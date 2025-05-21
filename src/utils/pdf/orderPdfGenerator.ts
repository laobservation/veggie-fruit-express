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
    doc.text(formatDate(order.created_at), 105, 55, { align: 'right' });
    
    doc.text("Client:", 20, 65);
    doc.text(order['Client Name'] || '', 105, 65, { align: 'right' });
    
    doc.text("----------------------------------------", 10, 75);
    
    // Add receipt title
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text("BON DE COMMANDE", 105, 85, { align: 'center' });
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    
    // Items table with simple styling
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
    doc.text(`${formatPrice(subtotal)} ${currency}`, 105, finalY + 20, { align: 'right' });
    
    doc.text("Livraison:", 50, finalY + 30);
    doc.text(`${formatPrice(shippingCost)} ${currency}`, 105, finalY + 30, { align: 'right' });
    
    doc.text("----------------------------------------", 10, finalY + 40);
    
    // Total with bold style
    doc.setFont(undefined, 'bold');
    doc.text("TOTAL:", 50, finalY + 50);
    doc.text(`${formatPrice(order.total_amount || 0)} ${currency}`, 105, finalY + 50, { align: 'right' });
    doc.setFont(undefined, 'normal');
    
    doc.text("----------------------------------------", 10, finalY + 60);
    
    // Delivery information
    if (order.delivery_day) {
      doc.text(`Jour de livraison: ${order.delivery_day}`, 20, finalY + 70);
    }
    if (order.preferred_time) {
      doc.text(`Heure de livraison: ${order.preferred_time}`, 20, finalY + 80);
    }
    doc.text(`Adresse: ${order['Adresse'] || ''}`, 20, finalY + 90);
    doc.text(`Téléphone: ${order['Phone'] || ''}`, 20, finalY + 100);
    
    // Thank you message
    doc.text("----------------------------------------", 10, finalY + 110);
    doc.setFontSize(12);
    doc.text("Merci pour votre commande!", 105, finalY + 120, { align: 'center' });
    
    // Save PDF
    doc.save(`commande-${order.id}.pdf`);
  }
  
  return doc;
};
