import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the LLM function
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(async ({ messages }) => ({
    choices: [{
      message: {
        content: "Vítejte v Lojzových Pasekách! Základní nájem je 24 000 Kč za měsíc. Kauce je 2 měsíční nájmy (48 000 Kč). Aktuální kurz EUR je 24.5 Kč.",
      },
    }],
  })),
}));

// Mock fetch for CNB API
global.fetch = vi.fn(async () => ({
  text: async () => `27 Jan 2026 #1
Country|Currency|Amount|Code|Rate
Austrálie|dolar|1|AUD|15.50
Eurozóna|euro|1|EUR|24.50
Spojené státy|dolar|1|USD|23.00`,
})) as any;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("ai.chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should accept chat messages and return AI response", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.ai.chat({
      messages: [
        { role: "user", content: "Jaká je cena pronájmu?" },
      ],
      language: "cs",
    });

    expect(result).toBeDefined();
    expect(result.message).toBeDefined();
    expect(result.exchangeRate).toBeDefined();
    expect(result.exchangeRate).toBeGreaterThan(0);
  });

  it("should detect language and include it in context", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.ai.chat({
      messages: [
        { role: "user", content: "Wie viel kostet die Miete?" },
      ],
    });

    expect(result).toBeDefined();
    expect(result.message).toContain("Kč");
  });

  it("should fetch current exchange rate from CNB", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.ai.getExchangeRate();

    expect(result.rate).toBeDefined();
    expect(result.rate).toBeGreaterThan(0);
    expect(result.rate).toBe(24.5);
  });

  it("should handle multiple messages in conversation", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.ai.chat({
      messages: [
        { role: "user", content: "Ahoj" },
        { role: "assistant", content: "Vítejte v Lojzových Pasekách!" },
        { role: "user", content: "Kolik stojí nájem na 3 měsíce?" },
      ],
    });

    expect(result).toBeDefined();
    expect(result.message).toBeDefined();
    expect(result.exchangeRate).toBeDefined();
  });

  it("should return fallback exchange rate on fetch error", async () => {
    // Mock fetch to throw error
    global.fetch = vi.fn(async () => {
      throw new Error("Network error");
    }) as any;

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.ai.getExchangeRate();

    expect(result.rate).toBe(24.5); // Fallback rate
  });

  it("should include rental calculation info in system prompt", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.ai.chat({
      messages: [
        { role: "user", content: "Jaká je kauce?" },
      ],
    });

    expect(result.message).toBeDefined();
    // The response should contain information about deposit
    expect(result.message.toLowerCase()).toContain("kč");
  });
});
