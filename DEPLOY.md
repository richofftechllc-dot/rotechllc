# Deploying Rich Off Tech — the safe way

**One rule above all: `main` IS production. Never deploy anything else to prod.**

Production (rotechllc.com) is auto-deployed by Vercel from the `main` branch. If code
isn't on `main`, it isn't real — and the next `main` deploy will overwrite anything that
was pushed to prod from a branch. (That is exactly what broke prices/invoicing/resources
on 2026-07-08: prod had been served from a feature branch that was never merged.)

## How to ship a change
1. **Branch** off the latest `main`:
   ```
   git fetch origin && git checkout -b my-change origin/main
   ```
   (Always `fetch` first — a stale local `main` is how you accidentally revert others' work.)
2. Make the change. **Build locally before you push:** `npm run build` must pass.
3. Push, open a **PR into `main`**. CI (`.github/workflows/ci.yml`) build-gates it —
   a red build cannot be merged.
4. **Merge to `main`.** Vercel auto-deploys production.
5. **Run the smoke test** once the deploy is live:
   ```
   ./scripts/smoke.sh
   ```
   It asserts pricing = $227, key pages 200, and the founding-count API responds.

## NEVER do this
- ❌ `vercel --prod` from a feature branch or a dirty working tree.
- ❌ Deploy prod from anything except a merged `main`.
- ❌ Merge a PR with a failing CI build.

## Rollback (if a bad deploy reaches prod)
Vercel keeps every prior production build. To instantly revert:
- **Dashboard:** Vercel → project `rotechllc` → Deployments → pick the last known-good
  READY production deploy → **Promote to Production** (or **Instant Rollback**).
- **CLI:** `vercel rollback <deployment-url>` (or `vercel promote <deployment-url>`).

Then fix forward on a branch and re-ship through the flow above. The last-good deploy is
usually the previous `Merge pull request …` on `main`.
