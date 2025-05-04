
-- Drop any existing function (will be recreated)
DROP FUNCTION IF EXISTS public.delete_order_by_id;

-- Recreate the function with improved error handling
CREATE OR REPLACE FUNCTION public.delete_order_by_id(order_id BIGINT)
RETURNS boolean AS $$
DECLARE
  row_count INTEGER;
BEGIN
  -- Direct SQL DELETE for maximum compatibility
  DELETE FROM public."Orders" WHERE id = order_id;
  
  -- Check if the deletion was successful
  GET DIAGNOSTICS row_count = ROW_COUNT;
  
  -- Return true if at least one row was deleted
  RETURN row_count > 0;
EXCEPTION WHEN OTHERS THEN
  -- Log the error (will appear in Supabase logs)
  RAISE NOTICE 'Error deleting order %: %', order_id, SQLERRM;
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to necessary roles
GRANT EXECUTE ON FUNCTION public.delete_order_by_id TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_order_by_id TO anon;
GRANT EXECUTE ON FUNCTION public.delete_order_by_id TO service_role;
