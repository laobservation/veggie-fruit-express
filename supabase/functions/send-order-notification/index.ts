
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createTransport } from "npm:nodemailer@6.9.8";
import type { OrderDetails } from "../../../src/types/delivery.ts";

// Email configuration
const emailConfig = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "ayoub.iqrae@gmail.com",
    pass: "vizpnvicomcjcwyx",
  },
  debug: true,
  logger: true
};

// CORS headers for the function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Create email transporter
const transporter = createTransport(emailConfig);

// Handler function for Supabase Edge Function
serve(async (req) => {
  console.log("Email notification function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Parse the request body
    const { orderDetails }: { orderDetails: OrderDetails } = await req.json();
    console.log("Order details received:", JSON.stringify(orderDetails));

    // Format the email content with simpler HTML for better deliverability
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #2e7d32;">Nouvelle Commande - AKHDAR.MA</h2>
        
        <div style="background-color: #f9f9f9; padding: 15px; margin: 15px 0;">
          <h3>Détails du client</h3>
          <p><strong>Nom:</strong> ${orderDetails.name}</p>
          <p><strong>Adresse:</strong> ${orderDetails.address}</p>
          <p><strong>Téléphone:</strong> ${orderDetails.phone}</p>
          <p><strong>Heure de livraison préférée:</strong> ${orderDetails.preferredTime || "Non spécifiée"}</p>
        </div>
        
        <h3>Résumé de la commande</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f5f5f5;">
            <th style="text-align: left; padding: 8px;">Produit</th>
            <th style="text-align: left; padding: 8px;">Qté</th>
            <th style="text-align: left; padding: 8px;">Prix</th>
          </tr>
          ${orderDetails.items.map(item => `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.product.name}</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${(item.product.price * item.quantity).toFixed(2)} DH</td>
            </tr>
          `).join('')}
          <tr>
            <td colspan="2" style="text-align: right; padding: 8px; font-weight: bold;">Sous-total:</td>
            <td style="padding: 8px;">${orderDetails.subtotal.toFixed(2)} DH</td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: right; padding: 8px; font-weight: bold;">Frais de livraison:</td>
            <td style="padding: 8px;">${orderDetails.shippingCost.toFixed(2)} DH</td>
          </tr>
          <tr style="background-color: #f5f5f5;">
            <td colspan="2" style="text-align: right; padding: 8px; font-weight: bold;">Total:</td>
            <td style="padding: 8px; font-weight: bold;">${orderDetails.totalAmount.toFixed(2)} DH</td>
          </tr>
        </table>
      </div>
    `;

    // Plain text version for better deliverability
    const plainText = `
      Nouvelle Commande - AKHDAR.MA
      
      Détails du client:
      Nom: ${orderDetails.name}
      Adresse: ${orderDetails.address}
      Téléphone: ${orderDetails.phone}
      Heure de livraison préférée: ${orderDetails.preferredTime || "Non spécifiée"}
      
      Total de la commande: ${orderDetails.totalAmount.toFixed(2)} DH
    `;

    // Send email using a more direct approach
    console.log("Sending email to ayoub.iqrae@gmail.com");
    const info = await transporter.sendMail({
      from: "AKHDAR.MA <ayoub.iqrae@gmail.com>",
      to: "ayoub.iqrae@gmail.com",
      subject: "🛒 Nouvelle commande de AKHDAR.MA",
      html: emailContent,
      text: plainText,
      headers: {
        'X-Priority': '1', // Set high priority
        'Importance': 'high'
      }
    });

    console.log("Email sent successfully:", info.messageId);
    console.log("Full email info:", JSON.stringify(info));

    return new Response(
      JSON.stringify({ 
        success: true,
        messageId: info.messageId,
        envelope: info.envelope
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    // Comprehensive error logging
    console.error("Error sending email notification:", error);
    console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    // Try to get more specific error information
    const errorMessage = error.message || "Unknown error";
    const errorCode = error.code || "No error code";
    const errorResponse = error.response || {};
    
    console.error(`Error code: ${errorCode}, Message: ${errorMessage}`);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Failed to send email notification",
        errorMessage: errorMessage,
        errorCode: errorCode,
        errorDetails: JSON.stringify(error, Object.getOwnPropertyNames(error))
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});
