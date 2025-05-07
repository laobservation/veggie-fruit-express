
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface FooterSettings {
  id: number;
  company_name: string;
  description: string;
  copyright_text: string;
  quick_links: {
    title: string;
    url: string;
  }[];
  social_links: {
    [key: string]: string;
  };
  contact_info: {
    email: string;
    phone: string;
    address: string;
  };
}

const initialSettings: FooterSettings = {
  id: 1,
  company_name: 'Veggie Express',
  description: 'Fresh fruits and vegetables delivered right to your doorstep.',
  copyright_text: '© 2025 Veggie Express. All rights reserved.',
  quick_links: [
    { title: 'Home', url: '/' },
    { title: 'Fruits', url: '/category/fruits' },
    { title: 'Vegetables', url: '/category/vegetables' }
  ],
  social_links: {
    facebook: '#',
    twitter: '#',
    instagram: '#'
  },
  contact_info: {
    email: 'info@veggieexpress.com',
    phone: '+1 234 567 8900',
    address: '123 Fresh Street, Veggie City'
  }
};

const FooterEditor: React.FC = () => {
  const [settings, setSettings] = useState<FooterSettings>(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newQuickLink, setNewQuickLink] = useState({ title: '', url: '' });
  const [newSocialTitle, setNewSocialTitle] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const { toast } = useToast();

  // Fetch footer settings on component mount
  useEffect(() => {
    fetchFooterSettings();
    
    // Set up a realtime subscription for footer settings changes
    const channel = supabase
      .channel('footer-settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'footer_settings'
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

  const fetchFooterSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('footer_settings')
        .select('*')
        .eq('id', 1)
        .single();
        
      if (error) {
        // If no settings found, we'll create them
        if (error.code === 'PGRST116') {
          await supabase.from('footer_settings').insert([initialSettings]);
          setSettings(initialSettings);
        } else {
          throw error;
        }
      } else if (data) {
        // Transform JSON fields
        setSettings({
          id: data.id,
          company_name: data.company_name || initialSettings.company_name,
          description: data.description || initialSettings.description,
          copyright_text: data.copyright_text || initialSettings.copyright_text,
          quick_links: Array.isArray(data.quick_links) ? data.quick_links : initialSettings.quick_links,
          social_links: data.social_links || initialSettings.social_links,
          contact_info: data.contact_info || initialSettings.contact_info
        });
      }
    } catch (error) {
      console.error('Error fetching footer settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load footer settings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('footer_settings')
        .update({
          company_name: settings.company_name,
          description: settings.description,
          copyright_text: settings.copyright_text,
          quick_links: settings.quick_links,
          social_links: settings.social_links,
          contact_info: settings.contact_info
        })
        .eq('id', 1);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Footer settings updated successfully'
      });
    } catch (error) {
      console.error('Error saving footer settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save footer settings',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle basic text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };

  // Handle contact info changes
  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      contact_info: {
        ...settings.contact_info,
        [name]: value
      }
    });
  };

  // Add a new quick link
  const handleAddQuickLink = () => {
    if (newQuickLink.title && newQuickLink.url) {
      setSettings({
        ...settings,
        quick_links: [...settings.quick_links, newQuickLink]
      });
      setNewQuickLink({ title: '', url: '' });
    } else {
      toast({
        title: 'Error',
        description: 'Both title and URL are required for quick links',
        variant: 'destructive'
      });
    }
  };

  // Remove a quick link
  const handleRemoveQuickLink = (index: number) => {
    const updatedLinks = [...settings.quick_links];
    updatedLinks.splice(index, 1);
    setSettings({
      ...settings,
      quick_links: updatedLinks
    });
  };

  // Update quick link title
  const handleQuickLinkTitleChange = (index: number, value: string) => {
    const updatedLinks = [...settings.quick_links];
    updatedLinks[index].title = value;
    setSettings({
      ...settings,
      quick_links: updatedLinks
    });
  };

  // Update quick link URL
  const handleQuickLinkUrlChange = (index: number, value: string) => {
    const updatedLinks = [...settings.quick_links];
    updatedLinks[index].url = value;
    setSettings({
      ...settings,
      quick_links: updatedLinks
    });
  };

  // Add a new social link
  const handleAddSocialLink = () => {
    if (newSocialTitle && newSocialUrl) {
      setSettings({
        ...settings,
        social_links: {
          ...settings.social_links,
          [newSocialTitle.toLowerCase()]: newSocialUrl
        }
      });
      setNewSocialTitle('');
      setNewSocialUrl('');
    } else {
      toast({
        title: 'Error',
        description: 'Both platform name and URL are required for social links',
        variant: 'destructive'
      });
    }
  };

  // Remove a social link
  const handleRemoveSocialLink = (platform: string) => {
    const updatedSocialLinks = { ...settings.social_links };
    delete updatedSocialLinks[platform];
    setSettings({
      ...settings,
      social_links: updatedSocialLinks
    });
  };

  // Update a social link value
  const handleSocialLinkChange = (platform: string, value: string) => {
    setSettings({
      ...settings,
      social_links: {
        ...settings.social_links,
        [platform]: value
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Footer Settings</h2>
        <Button 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save Changes
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input 
                id="company_name"
                name="company_name"
                value={settings.company_name}
                onChange={handleChange}
                placeholder="Company Name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                name="description"
                value={settings.description}
                onChange={handleChange}
                placeholder="Footer description"
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="copyright_text">Copyright Text</Label>
              <Input 
                id="copyright_text"
                name="copyright_text"
                value={settings.copyright_text}
                onChange={handleChange}
                placeholder="Copyright Text"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <Label>Contact Information</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                name="email"
                value={settings.contact_info.email}
                onChange={handleContactInfoChange}
                placeholder="Email address"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone"
                name="phone"
                value={settings.contact_info.phone}
                onChange={handleContactInfoChange}
                placeholder="Phone number"
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <Label htmlFor="address">Address</Label>
            <Textarea 
              id="address"
              name="address"
              value={settings.contact_info.address}
              onChange={handleContactInfoChange}
              placeholder="Physical address"
              className="mt-1"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <Label>Quick Links</Label>
          <div className="space-y-4 mt-2">
            {settings.quick_links.map((link, index) => (
              <div key={index} className="grid grid-cols-10 gap-2">
                <Input 
                  className="col-span-4"
                  value={link.title}
                  onChange={(e) => handleQuickLinkTitleChange(index, e.target.value)}
                  placeholder="Link title"
                />
                <Input 
                  className="col-span-5"
                  value={link.url}
                  onChange={(e) => handleQuickLinkUrlChange(index, e.target.value)}
                  placeholder="URL (e.g. /about)"
                />
                <Button 
                  variant="outline"
                  size="icon"
                  className="col-span-1"
                  onClick={() => handleRemoveQuickLink(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <div className="grid grid-cols-10 gap-2">
              <Input 
                className="col-span-4"
                value={newQuickLink.title}
                onChange={(e) => setNewQuickLink({...newQuickLink, title: e.target.value})}
                placeholder="New link title"
              />
              <Input 
                className="col-span-5"
                value={newQuickLink.url}
                onChange={(e) => setNewQuickLink({...newQuickLink, url: e.target.value})}
                placeholder="URL (e.g. /about)"
              />
              <Button 
                variant="outline"
                size="icon"
                className="col-span-1"
                onClick={handleAddQuickLink}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <Label>Social Links</Label>
          <div className="space-y-4 mt-2">
            {Object.entries(settings.social_links).map(([platform, url]) => (
              <div key={platform} className="grid grid-cols-10 gap-2">
                <Input 
                  className="col-span-4"
                  value={platform}
                  disabled
                />
                <Input 
                  className="col-span-5"
                  value={url}
                  onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                  placeholder="URL (e.g. https://facebook.com/yourbrand)"
                />
                <Button 
                  variant="outline"
                  size="icon"
                  className="col-span-1"
                  onClick={() => handleRemoveSocialLink(platform)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <div className="grid grid-cols-10 gap-2">
              <Input 
                className="col-span-4"
                value={newSocialTitle}
                onChange={(e) => setNewSocialTitle(e.target.value)}
                placeholder="Platform (e.g. facebook)"
              />
              <Input 
                className="col-span-5"
                value={newSocialUrl}
                onChange={(e) => setNewSocialUrl(e.target.value)}
                placeholder="URL (e.g. https://facebook.com/yourbrand)"
              />
              <Button 
                variant="outline"
                size="icon"
                className="col-span-1"
                onClick={handleAddSocialLink}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FooterEditor;
