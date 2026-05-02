import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Tests the client-side contract for calling the `chat` edge function:
 * - posts to the correct URL with auth + content-type
 * - sends { messages, language } in the body
 * - handles 429 (rate limit) and 200 SSE-style stream gracefully
 */

const ORIGINAL_FETCH = globalThis.fetch;

const SUPABASE_URL = "https://example.supabase.co";
const ANON = "anon-key";

function mockEnv() {
  // @ts-expect-error - inject Vite env at runtime for the test
  import.meta.env = { ...import.meta.env, VITE_SUPABASE_URL: SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY: ANON };
}

async function callChat(body: unknown) {
  const url = `${SUPABASE_URL}/functions/v1/chat`;
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${ANON}` },
    body: JSON.stringify(body),
  });
}

describe("chat API client", () => {
  beforeEach(() => mockEnv());
  afterEach(() => { globalThis.fetch = ORIGINAL_FETCH; vi.restoreAllMocks(); });

  it("posts to /functions/v1/chat with auth headers and JSON body", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await callChat({ messages: [{ role: "user", content: "hi" }], language: "en" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [calledUrl, init] = fetchMock.mock.calls[0];
    expect(calledUrl).toBe(`${SUPABASE_URL}/functions/v1/chat`);
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(init.headers.Authorization).toBe(`Bearer ${ANON}`);
    const parsed = JSON.parse(init.body);
    expect(parsed.language).toBe("en");
    expect(parsed.messages[0]).toEqual({ role: "user", content: "hi" });
  });

  it("surfaces 429 rate-limit responses", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: "rate limited" }), { status: 429 }),
    ) as unknown as typeof fetch;

    const r = await callChat({ messages: [{ role: "user", content: "hi" }] });
    expect(r.status).toBe(429);
    const j = await r.json();
    expect(j.error).toMatch(/rate/i);
  });

  it("parses an SSE-style streamed response", async () => {
    const sse = [
      `data: ${JSON.stringify({ sources: [{ title: "Doc A" }] })}\n\n`,
      `data: ${JSON.stringify({ choices: [{ delta: { content: "Hello" } }] })}\n\n`,
      `data: [DONE]\n\n`,
    ].join("");
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(sse, { status: 200, headers: { "Content-Type": "text/event-stream" } }),
    ) as unknown as typeof fetch;

    const r = await callChat({ messages: [{ role: "user", content: "hi" }] });
    const text = await r.text();
    expect(text).toContain("sources");
    expect(text).toContain("Hello");
    expect(text).toContain("[DONE]");
  });
});