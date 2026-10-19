---
name: code-reviewer
description: Runs a structured code review on changes for bugs, security vulnerabilities, logic errors, performance issues, and style violations. Findings organized by severity with suggested fixes. Use before finalizing meaningful code changes.
triggers:
  - review code
  - code review
  - review changes
  - review pull request
  - check for bugs
  - security review
---

# Code Reviewer

## Overview

Review code changes critically, catch regressions, quality issues, and weak design/engineering choices. Findings are organized by severity: Critical, Warning, and Suggestion. Each finding includes the file, line number, description, and concrete fix.

## What to Review

1. **Logic bugs** — off-by-one errors, wrong operators, incorrect assumptions
2. **Security vulnerabilities** — SQL injection, XSS, hardcoded secrets, auth bypasses
3. **Performance issues** — unnecessary re-renders, large bundles, O(n²) algorithms
4. **Edge cases** — empty states, null/undefined, error paths, boundary conditions
5. **Style and maintainability** — follows project conventions, readable, well-structured

## Review Process

1. **Read the diff** — understand what changed and why
2. **Identify hot spots** — complex logic, new dependencies, security-sensitive code
3. **Check each dimension** — logic, security, performance, edge cases, style
4. **Organize findings** — Critical → Warning → Suggestion (Nitpick/Optional)
5. **Provide fixes** — each finding includes file, line, explanation, and code fix
6. **Follow project style** — match existing codebase patterns, don't suggest subjective changes

## Severity Levels

- **Critical** — must fix before merge (bug, security hole, data loss)
- **Warning** — should fix (performance issue, missing edge case, maintainability)
- **Suggestion** — nice to have (minor refactor, naming, readability)

## Best Practices

- Follow the established style and patterns of the existing codebase
- Each finding includes file name, line number, explanation, and fenced code block fix
- Respect change sizing (~100 lines per review batch)
- Be precise and actionable — avoid vague criticism
