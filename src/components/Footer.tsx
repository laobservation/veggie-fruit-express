
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FooterSettings, defaultFooterSettings } from '@/types/footer';

const Footer = () => {
  const [footerData, setFooterData] = useState<FooterSettings>(defaultFooterSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFooterSettings() {
      try {
        const { data, error } = await supabase
          .from('footer_settings')
          .select('*')
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching footer settings:', error);
          return;
        }
        
        if (data) {
          setFooterData(data as FooterSettings);
        }
      } catch (error) {
        console.error('Error loading footer settings:', error);
      } finally {
        setLoading(false);
      }
    }

    loadFooterSettings();
    
    // Subscribe to realtime updates
    const footerChannel = supabase
      .channel('footer-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'footer_settings'
        },
        (payload) => {
          loadFooterSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(footerChannel);
    };
  }, []);

  return (
    <footer className="bg-veggie-light mt-12 pt-8 pb-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-veggie-dark mb-4">{footerData.companyName}</h3>
            <p className="text-gray-600 mb-4">
              {footerData.description}
            </p>
            <div className="flex space-x-4">
              {footerData.socialLinks?.facebook && (
                <a href={footerData.socialLinks.facebook} className="text-veggie-primary hover:text-veggie-dark" target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">Facebook</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              )}
              {footerData.socialLinks?.instagram && (
                <a href={footerData.socialLinks.instagram} className="text-veggie-primary hover:text-veggie-dark" target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">Instagram</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
              )}
              {footerData.socialLinks?.twitter && (
                <a href={footerData.socialLinks.twitter} className="text-veggie-primary hover:text-veggie-dark" target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">Twitter</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </a>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-veggie-dark mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerData.quickLinks?.map((link, index) => (
                <li key={index}>
                  <Link to={link.url} className="text-gray-600 hover:text-veggie-primary">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-veggie-dark mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-600">
              {footerData.contactInfo?.phone && (
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-veggie-primary"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span>{footerData.contactInfo.phone}</span>
                </li>
              )}
              {footerData.contactInfo?.email && (
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-veggie-primary"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <span>{footerData.contactInfo.email}</span>
                </li>
              )}
              {footerData.contactInfo?.address && (
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-veggie-primary"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <span>{footerData.contactInfo.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-4 text-center text-gray-500 text-sm">
          <p>{footerData.copyrightText}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
