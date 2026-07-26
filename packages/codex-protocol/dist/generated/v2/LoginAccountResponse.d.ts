export type LoginAccountResponse = {
    "type": "apiKey";
} | {
    "type": "chatgpt";
    loginId: string;
    /**
     * URL the client should open in a browser to initiate the OAuth flow.
     */
    authUrl: string;
} | {
    "type": "chatgptDeviceCode";
    loginId: string;
    /**
     * URL the client should open in a browser to complete device code authorization.
     */
    verificationUrl: string;
    /**
     * One-time code the user must enter after signing in.
     */
    userCode: string;
} | {
    "type": "chatgptAuthTokens";
};
//# sourceMappingURL=LoginAccountResponse.d.ts.map