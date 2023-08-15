import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import QRCode from 'qrcode';
import instantRouter from './instantRoom';
import { rooms, wss } from './sockets';
import getIp from './utils/getIp';
import { nanoid } from 'nanoid';
import Room from './common/utils/room';
import log from './utils/log';
dotenv.config();

const PORT = process.env.PORT || 3030;
const CORS_ORIGIN = process.env.ORIGIN ? JSON.parse(process.env.ORIGIN) : '*';
const TRUST_PROXY = Boolean(process.env.TRUST_PROXY);
const DISABLE_SSE_EVENTS = Boolean(process.env.DISABLE_SSE_EVENTS);

const app = express();
app.set('trust proxy', TRUST_PROXY);
app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN }));
app.use('/instant-room', instantRouter);

const server = http.createServer(app);

app.get('/', (_, res) => {
  res.send({
    message: 'Ofs websockets running',
    rooms: Object.keys(rooms).length,
    peers: Object.values(rooms).reduce(
      (sum, room) => sum + room.sockets.length,
      0
    ),
  });
});

app.get('/sse/local-peers', (req, res) => {
  if (DISABLE_SSE_EVENTS) return res.json([]);
  const ip = getIp(req);
  if (!ip) return res.json([]);

  const headers = {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
  };
  res.writeHead(200, headers);
  const watcher = { id: nanoid(), res };
  if (!rooms[ip]) {
    rooms[ip] = new Room(ip);
  }
  rooms[ip].addWatcher(watcher);
  rooms[ip].informWatchers([watcher]);
  req.on('close', () => {
    const room = rooms[ip];
    if (!room) return;
    room.removeWatcher(watcher);

    if (!room.watchers.length && !room.sockets.length) {
      delete rooms[ip];
    }
  });
});

app.get('/rooms/qrcode', async (req, res) => {
  const clientUrl = req.headers.referer as string;
  const room = req.query.room;

  try {
    const { origin } = new URL(clientUrl);
    const qrcode = await QRCode.toString(`${origin}/app/t/${room}`, {
      type: 'svg',
    });
    res.type('svg');
    res.send(qrcode);
  } catch (error) {
    res.status(400).send('Bad request');
  }
});

server.on('upgrade', (request, socket, head) => {
  const origin = request.headers.origin;
  let allowed = false;
  if (CORS_ORIGIN === '*') {
    allowed = true;
  } else if (Array.isArray(CORS_ORIGIN)) {
    for (const o of CORS_ORIGIN) {
      if (o === origin) {
        allowed = true;
        break;
      }
    }
  }

  if (!allowed) {
    socket.write('HTTP/1.1 401 Unauthorized\n\n\r\n');
    socket.destroy();
  } else {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  }
});

server.listen(PORT, () => {
  log(`listening on *:${PORT}`);
});
