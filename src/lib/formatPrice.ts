
/**
 * Formats a price with correct currency format (XX.XX DH)
 */
export const formatPrice = (price: number): string => {
  return `${price.toFixed(2)} DH`;
};
