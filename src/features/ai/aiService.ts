import { MockAIProvider } from './mockProvider';
import type { AIProvider, AIRequest, AIResponse } from './types';

// ─── Provider Singleton ──────────────────────────────────────────────────
// To switch to a real API: replace MockAIProvider with RealAIProvider here.
// All callers (hooks, stores) automatically pick up the new provider.

let _provider: AIProvider = new MockAIProvider();

/** Allows injecting a different provider at runtime (useful for tests). */
export function setAIProvider(provider: AIProvider): void {
  _provider = provider;
}

// ─── Public API ──────────────────────────────────────────────────────────

/**
 * Runs an AI operation through the active provider.
 *
 * Real API migration path:
 *   - Create `RealAIProvider` implementing `AIProvider`
 *   - Call `setAIProvider(new RealAIProvider({ apiKey, endpoint }))` at app boot
 *   - This function stays unchanged. All callers are unaffected.
 */
export async function runAIAction(request: AIRequest): Promise<AIResponse> {
  try {
    return await _provider.run(request);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return { success: false, error: `AI service error: ${message}` };
  }
}
