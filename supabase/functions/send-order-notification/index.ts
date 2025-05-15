
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
    
    // Format the delivery time text
    let deliveryTime = "Pas spécifiée";
    if (orderDetails.preferredTime) {
      deliveryTime = orderDetails.preferredTime;
    }

    // Format order items for email
    const itemsList = orderDetails.items
      .map((item) => {
        const serviceText = item.selectedServices && item.selectedServices.length > 0
          ? item.selectedServices.map(s => `- ${s.name}`).join("<br>")
          : "";
        
        return `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.product.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${(item.product.price * item.quantity).toFixed(2)} DH</td>
          </tr>
          ${serviceText ? `<tr><td colspan="3" style="padding: 4px 8px; font-size: 12px; color: #666;">${serviceText}</td></tr>` : ""}
        `;
      })
      .join("");

    // Create the email HTML content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2e7d32; border-bottom: 2px solid #2e7d32; padding-bottom: 10px;">Nouvelle Commande - AKHDAR.MA</h1>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Détails du client</h2>
          <p><strong>Nom:</strong> ${orderDetails.name}</p>
          <p><strong>Adresse:</strong> ${orderDetails.address}</p>
          <p><strong>Téléphone:</strong> ${orderDetails.phone}</p>
          <p><strong>Heure de livraison préférée:</strong> ${deliveryTime}</p>
        </div>
        
        <h2>Résumé de la commande</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="text-align: left; padding: 10px;">Produit</th>
              <th style="text-align: left; padding: 10px;">Quantité</th>
              <th style="text-align: left; padding: 10px;">Prix</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="text-align: right; padding: 10px; font-weight: bold;">Sous-total:</td>
              <td style="padding: 10px;">${orderDetails.subtotal.toFixed(2)} DH</td>
            </tr>
            <tr>
              <td colspan="2" style="text-align: right; padding: 10px; font-weight: bold;">Frais de livraison:</td>
              <td style="padding: 10px;">${orderDetails.shippingCost.toFixed(2)} DH</td>
            </tr>
            <tr style="background-color: #f5f5f5;">
              <td colspan="2" style="text-align: right; padding: 10px; font-weight: bold;">Total:</td>
              <td style="padding: 10px; font-weight: bold;">${orderDetails.totalAmount.toFixed(2)} DH</td>
            </tr>
          </tfoot>
        </table>
        
        <p style="margin-top: 20px; color: #666; font-size: 12px;">Cette notification a été envoyée automatiquement par le système AKHDAR.MA.</p>
      </div>
    `;

    // Send the email
    const info = await transporter.sendMail({
      from: '"AKHDAR.MA" <ayoub.iqrae@gmail.com>',
      to: "ayoub.iqrae@gmail.com",
      subject: "🛒 Nouvelle commande de AKHDAR.MA",
      html: emailHtml,
    });

    console.log("Email sent successfully:", info.messageId);

    // Return a successful response
    return new Response(
      JSON.stringify({ success: true, messageId: info.messageId }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    // Log the error but don't expose details to the client
    console.error("Error sending email notification:", error);

    // Return an error response
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
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
