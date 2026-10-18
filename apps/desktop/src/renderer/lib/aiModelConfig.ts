export const AI_MODEL_IDS = [
  "gpt-5.5",
  "gpt-6.1-sol",
] as const;

export type AIModelId = (typeof AI_MODEL_IDS)[number];

export const REASONING_EFFORTS = ["low", "medium", "high"] as const;

export type AIReasoningEffort = (typeof REASONING_EFFORTS)[number];
