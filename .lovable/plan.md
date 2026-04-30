## Goal
Add RAG (Retrieval-Augmented Generation) to the chat edge function only. No UI changes, no other component changes.

## Scope
Modify only `supabase/functions/chat/index.ts`. Everything else stays untouched.

## How it works

```text
user msg → embed(last user msg) → match_kb_chunks RPC → top-K chunks
        → inject as "Context" block in system prompt → stream LLM reply
```

## Implementation steps

1. **Embed the latest user query** via Lovable AI Gateway embeddings endpoint (`/v1/embeddings`) using `google/text-embedding-004` (768-dim). The existing `kb_chunks.embedding` column already uses pgvector; we'll match its dimension. If the dimension already provisioned in the DB differs, we fall back gracefully (catch error, skip RAG, continue chat).
2. **Retrieve top chunks** by calling the existing `match_kb_chunks` RPC via the Supabase REST endpoint using the service role key (already available as `SUPABASE_SERVICE_ROLE_KEY`). Pass `match_count: 5` and `filter_language: language`.
3. **Build context block**: concatenate retrieved chunks with their `document_title` / `source` as inline citations: `[1] Title — source`. Cap total context at ~3000 chars.
4. **Inject into system prompt**: append a `Knowledge Base Context:` section + an instruction to cite using `[n]` markers when the answer uses retrieved info. Keep neutrality rules intact.
5. **Resilience**: wrap retrieval in try/catch. On any failure (no KB rows, embedding error, RPC error), log and proceed without RAG — chat must never break.
6. **No streaming change**: still pass `stream: true` and pipe `r.body` back. Frontend behavior unchanged.

## Files touched
- `supabase/functions/chat/index.ts` (only)

## Out of scope
- No frontend changes (`Chat.tsx` untouched)
- No DB migrations (kb tables/RPC already exist)
- No KB ingestion (separate task — current `kb_chunks` may be empty; chat will simply behave as before until chunks exist)
