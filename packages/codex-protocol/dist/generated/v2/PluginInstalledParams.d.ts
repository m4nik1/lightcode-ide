import type { AbsolutePathBuf } from "../AbsolutePathBuf.js";
export type PluginInstalledParams = {
    /**
     * Optional working directories used to discover repo marketplaces.
     */
    cwds?: Array<AbsolutePathBuf> | null;
    /**
     * Additional uninstalled plugin names that should be returned when present locally.
     * This is used by mention surfaces that intentionally expose install entrypoints.
     */
    installSuggestionPluginNames?: Array<string> | null;
};
//# sourceMappingURL=PluginInstalledParams.d.ts.map