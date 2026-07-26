export type LoginAccountParams = {
    "type": "apiKey";
    apiKey: string;
} | {
    "type": "chatgpt";
    codexStreamlinedLogin?: boolean;
} | {
    "type": "chatgptDeviceCode";
} | {
    "type": "chatgptAuthTokens";
    /**
     * Access token (JWT) supplied by the client.
     * This token is used for backend API requests and email extraction.
     */
    accessToken: string;
    /**
     * Workspace/account identifier supplied by the client.
     */
    chatgptAccountId: string;
    /**
     * Optional plan type supplied by the client.
     *
     * When `null`, Codex attempts to derive the plan type from access-token
     * claims. If unavailable, the plan defaults to `unknown`.
     */
    chatgptPlanType?: string | null;
};
//# sourceMappingURL=LoginAccountParams.d.ts.map