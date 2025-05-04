
// Edge function to initialize and sync settings
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Check if settings table exists
    const { data: tablesData, error: checkError } = await supabaseClient
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", "settings")
      .eq("table_schema", "public");

    if (checkError) {
      throw new Error(`Error checking for settings table: ${checkError.message}`);
    }

    // If settings table doesn't exist, create it
    if (!tablesData || tablesData.length === 0) {
      console.log("Settings table doesn't exist, creating it...");
      
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS public.settings (
          id INTEGER PRIMARY KEY DEFAULT 1,
          site_name TEXT DEFAULT 'Marché Bio',
          description TEXT DEFAULT 'Livraison de fruits et légumes bio à domicile',
          contact_email TEXT DEFAULT 'contact@marchebiomobile.com',
          contact_phone TEXT DEFAULT '+212 612345678',
          address TEXT DEFAULT 'Extention Zerhounia N236, Marrakech, Maroc',
          currency TEXT DEFAULT 'DH',
          enable_delivery BOOLEAN DEFAULT TRUE,
          delivery_fee NUMERIC DEFAULT 30,
          enable_payments BOOLEAN DEFAULT TRUE,
          minimum_order_value NUMERIC DEFAULT 100,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        -- Disable RLS on settings table to ensure admins can access it
        ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;
        
        -- Insert default settings if not exists
        INSERT INTO public.settings (id) 
        VALUES (1) 
        ON CONFLICT (id) DO NOTHING;
      `;
      
      const { error: createError } = await supabaseClient.rpc('pgexec', { query: createTableQuery });
      
      if (createError) {
        throw new Error(`Error creating settings table: ${createError.message}`);
      }
    } else {
      // Make sure RLS is disabled on existing table
      const disableRlsQuery = `
        ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;
      `;
      
      const { error: disableError } = await supabaseClient.rpc('pgexec', { query: disableRlsQuery });
      
      if (disableError) {
        console.error(`Warning: Could not disable RLS: ${disableError.message}`);
      }
    }

    // Return success
    return new Response(
      JSON.stringify({ success: true, message: "Settings table setup completed" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
