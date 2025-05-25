
import { useState, useEffect } from 'react';
import { toast } from 'sonner'; 
import { supabase } from '@/integrations/supabase/client';
import { FooterSettings, defaultFooterSettings, ContactInfo, SocialLinks, QuickLink } from '@/types/footer';

export function useFooterSettings() {
  const [footerSettings, setFooterSettings] = useState<FooterSettings>(defaultFooterSettings);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Fetch settings from database
  const fetchFooterSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('footer_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching footer settings:', error);
        throw new Error('Failed to fetch footer settings');
      }
      
      if (data) {
        // Proper type handling with safe property access
        const contactInfo = data.contact_info && typeof data.contact_info === 'object' && !Array.isArray(data.contact_info) 
          ? data.contact_info as ContactInfo
          : defaultFooterSettings.contactInfo!;
          
        const socialLinks = data.social_links && typeof data.social_links === 'object' && !Array.isArray(data.social_links)
          ? data.social_links as SocialLinks
          : defaultFooterSettings.socialLinks!;
          
        // Proper handling of Json[] to QuickLink[] conversion with type safety
        const quickLinks = Array.isArray(data.quick_links) 
          ? (data.quick_links as any[]).map(link => ({
              title: link.title || '',
              url: link.url || ''
            })) as QuickLink[]
          : defaultFooterSettings.quickLinks!;

        setFooterSettings({
          id: data.id,
          companyName: data.company_name || defaultFooterSettings.companyName,
          description: data.description || defaultFooterSettings.description,
          copyrightText: data.copyright_text || defaultFooterSettings.copyrightText,
          contactInfo,
          socialLinks,
          quickLinks
        });
      } else {
        // No settings found, initialize with defaults
        setFooterSettings(defaultFooterSettings);
      }
    } catch (error) {
      console.error('Error in fetchFooterSettings:', error);
      toast.error('Failed to load footer settings');
      setFooterSettings(defaultFooterSettings);
    } finally {
      setLoading(false);
    }
  };
  
  // Update footer settings state
  const updateFooterSettings = (newSettings: FooterSettings) => {
    setFooterSettings(newSettings);
  };
  
  // Save footer settings with proper type conversion for Supabase
  const saveFooterSettings = async () => {
    setSaveLoading(true);
    try {
      // Create proper JSON objects for Supabase storage with type assertion
      const settingsToSave = {
        id: 1, // Always use ID 1 for the single settings record
        company_name: footerSettings.companyName || defaultFooterSettings.companyName,
        description: footerSettings.description || defaultFooterSettings.description,
        copyright_text: footerSettings.copyrightText || defaultFooterSettings.copyrightText,
        contact_info: footerSettings.contactInfo || defaultFooterSettings.contactInfo,
        social_links: footerSettings.socialLinks || defaultFooterSettings.socialLinks,
        quick_links: footerSettings.quickLinks || defaultFooterSettings.quickLinks,
        updated_at: new Date().toISOString(),
      };
      
      console.log('Saving footer settings:', settingsToSave);
      
      const { error } = await supabase
        .from('footer_settings')
        .upsert(settingsToSave as any, { onConflict: 'id' });
      
      if (error) {
        console.error('Error saving footer settings:', error);
        toast.error(`Failed to save footer settings: ${error.message}`);
        throw error;
      }
      
      toast.success('Footer settings saved successfully!');
      return true;
    } catch (error) {
      console.error('Error saving footer settings:', error);
      throw error;
    } finally {
      setSaveLoading(false);
    }
  };
  
  // Load settings on component mount
  useEffect(() => {
    fetchFooterSettings();
    
    // Set up a subscription to listen for settings changes
    const footerChannel = supabase
      .channel('footer-settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'footer_settings'
        },
        (payload) => {
          console.log('Footer settings changed:', payload);
          fetchFooterSettings();
        }
      )
      .subscribe();
      
    return () => {
      // Unsubscribe when component unmounts
      supabase.removeChannel(footerChannel);
    };
  }, []);
  
  return {
    footerSettings,
    loading,
    saveLoading,
    updateFooterSettings,
    saveFooterSettings,
    fetchFooterSettings
  };
}
