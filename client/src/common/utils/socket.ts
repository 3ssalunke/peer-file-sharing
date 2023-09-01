type Callback = ((data: any) => void) | undefined;
export type BufferLike = string | ArrayBufferLike | Blob | ArrayBufferView;
type SocktEvent = keyof WebSocketEventMap;

class Socket {
  socket: WebSocket;
  callbacks: Record<string, Callback>;
  ip: string;
  peerId: string;
  name: string;

  constructor(socket: WebSocket, ip = '') {
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

  on(
    event: SocktEvent,
    callback: (e: MessageEvent<any> | CloseEvent | Event) => any
  ) {
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

  close(code: number | undefined, reason?: string | undefined) {
    this.socket.close(code, reason);
  }
}

export default Socket;
