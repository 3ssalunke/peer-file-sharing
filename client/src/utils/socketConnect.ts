import Socket from '../common/utils/socket';
import urls from './urls';

function socketConnect(room: string, username: string) {
  const socket = new Socket(new WebSocket(urls.WS_HOST));
  const fileShare;
}

export default socketConnect;
