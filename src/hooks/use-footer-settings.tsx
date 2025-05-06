
import { useState, useEffect } from 'react';
import { toast } from 'sonner'; 
import { supabase } from '@/integrations/supabase/client';
import { FooterSettings, defaultFooterSettings } from '@/types/footer';

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
        setFooterSettings(data as FooterSettings);
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
      
      const { error } = await supabase
        .from('footer_settings')
        .insert({
          id: 1, // Always use ID 1 for the single settings record
          companyName: defaultFooterSettings.companyName,
          description: defaultFooterSettings.description,
          copyrightText: defaultFooterSettings.copyrightText,
          contactInfo: defaultFooterSettings.contactInfo,
          socialLinks: defaultFooterSettings.socialLinks,
          quickLinks: defaultFooterSettings.quickLinks,
        });
      
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
      const { error } = await supabase
        .from('footer_settings')
        .upsert({
          id: 1, // Always use ID 1 for the single settings record
          ...footerSettings,
          updated_at: new Date().toISOString(),
        });
      
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
