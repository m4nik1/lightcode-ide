export type ThreadLoadedListResponse = {
    /**
     * Thread ids for sessions currently loaded in memory.
     */
    data: Array<string>;
    /**
     * Opaque cursor to pass to the next call to continue after the last item.
     * if None, there are no more items to return.
     */
    nextCursor: string | null;
};
//# sourceMappingURL=ThreadLoadedListResponse.d.ts.map