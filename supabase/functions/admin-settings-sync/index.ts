
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
  id?: number;
}

serve(async (req) => {
  try {
    // Add CORS headers
    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Content-Type': 'application/json'
    });

    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers });
    }

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

      if (error && error.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is not critical
        return new Response(
          JSON.stringify({ error: 'Failed to fetch website settings.' }),
          { status: 500, headers }
        );
      }

      // If no settings exist yet, return an empty object
      if (!data) {
        return new Response(
          JSON.stringify({ success: true, settings: {} }),
          { headers }
        );
      }

      return new Response(
        JSON.stringify({ success: true, settings: data }),
        { headers }
      );
    } 
    else if (action === 'update' && settings) {
      // Check if settings already exist
      const { data, error: checkError } = await supabase
        .from('website_settings')
        .select('id')
        .maybeSingle();

      if (checkError) {
        return new Response(
          JSON.stringify({ error: 'Failed to check settings existence.' }),
          { status: 500, headers }
        );
      }

      let updateError;

      if (data) {
        // Settings exist, update them
        const { error } = await supabase
          .from('website_settings')
          .update(settings)
          .eq('id', data.id);
          
        updateError = error;
      } else {
        // No settings exist yet, insert new ones with id=1
        const settingsWithId: WebsiteSettings = { ...settings, id: 1 };
        const { error } = await supabase
          .from('website_settings')
          .insert(settingsWithId);
          
        updateError = error;
      }

      if (updateError) {
        return new Response(
          JSON.stringify({ error: 'Failed to update settings.' }),
          { status: 500, headers }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Settings updated successfully' }),
        { headers }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        } 
      }
    );
  }
})
