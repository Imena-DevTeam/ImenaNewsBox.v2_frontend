# Contributing

## Branches

| Branch        | Purpose                                   |
| ------------- | ----------------------------------------- |
| `main`        | Protected. Always deployable.             |
| `feature/*`   | New work — one phase task per branch.     |
| `fix/*`       | Bug fixes.                                |
| `chore/*`     | Tooling, dependencies, configuration.     |

Direct pushes and force pushes to `main` are disabled. Every change reaches
`main` through a reviewed pull request.

## Commits

Use Conventional Commits:

```
feat(blogs): add PostCard component
fix(auth): keep the OTP timer running across re-renders
chore(deps): bump next to 15.5.27
```

## Before opening a pull request

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Review

One approving review is required. The reviewer checks that the change follows
the folder rules in the Project Structure document, uses design tokens rather
than arbitrary values, and stays inside the scope of its phase task.
