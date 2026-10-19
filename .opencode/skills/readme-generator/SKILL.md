---
name: readme-generator
description: Generates a complete, polished README.md by scanning actual project structure, dependencies, and code. No placeholder text or generic filler. Use when project setup, architecture, or usage changes.
triggers:
  - generate readme
  - update readme
  - create readme
  - documentation
  - project docs
---

# README Generator

## Overview

Generate a complete, well-structured README.md by scanning the actual project. Reads directory structure, package files, configuration, and dependencies to produce a README that reflects what's actually in the repo. No generic boilerplate or placeholder text.

## What It Generates

Only includes sections that apply to the project:

- **Project description** — derived from package.json, pyproject.toml, Cargo.toml, etc.
- **Installation instructions** — from actual setup scripts and dependency files
- **Usage examples** — based on run scripts, CLI entry points, or API endpoints
- **Tech stack overview** — language, framework, key dependencies
- **Environment setup** — from .env.example and configuration files
- **Testing** — only if test suites are detected
- **Deployment** — only if Dockerfiles, CI config, or deploy scripts exist
- **Contribution guidelines** — if CONTRIBUTING.md or similar exists

## Process

1. Scan project structure — detect language, framework, package manager
2. Read config files — package.json, tsconfig, next.config, .env.example, etc.
3. Identify scripts and commands — build, test, dev, deploy
4. Check for CI/CD config — GitHub Actions, Docker, etc.
5. Generate README with only applicable sections
6. Review with user — let them customize descriptions and tone
7. Finalize — clean formatting, consistent style

## Rules

- Never generate placeholder or "TODO" text
- Skip sections that don't apply (testing, deployment, API reference)
- Preserve existing README content when updating
- Derive every line from actual codebase evidence
- Focus on high-signal content: usage examples, setup instructions
