---
name: env-doctor
description: Diagnoses why a project will not start. Checks runtime versions, dependencies, environment variables, databases, ports, and build artifacts systematically. Use whenever environment setup, API keys, MCP auth, or config problems are suspected.
triggers:
  - environment issue
  - project won't start
  - env setup
  - missing env
  - runtime version
  - dependency issue
  - port conflict
  - config problem
---

# Env Doctor

## Overview

"It works on my machine" ends here. Runs a systematic health check on any project: verifies runtime versions match requirements, checks for missing or conflicting dependencies, diffs .env against .env.example, checks database/service availability, detects port conflicts, and verifies build artifacts. Reports every issue with the exact command to fix it.

## Diagnostic Checks (in order)

### 1. Runtime Version Check
- Verify Node.js, Python, Go, Ruby, Rust version meets requirements
- Check .nvmrc, .node-version, pyproject.toml, runtime.txt, etc.

### 2. Dependency Audit
- Missing or outdated dependencies
- Conflicting peer dependencies
- Check package.json vs node_modules, requirements.txt vs installed

### 3. Environment Variables
- Diff .env against .env.example
- Check for missing required variables
- Validate format (URLs, keys, ports)
- **Never print secret values**

### 4. Service Availability
- Database reachable? (pg_isready, mysql ping, etc.)
- Docker containers running?
- Redis, Elasticsearch, or other services responsive?

### 5. Port Conflicts
- Check if required ports are already in use
- Identify the process occupying the port

### 6. Build Artifacts
- Do compiled outputs exist?
- Are they stale? (compare mtime with source)
- Check for common build output directories

## Process

1. Ask the user what's wrong or run full diagnostic
2. Run checks in logical order (cascade: runtime → deps → env → services → ports → build)
3. Report all issues found — grouped by severity
4. For each issue, provide the exact command to fix it
5. Never output actual secret values or API keys

## Supported Project Types

- Node.js (package.json, tsconfig, next.config, etc.)
- Python (pyproject.toml, requirements.txt, setup.py)
- Rust (Cargo.toml)
- Go (go.mod)
- Ruby (Gemfile)
- Docker (Dockerfile, docker-compose.yml)
- Monorepos — detect multiple project indicators
