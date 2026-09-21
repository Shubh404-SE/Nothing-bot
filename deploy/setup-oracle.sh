#!/usr/bin/env bash
# Run on Ubuntu Oracle VM after cloning the repo into ~/nothing-bot
set -euo pipefail

cd "$(dirname "$0")/.."

echo "Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git

echo "Installing dependencies and building..."
npm ci
npm run build

if [ ! -f .env ]; then
  echo "Create .env from .env.example and fill DISCORD_TOKEN / DISCORD_CLIENT_ID"
  cp .env.example .env
  chmod 600 .env
  echo "Edit: nano .env  (do NOT set DISCORD_GUILD_ID for public bot)"
  exit 1
fi

echo "Deploying global slash commands..."
npm run deploy-commands

echo "Installing systemd service..."
sudo cp deploy/nothing-bot.service /etc/systemd/system/nothing-bot.service
sudo systemctl daemon-reload
sudo systemctl enable nothing-bot
sudo systemctl restart nothing-bot
sudo systemctl status nothing-bot --no-pager

echo "Done. Check logs: journalctl -u nothing-bot -f"
