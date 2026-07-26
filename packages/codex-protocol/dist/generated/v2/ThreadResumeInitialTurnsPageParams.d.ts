import type { SortDirection } from "./SortDirection.js";
import type { TurnItemsView } from "./TurnItemsView.js";
export type ThreadResumeInitialTurnsPageParams = {
    /**
     * Optional turn page size.
     */
    limit?: number | null;
    /**
     * Optional turn pagination direction; defaults to descending.
     */
    sortDirection?: SortDirection | null;
    /**
     * How much item detail to include for each returned turn; defaults to summary.
     */
    itemsView?: TurnItemsView | null;
};
//# sourceMappingURL=ThreadResumeInitialTurnsPageParams.d.ts.map