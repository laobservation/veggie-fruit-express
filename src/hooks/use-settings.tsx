
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SettingsState, defaultSettings } from '@/types/settings';

export function useSettings() {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Fetch settings from the database
  const fetchSettings = async () => {
    setLoading(true);
    try {
      // We'll directly use supabase to avoid any RLS issues
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching settings:', error);
        if (error.code === 'PGRST116') {
          // Table doesn't exist or no data found
          await initializeSettings();
        } else {
          throw new Error('Failed to fetch settings');
        }
        return;
      }
      
      if (data) {
        setSettings({
          siteName: data.site_name || defaultSettings.siteName,
          description: data.description || defaultSettings.description,
          contactEmail: data.contact_email || defaultSettings.contactEmail,
          contactPhone: data.contact_phone || defaultSettings.contactPhone,
          address: data.address || defaultSettings.address,
          currency: data.currency || defaultSettings.currency,
          enableDelivery: data.enable_delivery || defaultSettings.enableDelivery,
          deliveryFee: data.delivery_fee || defaultSettings.deliveryFee,
          enablePayments: data.enable_payments || defaultSettings.enablePayments,
          minimumOrderValue: data.minimum_order_value || defaultSettings.minimumOrderValue
        });
      } else {
        // No settings found, initialize
        await initializeSettings();
      }
    } catch (error) {
      console.error('Error in fetching settings:', error);
      toast.error('Impossible de récupérer les paramètres du site.');
    } finally {
      setLoading(false);
    }
  };
  
  // Initialize settings table if it doesn't exist
  const initializeSettings = async () => {
    try {
      console.log('Initializing settings...');
      
      // Insert initial settings directly
      const { error } = await supabase
        .from('settings')
        .insert({
          id: 1, // Always use ID 1 for settings
          site_name: defaultSettings.siteName,
          description: defaultSettings.description,
          contact_email: defaultSettings.contactEmail,
          contact_phone: defaultSettings.contactPhone,
          address: defaultSettings.address,
          currency: defaultSettings.currency,
          enable_delivery: defaultSettings.enableDelivery,
          delivery_fee: defaultSettings.deliveryFee,
          enable_payments: defaultSettings.enablePayments,
          minimum_order_value: defaultSettings.minimumOrderValue
        });
      
      if (error) {
        console.error('Error creating settings:', error);
        throw error;
      }
      
      toast.success('Paramètres initialisés avec succès.');
    } catch (error) {
      console.error('Error initializing settings:', error);
      toast.error('Impossible d\'initialiser les paramètres du site.');
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      console.log('Saving settings:', settings);
      
      // Update settings using upsert
      const { error } = await supabase
        .from('settings')
        .upsert({
          id: 1, // Always use ID 1 for the single settings record
          site_name: settings.siteName,
          description: settings.description,
          contact_email: settings.contactEmail,
          contact_phone: settings.contactPhone,
          address: settings.address,
          currency: settings.currency,
          enable_delivery: settings.enableDelivery,
          delivery_fee: settings.deliveryFee,
          enable_payments: settings.enablePayments,
          minimum_order_value: settings.minimumOrderValue,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error saving settings:', error);
        throw error;
      }
      
      toast.success('Paramètres mis à jour avec succès');
      // Refresh settings to ensure UI is in sync with database
      await fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erreur lors de l\'enregistrement des paramètres');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setSettings({
      ...settings,
      [name]: type === 'number' ? parseFloat(value) : value
    });
  };
  
  const handleSwitchChange = (checked: boolean, name: string) => {
    setSettings({
      ...settings,
      [name]: checked
    });
  };
  
  // Load settings on component mount
  useEffect(() => {
    fetchSettings();
    
    // Set up a subscription to listen for settings changes
    const settingsChannel = supabase
      .channel('settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'settings'
        },
        (payload) => {
          console.log('Settings changed:', payload);
          fetchSettings();
        }
      )
      .subscribe();
      
    return () => {
      // Unsubscribe when component unmounts
      supabase.removeChannel(settingsChannel);
    };
  }, []);

  return {
    settings,
    loading,
    saveLoading,
    handleInputChange,
    handleSwitchChange,
    handleSave
  };
}
