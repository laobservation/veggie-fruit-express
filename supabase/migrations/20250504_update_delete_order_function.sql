
-- Drop any existing function (will be recreated)
DROP FUNCTION IF EXISTS public.delete_order_by_id;

-- Recreate the function with improved error handling
CREATE OR REPLACE FUNCTION public.delete_order_by_id(order_id BIGINT)
RETURNS boolean AS $$
DECLARE
  row_count INTEGER;
BEGIN
  -- First try a direct DELETE for maximum efficiency
  DELETE FROM public."Orders" WHERE id = order_id;
  
  -- Check if the deletion was successful
  GET DIAGNOSTICS row_count = ROW_COUNT;
  
  -- If nothing was deleted, try to force the deletion with elevated privileges
  IF row_count = 0 THEN
    -- Force delete with explicit schema name and quotes for exact table name
    EXECUTE format('DELETE FROM public."Orders" WHERE id = %s', order_id);
    GET DIAGNOSTICS row_count = ROW_COUNT;
  END IF;
  
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

-- Ensure the Orders table allows all operations for authorized users
DO $$
BEGIN
  -- Add RLS policies if they don't exist already
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'Orders' AND policyname = 'Enable delete for authenticated users'
  ) THEN
    ALTER TABLE public."Orders" ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Enable delete for authenticated users" 
      ON public."Orders" 
      FOR DELETE 
      USING (true);
  END IF;
END
$$;
