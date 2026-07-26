export type ActivePermissionProfile = {
    /**
     * Identifier from `default_permissions` or the implicit built-in default,
     * such as `:workspace` or a user-defined `[permissions.<id>]` profile.
     */
    id: string;
    /**
     * Parent profile identifier from the selected permissions profile's
     * `extends` setting, when present.
     */
    extends: string | null;
};
//# sourceMappingURL=ActivePermissionProfile.d.ts.map