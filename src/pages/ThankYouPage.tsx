import React, { useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatPrice } from '@/lib/formatPrice';
import { generateThankYouPDF } from '@/utils/pdfUtils';

const ThankYouPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const orderContentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
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

  // Redirect to homepage if no order details
  useEffect(() => {
    if (!orderDetails.name) {
      navigate('/');
    } else {
      // Auto-generate and download PDF for the user
      setTimeout(() => {
        generatePDF();
      }, 1000);
    }
  }, [orderDetails, navigate]);

  // Send notification to store owner
  useEffect(() => {
    const notifyStoreOwner = async () => {
      try {
        // Send notification email using Supabase function would go here
        // This is a placeholder - would typically call an edge function
        console.log('Order notification would be sent to store owner', orderDetails);
        
        // Only update if we have an orderId
        if (orderDetails.orderId) {
          const { error } = await supabase
            .from('Orders')
            .update({ notified: true })
            .eq('id', orderDetails.orderId);
            
          if (error) {
            console.error('Failed to update order notification status:', error);
          }
        }
      } catch (err) {
        console.error('Error sending notification:', err);
      }
    };
    
    if (orderDetails.name) {
      notifyStoreOwner();
    }
  }, [orderDetails]);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const generatePDF = () => {
    try {
      generateThankYouPDF(orderDetails);
      
      toast({
        title: "PDF téléchargé",
        description: "Le récapitulatif de votre commande a été téléchargé."
      });
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

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
          
          <div ref={orderContentRef} className="border-t border-b py-4 mb-6">
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
                <span>€{(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold mt-2">
              <span>Total :</span>
              <span>€{orderDetails.totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Button 
              className="w-full bg-veggie-primary hover:bg-veggie-dark flex items-center justify-center"
              onClick={generatePDF}
            >
              <Download className="mr-2 h-4 w-4" />
              Télécharger le récapitulatif
            </Button>
          </div>
          
          <Button asChild className="w-full bg-gray-500 hover:bg-gray-600 text-white">
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
