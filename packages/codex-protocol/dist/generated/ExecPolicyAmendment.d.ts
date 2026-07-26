/**
 * Proposed execpolicy change to allow commands starting with this prefix.
 *
 * The `command` tokens form the prefix that would be added as an execpolicy
 * `prefix_rule(..., decision="allow")`, letting the agent bypass approval for
 * commands that start with this token sequence.
 */
export type ExecPolicyAmendment = Array<string>;
//# sourceMappingURL=ExecPolicyAmendment.d.ts.map