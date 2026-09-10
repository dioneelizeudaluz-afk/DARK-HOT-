import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const VIP_GROUP_ID = process.env.TELEGRAM_VIP_GROUP_ID;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

async function sendMessage(chatId: number, text: string, replyMarkup?: any) {
  const body: any = { chat_id: chatId, text, parse_mode: 'HTML' };
  if (replyMarkup) body.reply_markup = replyMarkup;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function sendPhoto(chatId: number, photo: string, caption: string, replyMarkup?: any) {
  const body: any = { chat_id: chatId, photo, caption, parse_mode: 'HTML' };
  if (replyMarkup) body.reply_markup = replyMarkup;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function getFlow() {
  if (!supabase) return null;
  try {
    const { data } = await supabase.from('bot_settings').select('*').eq('id', 1).maybeSingle();
    if (data?.flow_data) return JSON.parse(data.flow_data);
  } catch (e) {}
  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!BOT_TOKEN) return res.status(200).json({ ok: true });

  try {
    const { message, callback_query } = req.body;
    const flow = await getFlow();

    if (callback_query) {
      const chatId = callback_query.message.chat.id;
      const data = callback_query.data;

      if (data === 'ver_planos' && flow?.plans) {
        const keyboard = flow.plans.filter((p: any) => p.active).map((p: any) => [{
          text: `${p.name} - R$ ${p.price.toFixed(2)}`,
          callback_data: `plano_${p.id}`,
        }]);
        await sendMessage(chatId, 'Escolha o plano que deseja:', { inline_keyboard: keyboard });
      } else if (data === 'suporte') {
        await sendMessage(chatId, flow?.supportMessage || 'Entre em contacto com o suporte.');
      } else if (data.startsWith('plano_')) {
        const planId = parseInt(data.replace('plano_', ''));
        const plan = flow?.plans?.find((p: any) => p.id === planId);
        if (plan) {
          const text = `Perfeito! Clique no link abaixo para pagar:\n\n💳 <b>${plan.name}</b>\n💰 R$ ${plan.price.toFixed(2)}\n\nApós o pagamento, será adicionado ao grupo VIP automaticamente.`;
          const keyboard = { inline_keyboard: [[{ text: 'PAGAR AGORA', url: plan.link }]] };
          await sendMessage(chatId, text, keyboard);
        }
      }
      return res.status(200).json({ ok: true });
    }

    if (!message || !message.text) return res.status(200).json({ ok: true });

    const chatId = message.chat.id;
    const text = message.text;
    const userId = message.from?.id;
    const firstName = message.from?.first_name || '';
    const username = message.from?.username || '';

    if (supabase && userId) {
      try {
        await supabase.from('bot_users').upsert({
          telegram_id: userId,
          username,
          first_name: firstName,
          last_activity: new Date().toISOString(),
        }, { onConflict: 'telegram_id' });
        const { data: lead } = await supabase.from('leads').select('id').eq('telegram_id', userId).maybeSingle();
        if (!lead) {
          await supabase.from('leads').insert({ telegram_id: userId, name: firstName, username, status: 'novo' });
        }
      } catch (e) {}
    }

    if (text === '/start') {
      const startText = flow?.startMessage || 'Bem-vindo à Luna VIP!';
      const keyboard = {
        inline_keyboard: [
          [{ text: 'VER PLANOS', callback_data: 'ver_planos' }],
          [{ text: 'SUPORTE', callback_data: 'suporte' }],
        ],
      };

      if (flow?.startImage) {
        await sendPhoto(chatId, flow.startImage, startText, keyboard);
      } else {
        await sendMessage(chatId, startText, keyboard);
      }
    } else if (text === '/planos') {
      if (flow?.plans) {
        const keyboard = flow.plans.filter((p: any) => p.active).map((p: any) => [{
          text: `${p.name} - R$ ${p.price.toFixed(2)}`,
          callback_data: `plano_${p.id}`,
        }]);
        await sendMessage(chatId, 'Escolha o plano:', { inline_keyboard: keyboard });
      }
    } else if (text === '/suporte') {
      await sendMessage(chatId, flow?.supportMessage || 'Entre em contacto com o suporte.');
    } else {
      await sendMessage(chatId, 'Comando não reconhecido. Use /start');
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(200).json({ ok: true });
  }
}