/**
 * Rounds the given value to the nearest whole or .5 step.
 * Allowed values: 0, 0.5, 1, 1.5, ..., n
 */
export const roundToHalfOrWhole = (value: number): number => {
    const rounded = Math.round(value * 2) / 2;
  
    // Ensure only .0 or .5 decimals allowed
    const decimal = rounded % 1;
  
    if (decimal !== 0 && decimal !== 0.5) {
      // fallback (shouldn't happen with Math.round * 2 logic)
      return parseFloat(rounded.toFixed(1));
    }
  
    return rounded;
  };
  