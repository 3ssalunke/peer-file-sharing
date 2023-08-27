import { createContext } from 'react';

type queuedFiles = {
  queuedFiles: Array<string>;
  setQueuedFiles: React.Dispatch<React.SetStateAction<string[]>>;
};

const QueuedFiles = createContext<queuedFiles>({
  queuedFiles: [],
  setQueuedFiles: () => {},
});

function withQueuedFiles(
  Component: React.FC<queuedFiles | Record<string, string>>
) {
  const Wrapped = (props: Record<string, string>) => (
    <QueuedFiles.Consumer>
      {(queued) => <Component {...props} {...queued} />}
    </QueuedFiles.Consumer>
  );

  return Wrapped;
}

// eslint-disable-next-line react-refresh/only-export-components
export { QueuedFiles, withQueuedFiles };
