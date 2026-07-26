/**
 * A directory entry returned by `fs/readDirectory`.
 */
export type FsReadDirectoryEntry = {
    /**
     * Direct child entry name only, not an absolute or relative path.
     */
    fileName: string;
    /**
     * Whether this entry resolves to a directory.
     */
    isDirectory: boolean;
    /**
     * Whether this entry resolves to a regular file.
     */
    isFile: boolean;
};
//# sourceMappingURL=FsReadDirectoryEntry.d.ts.map