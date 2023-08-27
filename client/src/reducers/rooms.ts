import { createLocalStorageDispatch } from 'react-localstorage-hooks';
import { Room } from '../routes/App/Rooms';

type AnyProps = {
  [key: string]: string | number | Array<Room>;
};
type ReducerState = AnyProps & {
  rooms: Array<Room>;
};

type ReducerAction = {
  type: 'remove-room' | 'add-room';
  payload: number | string;
};

type LocalStorageReducer<T> = (state: T, action: ReducerAction) => T;

const removeRoom = (rooms: Array<Room>, idx: number) => {
  return rooms.filter((_, i) => i !== idx);
};

const roomReducer: LocalStorageReducer<ReducerState> = (
  data,
  { type, payload }
) => {
  let roomIdx;
  let remainingRooms;
  let updatedRoom;
  switch (type) {
    case 'remove-room':
      return { ...data, rooms: removeRoom(data.rooms, payload as number) };
    case 'add-room':
      roomIdx = data.rooms.findIndex((room) => room.name === payload);
      remainingRooms = removeRoom(data.rooms, roomIdx);
      updatedRoom =
        roomIdx === -1 ? { name: payload as string } : data.rooms[roomIdx];

      return {
        ...data,
        rooms: [
          { ...updatedRoom, lastJoin: new Date().getTime() },
          ...remainingRooms,
        ],
      };
    default:
      return data;
  }
};

const dispatcher = createLocalStorageDispatch('ofs', roomReducer);
export { dispatcher as default, roomReducer };
