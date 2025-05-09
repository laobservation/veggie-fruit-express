
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the request body
    const body = await req.json()
    const { order_id } = body

    if (!order_id) {
      return new Response(
        JSON.stringify({ error: 'order_id is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Make sure order_id is a number
    const orderIdNumber = typeof order_id === 'string' ? parseInt(order_id, 10) : order_id

    console.log(`Edge function: Deleting order ${orderIdNumber}`)

    // First try to use the direct database RPC function for absolute deletion
    const { error: rpcError, data: rpcData } = await supabaseClient.rpc(
      'delete_order_by_id',
      { order_id: orderIdNumber }
    )
    
    if (rpcError) {
      console.error('Edge function: Error using RPC to delete order:', rpcError)
      
      // If RPC fails, try a direct DELETE with service role privileges
      const { error } = await supabaseClient
        .from('Orders')
        .delete()
        .eq('id', orderIdNumber)
    
      if (error) {
        console.error('Edge function: Error deleting order:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
    }

    // Verify deletion - careful checking
    const { data: checkData } = await supabaseClient
      .from('Orders')
      .select('id')
      .eq('id', orderIdNumber)
      .maybeSingle()

    if (checkData) {
      // One more attempt to force delete if still exists
      await supabaseClient.from('Orders').delete().eq('id', orderIdNumber)
      
      // Check again
      const { data: finalCheck } = await supabaseClient
        .from('Orders')
        .select('id')
        .eq('id', orderIdNumber)
        .maybeSingle()
        
      if (finalCheck) {
        return new Response(
          JSON.stringify({ error: "Order still exists after multiple deletion attempts" }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
    }

    // Return a success response
    return new Response(
      JSON.stringify({ success: true, message: `Order ${orderIdNumber} deleted successfully` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Edge function: Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
