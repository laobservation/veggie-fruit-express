
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '@/types/order';
import { formatPrice } from '@/lib/formatPrice';
import { formatDate } from './formatUtils';

export const generateOrderPDF = (order: Order) => {
  const doc = new jsPDF();
  
  // Add company logo/header
  doc.setFontSize(20);
  doc.setTextColor(39, 174, 96);
  doc.text("Marché Bio", 105, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Détails de la Commande #" + order.id, 105, 30, { align: 'center' });
  
  // Customer information
  doc.setFontSize(12);
  doc.text("Informations Client", 20, 45);
  doc.setFontSize(10);
  doc.text(`Nom: ${order['Client Name']}`, 20, 55);
  doc.text(`Adresse: ${order['Adresse']}`, 20, 60);
  doc.text(`Téléphone: ${order['Phone'] || 'Non fourni'}`, 20, 65);
  doc.text(`Date: ${formatDate(order.created_at)}`, 20, 70);
  
  let yPosition = 75;
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
    startY: 90,
    theme: 'striped',
    headStyles: { fillColor: [39, 174, 96] }
  });
  
  // Total
  const finalY = (doc as any).lastAutoTable.finalY || 120;
  doc.setFontSize(12);
  doc.text(`Total: ${formatPrice(order.total_amount || 0)}`, 150, finalY + 15);
  
  // Footer
  doc.setFontSize(10);
  doc.text("Document généré le " + new Date().toLocaleString('fr-FR'), 20, finalY + 30);
  
  // Save PDF
  doc.save(`commande-${order.id}.pdf`);
  
  return doc;
};
