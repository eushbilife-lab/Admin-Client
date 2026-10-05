export const decimalfixer = (number = 0, digit = 2) => {
  if (Math.abs(number) < Math.pow(10, -digit)) {
    return number;
  }
  return number.toFixed(digit);
};
