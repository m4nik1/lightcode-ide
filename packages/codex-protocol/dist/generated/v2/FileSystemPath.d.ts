import type { AbsolutePathBuf } from "../AbsolutePathBuf.js";
import type { FileSystemSpecialPath } from "./FileSystemSpecialPath.js";
export type FileSystemPath = {
    "type": "path";
    path: AbsolutePathBuf;
} | {
    "type": "glob_pattern";
    pattern: string;
} | {
    "type": "special";
    value: FileSystemSpecialPath;
};
//# sourceMappingURL=FileSystemPath.d.ts.map