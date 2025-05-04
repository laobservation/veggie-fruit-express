
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Define interface for website settings
interface WebsiteSettings {
  siteName?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

serve(async (req) => {
  try {
    const { action, settings } = await req.json();

    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') as string
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Handle different actions
    if (action === 'get') {
      // Get settings from database
      const { data, error } = await supabase
        .from('website_settings')
        .select('*')
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to fetch website settings.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, settings: data }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    } 
    else if (action === 'update' && settings) {
      // Update settings
      const { error } = await supabase
        .from('website_settings')
        .upsert({ id: 1, ...settings });

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to update settings.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Settings updated successfully' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
})
