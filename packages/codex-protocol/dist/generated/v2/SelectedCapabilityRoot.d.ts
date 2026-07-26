import type { CapabilityRootLocation } from "./CapabilityRootLocation.js";
/**
 * A user-selected root that can expose one or more runtime capabilities.
 */
export type SelectedCapabilityRoot = {
    /**
     * Stable identifier supplied by the capability selection platform.
     */
    id: string;
    /**
     * Where the selected root can be resolved.
     */
    location: CapabilityRootLocation;
};
//# sourceMappingURL=SelectedCapabilityRoot.d.ts.map