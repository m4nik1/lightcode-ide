export type ConfiguredHookHandler = {
    "type": "command";
    command: string;
    commandWindows: string | null;
    timeoutSec: bigint | null;
    async: boolean;
    statusMessage: string | null;
} | {
    "type": "prompt";
} | {
    "type": "agent";
};
//# sourceMappingURL=ConfiguredHookHandler.d.ts.map