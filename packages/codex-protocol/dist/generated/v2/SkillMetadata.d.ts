import type { AbsolutePathBuf } from "../AbsolutePathBuf.js";
import type { SkillDependencies } from "./SkillDependencies.js";
import type { SkillInterface } from "./SkillInterface.js";
import type { SkillScope } from "./SkillScope.js";
export type SkillMetadata = {
    name: string;
    description: string;
    /**
     * Legacy short_description from SKILL.md. Prefer SKILL.json interface.short_description.
     */
    shortDescription?: string;
    interface?: SkillInterface;
    dependencies?: SkillDependencies;
    path: AbsolutePathBuf;
    scope: SkillScope;
    enabled: boolean;
};
//# sourceMappingURL=SkillMetadata.d.ts.map