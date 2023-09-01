import { OnRoomJoinFunc } from '../..';
import Modal, { ModalProps } from '../../../../../components/Modal';

interface LocalRoomHelpModalProps extends Omit<ModalProps, 'children'> {
  onRoomJoin: OnRoomJoinFunc;
}

function LocalRoomHelpModal({ onRoomJoin, ...props }: LocalRoomHelpModalProps) {
  return (
    <Modal {...props}>
      <div className="local-room-help">
        <h2>Local Network Room</h2>
        <p>
          Local network room creates a private and isolated room among devices
          in the same network connection sharing the same public IP address.
          Devices outside the local network cannot join this room.
          <br />
          <br />
          If OFS is unable to detect devices in your local network, you can
          still create a public file sharing room that allows any device
          connected to the internet to join the room and share files.
        </p>
        <button className="btn wide" onClick={() => onRoomJoin('')}>
          Join local room
        </button>
      </div>
    </Modal>
  );
}

export default LocalRoomHelpModal;
