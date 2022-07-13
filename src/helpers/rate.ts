let newRate: number = 0;

export const convertRate = (rate: number): number => {
  if (rate <= 0.3) {
    newRate = 0;
  } else if (rate > 0.3 && rate <= 0.7) {
    newRate = 0.5;
  } else if (rate > 0.7 && rate <= 1.3) {
    newRate = 1;
  } else if (rate > 1.3 && rate <= 1.7) {
    newRate = 1.5;
  } else if (rate > 1.7 && rate <= 2.3) {
    newRate = 2;
  } else if (rate > 2.3 && rate <= 2.7) {
    newRate = 2.5;
  } else if (rate > 2.7 && rate <= 3.3) {
    newRate = 3;
  } else if (rate > 3.3 && rate <= 3.7) {
    newRate = 3.5;
  } else if (rate > 3.7 && rate <= 4.3) {
    newRate = 4;
  } else if (rate > 4.3 && rate <= 7.5) {
    newRate = 4.5;
  } else newRate = 5;

  return newRate;
};
