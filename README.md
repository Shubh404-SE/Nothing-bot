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

- `/translate language:hi text:"Hello"` — slash command (ephemeral reply)
- React with a country flag (e.g. 🇮🇳) on a message — translates to mapped language

## Architecture

See [`.cursor/plans/nothing_bot_architecture_1cc695bf.plan.md`](.cursor/plans/nothing_bot_architecture_1cc695bf.plan.md).
