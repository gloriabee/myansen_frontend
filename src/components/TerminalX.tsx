import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { Unicode11Addon } from "@xterm/addon-unicode11";

export default function TerminalX() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const termRef = useRef<Terminal | null>(null);
  const bufferRef = useRef<string>("");
    const wsRef = useRef<WebSocket | null>(null);
   

  useEffect(() => {
    if (!containerRef.current) return;
    if (termRef.current) return; // guard against React StrictMode double mount
     const unicode11 = new Unicode11Addon();
      const term = new Terminal({
        allowProposedApi: true, //to use unicode11
        cursorBlink: true,
        fontSize: 12,
        fontFamily: ` 'Noto Sans Mono','Padauk','Segoe UI Symbol', monospace`,
        lineHeight: 1.0,
        theme: { background: "#000000", foreground: "#d4d4d4" },
      });
      termRef.current = term;
      term.loadAddon(unicode11);
      term.unicode.activeVersion = "11";

     term.open(containerRef.current);

      term.writeln("Welcome to MyanSen Terminal!");
      //Connection to WebSocket server
      const ws = new WebSocket("ws://localhost:8000/ws");
      wsRef.current = ws;
      term.write("$\n")
      ws.addEventListener("message", (e) => {
          console.log(">> WebSocket message received:", e.data);
          
      // server may send bytes; xterm can handle strings or Uint8Array
      if (typeof e.data === "string") {
        term.write(e.data);
      } else {
        // Blob -> ArrayBuffer -> write
        (e.data as Blob)
          .arrayBuffer()
          .then((buf) => term.write(new Uint8Array(buf)));
      }
    });

    ws.addEventListener("open", () =>
      term.writeln("\r\n[connected] Type commands…")
    );
      ws.addEventListener("close", () => {
          term.writeln("\r\n[disconnected]") 
            wsRef.current = null;
      });
      
    //Sending terminal input to WebSocket server
    term.onData((data) => ws.readyState === WebSocket.OPEN && ws.send(data));

      
    //Keyboard input handling
    const onKey = term.onKey(({ key, domEvent }) => {
      const code = domEvent.key;

      if (code === "Enter") {
        term.write("\r\n");
        // here you could evaluate bufferRef.current, e.g. run a command
        bufferRef.current = "";
        return;
      }

      if (code === "Backspace") {
        if (bufferRef.current.length > 0) {
          bufferRef.current = bufferRef.current.slice(0, -1);
          term.write("\b \b"); // erase last char visually
        }
        return;
      }

    });

    return () => {
      onKey.dispose();
      term.dispose();
        termRef.current = null;
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.close();
          wsRef.current = null;
        }
        bufferRef.current = "";
        console.log("Terminal and WebSocket closed.");
    };
  }, []);

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Myanmar:wght@400;600&display=swap" rel="stylesheet"/>

            
        <div
            lang="my"
          ref={containerRef}
          style={{
            height: "200px",
            width: "100%",
            background: "#000",
            borderRadius: 8,
            overflow: "auto",
            padding: "10px",
          }}
        />
      </>
    );
}
