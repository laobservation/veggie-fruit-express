
import { useState, useEffect } from 'react';
import { toast } from 'sonner'; 
import { supabase } from '@/integrations/supabase/client';
import { FooterSettings, defaultFooterSettings, ContactInfo, SocialLinks, QuickLink } from '@/types/footer';
import { Json } from '@/integrations/supabase/types';

// Helper function to safely cast JSON data to specific types
function safeJsonCast<T>(json: Json | null, defaultValue: T): T {
  if (json === null || json === undefined) {
    return defaultValue;
  }
  
  try {
    // For arrays and objects, we need to ensure the structure matches
    return json as unknown as T;
  } catch (error) {
    console.error('Error casting JSON:', error);
    return defaultValue;
  }
}

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
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching footer settings:', error);
        if (error.code === 'PGRST116') {
          // Table doesn't exist or no data found
          await initializeFooterSettings();
        } else {
          throw new Error('Failed to fetch footer settings');
        }
        return;
      }
      
      if (data) {
        // Type checking to make sure the data is in the correct format using our helper
        const contactInfo = safeJsonCast<ContactInfo>(data.contact_info, defaultFooterSettings.contactInfo || {});
        const socialLinks = safeJsonCast<SocialLinks>(data.social_links, defaultFooterSettings.socialLinks || {});
        const quickLinks = safeJsonCast<QuickLink[]>(data.quick_links, defaultFooterSettings.quickLinks || []);
        
        // Map database fields to our object structure with proper type assertions
        const mappedSettings: FooterSettings = {
          id: data.id,
          companyName: data.company_name || defaultFooterSettings.companyName,
          description: data.description || defaultFooterSettings.description,
          copyrightText: data.copyright_text || defaultFooterSettings.copyrightText,
          contactInfo: contactInfo,
          socialLinks: socialLinks,
          quickLinks: quickLinks
        };
        setFooterSettings(mappedSettings);
      } else {
        // No settings found, initialize
        await initializeFooterSettings();
      }
    } catch (error) {
      console.error('Error in fetching footer settings:', error);
      toast.error('Failed to load footer settings');
    } finally {
      setLoading(false);
    }
  };
  
  // Initialize settings table if it doesn't exist
  const initializeFooterSettings = async () => {
    try {
      console.log('Initializing footer settings...');
      
      // Convert our FooterSettings object to the DB schema format
      const dbRecord = {
        id: 1, // Always use ID 1 for the single settings record
        company_name: defaultFooterSettings.companyName,
        description: defaultFooterSettings.description,
        copyright_text: defaultFooterSettings.copyrightText,
        contact_info: defaultFooterSettings.contactInfo as Json,
        social_links: defaultFooterSettings.socialLinks as Json,
        quick_links: defaultFooterSettings.quickLinks as Json,
      };
      
      const { error } = await supabase
        .from('footer_settings')
        .insert(dbRecord);
      
      if (error) {
        console.error('Error creating footer settings:', error);
        throw error;
      }
      
      setFooterSettings(defaultFooterSettings);
      toast.success('Footer settings initialized successfully');
    } catch (error) {
      console.error('Error initializing footer settings:', error);
      toast.error('Failed to initialize footer settings');
    }
  };
  
  // Update footer settings state
  const updateFooterSettings = (newSettings: FooterSettings) => {
    setFooterSettings(newSettings);
  };
  
  // Save footer settings to the database
  const saveFooterSettings = async () => {
    setSaveLoading(true);
    try {
      // Convert our FooterSettings object to the DB schema format
      const dbRecord = {
        id: 1, // Always use ID 1 for the single settings record
        company_name: footerSettings.companyName,
        description: footerSettings.description,
        copyright_text: footerSettings.copyrightText,
        contact_info: footerSettings.contactInfo as Json,
        social_links: footerSettings.socialLinks as Json,
        quick_links: footerSettings.quickLinks as Json,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('footer_settings')
        .upsert(dbRecord);
      
      if (error) {
        console.error('Error saving footer settings:', error);
        throw error;
      }
      
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
