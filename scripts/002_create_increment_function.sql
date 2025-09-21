-- Create a function to atomically increment the usage count for an excuse
CREATE OR REPLACE FUNCTION increment_usage(excuse_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.excuses
  SET usage_count = usage_count + 1
  WHERE id = excuse_id_param;
END;
$$ LANGUAGE plpgsql;
