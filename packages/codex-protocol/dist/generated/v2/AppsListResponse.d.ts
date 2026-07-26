import type { AppInfo } from "./AppInfo.js";
/**
 * EXPERIMENTAL - app list response.
 */
export type AppsListResponse = {
    data: Array<AppInfo>;
    /**
     * Opaque cursor to pass to the next call to continue after the last item.
     * If None, there are no more items to return.
     */
    nextCursor: string | null;
};
//# sourceMappingURL=AppsListResponse.d.ts.map