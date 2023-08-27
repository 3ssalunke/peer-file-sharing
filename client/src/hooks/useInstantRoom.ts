import { useState } from 'react';
import urls from '../utils/urls';

function useInstantRoom(
  cb: (room: string) => void
): [() => Promise<unknown>, { loading: boolean; error: Error | null }] {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  return [
    async () => {
      setLoading(true);
      try {
        const res = await fetch(`${urls.SERVER_HOST}/instant-room`);
        const { room } = await res.json();
        cb(room);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    },
    { loading, error },
  ];
}

export default useInstantRoom;
