
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

interface SeoData {
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
  language_code: string;
}

const defaultSeo = {
  meta_title: 'Marché Bio | Fruits et légumes bio à Meknès',
  meta_description: 'Livraison de fruits et légumes frais et bio à domicile à Meknès',
  meta_keywords: 'fruits, légumes, bio, marché, livraison, Meknès',
  canonical_url: '',
  robots_directives: 'index, follow',
  structured_data: '{}',
  og_title: 'Marché Bio | Fruits et légumes bio à Meknès',
  og_description: 'Livraison de fruits et légumes frais et bio à domicile à Meknès',
  og_image: '/lovable-uploads/4c234092-7248-4896-9d9b-9da5909ffbfb.png',
  og_url: '',
  twitter_card: 'summary',
  twitter_title: 'Marché Bio | Fruits et légumes bio à Meknès',
  twitter_description: 'Livraison de fruits et légumes frais et bio à domicile à Meknès',
  twitter_image: '/lovable-uploads/4c234092-7248-4896-9d9b-9da5909ffbfb.png',
  language_code: 'fr'
};

const SeoHead: React.FC = () => {
  const location = useLocation();
  const [seo, setSeo] = useState<SeoData>(defaultSeo);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchSeoData = async () => {
      setIsLoading(true);
      
      try {
        // First try to match exact route
        let { data, error } = await supabase
          .from('seo_settings')
          .select('*')
          .eq('route', location.pathname)
          .limit(1)
          .maybeSingle();
        
        // If no exact match, try fallback to homepage SEO
        if (!data && location.pathname !== '/') {
          const homeResponse = await supabase
            .from('seo_settings')
            .select('*')
            .eq('route', '/')
            .limit(1)
            .maybeSingle();
            
          data = homeResponse.data;
        }
        
        if (data) {
          setSeo({
            meta_title: data.meta_title || defaultSeo.meta_title,
            meta_description: data.meta_description || defaultSeo.meta_description,
            meta_keywords: data.meta_keywords || defaultSeo.meta_keywords,
            canonical_url: data.canonical_url || window.location.href,
            robots_directives: data.robots_directives || defaultSeo.robots_directives,
            structured_data: data.structured_data || defaultSeo.structured_data,
            og_title: data.og_title || data.meta_title || defaultSeo.og_title,
            og_description: data.og_description || data.meta_description || defaultSeo.og_description,
            og_image: data.og_image || defaultSeo.og_image,
            og_url: data.og_url || window.location.href,
            twitter_card: data.twitter_card || defaultSeo.twitter_card,
            twitter_title: data.twitter_title || data.og_title || data.meta_title || defaultSeo.twitter_title,
            twitter_description: data.twitter_description || data.og_description || data.meta_description || defaultSeo.twitter_description,
            twitter_image: data.twitter_image || data.og_image || defaultSeo.twitter_image,
            language_code: data.language_code || defaultSeo.language_code
          });
        } else {
          // Use default SEO if no data found
          setSeo({
            ...defaultSeo,
            canonical_url: window.location.href,
            og_url: window.location.href
          });
        }
      } catch (error) {
        console.error('Error fetching SEO data:', error);
        // Fallback to defaults
        setSeo({
          ...defaultSeo,
          canonical_url: window.location.href,
          og_url: window.location.href
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSeoData();
  }, [location.pathname]);
  
  // Parse structured data if available
  let structuredDataObj;
  try {
    structuredDataObj = seo.structured_data ? JSON.parse(seo.structured_data) : {};
  } catch (error) {
    console.error('Invalid structured data JSON:', error);
    structuredDataObj = {};
  }
  
  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{seo.meta_title}</title>
      <meta name="description" content={seo.meta_description} />
      <meta name="keywords" content={seo.meta_keywords} />
      <link rel="canonical" href={seo.canonical_url || window.location.href} />
      <meta name="robots" content={seo.robots_directives} />
      <html lang={seo.language_code} />
      
      {/* Open Graph */}
      <meta property="og:title" content={seo.og_title} />
      <meta property="og:description" content={seo.og_description} />
      <meta property="og:image" content={seo.og_image.startsWith('http') ? seo.og_image : `${window.location.origin}${seo.og_image}`} />
      <meta property="og:url" content={seo.og_url || window.location.href} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Marché Bio" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={seo.twitter_card} />
      <meta name="twitter:title" content={seo.twitter_title} />
      <meta name="twitter:description" content={seo.twitter_description} />
      <meta name="twitter:image" content={seo.twitter_image.startsWith('http') ? seo.twitter_image : `${window.location.origin}${seo.twitter_image}`} />
      
      {/* Structured Data */}
      {Object.keys(structuredDataObj).length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(structuredDataObj)}
        </script>
      )}
    </Helmet>
  );
};

export default SeoHead;
