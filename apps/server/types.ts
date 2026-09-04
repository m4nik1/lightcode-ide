import { FileFinder } from "@ff-labs/fff-node";

export interface fileItem {
  relativePath: string;
  fileName: string;
}

export interface fffInstance {
  [key: string] : FileFinder
}
