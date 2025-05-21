
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { Minus, Plus, Truck, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import DeliveryForm from "./DeliveryForm";
import { formatPrice } from "@/lib/formatPrice";

interface CartProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Cart: React.FC<CartProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose
}) => {
  const {
    items,
    updateQuantity,
    removeItem,
    getTotalPrice,
    getShippingCost,
    isCartOpen,
    closeCart,
    toggleCartReminder
  } = useCart();
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);

  useEffect(() => {
    const handleCartUpdated = () => {
      setAnimateCart(true);
      setTimeout(() => setAnimateCart(false), 800);
    };

    document.addEventListener('cart-updated', handleCartUpdated);
    return () => {
      document.removeEventListener('cart-updated', handleCartUpdated);
    };
  }, []);

  const handleShowDeliveryForm = () => {
    if (items.length > 0) {
      setShowDeliveryForm(true);
    } else {
      toast.error("Votre panier est vide");
    }
  };
  
  const handleClose = () => {
    if (propOnClose) {
      propOnClose();
    } else {
      closeCart();
    }
    if (items.length > 0) {
      toggleCartReminder(true);
    }

    // Reset the delivery form state when closing the cart
    setShowDeliveryForm(false);
  };

  // Use prop isOpen if provided, otherwise use from store
  const effectiveIsOpen = propIsOpen !== undefined ? propIsOpen : isCartOpen;
  const shippingCost = getShippingCost();
  const subtotal = getTotalPrice();
  const total = subtotal + shippingCost;
  
  return (
    <Sheet open={effectiveIsOpen} onOpenChange={handleClose}>
      <SheetContent className={`flex flex-col h-full w-full sm:max-w-md ${animateCart ? 'animate-bounce' : ''}`}>
        <SheetHeader>
          <SheetTitle>{showDeliveryForm ? "Informations de livraison" : "Votre Panier"}</SheetTitle>
        </SheetHeader>
        
        {showDeliveryForm ? (
          <div className="flex-1 overflow-auto py-4">
            <DeliveryForm onClose={handleClose} />
            <Button variant="ghost" className="mt-4 w-full" onClick={() => setShowDeliveryForm(false)}>
              Retour au panier
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1">
            <h3 className="font-medium text-lg">Votre panier est vide</h3>
            <p className="text-gray-500 mb-4">Ajoutez des produits frais pour commencer</p>
            <Button onClick={handleClose} asChild>
              <Link to="/">Continuer vos achats</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4">
              {items.map((item, index) => (
                <div key={`${item.product.id}-${index}`} className="flex py-4 border-b">
                  <div className="h-20 w-20 rounded overflow-hidden mr-4">
                    <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <button onClick={() => removeItem(item.product.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <p className="text-gray-500 text-sm">
                      {formatPrice(item.product.price)} / {item.product.unit}
                    </p>
                    
                    {/* Display selected services if any */}
                    {item.selectedServices && item.selectedServices.length > 0 && (
                      <div className="mt-1 mb-2">
                        <ul className="text-xs text-gray-500">
                          {item.selectedServices.map(service => (
                            <li key={service.id} className="flex justify-between">
                              <span>{service.name.split('(')[0]}</span>
                              <span>{formatPrice(service.price)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex items-center mt-2">
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="mx-2 w-8 text-center">{item.quantity}</span>
                      <Button variant="outline" size="icon" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="h-7 w-7 bg-green-600 hover:bg-green-500 text-white">
                        <Plus className="h-3 w-3" />
                      </Button>
                      <div className="ml-auto font-medium">
                        {formatPrice((item.product.price + (item.selectedServices?.reduce((acc, service) => acc + service.price, 0) || 0)) * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Livraison</span>
                <span>{formatPrice(shippingCost)}</span>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between mb-4">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-semibold">{formatPrice(total)}</span>
              </div>
              
              <Button onClick={handleShowDeliveryForm} className="w-full text-white mb-2 bg-green-600 hover:bg-green-500 shadow-md hover:shadow-lg transition-all duration-300">
                <Truck className="mr-2 h-5 w-5" />
                Procéder à la livraison
              </Button>
              <Button variant="outline" className="w-full" onClick={handleClose}>Continuer mes achats</Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
