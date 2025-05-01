
import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

const ThankYouPage = () => {
  const location = useLocation();
  const { orderDetails } = location.state || { 
    orderDetails: {
      name: '',
      address: '',
      phone: '',
      preferredTime: '',
      totalAmount: 0,
      items: []
    } 
  };

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-veggie-primary rounded-full p-3">
              <Check className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-6">Merci pour votre commande !</h1>
          <p className="text-center text-gray-600 mb-8">
            Votre commande a été reçue et sera livrée bientôt.
          </p>
          
          <div className="border-t border-b py-4 mb-6">
            <h2 className="font-semibold mb-3">Détails de livraison :</h2>
            <p><span className="font-medium">Nom :</span> {orderDetails.name}</p>
            <p><span className="font-medium">Adresse :</span> {orderDetails.address}</p>
            <p><span className="font-medium">Téléphone :</span> {orderDetails.phone}</p>
            {orderDetails.preferredTime && (
              <p><span className="font-medium">Heure de livraison préférée :</span> {orderDetails.preferredTime}</p>
            )}
          </div>
          
          <div className="mb-6">
            <h2 className="font-semibold mb-3">Résumé de la commande :</h2>
            {orderDetails.items && orderDetails.items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between py-2 border-b">
                <span>{item.product.name} × {item.quantity}</span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold mt-2">
              <span>Total :</span>
              <span>${orderDetails.totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <Button asChild className="w-full bg-veggie-primary hover:bg-veggie-dark">
            <Link to="/">
              Continuer vos achats
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThankYouPage;
