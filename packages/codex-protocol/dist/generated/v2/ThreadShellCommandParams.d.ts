export type ThreadShellCommandParams = {
    threadId: string;
    /**
     * Shell command string evaluated by the thread's configured shell.
     * Unlike `command/exec`, this intentionally preserves shell syntax
     * such as pipes, redirects, and quoting. This runs unsandboxed with full
     * access rather than inheriting the thread sandbox policy.
     */
    command: string;
};
//# sourceMappingURL=ThreadShellCommandParams.d.ts.map