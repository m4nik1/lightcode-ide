import type { AbsolutePathBuf } from "../AbsolutePathBuf.js";
import type { PluginListMarketplaceKind } from "./PluginListMarketplaceKind.js";
export type PluginListParams = {
    /**
     * Optional working directories used to discover repo marketplaces. When omitted,
     * only home-scoped marketplaces and the official curated marketplace are considered.
     */
    cwds?: Array<AbsolutePathBuf> | null;
    /**
     * Optional marketplace kind filter. When omitted, only local marketplaces are queried, plus
     * the default remote catalog when enabled by feature flag.
     */
    marketplaceKinds?: Array<PluginListMarketplaceKind> | null;
};
//# sourceMappingURL=PluginListParams.d.ts.map