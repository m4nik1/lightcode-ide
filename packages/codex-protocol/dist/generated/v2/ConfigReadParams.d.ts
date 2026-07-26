export type ConfigReadParams = {
    includeLayers?: boolean;
    /**
     * Optional working directory to resolve project config layers. If specified,
     * return the effective config as seen from that directory (i.e., including any
     * project layers between `cwd` and the project/repo root).
     */
    cwd?: string | null;
};
//# sourceMappingURL=ConfigReadParams.d.ts.map