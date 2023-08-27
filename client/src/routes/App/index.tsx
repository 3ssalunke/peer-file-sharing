import { useEffect, useState } from 'react';
import { Route, Routes, redirect } from 'react-router-dom';
import { QueuedFiles } from './context/QueuedFiles';
import useSWMessage from '../../hooks/useSWMessage';
import constants from '../../constants';
import { PWAInstallProvider } from './context/PWAInstall';
import Rooms, { Room } from './Rooms';
import useOnline from '../../hooks/useOnline';
import {
  createLocalStorageDispatch,
  useLocalStorageSelector,
} from 'react-localstorage-hooks';
import NewUser from './NewUser';

export interface LocalStorageData {
  user: {
    name: string;
  };
  rooms: Array<Room | string>;
}

const updateLocalStorageSchema = () => {
  if (typeof window === 'undefined') return;
  const v2Converter = (data: LocalStorageData) => {
    data.rooms = data.rooms.map((room) => {
      return typeof room === 'string'
        ? ({ name: room, lastJoin: new Date().getTime() } as Room)
        : room;
    });
  };

  createLocalStorageDispatch<LocalStorageData>('ofs', (data) => {
    v2Converter(data);
    return data;
  })('');
};

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const isRegistered = useLocalStorageSelector('ofs', (state) => !!state);
  const isOnline = useOnline();
  const [queuedFiles, setQueuedFiles] = useSWMessage(
    [],
    constants.SW_LOAD_FILES
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    navigator.serviceWorker?.controller?.postMessage(constants.SW_SHARE_READY);
  }, []);

  useEffect(() => {
    if (!isRegistered) return;
    /* eslint-disable @typescript-eslint/no-var-requires */
    const scriptjs = require('scriptjs');

    scriptjs(
      [
        'https://unpkg.com/canvas-elements/build/cdn/canvas-elements.min.js',
        'https://cdn.jsdelivr.net/npm/webtorrent@1.9.7/webtorrent.min.js',
      ],
      () => {
        updateLocalStorageSchema();
        setIsLoaded(true);
      }
    );
  }, [isRegistered]);

  useEffect(() => {
    if (isRegistered && !isOnline) {
      redirect('/app');
    }
  });

  if (!isRegistered) {
    return <NewUser />;
  }

  return isLoaded ? (
    <QueuedFiles.Provider value={{ queuedFiles, setQueuedFiles }}>
      <PWAInstallProvider>
        <Routes>
          <Route path="/app/" element={<Rooms isOnline={isOnline} />} />
        </Routes>
      </PWAInstallProvider>
    </QueuedFiles.Provider>
  ) : null;
};

export default App;
