
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

interface HomeSeoSettings {
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url: string;
  robots_directives: string;
  og_title: string;
  og_description: string;
  og_image: string;
  og_url: string;
}

const HomeSeoManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<HomeSeoSettings>({
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    canonical_url: '',
    robots_directives: 'index, follow',
    og_title: '',
    og_description: '',
    og_image: '',
    og_url: ''
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchHomeSeoSettings();
  }, []);

  const fetchHomeSeoSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .eq('route', '/')
        .eq('page_slug', 'home')
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setSettings({
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          meta_keywords: data.meta_keywords || '',
          canonical_url: data.canonical_url || '',
          robots_directives: data.robots_directives || 'index, follow',
          og_title: data.og_title || '',
          og_description: data.og_description || '',
          og_image: data.og_image || '',
          og_url: data.og_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching home SEO settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load home SEO settings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('seo_settings')
        .upsert({
          route: '/',
          page_slug: 'home',
          meta_title: settings.meta_title,
          meta_description: settings.meta_description,
          meta_keywords: settings.meta_keywords,
          canonical_url: settings.canonical_url,
          robots_directives: settings.robots_directives,
          og_title: settings.og_title,
          og_description: settings.og_description,
          og_image: settings.og_image,
          og_url: settings.og_url,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'route,page_slug'
        });
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Home page SEO settings saved successfully'
      });
    } catch (error) {
      console.error('Error saving home SEO settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save home SEO settings',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Meta Tags</CardTitle>
          <CardDescription>Basic SEO meta information for the homepage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="meta_title" className="block text-sm font-medium mb-1">Meta Title</label>
            <Input
              id="meta_title"
              name="meta_title"
              value={settings.meta_title}
              onChange={handleInputChange}
              placeholder="Your Homepage Title"
            />
          </div>
          <div>
            <label htmlFor="meta_description" className="block text-sm font-medium mb-1">Meta Description</label>
            <Textarea
              id="meta_description"
              name="meta_description"
              value={settings.meta_description}
              onChange={handleInputChange}
              placeholder="Brief description of your homepage"
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="meta_keywords" className="block text-sm font-medium mb-1">Meta Keywords</label>
            <Input
              id="meta_keywords"
              name="meta_keywords"
              value={settings.meta_keywords}
              onChange={handleInputChange}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
          <div>
            <label htmlFor="canonical_url" className="block text-sm font-medium mb-1">Canonical URL</label>
            <Input
              id="canonical_url"
              name="canonical_url"
              value={settings.canonical_url}
              onChange={handleInputChange}
              placeholder="https://yourwebsite.com/"
            />
          </div>
          <div>
            <label htmlFor="robots_directives" className="block text-sm font-medium mb-1">Robots Directives</label>
            <Input
              id="robots_directives"
              name="robots_directives"
              value={settings.robots_directives}
              onChange={handleInputChange}
              placeholder="index, follow"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Open Graph (Social Media)</CardTitle>
          <CardDescription>Settings for when your homepage is shared on social media</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="og_title" className="block text-sm font-medium mb-1">OG Title</label>
            <Input
              id="og_title"
              name="og_title"
              value={settings.og_title}
              onChange={handleInputChange}
              placeholder="Social media title"
            />
          </div>
          <div>
            <label htmlFor="og_description" className="block text-sm font-medium mb-1">OG Description</label>
            <Textarea
              id="og_description"
              name="og_description"
              value={settings.og_description}
              onChange={handleInputChange}
              placeholder="Social media description"
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="og_image" className="block text-sm font-medium mb-1">OG Image URL</label>
            <Input
              id="og_image"
              name="og_image"
              value={settings.og_image}
              onChange={handleInputChange}
              placeholder="https://yourwebsite.com/image.jpg"
            />
          </div>
          <div>
            <label htmlFor="og_url" className="block text-sm font-medium mb-1">OG URL</label>
            <Input
              id="og_url"
              name="og_url"
              value={settings.og_url}
              onChange={handleInputChange}
              placeholder="https://yourwebsite.com/"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? 'Saving...' : 'Save SEO Settings'}
        </Button>
      </div>
    </div>
  );
};

export default HomeSeoManager;
