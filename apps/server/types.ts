import { FileFinder } from "@ff-labs/fff-node";
import codexDriver from "./codexDriver.ts";
import claudeDriver from "./claudeDriver.ts";

export interface fileItem {
  relativePath: string;
  fileName: string;
}

export interface fffInstance {
  [key: string] : FileFinder
}

export type lightHarness = {
  codex: codexDriver;
  claude: claudeDriver;
};
