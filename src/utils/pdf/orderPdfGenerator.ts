
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '@/types/order';
import { formatPrice } from '@/lib/formatPrice';
import { formatDate } from '../formatUtils';
import { 
  addLogoToPdf, 
  calculateItemTotalWithServices, 
  fetchCurrencyFromSettings,
  formatTextWithLanguage,
  containsArabic
} from './pdfHelpers';

export const generateOrderPDF = (order: Order) => {
  const doc = new jsPDF();
  
  // Add Arabic font support
  // This is a simplified approach - for production, consider using a proper Arabic font
  try {
    doc.addFont("/fonts/NotoKufiArabic-Regular.ttf", "NotoKufiArabic", "normal");
    doc.addFont("/fonts/Nunito-Regular.ttf", "Nunito", "normal");
    doc.setFont("Nunito");
  } catch (e) {
    console.error("Error loading fonts:", e);
  }
  
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
    formatTextWithLanguage(doc, "Date:", 20, 55);
    formatTextWithLanguage(doc, formatDate(order.created_at), 105, 55, { align: 'right' });
    
    formatTextWithLanguage(doc, "Client:", 20, 65);
    formatTextWithLanguage(doc, order['Client Name'] || '', 105, 65, { align: 'right' });
    
    doc.text("----------------------------------------", 10, 75);
    
    // Add receipt title
    doc.setFontSize(14);
    doc.setFont("Nunito", "bold");
    formatTextWithLanguage(doc, "BON DE COMMANDE", 105, 85, { align: 'center' });
    doc.setFont("Nunito", "normal");
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
    
    // Use autoTable with support for Arabic text
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 95,
      theme: 'plain',
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' },
      styles: { 
        cellPadding: 3, 
        fontSize: 9,
        font: 'Nunito'
      },
      didDrawCell: function(data) {
        // Check if the cell contains text with Arabic characters
        if (data.section === 'body' && data.column.index === 0 && typeof data.cell.text === 'string') {
          const text = data.cell.text;
          if (containsArabic(text)) {
            // If it's Arabic, adjust the alignment and font
            const fontSize = 9;
            doc.setFontSize(fontSize);
            doc.setFont("NotoKufiArabic");
            
            // Get the cell dimensions
            const { x, y, width, height } = data.cell;
            
            // Clear the cell (the library already drew the text)
            doc.setFillColor(255, 255, 255);
            doc.rect(x, y, width, height, 'F');
            
            // Draw the text with right alignment for Arabic
            doc.text(text, x + width - 2, y + fontSize + 1, { align: 'right' });
            
            // Reset font
            doc.setFont("Nunito");
          }
        }
      }
    });
    
    // Dotted line before totals
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    doc.text("----------------------------------------", 10, finalY + 10);
    
    // Totals with right alignment
    formatTextWithLanguage(doc, "Sous-total:", 50, finalY + 20);
    formatTextWithLanguage(doc, `${formatPrice(subtotal)} ${currency}`, 105, finalY + 20, { align: 'right' });
    
    formatTextWithLanguage(doc, "Livraison:", 50, finalY + 30);
    formatTextWithLanguage(doc, `${formatPrice(shippingCost)} ${currency}`, 105, finalY + 30, { align: 'right' });
    
    doc.text("----------------------------------------", 10, finalY + 40);
    
    // Total with bold style
    doc.setFont("Nunito", "bold");
    formatTextWithLanguage(doc, "TOTAL:", 50, finalY + 50);
    formatTextWithLanguage(doc, `${formatPrice(order.total_amount || 0)} ${currency}`, 105, finalY + 50, { align: 'right' });
    doc.setFont("Nunito", "normal");
    
    doc.text("----------------------------------------", 10, finalY + 60);
    
    // Delivery information
    if (order.delivery_day) {
      formatTextWithLanguage(doc, `Jour de livraison: ${order.delivery_day}`, 20, finalY + 70);
    }
    if (order.preferred_time) {
      formatTextWithLanguage(doc, `Heure de livraison: ${order.preferred_time}`, 20, finalY + 80);
    }
    formatTextWithLanguage(doc, `Adresse: ${order['Adresse'] || ''}`, 20, finalY + 90);
    formatTextWithLanguage(doc, `Téléphone: ${order['Phone'] || ''}`, 20, finalY + 100);
    
    // Thank you message
    doc.text("----------------------------------------", 10, finalY + 110);
    doc.setFontSize(12);
    formatTextWithLanguage(doc, "Merci pour votre commande!", 105, finalY + 120, { align: 'center' });
    
    // Save PDF
    doc.save(`commande-${order.id}.pdf`);
  }
  
  return doc;
};
