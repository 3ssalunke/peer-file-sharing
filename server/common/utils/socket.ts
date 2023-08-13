import { WebSocket } from 'ws';

type Callback = ((data: any) => void) | undefined;
export type BufferLike =
  | string
  | Buffer
  | DataView
  | number
  | ArrayBufferView
  | Uint8Array
  | ArrayBuffer
  | SharedArrayBuffer
  | ReadonlyArray<any>
  | ReadonlyArray<number>
  | { valueOf(): ArrayBuffer }
  | { valueOf(): SharedArrayBuffer }
  | { valueOf(): Uint8Array }
  | { valueOf(): ReadonlyArray<number> }
  | { valueOf(): string }
  | { [Symbol.toPrimitive](hint: string): string };

type IWebSocket = typeof WebSocket & WebSocket;
export interface CustomWebSocket extends IWebSocket {
  id: string;
  isAlive: boolean;
}

class Socket {
  socket: CustomWebSocket;
  callbacks: Record<string, Callback>;
  ip: string;
  peerId: string;
  name: string;

  constructor(socket: CustomWebSocket, ip = '') {
    this.socket = socket;
    this.socket.binaryType = 'arraybuffer';
    this.callbacks = {};
    this.ip = ip;
    this.peerId = '';
    this.name = '';

    socket.addEventListener('message', (msg) => {
      let data: BufferLike, callback: Callback;
      if (typeof msg.data === 'string') {
        const json = JSON.parse(msg.data);
        data = json.data;
        callback = this.callbacks[json.event];
      } else {
        callback = this.callbacks['chunks'];
        data = msg.data;
      }

      if (callback) {
        callback(data);
      }
    });
  }

  listen(event: string, callback: Callback) {
    this.callbacks[event] = callback;
  }

  on(event: any, callback: any) {
    this.socket.addEventListener(event, callback);
  }

  off(event: string) {
    this.callbacks[event] = undefined;
  }

  send(event: string, data: BufferLike) {
    if (event === 'chunk') {
      this.socket.send(data);
    } else {
      this.socket.send(JSON.stringify({ event, data }));
    }
  }

  close(code: number | undefined, reason?: string | Buffer | undefined) {
    this.socket.close(code, reason);
  }

  get id() {
    return this.socket.id;
  }
}

export default Socket;
