import { Queue } from '.';
import Toast from './Toast';

interface ToastContainerProps {
  queue: Queue;
}

function ToastContainer({ queue }: ToastContainerProps) {
  return (
    <div>
      {queue.map(({ message }) => (
        <Toast>{message}</Toast>
      ))}
    </div>
  );
}

export default ToastContainer;
