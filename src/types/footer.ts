
export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  address?: string;
}

export interface QuickLink {
  title: string;
  url: string;
}

export interface FooterSettings {
  id?: number;
  companyName: string;
  description: string;
  copyrightText: string;
  contactInfo?: ContactInfo;
  socialLinks?: SocialLinks;
  quickLinks?: QuickLink[];
  [key: string]: any;
}

export const defaultFooterSettings: FooterSettings = {
  companyName: 'Veggie Express',
  description: 'Fresh fruits and vegetables delivered right to your doorstep.',
  copyrightText: `© ${new Date().getFullYear()} Veggie Express. All rights reserved.`,
  contactInfo: {
    phone: '+1 234 567 8900',
    email: 'info@veggieexpress.com',
    address: '123 Fresh Street, Veggie City'
  },
  socialLinks: {
    facebook: '#',
    instagram: '#',
    twitter: '#'
  }
};
