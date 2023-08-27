import { useEffect, useState } from 'react';

function useOnline() {
  const [isOnline, setOnline] = useState(
    typeof window !== 'undefined' ? navigator.onLine : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleNetworkStatus = () => {
      setOnline(navigator.onLine);
    };

    window.addEventListener('online', handleNetworkStatus);
    window.addEventListener('offline', handleNetworkStatus);

    return () => {
      window.addEventListener('online', handleNetworkStatus);
      window.addEventListener('offline', handleNetworkStatus);
    };
  }, []);

  return isOnline;
}

export default useOnline;
