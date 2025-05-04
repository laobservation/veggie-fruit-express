
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase, getSettingsTable } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Check, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SettingsState {
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

const WebsiteSettings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
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
  });
  
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Fetch settings from the database
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await getSettingsTable()
        .select('*')
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Table doesn't exist or no data found
          await initializeSettings();
        } else {
          console.error('Error fetching settings:', error);
          throw new Error('Failed to fetch settings');
        }
        return;
      }
      
      if (data) {
        setSettings({
          siteName: data.site_name || 'Marché Bio',
          description: data.description || 'Livraison de fruits et légumes bio à domicile',
          contactEmail: data.contact_email || 'contact@marchebiomobile.com',
          contactPhone: data.contact_phone || '+212 612345678',
          address: data.address || 'Extention Zerhounia N236, Marrakech, Maroc',
          currency: data.currency || 'DH',
          enableDelivery: data.enable_delivery || true,
          deliveryFee: data.delivery_fee || 30,
          enablePayments: data.enable_payments || true,
          minimumOrderValue: data.minimum_order_value || 100
        });
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
      // First, check if the table exists
      const { error: tableCheckError } = await getSettingsTable()
        .select('count')
        .limit(1);
      
      if (tableCheckError && tableCheckError.code === 'PGRST116') {
        // Table doesn't exist, create it
        console.log('Settings table might not exist. Trying to create a settings record...');
      }
      
      // Insert initial settings
      const { error } = await getSettingsTable()
        .insert([
          {
            site_name: settings.siteName,
            description: settings.description,
            contact_email: settings.contactEmail,
            contact_phone: settings.contactPhone,
            address: settings.address,
            currency: settings.currency,
            enable_delivery: settings.enableDelivery,
            delivery_fee: settings.deliveryFee,
            enable_payments: settings.enablePayments,
            minimum_order_value: settings.minimumOrderValue
          }
        ]);
      
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
  
  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const { error } = await getSettingsTable()
        .upsert([
          {
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
            updated_at: new Date()
          }
        ]);
      
      if (error) {
        throw error;
      }
      
      toast.success('Paramètres mis à jour avec succès');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erreur lors de l\'enregistrement des paramètres');
    } finally {
      setSaveLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }
  
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations du Site</h3>
            
            <div className="space-y-2">
              <Label htmlFor="siteName">Nom du Site</Label>
              <Input
                id="siteName"
                name="siteName"
                value={settings.siteName}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={settings.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email de Contact</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Téléphone</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                name="address"
                value={settings.address}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Commerce</h3>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Input
                id="currency"
                name="currency"
                value={settings.currency}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500">Exemple: DH, €, $</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableDelivery">Activer la Livraison</Label>
                <p className="text-xs text-gray-500">Permettre aux clients de se faire livrer</p>
              </div>
              <Switch
                id="enableDelivery"
                checked={settings.enableDelivery}
                onCheckedChange={(checked) => handleSwitchChange(checked, 'enableDelivery')}
              />
            </div>
            
            {settings.enableDelivery && (
              <div className="space-y-2">
                <Label htmlFor="deliveryFee">Frais de Livraison (DH)</Label>
                <Input
                  id="deliveryFee"
                  name="deliveryFee"
                  type="number"
                  value={settings.deliveryFee}
                  onChange={handleInputChange}
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enablePayments">Activer les Paiements en Ligne</Label>
                <p className="text-xs text-gray-500">Permettre aux clients de payer en ligne</p>
              </div>
              <Switch
                id="enablePayments"
                checked={settings.enablePayments}
                onCheckedChange={(checked) => handleSwitchChange(checked, 'enablePayments')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minimumOrderValue">Montant Minimum de Commande (DH)</Label>
              <Input
                id="minimumOrderValue"
                name="minimumOrderValue"
                type="number"
                value={settings.minimumOrderValue}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleSave}
            className="w-full bg-veggie-primary hover:bg-veggie-dark"
            disabled={saveLoading}
          >
            {saveLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Enregistrer les Modifications
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsiteSettings;
