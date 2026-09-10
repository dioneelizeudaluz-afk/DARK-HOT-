import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return res.status(200).json({ ok: true });
  }

  try {
    const { message, callback_query } = req.body;

    if (callback_query) {
      const chatId = callback_query.message.chat.id;
      const data = callback_query.data;

      let responseText = 'Opção selecionada.';

      if (data === 'vip') responseText = 'Área VIP. Conteúdo exclusivo em breve.';
      else if (data === 'suporte') responseText = 'Suporte DARK HOT. Como posso ajudar?';

      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: responseText }),
      });

      return res.status(200).json({ ok: true });
    }

    if (!message || !message.text) {
      return res.status(200).json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text;

    let responseText = 'Comando não reconhecido. Use /start, /vip ou /suporte';
    let replyMarkup = null;

    if (text === '/start') {
      responseText = 'Bem-vindo ao DARK HOT! Escolha uma opção abaixo.';
      replyMarkup = {
        inline_keyboard: [
          [{ text: 'VIP', callback_data: 'vip' }],
          [{ text: 'Suporte', callback_data: 'suporte' }],
        ],
      };
    } else if (text === '/vip') {
      responseText = 'Área VIP. Conteúdo exclusivo em breve.';
    } else if (text === '/suporte') {
      responseText = 'Suporte DARK HOT. Como posso ajudar?';
    }

    const body: any = { chat_id: chatId, text: responseText };
    if (replyMarkup) body.reply_markup = replyMarkup;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(200).json({ ok: true });
  }
}