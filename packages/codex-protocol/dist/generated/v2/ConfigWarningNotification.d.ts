import type { TextRange } from "./TextRange.js";
export type ConfigWarningNotification = {
    /**
     * Concise summary of the warning.
     */
    summary: string;
    /**
     * Optional extra guidance or error details.
     */
    details: string | null;
    /**
     * Optional path to the config file that triggered the warning.
     */
    path?: string;
    /**
     * Optional range for the error location inside the config file.
     */
    range?: TextRange;
};
//# sourceMappingURL=ConfigWarningNotification.d.ts.map