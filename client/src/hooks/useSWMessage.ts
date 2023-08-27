import { useEffect, useState } from 'react';

function useSWMessage(
  initial: Array<string>,
  action: string
): [Array<string>, React.Dispatch<React.SetStateAction<string[]>>] {
  const [data, setData] = useState(initial);

  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.serviceWorker) return;
    const handleMessage = (event: MessageEvent) => {
      if (event.data.action === action) {
        setData(event.data.data);
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);

    return navigator.serviceWorker.removeEventListener(
      'message',
      handleMessage
    );
  }, [action]);

  return [data, setData];
}

export default useSWMessage;
