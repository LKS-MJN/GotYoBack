---
name: deploy-toolkit
description: Build, deploy, and verify the Next.js project on Vercel. Use when asked to deploy, build, or publish changes.
---

# Deploy Toolkit

## Before Deploying
1. Run `npx tsc --noEmit` to check for TypeScript errors
2. Run `npm run build` to verify the production build compiles

## Deploying
- Use `vercel --prod --yes` from the project root
- The Vercel project is already linked (project ID in `.vercel/project.json`)
- Production URL: https://mannat-overseas.vercel.app

## Post-Deploy
- Verify all pages load correctly
- Check that the immigration page and study page both render their distinct content
