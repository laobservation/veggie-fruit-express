
import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: '1',
    name: 'Fresh Apples',
    category: 'fruit',
    price: 2.99,
    image: 'https://freshleafuae.com/wp-content/uploads/2024/08/red-apple-freshleaf-dubai-uae-img01.jpg',
    description: 'Sweet and crunchy apples freshly harvested from local farms.',
    unit: 'kg',
    featured: true,
    categoryLink: true
  },
  {
    id: '2',
    name: 'Organic Bananas',
    category: 'fruit',
    price: 1.99,
    image: 'https://images-cdn.ubuy.co.id/634e2c65a0e13a0eb35bdb1a-fresh-organic-bananas-bundle-3-lbs.jpg',
    description: 'Naturally ripened organic bananas, rich in potassium and fiber.',
    unit: 'bunch',
    featured: false
  },
  {
    id: '3',
    name: 'Fresh Oranges',
    category: 'fruit',
    price: 3.49,
    image: 'https://glycemic-index.net/images/rpaE64Cepa.webp',
    description: 'Juicy oranges packed with vitamin C, perfect for fresh juice.',
    unit: 'kg',
    featured: true
  },
  {
    id: '4',
    name: 'Ripe Strawberries',
    category: 'fruit',
    price: 4.99,
    image: 'https://img.freepik.com/photos-gratuite/baie-fraise-levitation-fond-blanc_485709-57.jpg',
    description: 'Sweet and juicy strawberries, handpicked at peak ripeness.',
    unit: 'basket',
    featured: true
  },
  {
    id: '5',
    name: 'Fresh Spinach',
    category: 'vegetable',
    price: 2.49,
    image: 'https://gabbarfarms.com/cdn/shop/products/Spinach.jpg',
    description: 'Nutrient-rich spinach leaves, perfect for salads and cooking.',
    unit: 'bunch',
    featured: false
  },
  {
    id: '6',
    name: 'Carotte – الجزر (1kg)',
    category: 'vegetable',
    price: 1.79,
    image: 'https://harvestmarkets.com.au/cdn/shop/products/ResizerImage2048X1535_1024x1024.jpg',
    description: 'Crunchy organic carrots, high in beta-carotene and antioxidants.',
    unit: 'kg',
    featured: true
  },
  {
    id: '7',
    name: 'Fresh Tomatoes',
    category: 'vegetable',
    price: 2.99,
    image: 'https://i5.walmartimages.com/asr/a1e8e44a-2b82-48ab-9c09-b68420f6954c.04f6e0e87807fc5457f57e3ec0770061.jpeg',
    description: 'Plump and juicy tomatoes, perfect for salads and cooking.',
    unit: 'kg',
    featured: false
  },
  {
    id: '8',
    name: 'Organic Broccoli',
    category: 'vegetable',
    price: 3.29,
    image: 'https://organicmandya.com/cdn/shop/files/Broccoli.jpg',
    description: 'Nutritious broccoli florets, rich in vitamins and minerals.',
    unit: 'head',
    featured: true
  },
  {
    id: '9',
    name: 'Pack Fruit ',
    category: 'vegetable',
    price: 22.29,
    image: 'https://freshbox.ma/wp-content/uploads/2025/03/Pack-Famille-2.jpg',
    description: 'Nutritious broccoli florets, rich in vitamins and minerals.',
    unit: 'head',
    featured: true
  }
];

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getProductsByCategory = (category: 'fruit' | 'vegetable' | 'pack' | 'drink' | 'salade-jus'): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getCategoryLinkedProducts = (category: 'fruit' | 'vegetable' | 'pack' | 'drink' | 'salade-jus'): Product[] => {
  return products.filter(product => product.category === category && product.categoryLink);
};

// Get products with stock information from Supabase
export const getProductsWithStock = async () => {
  try {
    const { fetchProducts } = await import('@/services/productService');
    const products = await fetchProducts();
    console.log('Fetched products with stock:', products);
    return products;
  } catch (error) {
    console.error('Error fetching products with stock:', error);
    return [];
  }
};

// Get product by ID from Supabase
export const getProductByIdFromSupabase = async (id: string) => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { transformProductFromSupabase } = await import('@/services/productService');
    
    const { data, error } = await supabase
      .from('Products')
      .select('*')
      .eq('id', parseInt(id, 10)) // Convert string ID to number
      .single();
    
    if (error || !data) {
      throw error;
    }
    
    // Ensure additional_images is present in the data
    const productData = {
      ...data,
      additional_images: data.additional_images || null
    };
    
    // The transform function now handles missing featured property
    return transformProductFromSupabase(productData);
  } catch (error) {
    console.error('Error fetching product from Supabase:', error);
    // Fall back to local data
    return getProductById(id);
  }
};
