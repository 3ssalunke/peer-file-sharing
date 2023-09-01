let WS_HOST;
let SERVER_HOST;

export default {
  WS_HOST: (() => {
    if (typeof window === 'undefined') return '';
    if (WS_HOST) return WS_HOST;

    if (window.location.protocol === 'https:') {
      WS_HOST = `wss://${window.location.host}/ws`;
      return WS_HOST;
    }

    WS_HOST = `ws://localhost:3030/ws`;
    return WS_HOST;
  })(),
  SERVER_HOST: (() => {
    if (typeof window === 'undefined') return;
    if (SERVER_HOST) return SERVER_HOST;

    if (window.location.protocol === 'https:') {
      SERVER_HOST = `https://${window.location.host}/server`;
      return SERVER_HOST;
    }

    SERVER_HOST = `http://localhost:3030/server`;
    return SERVER_HOST;
  })(),
};
