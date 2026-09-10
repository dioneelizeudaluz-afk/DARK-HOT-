import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return res.status(200).json({ status: 'offline', message: 'Token não configurado' });
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await response.json();

    if (data.ok) {
      return res.status(200).json({ status: 'online', bot: data.result });
    }
    return res.status(200).json({ status: 'offline' });
  } catch (error) {
    return res.status(200).json({ status: 'offline' });
  }
}