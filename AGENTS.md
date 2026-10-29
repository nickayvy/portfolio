<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## ZenMux usage limit (oil-motion generation)

The ZenMux key in the Keychain (`oil-motion/zenmux/default`) is a **Starter Builder Plan** subscription key.

- Never exceed **50 Flows per rolling 5-hour window** (about $1.60 of usage; 1 Flow ≈ $0.033). Also respect the weekly cap.
- Never fall through to pay-as-you-go. Don't enable Extra Usage and don't use a pay-as-you-go key.
- Run one generation call at a time (image or video). Before each call, state its rough Flow cost and the running total for the current window.
- If a call would push the window past 50 Flows, or the cost is unclear, stop and ask the user. Don't retry automatically after an error.
- Use `--dry-run` and low or medium quality for tests. Use high quality only for frames the user has approved.
