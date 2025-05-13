
import { jsPDF } from 'jspdf';

// Helper function to add logo to PDF
export const addLogoToPdf = (doc: jsPDF): Promise<void> => {
  return new Promise((resolve) => {
    // Add company logo with white background
    const logoPath = "/lovable-uploads/4c234092-7248-4896-9d9b-9da5909ffbfb.png";
    
    // Create a new Image to load the logo
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
      // Draw white background rectangle first
      doc.setFillColor(255, 255, 255);
      doc.rect(105 - 25, 5, 50, 50, 'F');
      // Then add the logo
      doc.addImage(img, 'PNG', 105 - 20, 10, 40, 40, undefined, 'FAST');
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

// Helper function to add header text to PDF
export const addHeaderToPdf = (doc: jsPDF) => {
  // Add header text
  doc.setFontSize(20);
  doc.setTextColor(39, 174, 96);
  doc.text("Marché Bio", 105, 60, { align: 'center' });
};

// Helper to calculate total price including services
export const calculateItemTotalWithServices = (
  item: { 
    price: number;
    quantity: number;
    services?: Array<{
      id: string;
      name: string;
      price: number;
    }>;
  }
): { 
  itemUnitPrice: number;
  totalPrice: number;
} => {
  let itemUnitPrice = item.price;
    
  // Add service costs if present
  if (item.services && item.services.length > 0) {
    const servicesCost = item.services.reduce((total, service) => 
      total + service.price, 0
    );
    itemUnitPrice += servicesCost;
  }
  
  return {
    itemUnitPrice,
    totalPrice: itemUnitPrice * item.quantity
  };
};

// Helper to fetch currency from settings
export const fetchCurrencyFromSettings = async () => {
  const { supabase } = await import('@/integrations/supabase/client');
  const { data: settingsData } = await supabase
    .from('settings')
    .select('currency')
    .single();
  
  return settingsData?.currency || 'DH';
};
