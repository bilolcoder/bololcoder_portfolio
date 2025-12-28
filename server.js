// server.js - Express server that serves static files and handles /api/contact
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
  console.warn('WARNING: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are not set in .env');
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter to avoid spam
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 6,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/contact', limiter);

// Serve frontend static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const safeName = String(name).replace(/<[^>]*>?/gm, '');
    const safeEmail = String(email).replace(/<[^>]*>?/gm, '');
    const safeMessage = String(message).replace(/<[^>]*>?/gm, '');

    const text = `<b>Yangi kontakt xabari</b>\n\n` +
                 `<b>Ism:</b> ${escapeHtml(safeName)}\n` +
                 `<b>Email:</b> ${escapeHtml(safeEmail)}\n\n` +
                 `<b>Xabar:</b>\n${escapeHtml(safeMessage)}`;

    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    const payload = { chat_id: TELEGRAM_CHAT_ID, parse_mode: 'HTML', text };

    const tgRes = await axios.post(url, payload, { timeout: 8000 });
    if (tgRes.data && tgRes.data.ok) {
      return res.json({ ok: true });
    } else {
      console.error('Telegram error:', tgRes.data);
      return res.status(500).json({ error: 'Telegram API error' });
    }
  } catch (err) {
    console.error(err?.response?.data || err.message || err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// fallback - serve index for any other route (SPA-friendly)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function escapeHtml(str) {
  return str.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
