import { WebContainer } from "@webcontainer/api";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import { MutableRefObject } from "react";
import { files } from "../files";

export async function startDevServer(
  terminal: Terminal,
  webContainer: WebContainer,
  iframeEl: HTMLIFrameElement
) {
  // Run `npm run start` to start the Express app
  const serverProcess = await webContainer.spawn("npm", ["run", "start"]);
  serverProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        terminal.write(data);
      },
    })
  );

  // Wait for `server-ready` event
  webContainer.on("server-ready", (port, url) => {
    iframeEl.src = url;
  });
}

export async function installDependencies(
  terminal: Terminal,
  webContainer: WebContainer
) {
  // Install dependencies
  const installProcess = await webContainer.spawn("npm", ["install"]);
  // installProcess.output.pipeTo(
  //   new WritableStream({
  //     write(data) {
  //       console.log(data);
  //     },
  //   })
  // );

  installProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        terminal.write(data);
      },
    })
  );
  // Wait for install command to exit
  return installProcess.exit;
}

export async function writeIndexJS(
  webContainer: WebContainer,
  filePath: string,
  content: string
) {
  console.log({ content });
  await webContainer.fs.writeFile(`/${filePath}`, content);
}

export async function startShell(
  terminal: Terminal,
  webContainer: WebContainer
) {
  const shellProcess = await webContainer.spawn("jsh", {
    terminal: {
      cols: terminal.cols,
      rows: terminal.rows,
    },
  });
  shellProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        terminal.write(data);
      },
    })
  );

  const input = shellProcess.input.getWriter();
  terminal.onData((data) => {
    console.log({ data });
    input.write(data);
  });

  return shellProcess;
}

export async function startResizeTerminal(
  terminal: Terminal,
  webContainer: WebContainer
) {
  const fitAddon = new FitAddon();
  const terminalEl = document.querySelector(".terminal")!;
  terminal.loadAddon(fitAddon);
  terminal.open(terminalEl as HTMLElement);
  fitAddon.fit();

  const shellProcess = await startShell(terminal, webContainer);
  window.addEventListener("resize", () => {
    fitAddon.fit();
    shellProcess.resize({
      cols: terminal.cols,
      rows: terminal.rows,
    });
  });
}

export async function mountFiles(webContainer: WebContainer) {
  // mount the files object
  await webContainer.mount(files);
}

export const loadContainers = (
  filesNeeded: Record<string, string>[],
  iframeElRef: MutableRefObject<HTMLIFrameElement | null>,
  webContainer: WebContainer
) => {
  let containerTemplate = `
      <div class="container  h-screen">
        <div class="preview  h-80">
          <iframe src="/loading.html"></iframe>
        </div>
        <div class="terminal h-80"></div>
    `;
  const ids: string[] = [];
  filesNeeded.forEach((file) => {
    const id = (file.name as string).split(".")[0].toLocaleLowerCase();
    ids.push(id);
    if (id !== "main") {
      containerTemplate += `\n
        <div class="editor h-80">
          <textarea id=${id}>I am a textarea</textarea>
        </div>
      `;
    }
  });
  containerTemplate += `\n
       
      </div>
    `;
  document.querySelector("#containerRoot")!.innerHTML = containerTemplate;

  iframeElRef.current = document.querySelector("iframe");
  ids.forEach((id) => {
    console.log({ id });
    const fileData = filesNeeded.filter((d) =>
      d.name.toLocaleLowerCase().includes(id)
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    files["src"]["directory"][fileData[0].name] = {
      file: {
        contents:
          id == "main"
            ? `
           import "./main.css"; \n
           ${fileData[0].content}
          `
            : fileData[0].content,
      },
    };

    if (id !== "main") {
      const textareaEl = document.getElementById(id)! as HTMLTextAreaElement;
      // load content in textarea
      textareaEl.value = `
         // ${id}
         ${fileData[0].content}
        `;

      // add event listener to change
      const filePath = `src/${fileData[0].name}`;
      textareaEl.addEventListener("input", (e: Event) => {
        writeIndexJS(
          webContainer,
          filePath,
          (e.currentTarget as HTMLInputElement).value
        );
      });
    }
  });
};
