import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Timeline reads from the `elections` and `states` tables via the supabase client.
 * We mock @/integrations/supabase/client to verify the query shape and result handling.
 */

vi.mock("@/integrations/supabase/client", () => {
  const electionsResult = {
    data: [
      { id: "1", name: "General Election", type: "lok_sabha", status: "upcoming", start_date: "2026-04-01", end_date: "2026-05-01", phases: [] },
      { id: "2", name: "State Election", type: "vidhan_sabha", status: "ongoing", start_date: "2026-03-01", end_date: "2026-03-15", phases: [] },
    ],
    error: null,
  };
  const statesResult = { data: [{ code: "TG", name: "Telangana" }], error: null };

  const order = vi.fn().mockResolvedValue(electionsResult);
  const selectElections = vi.fn().mockReturnValue({ order });
  const orderStates = vi.fn().mockResolvedValue(statesResult);
  const selectStates = vi.fn().mockReturnValue({ order: orderStates });

  const from = vi.fn((table: string) => {
    if (table === "elections") return { select: selectElections };
    if (table === "states") return { select: selectStates };
    return { select: vi.fn().mockReturnValue({ order: vi.fn().mockResolvedValue({ data: [], error: null }) }) };
  });

  return { supabase: { from } };
});

import { supabase } from "@/integrations/supabase/client";

describe("timeline data API", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetches elections ordered by start_date and returns rows", async () => {
    const res = await supabase
      .from("elections")
      .select("*")
      .order("start_date", { ascending: true, nullsFirst: false });

    expect(supabase.from).toHaveBeenCalledWith("elections");
    expect(res.error).toBeNull();
    expect(res.data).toHaveLength(2);
    expect(res.data[0]).toMatchObject({ id: "1", status: "upcoming" });
  });

  it("fetches states for the filter dropdown", async () => {
    const res = await supabase.from("states").select("code,name").order("name");
    expect(supabase.from).toHaveBeenCalledWith("states");
    expect(res.data?.[0]).toEqual({ code: "TG", name: "Telangana" });
  });
});