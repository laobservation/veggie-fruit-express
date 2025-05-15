
export const formatPrice = (price: number): string => {
  return `${price.toFixed(2)} DH`;
};

export const calculateTotalPrice = (basePrice: number, serviceOptionPrice: number = 0): number => {
  return basePrice + serviceOptionPrice;
};
