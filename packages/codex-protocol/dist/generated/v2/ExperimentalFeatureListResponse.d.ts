import type { ExperimentalFeature } from "./ExperimentalFeature.js";
export type ExperimentalFeatureListResponse = {
    data: Array<ExperimentalFeature>;
    /**
     * Opaque cursor to pass to the next call to continue after the last item.
     * If None, there are no more items to return.
     */
    nextCursor: string | null;
};
//# sourceMappingURL=ExperimentalFeatureListResponse.d.ts.map