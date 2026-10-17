export const AI_MODEL_IDS = [
  'gpt-6-astra',
  "gpt-6.1-sol",
  "gpt-6-luna",
] as const;

export type AIModelId = (typeof AI_MODEL_IDS)[number];

export const REASONING_EFFORTS = ["low", "medium", "high"] as const;

export type AIReasoningEffort = (typeof REASONING_EFFORTS)[number];
