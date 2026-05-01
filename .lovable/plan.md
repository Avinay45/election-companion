## Scope

Minimal, surgical edits to: chat edge function, Chat.tsx, Timeline.tsx. No other files touched.

## 1. Chat edge function (`supabase/functions/chat/index.ts`)

- Add lightweight in-memory LRU cache (Map, max 50, 10-min TTL) keyed by `${language}::${normalizedQuery}` storing retrieved context string.
- Add `shouldUseRAG(q)` — runs RAG only when query length > 8 chars AND matches keywords: `how|what|why|when|where|process|register|eligib|booth|nota|epic|form|vote|polling|election|phase|result`. Otherwise skip embedding/RPC for sub-second latency.
- Strengthen system prompt to enforce structured output:
  ```
  Format every answer as Markdown with these sections (omit empty ones):
  ## Answer
  short 1–2 sentence explanation
  ## Steps
  1. ...
  ## Key points
  - ...
  ## Sources
  - [1] Title
  ```
  Cite `[n]` only when context used. If no context, omit Sources.
- Return retrieved source titles in a custom SSE event so the UI can render the Sources panel even before the model finishes — actually simpler: prepend a single non-streamed SSE line `data: {"sources":[...]}\n\n` before piping the upstream stream. Frontend will parse it.

## 2. Chat UI (`src/pages/Chat.tsx`)

- Add 3 Quick Action buttons above the input (visible always): "Check Eligibility", "Find Polling Booth", "Election Timeline" — each calls `send(prefilledText)`.
- Parse the leading `{"sources":[...]}` SSE frame; store on the assistant message as `sources?: {title:string,source?:string}[]`.
- Render a compact "Sources" footer below assistant markdown (small chips with title, link icon if `source` is URL).
- Replace the current spinner-while-empty with a 3-dot typing animation (pure CSS, inline).
- Keep all existing styles, gradient, layout, suggestions grid (suggestions only render when `messages.length===0`; quick actions render always).

## 3. Timeline (`src/pages/Timeline.tsx`)

- For each election with `status==='ongoing'`, find the active phase: the phase with the latest `date <= today` (or first upcoming phase if none past). Mark it visually:
  - Add a small `Live Phase` badge next to the election title with a pulsing dot.
  - In the phases chip row, the active phase chip gets `bg-primary/15 text-primary border border-primary/30` and a `● Live` prefix.
- No data-shape changes, no new fetches.

## Files modified

```text
supabase/functions/chat/index.ts
src/pages/Chat.tsx
src/pages/Timeline.tsx
```

## Out of scope

- No new tables / migrations / edge functions.
- No changes to BoothFinder, Journey, Quiz, layout, auth, header, or design tokens.
- Voice input button stays as-is.
