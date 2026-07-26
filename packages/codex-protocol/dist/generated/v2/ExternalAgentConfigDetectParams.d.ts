export type ExternalAgentConfigDetectParams = {
    /**
     * If true, include detection under the user's home (~/.claude, ~/.codex, etc.).
     */
    includeHome?: boolean;
    /**
     * Zero or more working directories to include for repo-scoped detection.
     */
    cwds?: Array<string> | null;
};
//# sourceMappingURL=ExternalAgentConfigDetectParams.d.ts.map