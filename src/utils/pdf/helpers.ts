
import jsPDF from 'jspdf';
import { formatPrice } from '@/lib/formatPrice';
import { PDF_PRIMARY_COLOR, HEADER_FONT_SIZE, SUBHEADER_FONT_SIZE, TITLE_Y_POSITION, SUBTITLE_Y_POSITION } from './constants';

// Logo handling functions
export const addLogoToPDF = (doc: jsPDF, logoPath: string, x: number, y: number, width: number, height: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = logoPath;
    
    // Set a timeout to prevent hanging if image loading takes too long
    const timeout = setTimeout(() => {
      console.error("Logo loading took too long, generating PDF without it");
      resolve();
    }, 1500);
    
    // Once image is loaded, add it to the PDF
    img.onload = function() {
      clearTimeout(timeout);
      doc.addImage(img, 'PNG', x, y, width, height, undefined, 'FAST');
      resolve();
    };
    
    // Fallback in case image doesn't load
    img.onerror = function() {
      clearTimeout(timeout);
      console.error("Failed to load logo for PDF");
      resolve();
    };
  });
};

// Document header setup
export const addDocumentHeader = (doc: jsPDF, title: string, subtitle: string) => {
  // Add header text
  doc.setFontSize(HEADER_FONT_SIZE);
  doc.setTextColor(PDF_PRIMARY_COLOR[0], PDF_PRIMARY_COLOR[1], PDF_PRIMARY_COLOR[2]);
  doc.text("Marché Bio", 105, TITLE_Y_POSITION, { align: 'center' });
  
  // Add subtitle
  doc.setFontSize(SUBHEADER_FONT_SIZE);
  doc.setTextColor(0, 0, 0);
  doc.text(subtitle, 105, SUBTITLE_Y_POSITION, { align: 'center' });
};

// Format table data
export const formatOrderItemsForTable = (items: any[]): any[] => {
  const tableRows: any[] = [];
  
  if (items && items.length > 0) {
    items.forEach(item => {
      const productName = item.productName || item.product?.name;
      const quantity = item.quantity;
      const price = item.price || item.product?.price;
      
      if (productName && typeof quantity === 'number' && price) {
        const itemData = [
          productName,
          quantity,
          formatPrice(price),
          formatPrice(price * quantity)
        ];
        tableRows.push(itemData);
      }
    });
  }
  
  return tableRows;
};
