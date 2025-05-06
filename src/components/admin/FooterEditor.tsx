import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useFooterSettings } from '@/hooks/use-footer-settings';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/Footer';

const FooterEditor: React.FC = () => {
  const { 
    footerSettings, 
    loading, 
    updateFooterSettings,
    saveLoading 
  } = useFooterSettings();
  
  const [activeTab, setActiveTab] = useState<string>("general");
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested objects with dot notation (e.g., "socialLinks.facebook")
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      updateFooterSettings({
        ...footerSettings,
        [section]: {
          ...footerSettings[section],
          [field]: value
        }
      });
    } else {
      updateFooterSettings({
        ...footerSettings,
        [name]: value
      });
    }
  };
  
  const handleSave = async () => {
    try {
      await saveFooterSettings();
      toast({
        title: "Success",
        description: "Footer settings saved successfully",
      });
    } catch (error) {
      console.error('Error saving footer settings:', error);
      toast({
        title: "Error",
        description: "Failed to save footer settings",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-veggie-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Footer Settings</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowPreview(!showPreview)} 
            variant="outline"
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button onClick={handleSave} disabled={saveLoading}>
            {saveLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
      
      {showPreview && (
        <div className="border rounded-lg overflow-hidden mb-6">
          <div className="bg-gray-50 p-2 text-sm text-center text-gray-600 border-b">
            Preview - This is how your footer will appear on the website
          </div>
          <div className="max-w-full overflow-x-auto">
            <Footer />
          </div>
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="links">Links & Social</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Basic information displayed in the footer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={footerSettings.companyName}
                  onChange={handleInputChange}
                  placeholder="Your Company Name"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Footer Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={footerSettings.description}
                  onChange={handleInputChange}
                  placeholder="A short description of your business"
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="copyrightText">Copyright Text</Label>
                <Input
                  id="copyrightText"
                  name="copyrightText"
                  value={footerSettings.copyrightText}
                  onChange={handleInputChange}
                  placeholder="© 2025 Your Company. All rights reserved."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Contact details to display in the footer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="contactInfo.phone"
                  value={footerSettings.contactInfo?.phone}
                  onChange={handleInputChange}
                  placeholder="+1 234 567 890"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="contactInfo.email"
                  value={footerSettings.contactInfo?.email}
                  onChange={handleInputChange}
                  placeholder="contact@example.com"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="contactInfo.address"
                  value={footerSettings.contactInfo?.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street, City"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Navigation links in the footer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* We'll keep this simple for now, with just social media links */}
                <div className="grid gap-2">
                  <Label htmlFor="facebook">Facebook URL</Label>
                  <Input
                    id="facebook"
                    name="socialLinks.facebook"
                    value={footerSettings.socialLinks?.facebook}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/your-page"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="instagram">Instagram URL</Label>
                  <Input
                    id="instagram"
                    name="socialLinks.instagram"
                    value={footerSettings.socialLinks?.instagram}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/your-account"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="twitter">Twitter URL</Label>
                  <Input
                    id="twitter"
                    name="socialLinks.twitter"
                    value={footerSettings.socialLinks?.twitter}
                    onChange={handleInputChange}
                    placeholder="https://twitter.com/your-account"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FooterEditor;
