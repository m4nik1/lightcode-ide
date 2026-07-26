import type { PermissionProfileSummary } from "./PermissionProfileSummary.js";
export type PermissionProfileListResponse = {
    data: Array<PermissionProfileSummary>;
    /**
     * Opaque cursor to pass to the next call to continue after the last item.
     * If None, there are no more items to return.
     */
    nextCursor: string | null;
};
//# sourceMappingURL=PermissionProfileListResponse.d.ts.map