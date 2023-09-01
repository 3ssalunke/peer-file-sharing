import { nanoid } from 'nanoid';
import ToastContainer from './ToastContainer';

export type Queue = Array<{
  message: string;
  id: string;
}>;

let container: HTMLElement;
let queue: Queue = [];

const setQueue = (newQueue: Queue) => {
  if (typeof window === 'undefined') return;

  queue = newQueue;

  if (!container) {
    container = document.createElement('div');
    document.body.appendChild(container);
  }

  return <ToastContainer queue={queue} />;
};

export const toast = (message: string) => {
  const item = { message, id: nanoid() };
  if (queue.length < 4) {
    setQueue([...queue, item]);

    setTimeout(() => {
      setQueue(queue.slice(1));
    }, 4000);
  } else {
    setQueue([...queue.slice(1), item]);
  }
};
