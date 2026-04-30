-- Switch embeddings to 384-dim (gte-small) so they can be generated inside Supabase Edge runtime
ALTER TABLE public.kb_chunks DROP COLUMN IF EXISTS embedding;
ALTER TABLE public.kb_chunks ADD COLUMN embedding vector(384);

-- Recreate RPC at new dimension
DROP FUNCTION IF EXISTS public.match_kb_chunks(vector, integer, text);

CREATE OR REPLACE FUNCTION public.match_kb_chunks(
  query_embedding vector(384),
  match_count integer DEFAULT 5,
  filter_language text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  content text,
  document_title text,
  source text,
  similarity double precision
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT
    c.id,
    c.content,
    d.title AS document_title,
    d.source,
    1 - (c.embedding <=> query_embedding) AS similarity
  FROM public.kb_chunks c
  JOIN public.kb_documents d ON d.id = c.document_id
  WHERE c.embedding IS NOT NULL
    AND (filter_language IS NULL OR d.language::text = filter_language)
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- ANN index for fast retrieval
CREATE INDEX IF NOT EXISTS kb_chunks_embedding_hnsw_idx
  ON public.kb_chunks
  USING hnsw (embedding vector_cosine_ops);