
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface QuickLink {
  title: string;
  url: string;
}

interface SocialLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  [key: string]: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

interface FooterSettings {
  company_name: string;
  description: string;
  copyright_text: string;
  quick_links: QuickLink[];
  social_links: SocialLinks;
  contact_info: ContactInfo;
}

const Footer = () => {
  const [settings, setSettings] = useState<FooterSettings>({
    company_name: 'Marché Bio',
    description: 'Livraison de fruits et légumes bio à domicile',
    copyright_text: '© 2025 Marché Bio. All rights reserved.',
    quick_links: [
      { title: 'Accueil', url: '/' },
      { title: 'Fruits', url: '/category/fruits' },
      { title: 'Légumes', url: '/category/vegetables' }
    ],
    social_links: {
      facebook: '#',
      twitter: '#',
      instagram: '#'
    },
    contact_info: {
      email: 'contact@marchebiomobile.com',
      phone: '+212 612345678',
      address: 'Extention Zerhounia N236, Marrakech, Maroc'
    }
  });

  useEffect(() => {
    const fetchFooterSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('footer_settings')
          .select('*')
          .eq('id', 1)
          .single();
          
        if (error) {
          console.error('Error fetching footer settings:', error);
          return;
        }
        
        if (data) {
          // Ensure proper typing
          const quickLinks = Array.isArray(data.quick_links) 
            ? data.quick_links.map((link: any) => ({
                title: String(link.title || ''),
                url: String(link.url || '')
              }))
            : [];
          
          const socialLinks = typeof data.social_links === 'object' && data.social_links !== null
            ? data.social_links as SocialLinks
            : { facebook: '#', twitter: '#', instagram: '#' };
          
          const contactInfo = typeof data.contact_info === 'object' && data.contact_info !== null
            ? {
                email: String(data.contact_info.email || ''),
                phone: String(data.contact_info.phone || ''),
                address: String(data.contact_info.address || '')
              }
            : {
                email: 'contact@marchebiomobile.com',
                phone: '+212 612345678',
                address: 'Extention Zerhounia N236, Marrakech, Maroc'
              };
          
          setSettings({
            company_name: data.company_name || 'Marché Bio',
            description: data.description || 'Livraison de fruits et légumes bio à domicile',
            copyright_text: data.copyright_text || '© 2025 Marché Bio. All rights reserved.',
            quick_links: quickLinks,
            social_links: socialLinks,
            contact_info: contactInfo
          });
        }
      } catch (error) {
        console.error('Error fetching footer settings:', error);
      }
    };
    
    fetchFooterSettings();
    
    // Set up realtime subscription for settings changes
    const channel = supabase
      .channel('footer-settings-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'footer_settings',
          filter: 'id=eq.1'
        },
        () => {
          fetchFooterSettings();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <footer className="bg-gray-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">{settings.company_name}</h3>
            <p className="mb-4 text-gray-300">{settings.description}</p>
            <div className="flex space-x-4">
              <a 
                href={settings.social_links.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a 
                href={settings.social_links.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a 
                href={settings.social_links.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              {settings.quick_links.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.url} 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <address className="not-italic text-gray-300">
              <p className="mb-2">{settings.contact_info.address}</p>
              <p className="mb-2">
                <a 
                  href={`mailto:${settings.contact_info.email}`}
                  className="hover:text-white transition-colors"
                >
                  {settings.contact_info.email}
                </a>
              </p>
              <p>
                <a 
                  href={`tel:${settings.contact_info.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {settings.contact_info.phone}
                </a>
              </p>
            </address>
          </div>

          {/* Newsletter - Static section */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">Inscrivez-vous à notre newsletter pour recevoir nos dernières nouvelles.</p>
            <form className="flex flex-wrap gap-2">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-grow px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-400">
          <p>{settings.copyright_text}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
