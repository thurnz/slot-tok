export const easeInOutSine = (x: number) => {
  return -(Math.cos(Math.PI * x) - 1) / 2;
};

export const easeOutSine = (x: number) => {
  return Math.sin((x * Math.PI) / 2);
};

export const easeInSine = (x: number) => {
  return 1 - Math.cos((x * Math.PI) / 2);
};

export const easeInOutCubic = (x: number) => {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
