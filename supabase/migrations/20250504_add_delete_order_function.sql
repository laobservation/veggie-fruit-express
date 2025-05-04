
-- Create a function to delete orders by ID
CREATE OR REPLACE FUNCTION public.delete_order_by_id(order_id BIGINT)
RETURNS void AS $$
BEGIN
  DELETE FROM public."Orders" WHERE id = order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_order_by_id TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_order_by_id TO anon;
GRANT EXECUTE ON FUNCTION public.delete_order_by_id TO service_role;
