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

- `/translate <text> [language]` — language defaults to your saved preference, then your server's default, then English
- **Translate Message** — right-click (or long-press) any message → Apps → Translate Message; replies ephemerally with a "change language" dropdown to redo it in another language
- React with a **country flag** on a message (e.g. 🇮🇳) — bot translates and replies publicly (Nothing Bot does not add reactions to your messages)
- `/language set` / `/language show` — set or view your personal default translation language
- `/server-language set` — server admins (Manage Server) set the server's default translation language

`/translate`, `/language`, and Translate Message also work as a **user-installed app** — install the bot to your own Discord account ("Add to my apps") to use them in DMs and in servers the bot isn't invited to.

After changing slash/context-menu commands, run `npm run deploy-commands` again. User-installed commands only work outside your dev guild once deployed **globally** (omit `DISCORD_GUILD_ID` for that deploy).

## Deploy for all servers (free)

See **[DEPLOYMENT.md](DEPLOYMENT.md)** — step-by-step guide.

| Option                     | Cost           | Notes                                  |
| -------------------------- | -------------- | -------------------------------------- |
| **Your Windows PC + PM2**  | $0             | Recommended — no cloud signup          |
| **Free Discord bot hosts** | $0             | Third-party panels (see DEPLOYMENT.md) |
| **Koyeb**                  | Free credits   | Small monthly allowance                |
| Oracle / Render            | Often not free | Optional only                          |

Quick invite (replace `YOUR_CLIENT_ID`):

```text
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=84992&scope=bot%20applications.commands
```

## Architecture

See [`.cursor/plans/nothing_bot_architecture_1cc695bf.plan.md`](.cursor/plans/nothing_bot_architecture_1cc695bf.plan.md).
