import { Loader } from 'react-feather';
import Modal from '../../../../../components/Modal';
import useInstantRoom from '../../../../../hooks/useInstantRoom';

interface NewRoomModalProps {
  onNewRoom: (roomname: string) => void;
  isOpen: boolean;
  [key: string]: unknown;
}

function NewRoomModal({ onNewRoom, isOpen, ...props }: NewRoomModalProps) {
  const [getInstantRoom, { loading: isLoading }] = useInstantRoom((room) =>
    onNewRoom(room)
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onNewRoom(formData.get('room') as string);
  };

  return (
    <Modal isOpen={isOpen} {...props}>
      <div className="join-room">
        <h2>Create public room</h2>
        <p>
          Public rooms allow file sharing to any device connected to the
          internet in the same room.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            name="room"
            type="text"
            maxLength={20}
            required
            placeholder="Room name"
            pattern="^([A-Za-z0-9]+ ?)+[A-Za-z0-9\s]$"
            style={{ marginTop: 0 }}
            onChange={(e) => {
              e.target.setCustomValidity('');
            }}
            disabled={isLoading}
          />
          <button className="btn wide" type="submit" disabled={isLoading}>
            Join Room
          </button>
        </form>
        <hr className="divider" />
        <p className="instant-room-helper">
          Instant Rooms are easy to remember room names that don't clash with
          existing rooms.
        </p>
        <button
          className="btn outlined wide"
          onClick={getInstantRoom}
          disabled={isLoading}
        >
          <Loader size={18} />
          {isLoading ? 'Joining' : 'Join Instant Room'}
        </button>
      </div>
    </Modal>
  );
}

export default NewRoomModal;
