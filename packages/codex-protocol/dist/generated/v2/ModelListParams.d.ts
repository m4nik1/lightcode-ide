export type ModelListParams = {
    /**
     * Opaque pagination cursor returned by a previous call.
     */
    cursor?: string | null;
    /**
     * Optional page size; defaults to a reasonable server-side value.
     */
    limit?: number | null;
    /**
     * When true, include models that are hidden from the default picker list.
     */
    includeHidden?: boolean | null;
};
//# sourceMappingURL=ModelListParams.d.ts.map