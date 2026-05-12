/**
 * XCrawl Telegram Bot — Scrape web pages via Telegram
 * 
 * Deploy as: node bot.js
 * Dependencies: telegraf, need to: npm install telegraf
 */

const { Telegraf } = require('telegraf');
const https = require('https');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const API_KEY = process.env.XCRAWL_API_KEY || '';
const API_URL = process.env.XCRAWL_API_URL || 'https://api.xcrawl.com/v1';

if (!BOT_TOKEN || !API_KEY) {
  console.error('Error: TELEGRAM_BOT_TOKEN and XCRAWL_API_KEY required');
  process.exit(1);
}

function scrape(url, format = 'markdown') {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ url, format });
    const hostname = new URL(API_URL).hostname;
    const opts = {
      hostname, path: '/scrape', method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };
    const req = https.request(opts, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve({ success: false, error: 'Parse failed' }); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => ctx.reply(
  '🕷 *XCrawl Scraper Bot*\n\nSend me a URL and I\'ll scrape it!\n\n' +
  'Usage:\n  `/scrape https://example.com`\n  `/scrape json https://example.com`',
  { parse_mode: 'Markdown' }
));

bot.command('scrape', async (ctx) => {
  const text = ctx.message.text.replace(/^\/(scrape|start)\s*/, '').trim();
  const parts = text.split(/\s+/);
  let url, format = 'markdown';
  
  if (parts.length >= 2 && ['markdown','json','text','html'].includes(parts[0])) {
    format = parts[0];
    url = parts.slice(1).join(' ');
  } else {
    url = text;
  }
  
  if (!url) return ctx.reply('Please provide a URL. Usage: /scrape https://example.com');
  
  const msg = await ctx.reply(`⏳ Scraping ${url}...`);
  
  try {
    const result = await scrape(url, format);
    if (result.success) {
      const content = result.content || JSON.stringify(result, null, 2);
      const maxLen = 4000;
      const truncated = content.length > maxLen ? content.substring(0, maxLen) + '\n\n... (truncated)' : content;
      await ctx.reply(`✅ Result:\n\n\`\`\`\n${truncated}\n\`\`\``, { parse_mode: 'Markdown' });
    } else {
      await ctx.reply(`❌ Error: ${result.error || 'Unknown error'}`);
    }
  } catch (err) {
    await ctx.reply(`❌ Error: ${err.message}`);
  }
});

bot.launch().then(() => console.log('XCrawl Telegram Bot started'));
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
