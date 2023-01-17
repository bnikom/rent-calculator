export const inchPerFt = 12;

export const calculateSqFt = (length, width) =>
  inchesToFt(length) * inchesToFt(width);

export const calculateTotalSqFt = (sqFtRooms) =>
  sqFtRooms.reduce((partialSum, room) => partialSum + room, 0);
export const inchesToFt = (x) => x / inchPerFt;
