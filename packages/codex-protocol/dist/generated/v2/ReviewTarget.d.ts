export type ReviewTarget = {
    "type": "uncommittedChanges";
} | {
    "type": "baseBranch";
    branch: string;
} | {
    "type": "commit";
    sha: string;
    /**
     * Optional human-readable label (e.g., commit subject) for UIs.
     */
    title: string | null;
} | {
    "type": "custom";
    instructions: string;
};
//# sourceMappingURL=ReviewTarget.d.ts.map