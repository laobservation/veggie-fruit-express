
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductSeoFieldsProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (field: string, value: string) => void;
}

const ProductSeoFields: React.FC<ProductSeoFieldsProps> = ({ formData, handleInputChange, handleSelectChange }) => {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="basic">SEO Basique</TabsTrigger>
        <TabsTrigger value="advanced">SEO Avancé</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic" className="space-y-4">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="meta_title">Meta Title (max 70 caractères)</Label>
            <Input
              id="meta_title"
              name="meta_title"
              value={formData.meta_title || ''}
              onChange={handleInputChange}
              maxLength={70}
              placeholder="Titre SEO pour ce produit"
            />
          </div>
          
          <div>
            <Label htmlFor="meta_description">Meta Description (max 160 caractères)</Label>
            <Textarea
              id="meta_description"
              name="meta_description"
              value={formData.meta_description || ''}
              onChange={handleInputChange}
              maxLength={160}
              rows={3}
              placeholder="Description SEO pour ce produit"
            />
          </div>
          
          <div>
            <Label htmlFor="meta_keywords">Meta Keywords (séparés par des virgules)</Label>
            <Input
              id="meta_keywords"
              name="meta_keywords"
              value={formData.meta_keywords || ''}
              onChange={handleInputChange}
              placeholder="fruit, bio, frais, naturel"
            />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="advanced" className="space-y-4">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="canonical_url">Canonical URL</Label>
            <Input
              id="canonical_url"
              name="canonical_url"
              type="url"
              value={formData.canonical_url || ''}
              onChange={handleInputChange}
              placeholder="https://example.com/product/..."
            />
          </div>
          
          <div>
            <Label htmlFor="robots_directives">Robots Directives</Label>
            <Select 
              value={formData.robots_directives || 'index, follow'} 
              onValueChange={(value) => handleSelectChange('robots_directives', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="index, follow">index, follow</SelectItem>
                <SelectItem value="noindex, nofollow">noindex, nofollow</SelectItem>
                <SelectItem value="index, nofollow">index, nofollow</SelectItem>
                <SelectItem value="noindex, follow">noindex, follow</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="og_title">Open Graph Title</Label>
            <Input
              id="og_title"
              name="og_title"
              value={formData.og_title || ''}
              onChange={handleInputChange}
              placeholder="Titre pour le partage social"
            />
          </div>
          
          <div>
            <Label htmlFor="og_description">Open Graph Description</Label>
            <Textarea
              id="og_description"
              name="og_description"
              value={formData.og_description || ''}
              onChange={handleInputChange}
              rows={3}
              placeholder="Description pour le partage social"
            />
          </div>
          
          <div>
            <Label htmlFor="og_image">Open Graph Image URL</Label>
            <Input
              id="og_image"
              name="og_image"
              type="url"
              value={formData.og_image || ''}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div>
            <Label htmlFor="structured_data">Structured Data (JSON)</Label>
            <Textarea
              id="structured_data"
              name="structured_data"
              value={typeof formData.structured_data === 'string' ? formData.structured_data : JSON.stringify(formData.structured_data || {}, null, 2)}
              onChange={handleInputChange}
              rows={6}
              className="font-mono text-sm"
              placeholder='{"@type": "Product", "name": "..."}'
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProductSeoFields;
