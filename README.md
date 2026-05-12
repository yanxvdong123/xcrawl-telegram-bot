# XCrawl Scraper Telegram Bot 🤖

Send a URL → bot scrapes it via XCrawl Proxy API → returns structured content.

## Quick Start

```bash
# 1. Set env vars
export TELEGRAM_BOT_TOKEN="your_token_from_@BotFather"
export XCRAWL_API_KEY="your_xcrawl_api_key"

# 2. Install & run
npm install
npm start
```

## Deployment Options

### Railway (recommended)
- Fork this repo to GitHub
- Connect Railway project
- Add env vars in Railway dashboard
- Railway handles HTTPS webhook (no polling needed)

### Fly.io / Render
- Similar to Railway — Dockerfile included

## Bot Commands

- `/start` — welcome
- `/scrape <url>` — scrape a webpage
- `/help` — usage info
- Or just paste any URL directly into the chat

## Pricing

| Tier | Cost | Messages/mo |
|------|------|------------|
| Free | $0 | 100 |
| Basic | $5/mo | 1,000 |
| Pro | $20/mo | 10,000 |

Uses XCrawl API credits under the hood — profitable at scale.
