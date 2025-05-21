
import { jsPDF } from 'jspdf';
import { supabase } from '@/integrations/supabase/client';

// Function to add the store logo to the PDF
export const addLogoToPdf = async (doc: jsPDF): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('site_name')
      .single();

    if (error) {
      console.error("Error fetching site name:", error);
      // Note: We're not using this anymore as we're adding the logo image directly
      // in the PDF generator functions
      return;
    }

    // We're not setting the site name text anymore as we use the logo image
    // This function is kept for backward compatibility
  } catch (err) {
    console.error("Error in addLogoToPdf:", err);
  }
};

// Function to add a header to the PDF (you can customize this)
export const addHeaderToPdf = (doc: jsPDF, text: string): void => {
  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.text(text, 14, 30);
};

// Add a new function to fetch currency from settings
export const fetchCurrencyFromSettings = async (): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('currency')
      .single();
      
    if (error) {
      console.error("Error fetching currency:", error);
      return 'DH'; // Default to Moroccan Dirham
    }
    
    return data.currency || 'DH';
  } catch (err) {
    console.error("Error in fetchCurrencyFromSettings:", err);
    return 'DH'; // Default to Moroccan Dirham
  }
};

// Helper to calculate item total with services
export const calculateItemTotalWithServices = (item: any) => {
  let basePrice = item.price;
  let servicesCost = 0;
  
  // Add service costs if they exist
  if (item.services && Array.isArray(item.services) && item.services.length > 0) {
    servicesCost = item.services.reduce((total: number, service: any) => {
      return total + (service.price || 0);
    }, 0);
  }
  
  const totalUnitPrice = basePrice + servicesCost;
  const totalPrice = totalUnitPrice * item.quantity;
  
  return {
    basePrice,
    servicesCost,
    totalUnitPrice,
    totalPrice
  };
};

// Add a utility function to handle Arabic text in PDF
export const addArabicText = (doc: jsPDF, text: string, x: number, y: number, options?: any): void => {
  // Make sure we have text to process
  if (!text) return;

  // Use right-to-left alignment for Arabic text
  try {
    // Use right-to-left alignment for Arabic text
    const textOptions = { 
      align: 'right',
      ...options
    };

    // Draw the text with RTL alignment
    doc.text(text, x, y, textOptions);
  } catch (err) {
    console.error("Error adding Arabic text:", err);
    // Fallback to standard text rendering
    doc.text(text, x, y, options);
  }
};
