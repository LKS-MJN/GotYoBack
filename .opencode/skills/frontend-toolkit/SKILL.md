---
name: frontend-toolkit
description: Best practices for Next.js 16 + Tailwind CSS v4 + Framer Motion projects with custom design systems. Use when building UI components, pages, or sections in this project.
---

# Frontend Toolkit

This project uses a specific frontend stack. Follow these rules when building UI:

## Stack
- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS v4 with custom `@theme` tokens (cream, red, brand, gold, warm palettes)
- **Animation:** framer-motion 12
- **Icons:** lucide-react
- **UI Primitives:** @radix-ui/react-dialog, react-select, react-tabs, react-tooltip
- **3D:** three.js, @react-three/fiber, @react-three/drei
- **Forms:** react-hook-form, zod
- **Utility:** clsx, tailwind-merge (via `cn()` from `@/lib/utils`)

## Design Tokens
- Colors use the `@theme` defined in `globals.css` — do not use raw hex values
- Typography: `.heading-xl`, `.heading-lg`, `.heading-md`, `.heading-sm`, `.subtitle-text` classes
- Cards: `.glass`, `.glass-dark`, `.glass-card`, `.glass-card-solid` utility classes
- Section spacing: `.section-padding` (py-10 md:py-14)
- Container: `.container` (max-width 1280px, auto margins)
- Path alias: `@/*` maps to `./src/*`

## When Building Components
- Use `'use client'` for interactive components, server components by default
- Import `{ cn }` from `@/lib/utils` for className merging
- Import `{ motion }` from `framer-motion` for animations
- Use `lucide-react` for icons, never emoji icons in production UI
- Place shared UI in `@/components/ui/`, sections in `@/components/sections/`, layout in `@/components/layout/`
- Data configs go in `@/lib/config/`

## Ponytail Integration
This project uses the ponytail plugin. Follow its lazy senior dev principles:
- Before writing code, climb the ladder: does it need to exist? already in codebase? stdlib? platform native?
- Mark shortcuts with `ponytail:` comments
- Never skip validation, error handling, security, or accessibility

(End of file - total 40 lines)
</content>