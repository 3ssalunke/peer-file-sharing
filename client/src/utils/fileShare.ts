import WebTorrent from 'webtorrent';
import Socket, { BufferLike } from '../common/utils/socket';
import constants from '../common/constants';

const trackers = [
  'wss://tracker.btorrent.xyz',
  'wss://tracker.openwebtorrent.com',
  'wss://tracker.webtorrent.dev',
];

class FileShare {
  socket: Socket;
  torrentClient: WebTorrent.Instance;

  constructor(socket: Socket) {
    this.socket = socket;
    this.torrentClient = new WebTorrent({
      tracker: {
        ...trackers,
        rtcConfig: {
          iceServers: [
            {
              urls: 'stun:stun.l.google.com:19305',
            },
            {
              urls: 'stun:stun1.l.google.com:19305',
            },
          ],
        },
      },
    });
  }

  get webRTC() {
    return WebTorrent.WEBRTC_SUPPORT;
  }

  receiveFiles({
    onMeta,
    onProgress,
    onDone,
  }: {
    onMeta: (data: any) => void;
    onProgress: (torrent: WebTorrent.Torrent) => void;
    onDone: (files?: Array<WebTorrent.TorrentFile>, meta?: any) => void;
  }) {
    let metaData: any = {};

    this.socket.listen(constants.FILE_TORRENT, ({ infoHash, ...data }) => {
      if (onMeta) {
        metaData = data;
        onMeta();
      }

      this.torrentClient.add(infoHash, { urlList: trackers }, (torrent) => {
        this._onTorrent({ torrent, onProgress, onDone });
      });
    });

    const fileParts = [];
    let size = 0,
      statProg = 0.25;

    this.socket.listen(constants.FILE_INIT, (data) => {
      if (data.end) {
        if (fileParts.length) {
          onDone(
            new Blob(fileParts) as unknown as WebTorrent.TorrentFile[],
            metaData.meta[0]
          );
          fileParts = [];
          size = 0;
          statProg = 0.25;
        }
      } else {
        metaData = data;
        onMeta(data);
      }
    });

    this.socket.listen(constants.CHUNK, (data) => {
      fileParts.push(data);
      size += data.bytesLength;

      const progress = size / metaData.size;

      onProgress({ progress } as WebTorrent.Torrent);

      if (progress >= statProg) {
        statProg += 0.15;
        this.socket.send(constants.FILE_STATUS, {
          progress: statProg,
          peer: this.socket.name,
        } as unknown as BufferLike);
      }
    });

    return () => {
      this.socket.off(constants.FILE_TORRENT);
      this.socket.off(constants.FILE_INIT);
      this.socket.off(constants.CHUNK);
    };
  }

  _onTorrent({
    torrent,
    onProgress,
    onDone,
  }: {
    torrent: WebTorrent.Torrent;
    onProgress: (torrent: WebTorrent.Torrent) => void;
    onDone: (files?: Array<WebTorrent.TorrentFile>) => void;
  }) {
    let updateInterval: NodeJS.Timeout | undefined;

    const update = () => {
      onProgress(torrent);

      if (!updateInterval) {
        updateInterval = setInterval(update, 500);
      }

      if (!torrent.uploadSpeed && !torrent.downloadSpeed) {
        onDone();
        torrent.destroy();
        clearInterval(updateInterval);
        updateInterval = undefined;
      }
    };

    torrent.on('upload', update);
    torrent.on('download', update);
    torrent.on('done', () => {
      onDone(torrent.files);
    });
  }
}

export default FileShare;
