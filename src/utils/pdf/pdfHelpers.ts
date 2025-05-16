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
      doc.setFontSize(16);
      doc.text("Veggie Shop", 14, 22); // Default name if fetch fails
      return;
    }

    const siteName = data?.site_name || "Veggie Shop";
    doc.setFontSize(16);
    doc.text(siteName, 14, 22);
  } catch (err) {
    console.error("Error in addLogoToPdf:", err);
    doc.setFontSize(16);
    doc.text("Veggie Shop", 14, 22); // Fallback in case of any error
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
