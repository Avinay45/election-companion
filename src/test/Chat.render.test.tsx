import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Stub heavy / context-coupled deps so the page renders in isolation.
vi.mock("@/contexts/LanguageContext", () => ({
  useLang: () => ({ lang: "en", setLang: () => {} }),
}));
vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    { get: () => (props: any) => <div {...props}>{props.children}</div> },
  ),
}));
vi.mock("react-markdown", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("remark-gfm", () => ({ default: () => null }));

import Chat from "@/pages/Chat";

describe("Chat page", () => {
  it("renders the empty state with quick actions and the input", () => {
    render(<Chat />);
    // Quick action labels
    expect(screen.getByText(/Check Eligibility/i)).toBeInTheDocument();
    expect(screen.getByText(/Find Polling Booth/i)).toBeInTheDocument();
    expect(screen.getByText(/Election Timeline/i)).toBeInTheDocument();
    // Composer
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});