import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DocInput {
  title: string;
  source?: string;
  category?: string;
  language?: "en" | "hi" | "te";
  content: string;
}

function chunkText(text: string, maxLen = 900, overlap = 120): string[] {
  const clean = text.replace(/\s+\n/g, "\n").trim();
  if (clean.length <= maxLen) return [clean];
  const paragraphs = clean.split(/\n{2,}/);
  const chunks: string[] = [];
  let buf = "";
  for (const p of paragraphs) {
    if ((buf + "\n\n" + p).length > maxLen && buf) {
      chunks.push(buf.trim());
      buf = buf.slice(Math.max(0, buf.length - overlap)) + "\n\n" + p;
    } else {
      buf = buf ? buf + "\n\n" + p : p;
    }
  }
  if (buf.trim()) chunks.push(buf.trim());
  // Hard-split any oversize chunk
  const out: string[] = [];
  for (const c of chunks) {
    if (c.length <= maxLen) { out.push(c); continue; }
    for (let i = 0; i < c.length; i += maxLen - overlap) {
      out.push(c.slice(i, i + maxLen));
    }
  }
  return out;
}

async function embed(input: string[], apiKey: string): Promise<number[][]> {
  const out: number[][] = [];
  // Embed sequentially in small batches to respect rate limits
  for (const text of input) {
    const r = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "google/text-embedding-004", input: text }),
    });
    if (!r.ok) throw new Error(`embed failed ${r.status}: ${await r.text()}`);
    const j = await r.json();
    const v = j?.data?.[0]?.embedding;
    if (!Array.isArray(v)) throw new Error("no embedding returned");
    out.push(v);
  }
  return out;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
    if (!SUPABASE_URL || !SERVICE_KEY || !LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "missing server config" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const userClient = createClient(SUPABASE_URL, SERVICE_KEY, { global: { headers: { Authorization: `Bearer ${token}` } } });
    const { data: userRes, error: userErr } = await userClient.auth.getUser(token);
    if (userErr || !userRes?.user) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: roleCheck } = await admin.rpc("has_role", { _user_id: userRes.user.id, _role: "admin" });
    if (!roleCheck) return new Response(JSON.stringify({ error: "admin role required" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const body = await req.json();
    const docs: DocInput[] = Array.isArray(body?.documents) ? body.documents : [];
    if (docs.length === 0) return new Response(JSON.stringify({ error: "documents[] required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const replace = body?.replace === true;

    if (replace) {
      // Delete in dependency order
      await admin.from("kb_chunks").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await admin.from("kb_documents").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    }

    let totalChunks = 0;
    const results: { title: string; chunks: number }[] = [];

    for (const doc of docs) {
      if (!doc?.title || !doc?.content) continue;
      const { data: insertedDoc, error: docErr } = await admin
        .from("kb_documents")
        .insert({
          title: doc.title,
          source: doc.source ?? null,
          category: doc.category ?? null,
          language: doc.language ?? "en",
        })
        .select("id")
        .single();
      if (docErr || !insertedDoc) throw new Error(`insert doc failed: ${docErr?.message}`);

      const chunks = chunkText(doc.content);
      const embeddings = await embed(chunks, LOVABLE_API_KEY);
      const rows = chunks.map((content, i) => ({
        document_id: insertedDoc.id,
        chunk_index: i,
        content,
        embedding: embeddings[i] as unknown as string, // pg-vector accepts JSON array via supabase-js
        metadata: { title: doc.title, source: doc.source ?? null },
      }));
      const { error: chunkErr } = await admin.from("kb_chunks").insert(rows);
      if (chunkErr) throw new Error(`insert chunks failed: ${chunkErr.message}`);

      totalChunks += chunks.length;
      results.push({ title: doc.title, chunks: chunks.length });
    }

    return new Response(JSON.stringify({ ok: true, totalChunks, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("kb-ingest error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});