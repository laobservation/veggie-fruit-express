
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '@/types/order';
import { formatPrice } from '@/lib/formatPrice';
import { formatDate } from './formatUtils';
import { supabase } from '@/integrations/supabase/client';

export const generateOrderPDF = (order: Order) => {
  const doc = new jsPDF();
  
  // Add company logo with white background
  const logoPath = "/lovable-uploads/4c234092-7248-4896-9d9b-9da5909ffbfb.png";
  
  // Create a new Image to load the logo
  const img = new Image();
  img.src = logoPath;
  
  // Once image is loaded, add it to the PDF
  img.onload = function() {
    // Draw white background rectangle first
    doc.setFillColor(255, 255, 255);
    doc.rect(105 - 25, 5, 50, 50, 'F');
    // Then add the logo
    doc.addImage(img, 'PNG', 105 - 20, 10, 40, 40, undefined, 'FAST');
    finishPDFGeneration();
  };
  
  // Fallback in case image doesn't load
  img.onerror = function() {
    console.error("Failed to load logo for PDF");
    finishPDFGeneration();
  };
  
  // Set a timeout to prevent hanging if image loading takes too long
  setTimeout(() => {
    if (!img.complete) {
      console.error("Logo loading took too long, generating PDF without it");
      finishPDFGeneration();
    }
  }, 1500);
  
  async function finishPDFGeneration() {
    // Fetch settings to get currency
    const { data: settingsData } = await supabase
      .from('settings')
      .select('currency')
      .single();
    
    const currency = settingsData?.currency || 'DH';
    
    // Calculate subtotal and shipping cost
    let subtotal = 0;
    if (order.order_items && order.order_items.length > 0) {
      subtotal = order.order_items.reduce((total, item) => {
        let itemTotal = item.price * item.quantity;
        
        // Add service costs if present
        if (item.services && item.services.length > 0) {
          const servicesCost = item.services.reduce((sTotal, service) => sTotal + service.price, 0);
          itemTotal += servicesCost * item.quantity;
        }
        
        return total + itemTotal;
      }, 0);
    }
    
    // Estimate shipping cost (typical 30 DH)
    const shippingCost = order.total_amount ? (order.total_amount - subtotal) : 30;
    
    // Add header text
    doc.setFontSize(20);
    doc.setTextColor(39, 174, 96);
    doc.text("Marché Bio", 105, 60, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Détails de la Commande #" + order.id, 105, 70, { align: 'center' });
    
    // Customer information
    doc.setFontSize(12);
    doc.text("Informations Client", 20, 85);
    doc.setFontSize(10);
    doc.text(`Nom: ${order['Client Name']}`, 20, 95);
    doc.text(`Adresse: ${order['Adresse']}`, 20, 100);
    doc.text(`Téléphone: ${order['Phone'] || 'Non fourni'}`, 20, 105);
    doc.text(`Date: ${formatDate(order.created_at)}`, 20, 110);
    
    let yPosition = 115;
    if (order.preferred_time) {
      doc.text(`Heure de livraison préférée: ${order.preferred_time}`, 20, yPosition);
      yPosition += 5;
    }
    
    // Status
    doc.text(`Statut: ${order.status || 'Nouveau'}`, 20, yPosition);
    
    // Items table
    const tableColumn = ["Produit", "Quantité", "Prix unitaire", "Total"];
    const tableRows: any[] = [];
    
    if (order.order_items && order.order_items.length > 0) {
      order.order_items.forEach(item => {
        // Calculate total item price including services
        let itemUnitPrice = item.price;
        let itemName = item.productName;
        
        // Add service information to the item name if services exist
        if (item.services && item.services.length > 0) {
          itemName += "\n" + item.services.map(service => 
            `+ ${service.name} (${formatPrice(service.price)})`
          ).join("\n");
          
          // Add service costs to the unit price
          const servicesCost = item.services.reduce((total, service) => 
            total + service.price, 0
          );
          itemUnitPrice += servicesCost;
        }
        
        const itemData = [
          itemName,
          item.quantity,
          formatPrice(itemUnitPrice),
          formatPrice(itemUnitPrice * item.quantity)
        ];
        tableRows.push(itemData);
      });
    }
    
    // Use autoTable correctly
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 130,
      theme: 'striped',
      headStyles: { fillColor: [39, 174, 96] }
    });
    
    // Totals
    const finalY = (doc as any).lastAutoTable.finalY || 160;
    doc.setFontSize(10);
    doc.text(`Sous-total: ${formatPrice(subtotal)}`, 150, finalY + 10, { align: 'right' });
    doc.text(`Frais de livraison: ${formatPrice(shippingCost)}`, 150, finalY + 15, { align: 'right' });
    
    doc.setFontSize(12);
    doc.text(`Total: ${formatPrice(order.total_amount || 0)}`, 150, finalY + 25, { align: 'right' });
    doc.setFontSize(8);
    doc.text(`(Tous les prix sont en ${currency})`, 150, finalY + 30, { align: 'right' });
    
    // Footer
    doc.setFontSize(10);
    doc.text("Document généré le " + new Date().toLocaleString('fr-FR'), 20, finalY + 40);
    
    // Save PDF
    doc.save(`commande-${order.id}.pdf`);
  }
  
  return doc;
};

// Export a similar function for the thank you page PDF
export const generateThankYouPDF = (orderDetails: any) => {
  const doc = new jsPDF();
  
  // Add company logo with white background
  const logoPath = "/lovable-uploads/4c234092-7248-4896-9d9b-9da5909ffbfb.png";
  
  // Create a new Image to load the logo
  const img = new Image();
  img.src = logoPath;
  
  // Once image is loaded, add it to the PDF
  img.onload = function() {
    // Draw white background rectangle first
    doc.setFillColor(255, 255, 255);
    doc.rect(105 - 25, 5, 50, 50, 'F');
    // Then add the logo
    doc.addImage(img, 'PNG', 105 - 20, 10, 40, 40, undefined, 'FAST');
    finishPDFGeneration();
  };
  
  // Fallback in case image doesn't load
  img.onerror = function() {
    console.error("Failed to load logo for PDF");
    finishPDFGeneration();
  };
  
  // Set a timeout to prevent hanging if image loading takes too long
  setTimeout(() => {
    if (!img.complete) {
      console.error("Logo loading took too long, generating PDF without it");
      finishPDFGeneration();
    }
  }, 1500);
  
  async function finishPDFGeneration() {
    // Fetch settings to get currency
    const { data: settingsData } = await supabase
      .from('settings')
      .select('currency')
      .single();
    
    const currency = settingsData?.currency || 'DH';
    
    // Add header text
    doc.setFontSize(20);
    doc.setTextColor(39, 174, 96);
    doc.text("Marché Bio", 105, 60, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Récapitulatif de Commande", 105, 70, { align: 'center' });
    
    // Customer information
    doc.setFontSize(12);
    doc.text("Informations Client", 20, 85);
    doc.setFontSize(10);
    doc.text(`Nom: ${orderDetails.name}`, 20, 95);
    doc.text(`Adresse: ${orderDetails.address}`, 20, 100);
    doc.text(`Téléphone: ${orderDetails.phone}`, 20, 105);
    if (orderDetails.preferredTime) {
      doc.text(`Heure de livraison préférée: ${orderDetails.preferredTime}`, 20, 110);
    }
    
    // Items table
    const tableColumn = ["Produit", "Quantité", "Prix unitaire", "Total"];
    const tableRows: any[] = [];
    
    if (orderDetails.items && orderDetails.items.length > 0) {
      orderDetails.items.forEach((item: any) => {
        // Start with basic product info
        let itemName = item.product.name;
        let itemUnitPrice = item.product.price;
        
        // Add service information to the item name if services exist
        if (item.selectedServices && item.selectedServices.length > 0) {
          itemName += "\n" + item.selectedServices.map((service: any) => 
            `+ ${service.name} (${formatPrice(service.price)})`
          ).join("\n");
          
          // Add service costs to the unit price
          const servicesCost = item.selectedServices.reduce((total: number, service: any) => 
            total + service.price, 0
          );
          itemUnitPrice += servicesCost;
        }
        
        const itemData = [
          itemName,
          item.quantity,
          formatPrice(itemUnitPrice),
          formatPrice(itemUnitPrice * item.quantity)
        ];
        tableRows.push(itemData);
      });
    }
    
    // Use autoTable
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 120,
      theme: 'striped',
      headStyles: { fillColor: [39, 174, 96] }
    });
    
    // Totals
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    doc.setFontSize(10);
    doc.text(`Sous-total: ${formatPrice(orderDetails.subtotal || 0)}`, 150, finalY + 10, { align: 'right' });
    doc.text(`Frais de livraison: ${formatPrice(orderDetails.shippingCost || 0)}`, 150, finalY + 15, { align: 'right' });
    
    doc.setFontSize(12);
    doc.text(`Total: ${formatPrice(orderDetails.totalAmount || 0)}`, 150, finalY + 25, { align: 'right' });
    doc.setFontSize(8);
    doc.text(`(Tous les prix sont en ${currency})`, 150, finalY + 30, { align: 'right' });
    
    // Thank you note
    doc.setFontSize(10);
    doc.text("Merci pour votre commande!", 105, finalY + 40, { align: 'center' });
    doc.text("Notre équipe prépare vos produits avec soin.", 105, finalY + 45, { align: 'center' });
    
    // Save PDF
    doc.save(`commande-${new Date().toISOString().split('T')[0]}.pdf`);
    
    return doc;
  }
  
  return doc;
};
