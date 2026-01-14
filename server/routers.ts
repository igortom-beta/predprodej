import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  ai: router({
    chat: publicProcedure
      .input(z.object({
        messages: z.array(z.object({
          role: z.enum(['user', 'assistant']),
          content: z.string(),
        })),
        language: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const exchangeRate = await getExchangeRate();
        
        const systemPrompt = `You are a friendly and professional assistant for renting modern bungalows in Lojzovy Paseky, Lipno.

Property Information:
- Location: Lojzovy Paseky, Lipno nad Vltavou, Czech Republic
- Type: Modern bungalows
- Rental: Long-term and short-term available
- Target audience: Families with children, digital nomads, investors

Pricing:
- Base rent: 24,000 CZK/month
- Security deposit: 2 months rent (48,000 CZK)
- Current exchange rate: 1 CZK = ${exchangeRate} EUR

Instructions:
1. Communicate in the user's language (detect from conversation)
2. When asked about price, calculate rent and deposit
3. Provide EUR conversion using current CNB exchange rate
4. Always be professional, friendly, and sales-oriented
5. Offer booking and owner contact information
6. Support languages: Czech, German, English, Croatian, Italian, French, Spanish`;

        const response = await invokeLLM({
          messages: [
            { role: 'system', content: systemPrompt },
            ...(input.messages as Array<{ role: 'user' | 'assistant' | 'system'; content: string }>),
          ],
        });

        const assistantMessage = typeof response.choices[0]?.message?.content === 'string' 
          ? response.choices[0].message.content 
          : '';
        
        return {
          message: assistantMessage,
          exchangeRate,
        };
      }),

    getExchangeRate: publicProcedure
      .query(async () => {
        const rate = await getExchangeRate();
        return { rate };
      }),
  }),

});

// Helper function to fetch exchange rate from Czech National Bank
async function getExchangeRate(): Promise<number> {
  try {
    const response = await fetch('https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt');
    const text = await response.text();
    
    // Parse the CNB format: "27 Jan 2026 #1"
    const lines = text.split('\n');
    for (const line of lines) {
      if (line.includes('EUR')) {
        // Format: "Country|Currency|Amount|Code|Rate"
        const parts = line.split('|');
        if (parts[3] === 'EUR') {
          return parseFloat(parts[4]);
        }
      }
    }
    // Fallback rate if parsing fails
    return 24.5;
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
    // Return a reasonable fallback
    return 24.5;
  }
}

export type AppRouter = typeof appRouter;
