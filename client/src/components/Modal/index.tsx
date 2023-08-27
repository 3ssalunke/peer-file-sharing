import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { XCircle } from 'react-feather';

export interface ModalProps {
  isClosable?: boolean;
  isOpen: boolean;
  onClose?: (e: MouseEvent | KeyboardEvent) => void;
  children: React.ReactNode;
}

function useAnimatedVisibility(initial: boolean, time: number) {
  const [showContents, setShowContents] = useState(initial);

  useEffect(() => {
    if (initial) {
      setShowContents(true);
    } else {
      const id = setTimeout(() => setShowContents(false), time);
      return () => clearTimeout(id);
    }
  }, [initial, setShowContents, time]);

  return showContents;
}

function Modal({
  isOpen,
  isClosable,
  onClose,
  children,
}: ModalProps): React.ReactPortal {
  const showContents = useAnimatedVisibility(isOpen, 200);

  useEffect(() => {
    document.body.classList.toggle('no-bg-image', isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (isClosable) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (onClose) {
            onClose(e);
          }
        }
      };
      window.addEventListener('keydown', handleEsc);
      return () => {
        window.removeEventListener('keydown', handleEsc);
      };
    }
  });

  return createPortal(
    <div
      className="modal-wrapper"
      style={isOpen ? { opacity: 1, visibility: 'visible' } : {}}
    >
      {isClosable && (
        <button
          className="btn thin icon close"
          aria-label="Close Modal"
          onClick={(e) => {
            if (onClose) {
              onClose(e as unknown as MouseEvent);
            }
          }}
        >
          <XCircle />
        </button>
      )}
      <div className="modal">{showContents && children}</div>
    </div>,
    document.body
  );
}

Modal.defaultProps = {
  isClosable: true,
  onClose: () => {},
};

export default Modal;
