export type GetAccountParams = {
    /**
     * When `true`, requests a proactive token refresh before returning.
     *
     * In managed auth mode this triggers the normal refresh-token flow. In
     * external auth mode this flag is ignored. Clients should refresh tokens
     * themselves and call `account/login/start` with `chatgptAuthTokens`.
     */
    refreshToken?: boolean;
};
//# sourceMappingURL=GetAccountParams.d.ts.map