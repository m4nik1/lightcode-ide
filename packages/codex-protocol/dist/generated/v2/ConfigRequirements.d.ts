import type { WebSearchMode } from "../WebSearchMode.js";
import type { AskForApproval } from "./AskForApproval.js";
import type { ComputerUseRequirements } from "./ComputerUseRequirements.js";
import type { ResidencyRequirement } from "./ResidencyRequirement.js";
import type { SandboxMode } from "./SandboxMode.js";
import type { WindowsSandboxSetupMode } from "./WindowsSandboxSetupMode.js";
export type ConfigRequirements = {
    allowedApprovalPolicies: Array<AskForApproval> | null;
    allowedSandboxModes: Array<SandboxMode> | null;
    allowedWindowsSandboxImplementations: Array<WindowsSandboxSetupMode> | null;
    allowedPermissionProfiles: {
        [key in string]?: boolean;
    } | null;
    defaultPermissions: string | null;
    allowedWebSearchModes: Array<WebSearchMode> | null;
    allowManagedHooksOnly: boolean | null;
    allowAppshots: boolean | null;
    allowRemoteControl: boolean | null;
    computerUse: ComputerUseRequirements | null;
    featureRequirements: {
        [key in string]?: boolean;
    } | null;
    enforceResidency: ResidencyRequirement | null;
};
//# sourceMappingURL=ConfigRequirements.d.ts.map