
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatPrice } from '@/lib/formatPrice';
import { addLogoToPdf, addHeaderToPdf, calculateItemTotalWithServices, fetchCurrencyFromSettings } from './pdfHelpers';

export const generateThankYouPDF = (orderDetails: any) => {
  const doc = new jsPDF();
  
  // Initialize PDF generation process
  addLogoToPdf(doc).then(() => finishPDFGeneration());
  
  async function finishPDFGeneration() {
    // Fetch currency from settings
    const currency = await fetchCurrencyFromSettings();
    
    // Add logo image at the top center
    try {
      doc.addImage('/lovable-uploads/16c76097-c928-4d2e-a9e0-9f350b63b0d0.png', 'PNG', 65, 10, 80, 30);
    } catch (error) {
      console.error('Failed to add logo to PDF:', error);
    }
    
    // Add dotted lines and header info
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("----------------------------------------", 10, 45);
    
    doc.setFontSize(11);
    doc.text("Date:", 20, 55);
    doc.text(new Date().toLocaleDateString("fr-FR"), 105, 55, { align: 'right' });
    
    doc.text("Client:", 20, 65);
    doc.text(orderDetails.name, 105, 65, { align: 'right' });
    
    doc.text("----------------------------------------", 10, 75);
    
    // Add receipt title
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text("BON DE COMMANDE", 105, 85, { align: 'center' });
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    
    // Items table with weight information
    const tableColumn = ["Produit", "Qté/Poids", "Prix", "Total"];
    const tableRows: any[] = [];
    
    if (orderDetails.items && orderDetails.items.length > 0) {
      orderDetails.items.forEach((item: any) => {
        // Start with basic product info
        let itemName = item.product.name;
        let itemUnitPrice = item.product.price;
        
        // Format quantity with unit and weight information
        let quantityDisplay = `${item.quantity}`;
        if (item.product.unit) {
          quantityDisplay += ` ${item.product.unit}`;
          // Add weight in grams for kg products
          if (item.product.unit === 'kg' && item.quantity !== 1) {
            quantityDisplay += ` (${item.quantity * 1000}g)`;
          }
        }
        
        // Add service information to the item name if services exist
        if (item.selectedServices && item.selectedServices.length > 0) {
          itemName += "\n" + item.selectedServices.map((service: any) => 
            `+ ${service.name}`
          ).join("\n");
          
          // Add service costs to the unit price
          const servicesCost = item.selectedServices.reduce((total: number, service: any) => 
            total + service.price, 0
          );
          itemUnitPrice += servicesCost;
        }
        
        const itemData = [
          itemName,
          quantityDisplay,
          formatPrice(itemUnitPrice),
          formatPrice(itemUnitPrice * item.quantity)
        ];
        tableRows.push(itemData);
      });
    }
    
    // Use autoTable with simpler styling
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 95,
      theme: 'plain',
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' },
      styles: { cellPadding: 3, fontSize: 9 },
      didDrawCell: (data) => {
        // Apply special styling for cells containing Arabic text
        if (data.column.index === 0 && data.cell.text) {
          // Product name column - keep text as is to preserve both Arabic and Latin characters
        }
      }
    });
    
    // Dotted line before totals
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    doc.text("----------------------------------------", 10, finalY + 10);
    
    // Totals with right alignment
    doc.text("Sous-total:", 50, finalY + 20);
    doc.text(`${formatPrice(orderDetails.subtotal || 0)} ${currency}`, 105, finalY + 20, { align: 'right' });
    
    doc.text("Livraison:", 50, finalY + 30);
    doc.text(`${formatPrice(orderDetails.shippingCost || 0)} ${currency}`, 105, finalY + 30, { align: 'right' });
    
    doc.text("----------------------------------------", 10, finalY + 40);
    
    // Total with bold style
    doc.setFont(undefined, 'bold');
    doc.text("TOTAL:", 50, finalY + 50);
    doc.text(`${formatPrice(orderDetails.totalAmount || 0)} ${currency}`, 105, finalY + 50, { align: 'right' });
    doc.setFont(undefined, 'normal');
    
    doc.text("----------------------------------------", 10, finalY + 60);
    
    // Delivery information
    if (orderDetails.deliveryDay) {
      doc.text(`Jour de livraison: ${orderDetails.deliveryDay}`, 20, finalY + 70);
    }
    if (orderDetails.preferredTime) {
      doc.text(`Heure de livraison: ${orderDetails.preferredTime}`, 20, finalY + 80);
    }
    doc.text(`Adresse: ${orderDetails.address}`, 20, finalY + 90);
    doc.text(`Téléphone: ${orderDetails.phone}`, 20, finalY + 100);
    
    // Thank you message
    doc.text("----------------------------------------", 10, finalY + 110);
    doc.setFontSize(12);
    doc.text("Merci pour votre commande!", 105, finalY + 120, { align: 'center' });
    
    // Save PDF
    doc.save(`commande-${new Date().toISOString().split('T')[0]}.pdf`);
    
    return doc;
  }
  
  return doc;
};
