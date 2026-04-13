import type { AIProvider, AIRequest, AIResponse } from './types';

// ─── Believable generated content banks ──────────────────────────────────

const SUMMARIES = [
  'This block covers key metrics and trends observed over the recent reporting period. The data indicates steady growth with notable inflection points in the middle quarters. Actionable next steps include reviewing resource allocation and adjusting forecasting models accordingly.',
  'Analysis of the content reveals three primary themes: operational efficiency, stakeholder alignment, and near-term risk mitigation. The author recommends prioritising the second theme given current market conditions.',
  'The text outlines a comprehensive strategy for scaling the platform. Core pillars include infrastructure investment, developer experience improvements, and a phased go-to-market approach targeting enterprise segments first.',
  'Key findings suggest the current approach is performing above baseline expectations. However, there are identified gaps in monitoring coverage and incident response workflows that should be addressed in the next sprint.',
];

const TITLES = [
  'Executive Summary — Q2 Review',
  'Platform Growth Analysis',
  'Operational Health Update',
  'Strategic Initiative Briefing',
  'Weekly Performance Digest',
  'Risk Assessment Overview',
];

const REWRITES = [
  'Revised for clarity: The initiative is progressing on schedule. Cross-functional alignment has been confirmed with all stakeholders. The primary risk remains capacity constraints, which the team is actively mitigating through phased rollout planning.',
  'Improved version: Initial results are promising and tracking ahead of projections. The team has identified three optimisation opportunities that could accelerate delivery by approximately two weeks without compromising quality.',
  'Rewritten for conciseness: Core metrics are healthy. Outstanding items include finalising the data migration plan and completing the security review — both are expected to resolve by end of month.',
];

// ─── Failure simulation (10% of the time) ───────────────────────────────

const FAILURE_RATE = 0.1;

function maybeFailure(): boolean {
  return Math.random() < FAILURE_RATE;
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Latency simulation ──────────────────────────────────────────────────

function simulateLatency(min = 900, max = 2200): Promise<void> {
  const ms = min + Math.random() * (max - min);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Mock Provider ───────────────────────────────────────────────────────

/**
 * MockAIProvider satisfies the AIProvider interface.
 * To replace with a real API:
 *   1. Create `realProvider.ts` implementing the same AIProvider interface.
 *   2. In aiService.ts, swap `new MockAIProvider()` for `new RealAIProvider(config)`.
 *   3. Delete this file. Zero other changes required.
 */
export class MockAIProvider implements AIProvider {
  async run(request: AIRequest): Promise<AIResponse> {
    await simulateLatency();

    if (maybeFailure()) {
      return {
        success: false,
        error: 'AI generation failed. The model returned an unexpected response. Please retry.',
      };
    }

    switch (request.action) {
      case 'summarize':
        return { success: true, content: randomFrom(SUMMARIES) };

      case 'generate_title':
        return { success: true, content: randomFrom(TITLES) };

      case 'rewrite':
        return { success: true, content: randomFrom(REWRITES) };

      default:
        return { success: false, error: 'Unknown action type.' };
    }
  }
}
