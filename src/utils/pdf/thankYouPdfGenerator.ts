
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
    
    // Add header
    addHeaderToPdf(doc);
    
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
