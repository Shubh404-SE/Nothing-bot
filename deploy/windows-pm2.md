# Run Nothing Bot on Windows 24/7 (free, local)

## Prerequisites

- Node.js 20+ installed
- `.env` configured (see `.env.example`)
- `npm install` and `npm run build` already done

## Deploy global commands (once)

```powershell
cd "D:\project\discord bot\Nothing bot"
$env:DISCORD_GUILD_ID = ""
npm run deploy-commands
```

## Install PM2

```powershell
npm install -g pm2
pm2 start dist/src/index.js --name nothing-bot
pm2 logs nothing-bot
```

## Start on Windows login (optional)

Run PowerShell **as Administrator**:

```powershell
pm2 startup
```

Copy and run the command PM2 prints, then:

```powershell
pm2 save
```

## Daily use

```powershell
pm2 status
pm2 restart nothing-bot
pm2 stop nothing-bot
```

Bot stops when the PC is off or sleeping — disable sleep in Windows power settings if you need longer uptime.
