/**
 * Client-declared capabilities negotiated during initialize.
 */
export type InitializeCapabilities = {
    /**
     * Opt into receiving experimental API methods and fields.
     */
    experimentalApi: boolean;
    /**
     * Opt into `attestation/generate` requests for upstream `x-oai-attestation`.
     */
    requestAttestation: boolean;
    /**
     * Exact notification method names that should be suppressed for this
     * connection (for example `thread/started`).
     */
    optOutNotificationMethods?: Array<string> | null;
};
//# sourceMappingURL=InitializeCapabilities.d.ts.map