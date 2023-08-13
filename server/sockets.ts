import { WebSocket, CloseEvent } from 'ws';
import { nanoid } from 'nanoid';
import Room from './common/utils/room';
import Socket, { CustomWebSocket } from './common/utils/socket';
import getIp from './utils/getIp';
import log from './utils/log';
import constants from './common/constants';

const SOCKET_ALIVE_PONG_TIMEOUT = 5 * 1000;
const WS_SIZE_LIMIT = process.env.WS_SIZE_LIMIT || 1e8;
const RECHECK_ALIVE_SOCKETS_INTERVAL = 30 * 1000;

export const wss = new WebSocket.Server<CustomWebSocket>({
  noServer: true,
});
export const rooms: Record<string, Room> = {};

const isUserAlive = (room: Room, user: Socket): Promise<any> =>
  new Promise((resolve, reject) => {
    let timeoutId: NodeJS.Timeout | null = setTimeout(() => {
      timeoutId = null;
      room.removeSocket(user);
      reject('user is not alive');
    }, SOCKET_ALIVE_PONG_TIMEOUT);

    user.socket.on('pong', () => {
      if (timeoutId === null) return;
      clearTimeout(timeoutId);
      resolve('user is alive');
    });

    log(
      `Checking if ${user.name} is alive. Someone with same name is trying to join.`
    );

    user.socket.ping();
  });

wss.on('connection', (ws, req) => {
  (ws as CustomWebSocket).isAlive = true;
  (ws as CustomWebSocket).id = nanoid();

  const ip = getIp(req);

  const socket = new Socket(ws as CustomWebSocket, ip);
  let room: Room;

  socket.listen(constants.JOIN, async (data) => {
    let { roomName, name, peerId } = data;
    socket.name = name;
    socket.peerId = peerId;
    roomName = roomName || ip;
    if (!roomName) {
      socket.close(1000);
    }
    room = rooms[roomName];
    if (room) {
      const user = room.getSocketFromName(socket.name);
      if (user) {
        try {
          await isUserAlive(room, user);
          socket.close(1000, constants.ERR_SAME_NAME);
          return;
        } catch (error) {}
      }
    }

    room = rooms[roomName];
    if (!room) {
      rooms[roomName] = new Room(roomName);
      room = rooms[roomName];
    }

    log(`${name} has joined ${roomName}`);
    room.addSocket(socket);
    room.broadcast(constants.USER_JOIN, room.socketsData);
  });

  socket.on('close', (data: CloseEvent) => {
    if (data.reason === constants.ERR_SAME_NAME) return;
    if (!room) return;

    room.removeSocket(socket);
  });

  socket.on('pong', () => {
    socket.socket.isAlive = true;
  });

  socket.listen(constants.FILE_INIT, (data) => {
    if (data.size > WS_SIZE_LIMIT) return;
    if (data.end) {
      log(`File transfer just finished`);
    } else {
      log(`${socket.name} has initialized file transfer`);
    }

    room.sender = socket.name;
    room.broadcast(constants.FILE_INIT, data, [socket.name]);
  });

  socket.listen(constants.FILE_STATUS, (data) => {
    const sender = room.senderSocket;
    if (!sender) return;
    sender.send(constants.FILE_STATUS, data);
  });

  socket.listen(constants.CHUNK, (data) => {
    room.broadcast(constants.CHUNK, data, [socket.name]);
  });

  socket.listen(constants.FILE_TORRENT, (data) => {
    room.broadcast(constants.FILE_TORRENT, data, [socket.name]);
  });
});

const interval = setInterval(() => {
  log('Checking alive sockets');
  wss.clients.forEach((ws) => {
    if ((ws as CustomWebSocket).isAlive === false) return ws.terminate;
    (ws as CustomWebSocket).isAlive = false;
    (ws as CustomWebSocket).ping();
  });
}, RECHECK_ALIVE_SOCKETS_INTERVAL);

wss.on('close', () => {
  clearInterval(interval);
});
