-- 001_init_schema.sql
-- This script initializes the database with the 'excuses' table.

-- Drop any old tables to ensure a clean slate
DROP TABLE IF EXISTS public.status;
DROP TABLE IF EXISTS public.excuses;

-- Create the new 'excuses' table as per user specification
CREATE TABLE public.excuses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  excuse_text text NOT NULL,
  nickname character varying(50) NULL DEFAULT 'System'::character varying,
  is_approved boolean NULL DEFAULT true,
  usage_count integer NULL DEFAULT 0,
  created_at timestamp with time zone NULL DEFAULT now(),
  approved_at timestamp with time zone NULL DEFAULT now(),
  approved_by character varying(100) NULL DEFAULT 'System'::character varying,
  CONSTRAINT excuses_pkey PRIMARY KEY (id),
  CONSTRAINT excuses_excuse_text_key UNIQUE (excuse_text)
) TABLESPACE pg_default;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_excuses_approved ON public.excuses USING btree (is_approved) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_excuses_created_at ON public.excuses USING btree (created_at DESC) TABLESPACE pg_default;

-- Enable Row Level Security
ALTER TABLE public.excuses ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.excuses
  FOR SELECT
  USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert access" ON public.excuses
  FOR INSERT
  WITH CHECK (true);

-- Allow public update access
CREATE POLICY "Allow public update access" ON public.excuses
  FOR UPDATE
  USING (true);
