"use client";

import { useEffect, useRef, useState } from "react";
import { WebContainer } from "@webcontainer/api";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import {
  installDependencies,
  loadContainers,
  mountFiles,
  startDevServer,
  startResizeTerminal,
} from "./utils/utils";
import Form from "./components/Form";

export default function Home() {
  const containerRef = useRef<WebContainer | null>(null);
  const iframeEl = useRef<HTMLIFrameElement | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const mount = async () => {
      // Call only once
      if (!containerRef.current) {
        containerRef.current = await WebContainer.boot();
      }
    };

    mount();
  }, []);

  const mountWebContainerContent = async () => {
    // mount the files object
    await mountFiles(containerRef.current!);
  };

  const runContainer = async () => {
    const terminal = new Terminal({
      convertEol: true,
    });

    // const packageJSON = await containerRef.current.fs.readFile(
    //   "package.json",
    //   "utf-8"
    // );
    // console.log(packageJSON);

    const exitCode = await installDependencies(terminal, containerRef.current!);
    if (exitCode !== 0) {
      throw new Error("Installation failed");
    }
    await startResizeTerminal(terminal, containerRef.current!);

    startDevServer(terminal, containerRef.current!, iframeEl.current!);
    // startShell(terminal);
  };

  const handleClick = async (question: string) => {
    console.log("handleClick");
    setLoading(true);
    const response = await fetch("/api/ask", {
      method: "POST",
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    // console.log({ json });
    const aiResponse = json.messages.pop();
    const filesNeeded = JSON.parse(aiResponse.content);
    console.log(filesNeeded);

    // load text Iframe and terminal
    await loadContainers(filesNeeded, iframeEl, containerRef.current!);

    // mount web container
    mountWebContainerContent();
    runContainer();
    setLoading(false);
  };

  return (
    <div className="flex flex-col">
      <Form handleClick={handleClick} />
      {loading ? (
        <div className="w-screen h-screen text-center">Laoding.......... </div>
      ) : null}
      <div className="w-screen h-screen p-4" id="containerRoot"></div>
    </div>
  );
}
