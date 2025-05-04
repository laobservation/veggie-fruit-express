
export interface SettingsState {
  siteName: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  currency: string;
  enableDelivery: boolean;
  deliveryFee: number;
  enablePayments: boolean;
  minimumOrderValue: number;
  [key: string]: string | number | boolean;
}

export const defaultSettings: SettingsState = {
  siteName: 'Marché Bio',
  description: 'Livraison de fruits et légumes bio à domicile',
  contactEmail: 'contact@marchebiomobile.com',
  contactPhone: '+212 612345678',
  address: 'Extention Zerhounia N236, Marrakech, Maroc',
  currency: 'DH',
  enableDelivery: true,
  deliveryFee: 30,
  enablePayments: true,
  minimumOrderValue: 100
};
