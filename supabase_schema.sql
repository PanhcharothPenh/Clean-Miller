-- Supabase Postgres Database Migration Schema for Clean24
-- Run this SQL in Supabase SQL Editor to initialize storage collections

CREATE TABLE IF NOT EXISTS clean24_collections (
  id TEXT PRIMARY KEY, -- Collection Name (e.g. users, branches, etc.)
  data JSONB NOT NULL, -- Array of records
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for rapid JSONB lookups
CREATE INDEX IF NOT EXISTS idx_collections_data ON clean24_collections USING gin (data);

-- Optional: Seed default setup metadata
INSERT INTO clean24_collections (id, data)
VALUES ('metadata', '{"initialized": true, "version": "1.0.0"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE clean24_collections IS 'Persisted database JSON collections for Clean24 serverless architecture';
