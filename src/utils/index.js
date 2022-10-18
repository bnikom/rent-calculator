export const inchPerFt = 12;

export const calculateSqFt = (length, width) =>
  inchesToFt(length) * inchesToFt(width);

export const inchesToFt = (x) => x / inchPerFt;
