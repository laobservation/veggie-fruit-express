export interface Product {
  id: string;
  name: string;
  category: 'fruit' | 'vegetable';
  price: number;
  image: string;
  description: string;
  unit: string;
  featured?: boolean;
  videoUrl?: string;
  categoryLink?: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Fresh Apples',
    category: 'fruit',
    price: 2.99,
    image: '/images/apple.jpg',
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
    image: '/images/banana.jpg',
    description: 'Naturally ripened organic bananas, rich in potassium and fiber.',
    unit: 'bunch'
  },
  {
    id: '3',
    name: 'Fresh Oranges',
    category: 'fruit',
    price: 3.49,
    image: '/images/orange.jpg',
    description: 'Juicy oranges packed with vitamin C, perfect for fresh juice.',
    unit: 'kg',
    featured: true
  },
  {
    id: '4',
    name: 'Ripe Strawberries',
    category: 'fruit',
    price: 4.99,
    image: '/images/strawberry.jpg',
    description: 'Sweet and juicy strawberries, handpicked at peak ripeness.',
    unit: 'basket',
    featured: true
  },
  {
    id: '5',
    name: 'Fresh Spinach',
    category: 'vegetable',
    price: 2.49,
    image: '/images/spinach.jpg',
    description: 'Nutrient-rich spinach leaves, perfect for salads and cooking.',
    unit: 'bunch'
  },
  {
    id: '6',
    name: 'Organic Carrots',
    category: 'vegetable',
    price: 1.79,
    image: '/images/carrot.jpg',
    description: 'Crunchy organic carrots, high in beta-carotene and antioxidants.',
    unit: 'kg',
    featured: true
  },
  {
    id: '7',
    name: 'Fresh Tomatoes',
    category: 'vegetable',
    price: 2.99,
    image: '/images/tomato.jpg',
    description: 'Plump and juicy tomatoes, perfect for salads and cooking.',
    unit: 'kg'
  },
  {
    id: '8',
    name: 'Organic Broccoli',
    category: 'vegetable',
    price: 3.29,
    image: '/images/broccoli.jpg',
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

export const getProductsByCategory = (category: 'fruit' | 'vegetable'): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getCategoryLinkedProducts = (category: 'fruit' | 'vegetable'): Product[] => {
  return products.filter(product => product.category === category && product.categoryLink);
};
