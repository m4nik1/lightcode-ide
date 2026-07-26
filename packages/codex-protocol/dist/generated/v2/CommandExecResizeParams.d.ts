import type { CommandExecTerminalSize } from "./CommandExecTerminalSize.js";
/**
 * Resize a running PTY-backed `command/exec` session.
 */
export type CommandExecResizeParams = {
    /**
     * Client-supplied, connection-scoped `processId` from the original
     * `command/exec` request.
     */
    processId: string;
    /**
     * New PTY size in character cells.
     */
    size: CommandExecTerminalSize;
};
//# sourceMappingURL=CommandExecResizeParams.d.ts.map