import type { AbsolutePathBuf } from "../AbsolutePathBuf.js";
export type CommandAction = {
    "type": "read";
    command: string;
    name: string;
    path: AbsolutePathBuf;
} | {
    "type": "listFiles";
    command: string;
    path: string | null;
} | {
    "type": "search";
    command: string;
    query: string | null;
    path: string | null;
} | {
    "type": "unknown";
    command: string;
};
//# sourceMappingURL=CommandAction.d.ts.map