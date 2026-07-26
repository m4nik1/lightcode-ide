export type AskForApproval = "untrusted" | "on-failure" | "on-request" | {
    "granular": {
        sandbox_approval: boolean;
        rules: boolean;
        skill_approval: boolean;
        request_permissions: boolean;
        mcp_elicitations: boolean;
    };
} | "never";
//# sourceMappingURL=AskForApproval.d.ts.map