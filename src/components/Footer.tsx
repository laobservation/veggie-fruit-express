
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { FooterSettings } from '@/types/footer';

const Footer: React.FC = () => {
  const [footerSettings, setFooterSettings] = useState<FooterSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFooterSettings();
  }, []);

  const fetchFooterSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('footer_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching footer settings:', error);
        return;
      }

      if (data) {
        // FIXED: Proper type handling with safe property access
        const contactInfo = data.contact_info && typeof data.contact_info === 'object' && !Array.isArray(data.contact_info) 
          ? data.contact_info as Record<string, any>
          : {};
          
        const socialLinks = data.social_links && typeof data.social_links === 'object' && !Array.isArray(data.social_links)
          ? data.social_links as Record<string, any>
          : {};
          
        const quickLinks = Array.isArray(data.quick_links) 
          ? data.quick_links as Array<{ title: string; url: string }>
          : [];

        setFooterSettings({
          id: data.id,
          companyName: data.company_name || 'Marché Bio',
          description: data.description || 'Fresh fruits and vegetables delivered right to your doorstep.',
          copyrightText: data.copyright_text || `© ${new Date().getFullYear()} Marché Bio. All rights reserved.`,
          contactInfo: {
            email: contactInfo.email || 'contact@marchebiomobile.com',
            phone: contactInfo.phone || '+212 649150370',
            address: contactInfo.address || 'Meknès, Maroc'
          },
          socialLinks: {
            facebook: socialLinks.facebook || '',
            instagram: socialLinks.instagram || '',
            twitter: socialLinks.twitter || ''
          },
          quickLinks: quickLinks.length > 0 ? quickLinks : [
            { title: 'Accueil', url: '/' },
            { title: 'Fruits', url: '/category/fruits' },
            { title: 'Légumes', url: '/category/légumes' }
          ]
        });
      } else {
        // Set default settings if no data found
        setFooterSettings({
          companyName: 'Marché Bio',
          description: 'Fresh fruits and vegetables delivered right to your doorstep.',
          copyrightText: `© ${new Date().getFullYear()} Marché Bio. All rights reserved.`,
          contactInfo: {
            email: 'contact@marchebiomobile.com',
            phone: '+212 649150370',
            address: 'Meknès, Maroc'
          },
          socialLinks: {
            facebook: '',
            instagram: '',
            twitter: ''
          },
          quickLinks: [
            { title: 'Accueil', url: '/' },
            { title: 'Fruits', url: '/category/fruits' },
            { title: 'Légumes', url: '/category/légumes' }
          ]
        });
      }
    } catch (error) {
      console.error('Error in fetchFooterSettings:', error);
      // Set default settings on error
      setFooterSettings({
        companyName: 'Marché Bio',
        description: 'Fresh fruits and vegetables delivered right to your doorstep.',
        copyrightText: `© ${new Date().getFullYear()} Marché Bio. All rights reserved.`,
        contactInfo: {
          email: 'contact@marchebiomobile.com',
          phone: '+212 649150370',
          address: 'Meknès, Maroc'
        },
        socialLinks: {
          facebook: '',
          instagram: '',
          twitter: ''
        },
        quickLinks: [
          { title: 'Accueil', url: '/' },
          { title: 'Fruits', url: '/category/fruits' },
          { title: 'Légumes', url: '/category/légumes' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  console.log('Footer component rendering:', { loading, footerSettings });

  if (loading) {
    return (
      <footer className="bg-gray-800 text-white py-8 w-full">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-600 rounded w-1/4 mb-4"></div>
            <div className="h-3 bg-gray-600 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-600 rounded w-1/3"></div>
          </div>
        </div>
      </footer>
    );
  }

  if (!footerSettings) {
    console.log('No footer settings, not rendering footer');
    return null;
  }

  return (
    <footer className="bg-gray-800 text-white py-8 w-full">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">{footerSettings.companyName}</h3>
            <p className="text-gray-300 mb-4">
              {footerSettings.description}
            </p>
            <div className="space-y-2">
              {footerSettings.contactInfo?.email && (
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {footerSettings.contactInfo.email}
                </p>
              )}
              {footerSettings.contactInfo?.phone && (
                <p className="text-sm">
                  <span className="font-medium">Téléphone:</span> {footerSettings.contactInfo.phone}
                </p>
              )}
              {footerSettings.contactInfo?.address && (
                <p className="text-sm">
                  <span className="font-medium">Adresse:</span> {footerSettings.contactInfo.address}
                </p>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              {footerSettings.quickLinks?.map((link, index) => (
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

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Suivez-nous</h4>
            <div className="flex space-x-4">
              {footerSettings.socialLinks?.facebook && (
                <a 
                  href={footerSettings.socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Facebook
                </a>
              )}
              {footerSettings.socialLinks?.instagram && (
                <a 
                  href={footerSettings.socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Instagram
                </a>
              )}
              {footerSettings.socialLinks?.twitter && (
                <a 
                  href={footerSettings.socialLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Twitter
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            {footerSettings.copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
