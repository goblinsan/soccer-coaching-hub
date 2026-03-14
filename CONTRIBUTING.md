# Contributing to Soccer Coaching Hub

Thank you for contributing! Please follow these guidelines to keep the codebase consistent and maintainable.

## Table of Contents

- [Code Style](#code-style)
- [TypeScript Guidelines](#typescript-guidelines)
- [Code Complexity](#code-complexity)
- [Running Quality Checks](#running-quality-checks)
- [Pull Request Process](#pull-request-process)

---

## Code Style

This project uses **Prettier** for automatic code formatting and **ESLint** for static analysis.

### Formatting (Prettier)

- **Single quotes** for strings
- **2-space indentation** (no tabs)
- **100-character line width** (hard wrap)
- **Trailing commas** in multi-line structures
- **Semicolons** at end of statements
- **LF** line endings

Run the formatter before committing:

```bash
npm run format
```

Check formatting without modifying files:

```bash
npm run format:check
```

---

## TypeScript Guidelines

- **Strict mode** is enabled – avoid `any`, prefer explicit types.
- Use **`const`** by default; only use `let` when reassignment is necessary. Never use `var`.
- Use **`===`** (strict equality) instead of `==`.
- Prefer **named exports** over default exports for better refactoring support.
- Use **`type` imports** (`import type { Foo } from './foo'`) when importing types only.
- Avoid unused variables; prefix intentionally unused parameters with `_` (e.g., `_event`).
- Provide explicit **return types** on all exported functions.

### DRY Principles

- Extract repeated logic into shared utilities under `src/utils/`.
- Avoid duplicating constants – define them once and import where needed.
- Prefer composition over inheritance.

---

## Code Complexity

To keep functions readable and testable, ESLint enforces the following limits:

| Rule                                       | Limit     | Severity |
| ------------------------------------------ | --------- | -------- |
| Cyclomatic complexity per function         | 10        | Error    |
| Maximum nesting depth                      | 4         | Error    |
| Lines per function (excl. blanks/comments) | 50        | Warning  |
| Function parameters                        | 5         | Warning  |
| Line length                                | 100 chars | Warning  |

If a function exceeds these limits, refactor it:

- Break large functions into smaller, single-responsibility helpers.
- Replace deeply nested conditions with early returns (guard clauses).
- Group related parameters into an options object.

---

## Running Quality Checks

```bash
# Full CI check (format + lint + build + test)
npm run ci

# Individual steps
npm run format:check   # Verify Prettier formatting
npm run lint           # Run ESLint
npm run build          # Compile TypeScript
npm test               # Run tests
```

All checks must pass before a pull request can be merged.

---

## Pull Request Process

1. Create a feature branch from `main`: `git checkout -b feat/your-feature`.
2. Write code that satisfies the quality gates above.
3. Run `npm run ci` locally to confirm everything passes.
4. Open a pull request against `main` – the CI pipeline will run automatically.
5. Obtain at least one approving review before merging.
