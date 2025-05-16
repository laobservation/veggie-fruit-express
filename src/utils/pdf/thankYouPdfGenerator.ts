
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
    
    // Add header with dotted lines like in the provided receipt image
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("............................................", 10, 40);
    
    doc.setFontSize(11);
    doc.text("Date:", 20, 50);
    doc.text(new Date().toLocaleDateString("fr-FR"), 105, 50, { align: 'right' });
    
    doc.text("Nom:", 20, 60);
    doc.text(orderDetails.name, 105, 60, { align: 'right' });
    
    doc.text("............................................", 10, 70);
    
    // Customer information
    doc.setFontSize(12);
    doc.text("Détails de commande", 105, 85, { align: 'center' });
    doc.setFontSize(10);
    
    // Items table with simple styling like in image
    const tableColumn = ["Produit", "Qté", "Prix", "Total"];
    const tableRows: any[] = [];
    
    if (orderDetails.items && orderDetails.items.length > 0) {
      orderDetails.items.forEach((item: any) => {
        // Start with basic product info
        let itemName = item.product.name;
        let itemUnitPrice = item.product.price;
        
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
          item.quantity,
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
      styles: { cellPadding: 3 }
    });
    
    // Dotted line before totals
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    doc.text("............................................", 10, finalY + 10);
    
    // Totals with right alignment
    doc.text("Sous-total:", 50, finalY + 20);
    doc.text(`${formatPrice(orderDetails.subtotal || 0)} ${currency}`, 105, finalY + 20, { align: 'right' });
    
    doc.text("Livraison:", 50, finalY + 30);
    doc.text(`${formatPrice(orderDetails.shippingCost || 0)} ${currency}`, 105, finalY + 30, { align: 'right' });
    
    doc.text("TVA:", 50, finalY + 40);
    // Calculate 5.5% VAT on subtotal for example
    const vat = orderDetails.subtotal * 0.055;
    doc.text(`5.5%`, 80, finalY + 40);
    doc.text(`${formatPrice(vat)} ${currency}`, 105, finalY + 40, { align: 'right' });
    
    doc.text("............................................", 10, finalY + 50);
    
    // Total with bold style
    doc.setFont(undefined, 'bold');
    doc.text("Total TTC:", 50, finalY + 60);
    doc.text(`${formatPrice(orderDetails.totalAmount || 0)} ${currency}`, 105, finalY + 60, { align: 'right' });
    doc.setFont(undefined, 'normal');
    
    // Total HT
    const totalHT = orderDetails.totalAmount - vat;
    doc.text("............................................", 10, finalY + 70);
    doc.setFont(undefined, 'bold');
    doc.text(`Total HT: ${formatPrice(totalHT)} ${currency}`, 105, finalY + 80, { align: 'right' });
    doc.setFont(undefined, 'normal');
    
    // Delivery information
    doc.text("............................................", 10, finalY + 90);
    if (orderDetails.deliveryDay) {
      doc.text(`Jour de livraison: ${orderDetails.deliveryDay}`, 20, finalY + 100);
    }
    if (orderDetails.preferredTime) {
      doc.text(`Heure de livraison: ${orderDetails.preferredTime}`, 20, finalY + 110);
    }
    doc.text(`Adresse: ${orderDetails.address}`, 20, finalY + 120);
    
    // Save PDF
    doc.save(`commande-${new Date().toISOString().split('T')[0]}.pdf`);
    
    return doc;
  }
  
  return doc;
};
