import { useState, useEffect } from 'react';
import { Bot, CreditCard, Save, CheckCircle, ExternalLink } from 'lucide-react';

export default function Settings() {
  const [botName, setBotName] = useState('DARK HOT');
  const [botUsername, setBotUsername] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [saved, setSaved] = useState(false);
  const [botStatus, setBotStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [botInfo, setBotInfo] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('dh_settings');
    if (saved) {
      const data = JSON.parse(saved);
      setBotName(data.botName || 'DARK HOT');
      setBotUsername(data.botUsername || '');
      setWebhookUrl(data.webhookUrl || '');
    }
    checkBot();
  }, []);

  const checkBot = async () => {
    try {
      const res = await fetch('/api/bot-status');
      const data = await res.json();
      if (data.status === 'online') {
        setBotStatus('online');
        setBotInfo(data.bot);
      } else {
        setBotStatus('offline');
      }
    } catch {
      setBotStatus('offline');
    }
  };

  const save = () => {
    localStorage.setItem('dh_settings', JSON.stringify({ botName, botUsername, webhookUrl }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getWebhookUrl = () => {
    return `${window.location.origin}/api/telegram-webhook`;
  };

  const setupWebhook = async () => {
    try {
      const res = await fetch('/api/setup-webhook', { method: 'POST' });
      const data = await res.json();
      if (data.ok) {
        alert('Webhook configurado com sucesso!');
      } else {
        alert('Erro: ' + (data.error || 'Falha desconhecida'));
      }
    } catch (err) {
      alert('Erro ao configurar webhook');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 4 }}>Configurações</h1>
        <p style={{ color: '#666', fontSize: 13 }}>Configuração do sistema</p>
      </div>

      <div className="dh-card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Bot size={20} color="#00ff88" />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Bot Telegram</h3>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: botStatus === 'online' ? '#00ff88' : botStatus === 'offline' ? '#ef4444' : '#f59e0b' }}></span>
            <span style={{ fontSize: 11, color: botStatus === 'online' ? '#00ff88' : '#9ca3af', fontWeight: 700 }}>
              {botStatus === 'checking' ? 'VERIFICANDO' : botStatus === 'online' ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </div>

        {botInfo && (
          <div style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 8, padding: 12, marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: '#00ff88', fontWeight: 700 }}>{botInfo.first_name}</p>
            <p style={{ fontSize: 11, color: '#9ca3af' }}>@{botInfo.username}</p>
          </div>
        )}

        <div style={{ marginBottom: 15 }}>
          <label style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 5, fontWeight: 600 }}>NOME DO BOT</label>
          <input className="dh-input" value={botName} onChange={(e) => setBotName(e.target.value)} placeholder="DARK HOT" />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 5, fontWeight: 600 }}>USERNAME</label>
          <input className="dh-input" value={botUsername} onChange={(e) => setBotUsername(e.target.value)} placeholder="@seu_bot" />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 5, fontWeight: 600 }}>TOKEN DO BOT</label>
          <input className="dh-input" type="password" placeholder="Configurado via variável de ambiente" disabled />
          <p style={{ fontSize: 11, color: '#444', marginTop: 5 }}>O token NUNCA é armazenado no código por segurança</p>
        </div>

        <div style={{ padding: 16, background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 8, marginBottom: 16 }}>
          <p style={{ fontSize: 12, color: '#00ff88', fontWeight: 700, marginBottom: 8 }}>WEBHOOK URL</p>
          <p style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'monospace', wordBreak: 'break-all', marginBottom: 12 }}>{getWebhookUrl()}</p>
          <button onClick={setupWebhook} className="dh-btn" style={{ fontSize: 12, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ExternalLink size={14} />
            CONFIGURAR WEBHOOK
          </button>
        </div>

        {botStatus === 'offline' && (
          <div style={{ padding: 12, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8 }}>
            <p style={{ fontSize: 12, color: '#f59e0b' }}>Bot offline. Adicione TELEGRAM_BOT_TOKEN na Vercel e faça redeploy.</p>
          </div>
        )}
      </div>

      <div className="dh-card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <CreditCard size={20} color="#00ff88" />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>EscalePay</h3>
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 5, fontWeight: 600 }}>WEBHOOK URL</label>
          <input className="dh-input" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://seu-dominio.com/api/webhook" />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 5, fontWeight: 600 }}>SECRET TOKEN</label>
          <input className="dh-input" type="password" placeholder="Configurado via variável de ambiente" disabled />
        </div>
        <div style={{ padding: 12, background: 'rgba(107,114,128,0.1)', border: '1px solid rgba(107,114,128,0.3)', borderRadius: 8 }}>
          <p style={{ fontSize: 12, color: '#9ca3af' }}>Integração pendente</p>
        </div>
      </div>

      <button onClick={save} className="dh-btn" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {saved ? <CheckCircle size={16} /> : <Save size={16} />}
        {saved ? 'GUARDADO!' : 'GUARDAR CONFIGURAÇÕES'}
      </button>
    </div>
  );
}