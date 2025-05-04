
import React, { useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatPrice } from '@/lib/formatPrice';

// Import autoTable explicitly to make it available on the jsPDF instance
import autoTable from 'jspdf-autotable';

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
      const doc = new jsPDF();
      
      // Add company logo/header
      doc.setFontSize(20);
      doc.setTextColor(39, 174, 96);
      doc.text("Marché Bio", 105, 20, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Récapitulatif de Commande", 105, 30, { align: 'center' });
      
      // Customer information
      doc.setFontSize(12);
      doc.text("Informations Client", 20, 45);
      doc.setFontSize(10);
      doc.text(`Nom: ${orderDetails.name}`, 20, 55);
      doc.text(`Adresse: ${orderDetails.address}`, 20, 60);
      doc.text(`Téléphone: ${orderDetails.phone}`, 20, 65);
      if (orderDetails.preferredTime) {
        doc.text(`Heure de livraison préférée: ${orderDetails.preferredTime}`, 20, 70);
      }
      
      // Items table
      const tableColumn = ["Produit", "Quantité", "Prix unitaire", "Total"];
      const tableRows: any[] = [];
      
      if (orderDetails.items && orderDetails.items.length > 0) {
        orderDetails.items.forEach((item: any) => {
          const itemData = [
            item.product.name,
            item.quantity,
            formatPrice(item.product.price),
            formatPrice(item.product.price * item.quantity)
          ];
          tableRows.push(itemData);
        });
      }
      
      // Use autoTable with proper type handling
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 80,
        theme: 'striped',
        headStyles: { fillColor: [39, 174, 96] }
      });
      
      // Total
      const finalY = (doc as any).lastAutoTable.finalY || 120;
      doc.setFontSize(12);
      doc.text(`Total: ${formatPrice(orderDetails.totalAmount)}`, 150, finalY + 15);
      
      // Thank you note
      doc.setFontSize(10);
      doc.text("Merci pour votre commande!", 105, finalY + 30, { align: 'center' });
      doc.text("Notre équipe prépare vos produits avec soin.", 105, finalY + 35, { align: 'center' });
      
      // Save PDF
      doc.save(`commande-${new Date().toISOString().split('T')[0]}.pdf`);
      
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
