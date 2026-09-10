import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!token) {
    return res.status(200).json({ ok: true });
  }

  const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

  try {
    const { message, callback_query } = req.body;

    if (callback_query) {
      const chatId = callback_query.message.chat.id;
      const data = callback_query.data;

      let responseText = 'Opção selecionada.';

      if (supabase) {
        if (data === 'vip') {
          const { data: msg } = await supabase.from('messages').select('text').eq('name', 'Oferta').single();
          responseText = msg?.text || 'Área VIP. Conteúdo exclusivo em breve.';
        } else if (data === 'suporte') {
          const { data: msg } = await supabase.from('messages').select('text').eq('name', 'Suporte').single();
          responseText = msg?.text || 'Suporte DARK HOT. Como posso ajudar?';
        }
      }

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
    const firstName = message.from?.first_name || '';
    const username = message.from?.username || '';
    const userId = message.from?.id;

    if (supabase && userId) {
      await supabase.from('bot_users').upsert({
        telegram_id: userId,
        username: username,
        first_name: firstName,
        last_activity: new Date().toISOString(),
      }, { onConflict: 'telegram_id' });

      const { data: existingLead } = await supabase.from('leads').select('id').eq('telegram_id', userId).maybeSingle();
      if (!existingLead) {
        await supabase.from('leads').insert({
          telegram_id: userId,
          name: firstName,
          username: username,
          status: 'novo',
        });
      }
    }

    let responseText = 'Comando não reconhecido. Use /start, /vip ou /suporte';
    let replyMarkup = null;

    if (text === '/start') {
      if (supabase) {
        const { data: msg } = await supabase.from('messages').select('text').eq('name', 'Boas-vindas').eq('active', true).maybeSingle();
        responseText = msg?.text || 'Bem-vindo ao DARK HOT!';
      } else {
        responseText = 'Bem-vindo ao DARK HOT!';
      }
      replyMarkup = {
        inline_keyboard: [
          [{ text: 'VIP', callback_data: 'vip' }],
          [{ text: 'Suporte', callback_data: 'suporte' }],
        ],
      };
    } else if (text === '/vip') {
      if (supabase) {
        const { data: msg } = await supabase.from('messages').select('text').eq('name', 'Oferta').eq('active', true).maybeSingle();
        responseText = msg?.text || 'Área VIP. Conteúdo exclusivo em breve.';
      } else {
        responseText = 'Área VIP em breve.';
      }
    } else if (text === '/suporte') {
      if (supabase) {
        const { data: msg } = await supabase.from('messages').select('text').eq('name', 'Suporte').eq('active', true).maybeSingle();
        responseText = msg?.text || 'Suporte DARK HOT. Como posso ajudar?';
      } else {
        responseText = 'Suporte DARK HOT.';
      }
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
    console.error('Erro webhook:', error);
    return res.status(200).json({ ok: true });
  }
}