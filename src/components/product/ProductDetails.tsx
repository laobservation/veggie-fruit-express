
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/hooks/use-cart';
import { useFavorites } from '@/hooks/use-favorites';
import { formatPrice } from '@/lib/formatPrice';
import { useNavigate } from 'react-router-dom';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const navigate = useNavigate();

  const adjustQuantity = (amount: number) => {
    setQuantity(Math.max(1, quantity + amount));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/thank-you'); // Redirect directly to checkout
  };

  const toggleFavorite = () => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  const inStock = product.stock === undefined || product.stock > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="flex items-center justify-center rounded-md bg-muted">
        <img 
          src={product.image_url || "/placeholder.svg"}
          alt={product.name}
          className="object-cover w-full rounded-md aspect-square"
          width={500}
          height={500}
        />
      </div>
      <div className="flex flex-col space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-2">
            <div className="font-bold text-2xl text-green-700 dark:text-green-500">
              {formatPrice(product.price || 0)}
            </div>
            <span className="text-sm text-muted-foreground">/ {product.unit}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">{product.description}</p>
        
        <div className="flex items-center space-x-2 py-2">
          <div className="flex items-center rounded-md border border-input">
            <button
              onClick={() => adjustQuantity(-1)}
              className="h-10 w-10 flex items-center justify-center text-lg border-r"
              disabled={quantity <= 1}
            >
              -
            </button>
            <div className="h-10 w-14 flex items-center justify-center">
              {quantity}
            </div>
            <button
              onClick={() => adjustQuantity(1)}
              className="h-10 w-10 flex items-center justify-center text-lg border-l"
            >
              +
            </button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {inStock ? (
              <span className="text-green-600">En stock</span>
            ) : (
              <span className="text-red-600">Épuisé</span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button 
            onClick={handleAddToCart} 
            disabled={!inStock} 
            className="flex-1"
          >
            Ajouter au panier
          </Button>
          <Button 
            onClick={handleBuyNow} 
            disabled={!inStock} 
            variant="default"
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Acheter maintenant
          </Button>
          <Button 
            onClick={toggleFavorite} 
            variant="outline" 
            size="icon"
            className={`${isFavorite(product.id) ? 'text-red-500 border-red-200' : ''}`}
          >
            <Heart 
              className="h-5 w-5" 
              fill={isFavorite(product.id) ? "currentColor" : "none"}
            />
            <span className="sr-only">
              {isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
