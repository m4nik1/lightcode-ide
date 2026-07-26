export type ThreadMetadataGitInfoUpdateParams = {
    /**
     * Omit to leave the stored commit unchanged, set to `null` to clear it,
     * or provide a non-empty string to replace it.
     */
    sha?: string | null;
    /**
     * Omit to leave the stored branch unchanged, set to `null` to clear it,
     * or provide a non-empty string to replace it.
     */
    branch?: string | null;
    /**
     * Omit to leave the stored origin URL unchanged, set to `null` to clear it,
     * or provide a non-empty string to replace it.
     */
    originUrl?: string | null;
};
//# sourceMappingURL=ThreadMetadataGitInfoUpdateParams.d.ts.map