# Deploy Nothing Bot for free (all servers)

Cloud “free” tiers change often (Render, Oracle, etc. often need a card or are not really $0). These paths work **without paying** for hosting:

| Option                       | Cost             | 24/7?          | Best for                                        |
| ---------------------------- | ---------------- | -------------- | ----------------------------------------------- |
| **A. Your Windows PC**       | $0               | If PC stays on | You control everything, safest for your token   |
| **B. Free Discord bot host** | $0               | Usually yes    | No VPS; third-party panel (read warnings below) |
| **C. Koyeb**                 | $0 credits/month | Often          | Small bot; may need card; credits can run out   |

---

## Discord setup (all options)

### 1. Developer Portal

1. [Developer Portal](https://discord.com/developers/applications) → **Bot**.
2. Enable **Message Content Intent** (flag reactions).
3. Save **Token** and **Application ID** — never commit to GitHub.

### 2. Invite link (any server can add your bot)

**OAuth2 → URL Generator** → scopes: `bot`, `applications.commands`  
Permissions: View Channels, Send Messages, Embed Links, Read Message History

Replace `YOUR_CLIENT_ID`:

```text
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=84992&scope=bot%20applications.commands
```

### 3. Global commands (all servers)

On production, **do not set** `DISCORD_GUILD_ID`.

Deploy once (from PC or host console):

```powershell
cd "D:\project\discord bot\Nothing bot"
# Temporarily remove guild id from .env or:
$env:DISCORD_GUILD_ID = ""
npm run build
npm run deploy-commands
```

Global commands can take **up to ~1 hour** to appear in every server.

> **User-installed commands** (`/translate`, `/language`, Translate Message): these only work outside your dev guild — in DMs or servers the bot isn't invited to — once deployed **globally**. A guild-scoped deploy (`DISCORD_GUILD_ID` set) only makes them usable inside that one guild.

---

## Persisting language preferences (`DATA_DIR`)

Per-user and per-server default languages are stored in a local JSON file at `$DATA_DIR/preferences.json` (`DATA_DIR` defaults to `./data`). Options A/B/C below already get this "for free" — the process's local disk survives restarts. If you later move to a host with an ephemeral/reset-on-deploy filesystem (e.g. most container platforms), point `DATA_DIR` at a mounted persistent volume/disk for that host, or preferences will reset on every redeploy. This isn't wired up for a specific host yet — do it when you pick one.

---

## Option A — Run on your Windows PC (recommended, $0)

No cloud signup. Bot is online while your PC is on and `npm start` (or PM2) is running.

### A1. One-time setup

```powershell
cd "D:\project\discord bot\Nothing bot"
npm install
npm run build
```

Ensure `.env` has `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, `NODE_ENV=production`, and **no** `DISCORD_GUILD_ID` for public use.

Deploy global commands (once):

```powershell
npm run deploy-commands
```

### A2. Run the bot

**Manual (testing):**

```powershell
npm start
```

Leave the window open. Logs should show `Bot is ready`.

**Auto-restart + run in background (PM2):**

```powershell
npm install -g pm2
pm2 start dist/src/index.js --name nothing-bot
pm2 save
pm2 startup
```

Follow the command `pm2 startup` prints (run the suggested line as Administrator), then `pm2 save` again.

Useful commands:

```powershell
pm2 logs nothing-bot
pm2 restart nothing-bot
pm2 stop nothing-bot
```

### A3. Test

1. Open your invite link → add bot to a server.
2. Try `/translate`, a flag reaction, right-click → Apps → Translate Message, `/language set`, and (as an admin) `/server-language set`.

### A4. Limitations

- Bot goes **offline** when the PC sleeps, shuts down, or loses internet.
- Fine for testing and small communities; for 24/7 public use see Option B or leave PC on.

---

## Option B — Free Discord bot hosting sites ($0, third-party)

These are **community / ad-supported** panels aimed at Discord bots. They are easier than a VPS but:

- You trust them with your **bot token**
- Uptime and policies can change
- Free tiers may have RAM/CPU limits

Pick **one** provider and follow their “Node.js bot” flow. General steps:

### B1. Prepare the project

1. Push code to **GitHub** (no `.env` in the repo), **or** zip the project (exclude `node_modules` and `.env`).

### B2. On the host dashboard

1. Create a new **Discord bot** / **Node.js** app.
2. Upload **Git** repo or **ZIP**.
3. **Install:** `npm install && npm run build`
4. **Start:** `npm start` or `node dist/src/index.js`
5. **Environment variables** (secrets):

   | Name                | Value          |
   | ------------------- | -------------- |
   | `DISCORD_TOKEN`     | your token     |
   | `DISCORD_CLIENT_ID` | application id |
   | `NODE_ENV`          | `production`   |

   Do **not** set `DISCORD_GUILD_ID`.

6. Start the app and open **console/logs** → look for `Bot is ready`.

### B3. Deploy slash commands (from your PC)

Hosts usually do **not** run deploy for you. On your PC:

```powershell
$env:DISCORD_GUILD_ID = ""
npm run deploy-commands
```

### B4. Providers to try (search “free discord bot hosting”)

Examples (availability changes — use their official sites):

- [JustRunMy.App](https://justrunmy.app/discord-bots) — free tier, Node.js
- [Monkey Network](https://monkey-network.xyz/) — free Discord bot hosting
- [HeavenCloud](https://heavencloud.in/service/free-discord-bot-hosting) — may require joining their Discord

Read each site’s **ToS** and resource limits before pasting your token.

---

## Option C — Koyeb (free monthly credits)

1. [koyeb.com](https://www.koyeb.com) → sign up.
2. **Create app** → GitHub → this repo.
3. Build: `npm install && npm run build`  
   Run: `npm start`
4. Secrets: `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, `NODE_ENV=production` (no `DISCORD_GUILD_ID`).
5. Deploy commands from your PC (see B3).

Credits are limited; not “unlimited forever,” but often enough for a small bot.

---

## Option D — Fly.io (optional)

Uses a small **monthly credit** (not unlimited). See `fly.toml` + `Dockerfile` if you already use Fly.

---

## Not recommended as “free” (as of common 2025–2026 experience)

- **Render** background workers — paid
- **Oracle Cloud** — Always Free exists but signup/verification frustrates many users; card may be required
- **Railway** — trial credits, then paid

`deploy/setup-oracle.sh` remains in the repo only if you later get an Always Free Oracle VM working.

---

## Production checklist

- [ ] Message Content Intent enabled
- [ ] `DISCORD_GUILD_ID` unset for public bot
- [ ] `npm run deploy-commands` succeeded (global)
- [ ] Logs show `Bot is ready`
- [ ] Invite link tested on a server
- [ ] `/translate` + flag reaction work
- [ ] Right-click → Apps → Translate Message works, including the "change language" dropdown
- [ ] `/language set` / `/language show` and `/server-language set` work
- [ ] `DATA_DIR` points at durable storage for your chosen host (see "Persisting language preferences" above)
- [ ] Tested as a user-installed app ("Add to my apps") in a DM or a server the bot isn't in

---

## Troubleshooting

| Problem         | Fix                                                     |
| --------------- | ------------------------------------------------------- |
| Bot offline     | PC asleep / host stopped → start `npm start` or PM2     |
| No `/translate` | Run `deploy-commands` without guild id; wait ~1h        |
| Reactions fail  | Message Content Intent; Read Message History permission |
| Token leaked    | Reset in Developer Portal; update env; restart          |

---

## Security

Never commit `.env` or share your token. Third-party hosts can read secrets you enter in their dashboard — prefer **Option A (your PC)** if you want maximum control.
