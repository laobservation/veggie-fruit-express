
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '@/types/order';
import { formatPrice } from '@/lib/formatPrice';
import { formatDate } from '@/utils/formatUtils';
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
  TABLE_COLUMNS
} from './constants';

export const generateOrderPDF = (order: Order) => {
  const doc = new jsPDF();
  const logoPath = "/lovable-uploads/4c234092-7248-4896-9d9b-9da5909ffbfb.png";
  
  // Start the PDF generation process
  addLogoToPDF(doc, logoPath, LOGO_X_POSITION, LOGO_Y_POSITION, LOGO_SIZE, LOGO_SIZE)
    .then(() => {
      finishPDFGeneration(doc, order);
    });
  
  return doc;
};

function finishPDFGeneration(doc: jsPDF, order: Order) {
  // Add header
  addDocumentHeader(doc, "Marché Bio", "Détails de la Commande #" + order.id);
  
  // Customer information
  doc.setFontSize(SECTION_TITLE_FONT_SIZE);
  doc.text("Informations Client", 20, CUSTOMER_INFO_TITLE_Y);
  doc.setFontSize(DETAIL_FONT_SIZE);
  doc.text(`Nom: ${order['Client Name']}`, 20, CUSTOMER_INFO_START_Y);
  doc.text(`Adresse: ${order['Adresse']}`, 20, CUSTOMER_INFO_START_Y + CUSTOMER_INFO_LINE_HEIGHT);
  doc.text(`Téléphone: ${order['Phone'] || 'Non fourni'}`, 20, CUSTOMER_INFO_START_Y + (CUSTOMER_INFO_LINE_HEIGHT * 2));
  doc.text(`Date: ${formatDate(order.created_at)}`, 20, CUSTOMER_INFO_START_Y + (CUSTOMER_INFO_LINE_HEIGHT * 3));
  
  let yPosition = CUSTOMER_INFO_START_Y + (CUSTOMER_INFO_LINE_HEIGHT * 4);
  if (order.preferred_time) {
    doc.text(`Heure de livraison préférée: ${order.preferred_time}`, 20, yPosition);
    yPosition += CUSTOMER_INFO_LINE_HEIGHT;
  }
  
  // Status
  doc.text(`Statut: ${order.status || 'Nouveau'}`, 20, yPosition);
  
  // Items table
  const tableRows = formatOrderItemsForTable(order.order_items || []);
  
  // Use autoTable
  autoTable(doc, {
    head: [TABLE_COLUMNS],
    body: tableRows,
    startY: 130,
    theme: TABLE_THEME,
    headStyles: { fillColor: PDF_PRIMARY_COLOR }
  });
  
  // Total
  const finalY = (doc as any).lastAutoTable.finalY || 160;
  doc.setFontSize(SECTION_TITLE_FONT_SIZE);
  doc.text(`Total: ${formatPrice(order.total_amount || 0)}`, 150, finalY + 15);
  
  // Footer
  doc.setFontSize(DETAIL_FONT_SIZE);
  doc.text("Document généré le " + new Date().toLocaleString('fr-FR'), 20, finalY + 30);
  
  // Save PDF
  doc.save(`commande-${order.id}.pdf`);
}
