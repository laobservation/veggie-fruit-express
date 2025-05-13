
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { generateThankYouPDF } from '@/utils/pdf';
import OrderConfirmation from '@/components/thankyou/OrderConfirmation';
import { Howl } from 'howler';
import { useSettings } from '@/hooks/use-settings';

const ThankYouPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings } = useSettings();
  
  // Get order details from location state with proper fallback
  const orderDetails = location.state?.orderDetails || { 
    name: '',
    address: '',
    phone: '',
    preferredTime: '',
    totalAmount: 0,
    subtotal: 0,
    shippingCost: 0,
    items: []
  };

  // Play success sound when the page loads
  useEffect(() => {
    if (orderDetails.name) {
      console.log("Playing success sound for completed order");
      const successSound = new Howl({
        src: ['/success-sound.mp3'],
        volume: 0.5,
      });
      successSound.play();
    }
  }, [orderDetails]);

  // Redirect to homepage if no order details
  useEffect(() => {
    if (!orderDetails.name) {
      console.log("No order details found, redirecting to home");
      navigate('/', { replace: true });
    } else {
      console.log("Order details received:", orderDetails);
      // Auto-generate and download PDF for the user with a slight delay
      setTimeout(() => {
        generatePDF();
      }, 1000);
    }
  }, [orderDetails, navigate]);

  // Send notification to store owner
  useEffect(() => {
    const notifyStoreOwner = async () => {
      try {
        console.log('Marking order as notified:', orderDetails.orderId);
        
        // Only update if we have an orderId
        if (orderDetails.orderId) {
          const { error } = await supabase
            .from('Orders')
            .update({ notified: true })
            .eq('id', orderDetails.orderId);
            
          if (error) {
            console.error('Failed to update order notification status:', error);
          } else {
            console.log('Order notification status updated successfully');
          }
        }
      } catch (err) {
        console.error('Error sending notification:', err);
      }
    };
    
    if (orderDetails.name && orderDetails.orderId) {
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
        description: "Le récapitulatif de votre commande a été téléchargé.",
        variant: "default",
        className: "bg-[#F2FCE2] border-green-300 text-green-800"
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
        <OrderConfirmation 
          orderDetails={orderDetails}
          onGeneratePDF={generatePDF}
          currency={settings.currency}
        />
      </main>
      <Footer />
    </div>
  );
};

export default ThankYouPage;
