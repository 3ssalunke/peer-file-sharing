import React from 'react';
import getFirstCharacterFromString from '../../../../../utils/getFirstCharacterFromString';
import { Peer } from '../..';

interface GenericProps {
  as?: keyof React.JSX.IntrinsicElements;
  [key: string]:
    | string
    | number
    | null
    | undefined
    | boolean
    | ((e?: React.BaseSyntheticEvent) => void)
    | React.ReactNode
    | Array<Peer>;
}

export function RoomContainer({
  as,
  className,
  highlighted,
  ...props
}: GenericProps) {
  const Tag = as!;
  return (
    <Tag
      className={`room ${highlighted && 'highlighted'} ${className})}`}
      {...props}
    />
  );
}

RoomContainer.defaultProps = {
  as: 'div',
  className: '',
  highlighted: false,
};

export function RoomName({ as, className, ...props }: GenericProps) {
  const Tag = as!;
  return <Tag className={`room-name ${className}`} {...props} />;
}

RoomName.defaultProps = {
  as: 'div',
  className: '',
};

export function RoomDescription({ as, className, ...props }: GenericProps) {
  const Tag = as!;
  return <Tag className={`room-description ${className}`} {...props} />;
}

RoomDescription.defaultProps = {
  as: 'div',
  className: '',
};

interface RoomSecondaryActionProps extends GenericProps {
  onClick: (e?: React.BaseSyntheticEvent) => void;
  children: React.ReactNode;
}

export function RoomSecondaryAction({
  className,
  onClick,
  children,
  ...props
}: RoomSecondaryActionProps) {
  if (!onClick) return;
  return (
    <button
      className={`btn thin icon secondary-action ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

RoomSecondaryAction.defaultProps = {
  className: '',
  onClick: () => {},
};

interface RoomPeersProps extends GenericProps {
  localPeers: Array<Peer>;
}

export function RoomPeers({ className, localPeers, ...props }: RoomPeersProps) {
  return (
    <ul className={`peers secondary-action ${className}`} {...props}>
      {localPeers.slice(0, 3).map((peer) => (
        <li className="peer" title={peer.name}>
          {getFirstCharacterFromString(peer.name)}
        </li>
      ))}
      {localPeers.length > 3 && <li>+{localPeers.length - 3}</li>}
    </ul>
  );
}
