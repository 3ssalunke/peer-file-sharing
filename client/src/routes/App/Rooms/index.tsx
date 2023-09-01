import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { HelpCircle, Plus, X } from 'react-feather';
import {
  RoomContainer,
  RoomDescription,
  RoomName,
  RoomPeers,
  RoomSecondaryAction,
} from './components/Room';
import { useLocalStorageSelector } from 'react-localstorage-hooks';
import { formatDistance } from 'date-fns';
import roomDispatcher from '../../../reducers/rooms';
import { QueuedFiles } from '../context/QueuedFiles';
import pluralize from '../../../utils/pluralize';
import LocalRoomHelpModal from './components/LocalRoomHelpModal';
import urls from '../../../utils/urls';
import AppLanding from '../layouts/AppLanding';
import { useNavigate } from 'react-router-dom';
import Fab from '../../../components/Fab';
import NewRoomModal from './components/NewRoomModal';
import './index.scss';

export type Peer = {
  name: string;
};

export interface Room {
  name: string;
  lastJoin: number;
}

export type OnRoomJoinFunc = (roomname: string) => void;

interface RoomListProps {
  isOnline: boolean;
  onRoomJoin: OnRoomJoinFunc;
}

const RoomsList: FC<RoomListProps> = ({ isOnline, onRoomJoin }) => {
  const rooms = useLocalStorageSelector<{ rooms: Array<Room> }, Array<Room>>(
    'ofs',
    ({ rooms }) => rooms,
    {
      equalityFn: (prev, next) => prev.length === next.length,
    }
  );
  const { queuedFiles } = useContext(QueuedFiles);
  const [localPeers, setLocalPeers] = useState<Array<Peer>>([]);
  const [showLocalRoomModal, setShowLocalRoomModal] = useState(false);

  useEffect(() => {
    if (!isOnline) return;

    const localPeersSource = new EventSource(
      `${urls.SERVER_HOST}/sse/local-peers`
    );
    localPeersSource.addEventListener('message', ({ data }) => {
      setLocalPeers(JSON.parse(data));
    });
  });

  if (!isOnline) {
    return <div>Connect to the internet to start sharing files</div>;
  } else {
    return (
      <>
        {!!queuedFiles.length && (
          <div
            className="message"
            style={{ marginTop: '0', marginBottom: '2.5rem' }}
          >
            Join a room to share the selected{' '}
            {pluralize(queuedFiles.length, 'file', 'files')}
          </div>
        )}
        <ul className="recent-rooms-list">
          <RoomContainer
            highlighted={localPeers.length > 0}
            as="li"
            role="link"
            tabIndex="0"
            onClick={() => onRoomJoin('')}
          >
            <div>
              <RoomName>Local network room</RoomName>
              <RoomDescription>
                Share files only on your local network
              </RoomDescription>
            </div>
            {localPeers.length > 0 ? (
              <RoomPeers localPeers={localPeers} />
            ) : (
              <RoomSecondaryAction onClick={() => setShowLocalRoomModal(true)}>
                <HelpCircle aria-label="what is local network room?" />
              </RoomSecondaryAction>
            )}
          </RoomContainer>
          {rooms.map((room, idx) => (
            <RoomContainer>
              <div>
                <RoomName>{room.name}</RoomName>
                <RoomDescription>
                  Joined{' '}
                  {formatDistance(new Date(room.lastJoin), new Date(), {
                    addSuffix: true,
                  })}
                </RoomDescription>
              </div>
              <RoomSecondaryAction
                onClick={() =>
                  roomDispatcher({ type: 'remove-room', payload: idx })
                }
                aria-label="Remove room"
              >
                <X />
              </RoomSecondaryAction>
            </RoomContainer>
          ))}
        </ul>
        <LocalRoomHelpModal
          isOpen={showLocalRoomModal}
          onClose={() => setShowLocalRoomModal(false)}
          onRoomJoin={onRoomJoin}
        />
      </>
    );
  }
};

interface LocalStorageUser {
  user: {
    name: string;
  };
}

function Rooms({ isOnline }: { isOnline: boolean }): React.ReactNode {
  const [isModalOpen, setModal] = useState(false);
  const username = useLocalStorageSelector<LocalStorageUser, string>(
    'ofs',
    ({ user }) => user.name
  );
  const navigate = useNavigate();

  const handleNewRoom = useCallback(
    (room: string) => {
      setModal(false);
      const roomURL = room.trim().replace(/ /g, '-').toLowerCase();
      navigate(`/app/t/${roomURL}`);
    },
    [setModal, navigate]
  );

  return (
    <AppLanding
      title={`Hi, ${username}`}
      subtitle="Join or create a room to share files"
    >
      <main className="rooms">
        <section className="recent-rooms">
          <h2 className="section-title">Recent Rooms</h2>
          <RoomsList isOnline={isOnline} onRoomJoin={handleNewRoom} />
          {isOnline && (
            <Fab
              text="New Room"
              className="fab-new-room"
              onClick={() => setModal(true)}
            >
              <Plus />
            </Fab>
          )}
        </section>

        <NewRoomModal
          isOpen={isModalOpen}
          onNewRoom={handleNewRoom}
          onClose={() => setModal(false)}
        />
      </main>
    </AppLanding>
  );
}

export default Rooms;
