import { EventEmitter } from "node:events";
import { PassThrough } from "node:stream";

export class FakeAppServerProcess extends EventEmitter {
  stdin = new PassThrough();
  stdout = new PassThrough();
  stderr = new PassThrough();
  killed = false;
  messages = [];
  #inputBuffer = "";
  #exited = false;

  constructor(onMessage) {
    super();
    this.stdin.on("data", (chunk) => {
      this.#inputBuffer += chunk.toString();
      let newline = this.#inputBuffer.indexOf("\n");
      while (newline >= 0) {
        const line = this.#inputBuffer.slice(0, newline);
        this.#inputBuffer = this.#inputBuffer.slice(newline + 1);
        if (line.length > 0) {
          const message = JSON.parse(line);
          this.messages.push(message);
          onMessage?.(message, this);
        }
        newline = this.#inputBuffer.indexOf("\n");
      }
    });
    this.stdin.on("finish", () => {
      queueMicrotask(() => this.exit(0, null));
    });
  }

  send(message) {
    this.stdout.write(`${JSON.stringify(message)}\n`);
  }

  sendRaw(line) {
    this.stdout.write(`${line}\n`);
  }

  log(text) {
    this.stderr.write(text);
  }

  exit(code = 0, signal = null) {
    if (this.#exited) {
      return;
    }
    this.#exited = true;
    this.stdout.end();
    this.stderr.end();
    this.emit("exit", code, signal);
  }

  kill(signal = "SIGTERM") {
    this.killed = true;
    this.exit(null, signal);
    return true;
  }
}
