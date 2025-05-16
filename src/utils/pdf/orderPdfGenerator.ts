
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '@/types/order';
import { formatPrice } from '@/lib/formatPrice';
import { formatDate } from '../formatUtils';
import { addLogoToPdf, addHeaderToPdf, calculateItemTotalWithServices, fetchCurrencyFromSettings } from './pdfHelpers';

export const generateOrderPDF = (order: Order) => {
  const doc = new jsPDF();
  
  // Initialize PDF generation process
  addLogoToPdf(doc).then(() => finishPDFGeneration());
  
  async function finishPDFGeneration() {
    // Fetch currency from settings
    const currency = await fetchCurrencyFromSettings();
    
    // Calculate subtotal and shipping cost
    let subtotal = 0;
    if (order.order_items && order.order_items.length > 0) {
      subtotal = order.order_items.reduce((total, item) => {
        const { totalPrice } = calculateItemTotalWithServices(item);
        return total + totalPrice;
      }, 0);
    }
    
    // Estimate shipping cost
    const shippingCost = order.total_amount ? (order.total_amount - subtotal) : 30;
    
    // Add header with dotted lines like in the provided receipt image
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("............................................", 10, 40);
    
    doc.setFontSize(11);
    doc.text("Date:", 20, 50);
    doc.text(formatDate(order.created_at), 105, 50, { align: 'right' });
    
    doc.text("Client:", 20, 60);
    doc.text(order['Client Name'] || '', 105, 60, { align: 'right' });
    
    doc.text("............................................", 10, 70);
    
    // Items table with simple styling like in image
    const tableColumn = ["Produit", "Qté", "Prix", "Total"];
    const tableRows: any[] = [];
    
    if (order.order_items && order.order_items.length > 0) {
      order.order_items.forEach(item => {
        // Calculate total item price including services
        let itemUnitPrice = item.price;
        let itemName = item.productName;
        
        // Add service information to the item name if services exist
        if (item.services && item.services.length > 0) {
          itemName += "\n" + item.services.map(service => 
            `+ ${service.name}`
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
    doc.text(`${formatPrice(subtotal)} ${currency}`, 105, finalY + 20, { align: 'right' });
    
    doc.text("Livraison:", 50, finalY + 30);
    doc.text(`${formatPrice(shippingCost)} ${currency}`, 105, finalY + 30, { align: 'right' });
    
    doc.text("TVA:", 50, finalY + 40);
    // Calculate 5.5% VAT on subtotal for example
    const vat = subtotal * 0.055;
    doc.text(`5.5%`, 80, finalY + 40);
    doc.text(`${formatPrice(vat)} ${currency}`, 105, finalY + 40, { align: 'right' });
    
    doc.text("............................................", 10, finalY + 50);
    
    // Total with bold style
    doc.setFont(undefined, 'bold');
    doc.text("Total TTC:", 50, finalY + 60);
    doc.text(`${formatPrice(order.total_amount || 0)} ${currency}`, 105, finalY + 60, { align: 'right' });
    doc.setFont(undefined, 'normal');
    
    // Total HT
    const totalHT = (order.total_amount || 0) - vat;
    doc.text("............................................", 10, finalY + 70);
    doc.setFont(undefined, 'bold');
    doc.text(`Total HT: ${formatPrice(totalHT)} ${currency}`, 105, finalY + 80, { align: 'right' });
    doc.setFont(undefined, 'normal');
    
    // Delivery information
    doc.text("............................................", 10, finalY + 90);
    if (order.delivery_day) {
      doc.text(`Jour de livraison: ${order.delivery_day}`, 20, finalY + 100);
    }
    if (order.preferred_time) {
      doc.text(`Heure de livraison: ${order.preferred_time}`, 20, finalY + 110);
    }
    doc.text(`Adresse: ${order['Adresse'] || ''}`, 20, finalY + 120);
    
    // Save PDF
    doc.save(`commande-${order.id}.pdf`);
  }
  
  return doc;
};
