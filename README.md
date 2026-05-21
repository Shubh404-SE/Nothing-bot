# Nothing Bot

Production-oriented Discord.js bot (translation MVP).

## Setup

1. Copy `.env.example` to `.env` and fill in values.
2. Install dependencies: `npm install`
3. Deploy slash commands: `npm run deploy-commands`
4. Run locally: `npm run dev`

## Scripts

| Script                    | Description                 |
| ------------------------- | --------------------------- |
| `npm run dev`             | Start with hot reload (tsx) |
| `npm run build`           | Compile TypeScript          |
| `npm start`               | Run compiled bot            |
| `npm run deploy-commands` | Register slash commands     |
| `npm run lint`            | ESLint                      |
| `npm test`                | Vitest unit tests           |

## Features

- `/translate` — pick a language from the menu (no default US flag; English is 🌐)
- React with a **country flag** on a message (e.g. 🇮🇳) — bot translates and replies (Nothing Bot does not add reactions to your messages)

After changing slash commands, run `npm run deploy-commands` again.

## Architecture

See [`.cursor/plans/nothing_bot_architecture_1cc695bf.plan.md`](.cursor/plans/nothing_bot_architecture_1cc695bf.plan.md).
