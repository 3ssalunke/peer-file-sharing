import { Response } from 'express';
import log from '../../utils/log';
import Socket, { BufferLike } from './socket';
import constants from '../constants';
import { rooms } from '../../sockets';

type Watcher = {
  id: string;
  res: Response;
};

class Room {
  name: string;
  sender: string | null;
  sockets: Array<Socket>;
  watchers: Array<Watcher>;

  constructor(name: string) {
    this.sockets = [];
    this.watchers = [];
    this.sender = null;
    this.name = name;
  }

  addSocket(socket: Socket) {
    this.sockets.push(socket);
    this.informWatchers();
  }

  addWatcher(watcher: Watcher) {
    this.watchers.push(watcher);
  }

  broadcast(event: string, message: BufferLike, ignore?: Array<string>) {
    this.sockets.forEach((client) => {
      if (ignore && ignore.includes(client.name)) return;

      client.send(event, message);
    });
  }

  removeSocket(socket: Socket) {
    const totalSockets = this.sockets.length;
    this.sockets = this.sockets.filter((client) => client.name != socket.name);
    const totalSocketsAfterRemove = this.sockets.length;

    if (totalSockets === totalSocketsAfterRemove) return;

    log(`${socket.name} has left ${this.name}`);
    this.informWatchers();

    if (this.sockets.length) {
      this.broadcast(constants.USER_LEAVE, socket.name, [socket.name]);
    } else if (!this.watchers.length) {
      delete rooms[this.name];
    }
  }

  removeWatcher(watcher: Watcher) {
    this.watchers = this.watchers.filter(({ id }) => id !== watcher.id);
    watcher.res.end();
  }

  informWatchers(watchers = this.watchers) {
    watchers.forEach(({ res }) => {
      res.write(`data: ${JSON.stringify(this.socketsData)}\n\n`);
    });
  }

  getSocketFromName(name: string) {
    return this.sockets.find((socket) => socket.name === name);
  }

  get socketsData() {
    return this.sockets.map(({ name, peerId }) => ({ name, peerId }));
  }

  get senderSocket() {
    if (!this.sender) return undefined;
    return this.sockets.find((socket) => socket.name === this.sender);
  }
}

export default Room;
