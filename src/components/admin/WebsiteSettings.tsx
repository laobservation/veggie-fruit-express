
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Palette, Mail, Building, Globe, Share2, Save } from 'lucide-react';
import { ChromePicker } from 'react-color';
import { supabase } from '@/integrations/supabase/client';

interface WebsiteSettings {
  siteName?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

const WebsiteSettings: React.FC = () => {
  const [settings, setSettings] = useState<WebsiteSettings>({
    siteName: '',
    logo: '',
    primaryColor: '#4CAF50',
    secondaryColor: '#8BC34A',
    contactEmail: '',
    contactPhone: '',
    address: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
    },
  });
  
  const [isPrimaryColorPickerOpen, setIsPrimaryColorPickerOpen] = useState(false);
  const [isSecondaryColorPickerOpen, setIsSecondaryColorPickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // Fetch settings using Edge Function
      const response = await fetch('/api/admin-settings-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'get' }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      const result = await response.json();
      
      if (result.success && result.settings) {
        setSettings(result.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres du site",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Save settings using Edge Function
      const response = await fetch('/api/admin-settings-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'update', 
          settings: settings 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Succès",
          description: "Les paramètres ont été enregistrés avec succès",
        });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les paramètres du site",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      // Handle nested properties like socialMedia.facebook
      const [parent, child] = name.split('.');
      setSettings({
        ...settings,
        [parent]: {
          ...settings[parent as keyof WebsiteSettings],
          [child]: value,
        },
      });
    } else {
      setSettings({
        ...settings,
        [name]: value,
      });
    }
  };

  const handleColorChange = (color: { hex: string }, colorType: 'primaryColor' | 'secondaryColor') => {
    setSettings({
      ...settings,
      [colorType]: color.hex,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Paramètres du site</CardTitle>
          <CardDescription>
            Configurez les paramètres généraux de votre site web
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Général</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Apparence</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Contact</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Réseaux sociaux</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="siteName">Nom du site</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={settings.siteName || ''}
                    onChange={handleInputChange}
                    placeholder="Mon site de vente en ligne"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="logo">URL du logo</Label>
                  <Input
                    id="logo"
                    name="logo"
                    value={settings.logo || ''}
                    onChange={handleInputChange}
                    placeholder="https://example.com/logo.png"
                  />
                  {settings.logo && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-2">Aperçu :</p>
                      <img
                        src={settings.logo}
                        alt="Logo Preview"
                        className="h-16 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="mt-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Couleur primaire</Label>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-md border cursor-pointer"
                      style={{ backgroundColor: settings.primaryColor }}
                      onClick={() => setIsPrimaryColorPickerOpen(!isPrimaryColorPickerOpen)}
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => handleColorChange({ hex: e.target.value }, 'primaryColor')}
                      className="w-32"
                    />
                  </div>
                  {isPrimaryColorPickerOpen && (
                    <div className="relative z-10 mt-2">
                      <div 
                        className="fixed inset-0" 
                        onClick={() => setIsPrimaryColorPickerOpen(false)}
                      />
                      <div className="absolute">
                        <ChromePicker
                          color={settings.primaryColor}
                          onChange={(color) => handleColorChange(color, 'primaryColor')}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Couleur secondaire</Label>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-md border cursor-pointer"
                      style={{ backgroundColor: settings.secondaryColor }}
                      onClick={() => setIsSecondaryColorPickerOpen(!isSecondaryColorPickerOpen)}
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) => handleColorChange({ hex: e.target.value }, 'secondaryColor')}
                      className="w-32"
                    />
                  </div>
                  {isSecondaryColorPickerOpen && (
                    <div className="relative z-10 mt-2">
                      <div 
                        className="fixed inset-0" 
                        onClick={() => setIsSecondaryColorPickerOpen(false)}
                      />
                      <div className="absolute">
                        <ChromePicker
                          color={settings.secondaryColor}
                          onChange={(color) => handleColorChange(color, 'secondaryColor')}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium mb-3">Aperçu des couleurs</h4>
                  <div className="space-y-3">
                    <div 
                      className="p-4 rounded-md text-white" 
                      style={{ backgroundColor: settings.primaryColor }}
                    >
                      Texte sur couleur primaire
                    </div>
                    <div 
                      className="p-4 rounded-md text-white" 
                      style={{ backgroundColor: settings.secondaryColor }}
                    >
                      Texte sur couleur secondaire
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        style={{ backgroundColor: settings.primaryColor }}
                        className="text-white"
                      >
                        Bouton primaire
                      </Button>
                      <Button 
                        variant="outline" 
                        style={{ 
                          borderColor: settings.secondaryColor,
                          color: settings.secondaryColor
                        }}
                      >
                        Bouton secondaire
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="mt-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="contactEmail">Email de contact</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={settings.contactEmail || ''}
                    onChange={handleInputChange}
                    placeholder="contact@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contactPhone">Téléphone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={settings.contactPhone || ''}
                    onChange={handleInputChange}
                    placeholder="+33 123456789"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={settings.address || ''}
                    onChange={handleInputChange}
                    placeholder="123 Rue des Exemples, 75000 Paris"
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social" className="mt-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="socialMedia.facebook">Facebook</Label>
                  <Input
                    id="socialMedia.facebook"
                    name="socialMedia.facebook"
                    value={settings.socialMedia?.facebook || ''}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/votrepage"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="socialMedia.instagram">Instagram</Label>
                  <Input
                    id="socialMedia.instagram"
                    name="socialMedia.instagram"
                    value={settings.socialMedia?.instagram || ''}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/votrecompte"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="socialMedia.twitter">Twitter</Label>
                  <Input
                    id="socialMedia.twitter"
                    name="socialMedia.twitter"
                    value={settings.socialMedia?.twitter || ''}
                    onChange={handleInputChange}
                    placeholder="https://twitter.com/votrecompte"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 p-6">
          <Button 
            onClick={saveSettings} 
            disabled={saving}
            className="ml-auto flex items-center"
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WebsiteSettings;
