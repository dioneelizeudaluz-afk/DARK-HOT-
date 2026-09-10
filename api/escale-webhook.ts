import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const VIP_GROUP_ID = process.env.TELEGRAM_VIP_GROUP_ID;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

async function createInviteLink() {
  if (!BOT_TOKEN || !VIP_GROUP_ID) return null;
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/createChatInviteLink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: VIP_GROUP_ID,
        member_limit: 1,
        expire_date: Math.floor(Date.now() / 1000) + 86400,
      }),
    });
    const data = await res.json();
    return data.ok ? data.result.invite_link : null;
  } catch (e) {
    return null;
  }
}

async function sendMessage(chatId: number, text: string, replyMarkup?: any) {
  const body: any = { chat_id: chatId, text, parse_mode: 'HTML' };
  if (replyMarkup) body.reply_markup = replyMarkup;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { event, data } = req.body;
    console.log('EscalePay event:', event, data);

    if (event === 'payment.received' || event === 'payment.confirmed') {
      const { customer_name, product, amount, customer_telegram_id } = data || {};

      if (supabase) {
        await supabase.from('sales').insert({
          customer_name: customer_name || 'Cliente',
          product: product || 'VIP',
          amount: Number(amount) || 0,
          status: 'confirmada',
        });
      }

      if (customer_telegram_id && BOT_TOKEN) {
        const inviteLink = await createInviteLink();
        if (inviteLink) {
          await sendMessage(Number(customer_telegram_id), '✅ Pagamento confirmado!\n\nAqui está o link para entrar no grupo VIP:', {
            inline_keyboard: [[{ text: 'ENTRAR NO GRUPO', url: inviteLink }]],
          });
        } else {
          await sendMessage(Number(customer_telegram_id), '✅ Pagamento confirmado! Entraremos em contacto em breve com o link do grupo.');
        }
      }

      return res.status(200).json({ ok: true });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('EscalePay webhook error:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}