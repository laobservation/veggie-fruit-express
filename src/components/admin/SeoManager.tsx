import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, PlusCircle, Trash2, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';

interface SeoEntry {
  id: string;
  page_slug: string;
  route: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url: string;
  robots_directives: string;
  structured_data: string;
  og_title: string;
  og_description: string;
  og_image: string;
  og_url: string;
  twitter_card: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
  include_in_sitemap: boolean;
  language_code: string;
  created_at: string;
  updated_at: string;
}

const defaultSeoEntry: Partial<SeoEntry> = {
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  canonical_url: '',
  robots_directives: 'index, follow',
  structured_data: '{}',
  og_title: '',
  og_description: '',
  og_image: '',
  og_url: '',
  twitter_card: 'summary',
  twitter_title: '',
  twitter_description: '',
  twitter_image: '',
  include_in_sitemap: true,
  language_code: 'fr'
};

const SeoManager = () => {
  const [seoEntries, setSeoEntries] = useState<SeoEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<SeoEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Load SEO entries on mount
  useEffect(() => {
    fetchSeoEntries();
  }, []);
  
  const fetchSeoEntries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .order('page_slug', { ascending: true });
      
      if (error) throw error;
      
      setSeoEntries(data || []);
    } catch (error) {
      console.error('Error fetching SEO entries:', error);
      toast.error('Failed to load SEO entries');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNewEntry = () => {
    setSelectedEntry({ ...defaultSeoEntry, id: '', page_slug: '', route: '' } as SeoEntry);
    setIsDialogOpen(true);
  };
  
  const handleEditEntry = (entry: SeoEntry) => {
    setSelectedEntry(entry);
    setIsDialogOpen(true);
  };
  
  const handleDeleteEntry = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this SEO entry?')) {
      try {
        const { error } = await supabase
          .from('seo_settings')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        setSeoEntries(seoEntries.filter(entry => entry.id !== id));
        toast.success('SEO entry deleted successfully');
      } catch (error) {
        console.error('Error deleting SEO entry:', error);
        toast.error('Failed to delete SEO entry');
      }
    }
  };
  
  const handleSave = async (data: Partial<SeoEntry>) => {
    setIsSaving(true);
    
    try {
      if (selectedEntry?.id) {
        // Update existing entry
        const { error } = await supabase
          .from('seo_settings')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedEntry.id);
        
        if (error) throw error;
        
        toast.success('SEO entry updated successfully');
        
        // Update local state
        setSeoEntries(entries => 
          entries.map(entry => 
            entry.id === selectedEntry.id ? { ...entry, ...data, updated_at: new Date().toISOString() } : entry
          )
        );
      } else {
        // Create new entry
        const { data: newEntry, error } = await supabase
          .from('seo_settings')
          .insert({
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();
        
        if (error) throw error;
        
        toast.success('SEO entry created successfully');
        
        // Update local state
        if (newEntry && newEntry.length > 0) {
          setSeoEntries([...seoEntries, newEntry[0]]);
        }
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving SEO entry:', error);
      toast.error('Failed to save SEO entry');
    } finally {
      setIsSaving(false);
    }
  };
  
  const filteredEntries = seoEntries.filter(entry => 
    entry.page_slug.toLowerCase().includes(searchTerm.toLowerCase()) || 
    entry.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.meta_title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search SEO entries..."
            className="pl-9"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleNewEntry} className="bg-green-600 hover:bg-green-700">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-10 border rounded-lg bg-gray-50">
          <p className="text-gray-500">No SEO entries found. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEntries.map(entry => (
            <Card key={entry.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg truncate" title={entry.page_slug}>
                        {entry.page_slug || 'Unnamed Page'}
                      </h3>
                      <p className="text-sm text-gray-500 truncate" title={entry.route}>
                        {entry.route || 'No route specified'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditEntry(entry)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil">
                          <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                        </svg>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="border-t p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Title:</span>
                    </div>
                    <div className="truncate" title={entry.meta_title}>
                      {entry.meta_title || 'Not set'}
                    </div>
                    <div>
                      <span className="text-gray-500">Description:</span>
                    </div>
                    <div className="truncate" title={entry.meta_description}>
                      {entry.meta_description || 'Not set'}
                    </div>
                    <div className="col-span-2 mt-2">
                      <Button 
                        variant="outline" 
                        className="w-full text-xs h-8"
                        onClick={() => handleEditEntry(entry)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <SeoEntryDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        entry={selectedEntry}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
};

interface SeoEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: SeoEntry | null;
  onSave: (data: Partial<SeoEntry>) => void;
  isSaving: boolean;
}

const SeoEntryDialog: React.FC<SeoEntryDialogProps> = ({ 
  open, 
  onOpenChange,
  entry,
  onSave,
  isSaving
}) => {
  const [formData, setFormData] = useState<Partial<SeoEntry>>(defaultSeoEntry);
  const [activeTab, setActiveTab] = useState('basic');
  
  // Reset form when entry changes
  useEffect(() => {
    if (entry) {
      setFormData(entry);
    } else {
      setFormData(defaultSeoEntry);
    }
  }, [entry]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSwitchChange = (checked: boolean, name: string) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  const handleSelectChange = (value: string, name: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{entry?.id ? 'Edit' : 'Create'} SEO Entry</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="opengraph">Open Graph</TabsTrigger>
              <TabsTrigger value="twitter">Twitter</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="page_slug">Page Name</Label>
                  <Input
                    id="page_slug"
                    name="page_slug"
                    value={formData.page_slug || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. Home, About Us, Contact"
                    maxLength={100}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="route">Route Path</Label>
                  <Input
                    id="route"
                    name="route"
                    value={formData.route || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. /, /about, /contact"
                    maxLength={100}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <div className="relative">
                  <Input
                    id="meta_title"
                    name="meta_title"
                    value={formData.meta_title || ''}
                    onChange={handleInputChange}
                    placeholder="Meta title (70 characters max)"
                    maxLength={70}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                    {(formData.meta_title?.length || 0)}/70
                  </span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <div className="relative">
                  <Textarea
                    id="meta_description"
                    name="meta_description"
                    value={formData.meta_description || ''}
                    onChange={handleInputChange}
                    placeholder="Meta description (160 characters max)"
                    maxLength={160}
                    rows={3}
                  />
                  <span className="absolute right-3 bottom-3 text-xs text-gray-400">
                    {(formData.meta_description?.length || 0)}/160
                  </span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="meta_keywords">Meta Keywords</Label>
                <Input
                  id="meta_keywords"
                  name="meta_keywords"
                  value={formData.meta_keywords || ''}
                  onChange={handleInputChange}
                  placeholder="Comma-separated keywords"
                />
              </div>
              
              <div>
                <Label htmlFor="canonical_url">Canonical URL (optional)</Label>
                <Input
                  id="canonical_url"
                  name="canonical_url"
                  value={formData.canonical_url || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com/canonical-page"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="include_in_sitemap"
                  checked={formData.include_in_sitemap !== false}
                  onCheckedChange={(checked) => handleSwitchChange(checked, 'include_in_sitemap')}
                />
                <Label htmlFor="include_in_sitemap">Include in Sitemap</Label>
              </div>
            </TabsContent>
            
            <TabsContent value="opengraph" className="space-y-4">
              <div>
                <Label htmlFor="og_title">OG Title</Label>
                <Input
                  id="og_title"
                  name="og_title"
                  value={formData.og_title || ''}
                  onChange={handleInputChange}
                  placeholder="Open Graph title"
                />
              </div>
              
              <div>
                <Label htmlFor="og_description">OG Description</Label>
                <Textarea
                  id="og_description"
                  name="og_description"
                  value={formData.og_description || ''}
                  onChange={handleInputChange}
                  placeholder="Open Graph description"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="og_image">OG Image URL</Label>
                <Input
                  id="og_image"
                  name="og_image"
                  value={formData.og_image || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <Label htmlFor="og_url">OG URL (optional)</Label>
                <Input
                  id="og_url"
                  name="og_url"
                  value={formData.og_url || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com/page"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="twitter" className="space-y-4">
              <div>
                <Label htmlFor="twitter_card">Twitter Card Type</Label>
                <Select
                  value={formData.twitter_card || 'summary'}
                  onValueChange={(value) => handleSelectChange(value, 'twitter_card')}
                >
                  <SelectTrigger id="twitter_card">
                    <SelectValue placeholder="Select card type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Summary</SelectItem>
                    <SelectItem value="summary_large_image">Summary with Large Image</SelectItem>
                    <SelectItem value="app">App</SelectItem>
                    <SelectItem value="player">Player</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="twitter_title">Twitter Title</Label>
                <Input
                  id="twitter_title"
                  name="twitter_title"
                  value={formData.twitter_title || ''}
                  onChange={handleInputChange}
                  placeholder="Twitter card title"
                />
              </div>
              
              <div>
                <Label htmlFor="twitter_description">Twitter Description</Label>
                <Textarea
                  id="twitter_description"
                  name="twitter_description"
                  value={formData.twitter_description || ''}
                  onChange={handleInputChange}
                  placeholder="Twitter card description"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="twitter_image">Twitter Image URL</Label>
                <Input
                  id="twitter_image"
                  name="twitter_image"
                  value={formData.twitter_image || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4">
              <div>
                <Label htmlFor="robots_directives">Robots Directives</Label>
                <Select
                  value={formData.robots_directives || 'index, follow'}
                  onValueChange={(value) => handleSelectChange(value, 'robots_directives')}
                >
                  <SelectTrigger id="robots_directives">
                    <SelectValue placeholder="Select robots directive" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="index, follow">index, follow</SelectItem>
                    <SelectItem value="noindex, follow">noindex, follow</SelectItem>
                    <SelectItem value="index, nofollow">index, nofollow</SelectItem>
                    <SelectItem value="noindex, nofollow">noindex, nofollow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="structured_data">Structured Data (JSON-LD)</Label>
                <Textarea
                  id="structured_data"
                  name="structured_data"
                  value={formData.structured_data || '{}'}
                  onChange={handleInputChange}
                  placeholder="{}"
                  rows={5}
                  className="font-mono"
                />
              </div>
              
              <div>
                <Label htmlFor="language_code">Language Code (optional)</Label>
                <Input
                  id="language_code"
                  name="language_code"
                  value={formData.language_code || ''}
                  onChange={handleInputChange}
                  placeholder="fr"
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {entry?.id ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SeoManager;
