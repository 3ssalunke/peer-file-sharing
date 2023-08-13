import { IncomingMessage } from 'http';

const TRUST_PROXY = Boolean(process.env.TRUST_PROXY);

function getIp(request: IncomingMessage): string {
  let forwarded = request.headers['x-forwarded-for'] ?? '';
  if (Array.isArray(forwarded)) {
    forwarded = forwarded.join(',');
  }

  let ip =
    'ip' in request
      ? (request.ip as string)
      : TRUST_PROXY
      ? forwarded.split(',').shift()
      : undefined;
  ip = ip ?? request.socket.remoteAddress;
  if (ip === '::1' || ip === '::fff:127.0.0.1') {
    ip = '127.0.0.1';
  }
  return ip as string;
}

export default getIp;
