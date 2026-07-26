/**
 * Notification emitted when watched local skill files change.
 *
 * Treat this as an invalidation signal and re-run `skills/list` with the
 * client's current parameters when refreshed skill metadata is needed.
 */
export type SkillsChangedNotification = Record<string, never>;
//# sourceMappingURL=SkillsChangedNotification.d.ts.map