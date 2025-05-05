
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { generateThankYouPDF } from '@/utils/pdfUtils';
import OrderConfirmation from '@/components/thankyou/OrderConfirmation';

const ThankYouPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
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
        <OrderConfirmation 
          orderDetails={orderDetails}
          onGeneratePDF={generatePDF}
        />
      </main>
      <Footer />
    </div>
  );
};

export default ThankYouPage;
