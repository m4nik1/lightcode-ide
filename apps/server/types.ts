import { FileFinder } from "@ff-labs/fff-node";
import { CodexAppServerClient } from "../../packages/codex-protocol/dist/client.js";

export interface fileItem {
  relativePath: string;
  fileName: string;
}

export interface fffInstance {
  [key: string] : FileFinder
}

export type lightHarness = CodexAppServerClient | null;
