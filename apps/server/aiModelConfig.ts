export const AI_MODEL_IDS = [
  "gpt-5.5",
  "gpt-5.6-sol",
  "gpt-5.6-terra",
  "gpt-5.6-luna"
] as const;

export type AIModelId = (typeof AI_MODEL_IDS)[number];

export const REASONING_EFFORTS = ["low", "medium", "high"] as const;

export type AIReasoningEffort = (typeof REASONING_EFFORTS)[number];
