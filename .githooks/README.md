# Git hooks

Shared hooks, versioned so everyone on the team runs the same ones.

## Enable them (once per clone)

```sh
git config core.hooksPath .githooks
```

Without this, git looks in `.git/hooks`, which is not versioned, and the
protections below do nothing.

## What `pre-push` refuses

| Situation                                | Why                                                 |
| ---------------------------------------- | --------------------------------------------------- |
| A push that would rewrite remote history | It discards commits a teammate may be working from  |
| A push straight to `main` or `master`    | Changes belong in a pull request                    |
| Deleting a remote branch                 | Too easy to do by accident; do it on GitHub instead |

Force is **not** read from the command line — git does not pass the flag to a
hook. It is detected from the refs: if what is already on the remote is not an
ancestor of what is being pushed, commits would be lost. That catches
`--force` and `--force-with-lease` alike, including a rebase or an amend that
has already been pushed.

## When a force really is needed

```sh
ALLOW_FORCE_PUSH=1 git push ...
```

Typing that is the point: it cannot happen by reflex or by a tool running
`git push --force` on your behalf.

## This is the local half only

A hook lives on your machine and can be skipped with `--no-verify`. For a
guarantee, set **branch protection** on GitHub for `main`:

- Require a pull request before merging
- Block force pushes
- Block deletions

Settings → Branches → Add branch ruleset. The hook catches mistakes early; the
ruleset is what actually holds.
