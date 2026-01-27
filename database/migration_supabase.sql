-- Migration: Add Supabase Storage and Realtime fields
-- Run this after initial schema.sql

-- Add storage fields to resumes table
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS storage_path VARCHAR(500);
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS storage_bucket VARCHAR(50) DEFAULT 'resumes';

-- Add storage and progress fields to analyses table
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS latex_storage_path VARCHAR(500);
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS pdf_storage_path VARCHAR(500);
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS progress_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS progress_percentage INTEGER DEFAULT 0;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_analyses_progress_status ON analyses(progress_status);
CREATE INDEX IF NOT EXISTS idx_resumes_storage_path ON resumes(storage_path);

-- Comments for documentation
COMMENT ON COLUMN resumes.storage_path IS 'Supabase Storage path for the resume file';
COMMENT ON COLUMN resumes.storage_bucket IS 'Supabase Storage bucket name';
COMMENT ON COLUMN analyses.latex_storage_path IS 'Supabase Storage path for improved LaTeX file';
COMMENT ON COLUMN analyses.pdf_storage_path IS 'Supabase Storage path for improved PDF file';
COMMENT ON COLUMN analyses.progress_status IS 'Current status: pending, analyzing, improving, completed';
COMMENT ON COLUMN analyses.progress_percentage IS 'Progress percentage 0-100';
