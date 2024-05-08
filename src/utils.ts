export const randomInt = (max: number, min: number = 0) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const timeToMili = (format: string, val: number): number => {
  switch (format) {
    case 'h':
      return val * 60 * 60 * 1000;

    case 'm':
      return val * 60 * 1000;

    case 's':
      return val * 1000;

    default:
      return val * 1000;
  }
};

const twoDigits = (val: number): string => {
  return val < 10 ? `0${val}` : `${val}`;
}

export const miliToTimeString = (mili: number): string => {
  const hours = Math.floor(mili / 3600000);
  const minutes = Math.floor((mili % 3600000) / 60000);
  const seconds = Math.floor((mili % 60000) / 1000);

  return `${twoDigits(hours)}:${twoDigits(minutes)}:${twoDigits(seconds)}`;
}

