export const digitFixer = (number = 0, digit = 2) => {
    let num = Number(number);
    if (isNaN(num)) return 0;
    return parseFloat(num.toFixed(digit));
  };
  