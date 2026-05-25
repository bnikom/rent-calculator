export type RoomType = "yours" | "shared" | "theirs";

export type Room = {
  name?: string;
  length?: number;
  width?: number;
  type?: RoomType;
};

export type FormValues = {
  rent?: number;
  rooms?: Room[];
};

export const inchPerFt = 12;

export const calculateSqFt = (length: number, width: number) => {
  return length * width;
};

export const calculateTotalSqFt = (sqFtRooms: number[]) =>
  sqFtRooms.reduce((partialSum, room) => partialSum + room, 0);

export const inchesToFt = (x: number) => x / inchPerFt;

export const calculateTypeSqFt = (rooms: Room[], type: RoomType) =>
  calculateRoomsSqFt(rooms.filter((room) => room.type === type));

export const calculateRoomsSqFt = (rooms: Room[]): number =>
  rooms
    .map((room) =>
      calculateSqFt(Number(room?.length) || 0, Number(room?.width) || 0),
    )
    .reduce((acc, currentValue) => acc + currentValue, 0);
