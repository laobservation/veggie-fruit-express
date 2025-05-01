
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, Check, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LogoManager: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [logoWidth, setLogoWidth] = useState(150);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/svg+xml') {
        toast.error('Please upload a PNG, JPEG, or SVG file');
        return;
      }
      
      setIsUploading(true);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
      
      // In a real app, you would upload to your storage here
      // This is just a simulation
      setTimeout(() => {
        // Simulate upload completion
        const fakeUploadedUrl = 'https://example.com/logos/' + file.name;
        setLogoUrl(fakeUploadedUrl);
        toast.success('Logo uploaded successfully');
      }, 1500);
    }
  };
  
  const handleSave = () => {
    if (!logoUrl) {
      toast.error('Please upload a logo first');
      return;
    }
    
    setIsSaving(true);
    
    // In a real app, you would save to your database here
    // This is just a simulation
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Logo settings saved successfully');
    }, 1000);
  };
  
  const handleReset = () => {
    setPreviewUrl('');
    setLogoUrl('');
    setLogoWidth(150);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Logo Management</h2>
      </div>
      
      <Alert>
        <AlertDescription>
          Upload a new logo for your store. The logo will be displayed in the header and footer.
          For best results, use a PNG or SVG file with a transparent background.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Logo Image</label>
            <Input
              type="file"
              onChange={handleFileChange}
              accept="image/png,image/jpeg,image/svg+xml"
            />
            <p className="text-xs text-gray-500">Max file size: 2MB. Formats: PNG, JPEG, SVG</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Logo Width ({logoWidth}px)</label>
            <Slider
              value={[logoWidth]}
              onValueChange={(value) => setLogoWidth(value[0])}
              min={50}
              max={200}
              step={1}
              disabled={!previewUrl}
            />
            <p className="text-xs text-gray-500">Recommended width: 120-180px</p>
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button
              onClick={handleSave}
              disabled={!logoUrl || isSaving}
              className="bg-veggie-primary hover:bg-veggie-dark"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!previewUrl}
            >
              Reset
            </Button>
          </div>
        </div>
        
        <Card className="p-6 bg-gray-50 flex flex-col items-center justify-center">
          <h3 className="text-sm font-medium mb-4">Logo Preview</h3>
          
          {isUploading ? (
            <div className="flex flex-col items-center justify-center h-32">
              <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
              <p className="mt-2 text-sm text-gray-500">Uploading...</p>
            </div>
          ) : previewUrl ? (
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded border mb-4">
                <img
                  src={previewUrl}
                  alt="Logo Preview"
                  style={{ width: `${logoWidth}px`, height: 'auto' }}
                  className="max-h-32"
                />
              </div>
              <p className="text-xs text-gray-500">Current width: {logoWidth}px</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32">
              <Upload className="h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Upload a logo to see preview</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LogoManager;
