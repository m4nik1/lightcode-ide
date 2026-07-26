import type { ChatgptAuthTokensRefreshReason } from "./ChatgptAuthTokensRefreshReason.js";
export type ChatgptAuthTokensRefreshParams = {
    reason: ChatgptAuthTokensRefreshReason;
    /**
     * Workspace/account identifier that Codex was previously using.
     *
     * Clients that manage multiple accounts/workspaces can use this as a hint
     * to refresh the token for the correct workspace.
     *
     * This may be `null` when the prior auth state did not include a workspace
     * identifier (`chatgpt_account_id`).
     */
    previousAccountId?: string | null;
};
//# sourceMappingURL=ChatgptAuthTokensRefreshParams.d.ts.map