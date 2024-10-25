// import { ChatOllama } from "@langchain/ollama";
import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage } from "ai";
// import { Calculator } from "@langchain/community/tools/calculator";
import {
  AIMessage,
  BaseMessage,
  ChatMessage,
  HumanMessage,
} from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { JsonOutputParser } from "@langchain/core/output_parsers";

import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

export const runtime = "edge";

type File = {
  content: string;
  language: string;
  name: string;
};

// Set up a parser + inject instructions into the prompt template.
const parser = new JsonOutputParser<File[]>();

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
     You are a coding master in React, assit the user in coding questions.
     Strictly stick to React and Javascript for framework and Tailwind classes for CSS and don't add any explanation.
     Make sure all html elements like buttons, headings, input are styled nicely using Tailwind css.
     List out all components needed for the task in separate files and don't worry about html files.
     Always have the entry file that will mount the component named as "main.jsx". 
     Please focus on clean code and smaller components.
     Respond with a valid Array that has valid JSON objects , each object contains  "content" key for the file content, "name" key for the file name and "language" key for the language used.
    `,
  ],
  new MessagesPlaceholder("messages"),
]);

const convertUIMessageToLangChainMessage = (message: VercelChatMessage) => {
  if (message.role === "user") {
    return new HumanMessage(message.content);
  } else if (message.role === "assistant") {
    return new AIMessage(message.content);
  } else {
    return new ChatMessage(message.content, message.role);
  }
};

const convertLangChainMessageToUIMessage = (message: BaseMessage) => {
  // console.log(message.getType());
  if (message.getType() === "human") {
    return { content: message.content, role: "user" };
  }
  if (message.getType() === "ai") {
    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      content: message.content,
      role: "assistant",
    };
  }
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const messages = (body.messages ?? [])
      .filter(
        (message: VercelChatMessage) =>
          message.role === "user" || message.role === "assistant"
      )
      .map(convertUIMessageToLangChainMessage);

    // console.log({ messages });
    const chain = promptTemplate.pipe(llm).pipe(parser);
    // console.log(promptTemplate);
    const result2 = await chain.invoke({
      messages,
    });

    const updatedMessages = [
      ...messages,
      new AIMessage(JSON.stringify(result2)),
    ];
    const formattedMessages = updatedMessages.map(
      convertLangChainMessageToUIMessage
    );
    console.log({ formattedMessages });

    return NextResponse.json(
      {
        messages: formattedMessages,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
