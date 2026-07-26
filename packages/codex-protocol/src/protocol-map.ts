import type { ClientRequest } from "./generated/ClientRequest.js";
import type { InitializeResponse } from "./generated/InitializeResponse.js";
import type { ThreadResumeResponse } from "./generated/v2/ThreadResumeResponse.js";
import type { ThreadStartResponse } from "./generated/v2/ThreadStartResponse.js";
import type { TurnInterruptResponse } from "./generated/v2/TurnInterruptResponse.js";
import type { TurnStartResponse } from "./generated/v2/TurnStartResponse.js";

export interface CoreMethodResults {
  initialize: InitializeResponse;
  "thread/start": ThreadStartResponse;
  "thread/resume": ThreadResumeResponse;
  "turn/start": TurnStartResponse;
  "turn/interrupt": TurnInterruptResponse;
}

export type CoreMethod = keyof CoreMethodResults;

export type RequestFor<M extends ClientRequest["method"]> = Extract<
  ClientRequest,
  { method: M }
>;

export type ParamsFor<M extends ClientRequest["method"]> =
  RequestFor<M> extends { params: infer Params } ? Params : never;
