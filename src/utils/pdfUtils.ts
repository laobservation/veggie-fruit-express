
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '@/types/order';
import { formatPrice } from '@/lib/formatPrice';
import { formatDate } from './formatUtils';

export const generateOrderPDF = (order: Order) => {
  const doc = new jsPDF();
  
  // Add company logo
  const logoPath = "/lovable-uploads/4c234092-7248-4896-9d9b-9da5909ffbfb.png";
  
  // Create a new Image to load the logo
  const img = new Image();
  img.src = logoPath;
  
  // Once image is loaded, add it to the PDF
  img.onload = function() {
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
  
  function finishPDFGeneration() {
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
        const itemData = [
          item.productName,
          item.quantity,
          formatPrice(item.price),
          formatPrice(item.price * item.quantity)
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
    
    // Total
    const finalY = (doc as any).lastAutoTable.finalY || 160;
    doc.setFontSize(12);
    doc.text(`Total: ${formatPrice(order.total_amount || 0)}`, 150, finalY + 15);
    
    // Footer
    doc.setFontSize(10);
    doc.text("Document généré le " + new Date().toLocaleString('fr-FR'), 20, finalY + 30);
    
    // Save PDF
    doc.save(`commande-${order.id}.pdf`);
  }
  
  return doc;
};

// Export a similar function for the thank you page PDF
export const generateThankYouPDF = (orderDetails: any) => {
  const doc = new jsPDF();
  
  // Add company logo
  const logoPath = "/lovable-uploads/4c234092-7248-4896-9d9b-9da5909ffbfb.png";
  
  // Create a new Image to load the logo
  const img = new Image();
  img.src = logoPath;
  
  // Once image is loaded, add it to the PDF
  img.onload = function() {
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
  
  function finishPDFGeneration() {
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
        const itemData = [
          item.product.name,
          item.quantity,
          formatPrice(item.product.price),
          formatPrice(item.product.price * item.quantity)
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
    
    // Total
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    doc.setFontSize(12);
    doc.text(`Total: ${formatPrice(orderDetails.totalAmount)}`, 150, finalY + 15);
    
    // Thank you note
    doc.setFontSize(10);
    doc.text("Merci pour votre commande!", 105, finalY + 30, { align: 'center' });
    doc.text("Notre équipe prépare vos produits avec soin.", 105, finalY + 35, { align: 'center' });
    
    // Save PDF
    doc.save(`commande-${new Date().toISOString().split('T')[0]}.pdf`);
    
    return doc;
  }
  
  return doc;
};
