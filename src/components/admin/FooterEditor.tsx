
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, CardHeader, CardTitle, CardDescription, CardContent 
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, X } from 'lucide-react';

interface FooterSettings {
  id: number;
  company_name: string;
  description: string;
  copyright_text: string;
  quick_links: { title: string; url: string; }[];
  social_links: { [key: string]: string };
  contact_info: {
    email: string;
    phone: string;
    address: string;
  };
}

const FooterEditor: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<FooterSettings>({
    id: 1,
    company_name: 'Veggie Express',
    description: 'Fresh fruits and vegetables delivered right to your doorstep.',
    copyright_text: '© 2025 Veggie Express. All rights reserved.',
    quick_links: [
      { title: 'Home', url: '/' },
      { title: 'Fruits', url: '/fruits' },
      { title: 'Vegetables', url: '/vegetables' }
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
  });

  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchFooterSettings();
    
    // Set up realtime subscription
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

  const fetchFooterSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('footer_settings')
        .select('*')
        .eq('id', 1)
        .single();
        
      if (error) throw error;
      
      if (data) {
        // Type assertion to ensure the correct shape
        const contactInfoObj = data.contact_info as unknown as Record<string, string> || {};
        
        const contactInfo = {
          email: contactInfoObj.email || '',
          phone: contactInfoObj.phone || '',
          address: contactInfoObj.address || ''
        };
          
        const parsedSettings: FooterSettings = {
          id: data.id,
          company_name: data.company_name || 'Veggie Express',
          description: data.description || 'Fresh fruits and vegetables delivered right to your doorstep.',
          copyright_text: data.copyright_text || '© 2025 Veggie Express. All rights reserved.',
          quick_links: Array.isArray(data.quick_links) 
            ? data.quick_links.map((link: any) => ({
                title: String(link.title || ''),
                url: String(link.url || '')
              }))
            : [],
          social_links: typeof data.social_links === 'object' && data.social_links !== null
            ? Object.entries(data.social_links).reduce((acc, [key, value]) => {
                acc[key] = String(value || '');
                return acc;
              }, {} as { [key: string]: string })
            : { facebook: '#', twitter: '#', instagram: '#' },
          contact_info: contactInfo
        };
        
        setSettings(parsedSettings);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section?: 'contact_info' | 'social_links'
  ) => {
    const { name, value } = e.target;
    
    if (section === 'contact_info') {
      setSettings({
        ...settings,
        contact_info: {
          ...settings.contact_info,
          [name]: value
        }
      });
    } else if (section === 'social_links') {
      setSettings({
        ...settings,
        social_links: {
          ...settings.social_links,
          [name]: value
        }
      });
    } else {
      setSettings({
        ...settings,
        [name]: value
      });
    }
  };

  const handleNewLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLink({
      ...newLink,
      [name]: value
    });
  };

  const addQuickLink = () => {
    if (newLink.title && newLink.url) {
      setSettings({
        ...settings,
        quick_links: [...settings.quick_links, { ...newLink }]
      });
      setNewLink({ title: '', url: '' });
    }
  };

  const removeQuickLink = (index: number) => {
    const updatedLinks = [...settings.quick_links];
    updatedLinks.splice(index, 1);
    setSettings({
      ...settings,
      quick_links: updatedLinks
    });
  };

  const saveSettings = async () => {
    try {
      const { error } = await supabase
        .from('footer_settings')
        .upsert({
          id: 1,
          company_name: settings.company_name,
          description: settings.description,
          copyright_text: settings.copyright_text,
          quick_links: settings.quick_links,
          social_links: settings.social_links,
          contact_info: settings.contact_info
        });
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Footer settings saved successfully'
      });
    } catch (error) {
      console.error('Error saving footer settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save footer settings',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
          <CardDescription>Update your company information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="company_name" className="block text-sm font-medium mb-1">Company Name</label>
            <Input
              id="company_name"
              name="company_name"
              value={settings.company_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              id="description"
              name="description"
              value={settings.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="copyright_text" className="block text-sm font-medium mb-1">Copyright Text</label>
            <Input
              id="copyright_text"
              name="copyright_text"
              value={settings.copyright_text}
              onChange={handleChange}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Navigation links displayed in the footer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {settings.quick_links.map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input 
                    value={link.title} 
                    disabled 
                    className="flex-1"
                  />
                  <Input 
                    value={link.url} 
                    disabled 
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuickLink(index)}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 mt-2">
              <h4 className="text-sm font-medium mb-2">Add New Link</h4>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label htmlFor="title" className="text-xs">Title</label>
                  <Input
                    id="title"
                    name="title"
                    value={newLink.title}
                    onChange={handleNewLinkChange}
                    placeholder="Link Title"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="url" className="text-xs">URL</label>
                  <Input
                    id="url"
                    name="url"
                    value={newLink.url}
                    onChange={handleNewLinkChange}
                    placeholder="/page-path"
                  />
                </div>
                <Button
                  onClick={addQuickLink}
                  size="sm"
                  className="shrink-0"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>Your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="facebook" className="block text-sm font-medium mb-1">Facebook</label>
                <Input
                  id="facebook"
                  name="facebook"
                  value={settings.social_links.facebook}
                  onChange={(e) => handleChange(e, 'social_links')}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div>
                <label htmlFor="twitter" className="block text-sm font-medium mb-1">Twitter</label>
                <Input
                  id="twitter"
                  name="twitter"
                  value={settings.social_links.twitter}
                  onChange={(e) => handleChange(e, 'social_links')}
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium mb-1">Instagram</label>
                <Input
                  id="instagram"
                  name="instagram"
                  value={settings.social_links.instagram}
                  onChange={(e) => handleChange(e, 'social_links')}
                  placeholder="https://instagram.com/yourprofile"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Your contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <Input
                  id="email"
                  name="email"
                  value={settings.contact_info.email}
                  onChange={(e) => handleChange(e, 'contact_info')}
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
                <Input
                  id="phone"
                  name="phone"
                  value={settings.contact_info.phone}
                  onChange={(e) => handleChange(e, 'contact_info')}
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
                <Input
                  id="address"
                  name="address"
                  value={settings.contact_info.address}
                  onChange={(e) => handleChange(e, 'contact_info')}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={saveSettings}>
          Save Footer Settings
        </Button>
      </div>
    </div>
  );
};

export default FooterEditor;
