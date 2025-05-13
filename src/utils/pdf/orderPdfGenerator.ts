
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
    
    // Estimate shipping cost (typical 30 DH)
    const shippingCost = order.total_amount ? (order.total_amount - subtotal) : 30;
    
    // Add header
    addHeaderToPdf(doc);
    
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
    
    // Create order items table
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
    
    // Use autoTable
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
