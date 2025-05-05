
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatPrice } from '@/lib/formatPrice';
import { 
  addLogoToPDF, 
  addDocumentHeader, 
  formatOrderItemsForTable 
} from './helpers';
import { 
  PDF_PRIMARY_COLOR, 
  LOGO_SIZE, 
  LOGO_X_POSITION, 
  LOGO_Y_POSITION,
  DETAIL_FONT_SIZE, 
  SECTION_TITLE_FONT_SIZE,
  CUSTOMER_INFO_TITLE_Y,
  CUSTOMER_INFO_START_Y,
  CUSTOMER_INFO_LINE_HEIGHT,
  TABLE_THEME,
  TABLE_COLUMNS,
  ITEMS_TABLE_Y
} from './constants';

export const generateThankYouPDF = (orderDetails: any) => {
  const doc = new jsPDF();
  const logoPath = "/lovable-uploads/4c234092-7248-4896-9d9b-9da5909ffbfb.png";
  
  // Start the PDF generation process
  addLogoToPDF(doc, logoPath, LOGO_X_POSITION, LOGO_Y_POSITION, LOGO_SIZE, LOGO_SIZE)
    .then(() => {
      finishPDFGeneration(doc, orderDetails);
    });
  
  return doc;
};

function finishPDFGeneration(doc: jsPDF, orderDetails: any) {
  // Add header
  addDocumentHeader(doc, "Marché Bio", "Récapitulatif de Commande");
  
  // Customer information
  doc.setFontSize(SECTION_TITLE_FONT_SIZE);
  doc.text("Informations Client", 20, CUSTOMER_INFO_TITLE_Y);
  doc.setFontSize(DETAIL_FONT_SIZE);
  doc.text(`Nom: ${orderDetails.name}`, 20, CUSTOMER_INFO_START_Y);
  doc.text(`Adresse: ${orderDetails.address}`, 20, CUSTOMER_INFO_START_Y + CUSTOMER_INFO_LINE_HEIGHT);
  doc.text(`Téléphone: ${orderDetails.phone}`, 20, CUSTOMER_INFO_START_Y + (CUSTOMER_INFO_LINE_HEIGHT * 2));
  
  if (orderDetails.preferredTime) {
    doc.text(`Heure de livraison préférée: ${orderDetails.preferredTime}`, 20, CUSTOMER_INFO_START_Y + (CUSTOMER_INFO_LINE_HEIGHT * 3));
  }
  
  // Items table
  const tableRows = formatOrderItemsForTable(orderDetails.items || []);
  
  // Use autoTable
  autoTable(doc, {
    head: [TABLE_COLUMNS],
    body: tableRows,
    startY: ITEMS_TABLE_Y,
    theme: TABLE_THEME,
    headStyles: { fillColor: PDF_PRIMARY_COLOR }
  });
  
  // Total
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  doc.setFontSize(SECTION_TITLE_FONT_SIZE);
  doc.text(`Total: ${formatPrice(orderDetails.totalAmount)}`, 150, finalY + 15);
  
  // Thank you note
  doc.setFontSize(DETAIL_FONT_SIZE);
  doc.text("Merci pour votre commande!", 105, finalY + 30, { align: 'center' });
  doc.text("Notre équipe prépare vos produits avec soin.", 105, finalY + 35, { align: 'center' });
  
  // Save PDF
  doc.save(`commande-${new Date().toISOString().split('T')[0]}.pdf`);
}
