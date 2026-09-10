import { useState, useEffect } from 'react';
import { Bot, CreditCard, Save, CheckCircle } from 'lucide-react';

export default function Settings() {
  const [botName, setBotName] = useState('DARK HOT');
  const [botUsername, setBotUsername] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dh_settings');
    if (saved) {
      const data = JSON.parse(saved);
      setBotName(data.botName || 'DARK HOT');
      setBotUsername(data.botUsername || '');
      setWebhookUrl(data.webhookUrl || '');
    }
  }, []);

  const save = () => {
    localStorage.setItem('dh_settings', JSON.stringify({ botName, botUsername, webhookUrl }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
        </div>
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
          <p style={{ fontSize: 11, color: '#444', marginTop: 5 }}>O token é armazenado em variáveis de ambiente do servidor</p>
        </div>
        <div style={{ padding: 12, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8 }}>
          <p style={{ fontSize: 12, color: '#f59e0b' }}>Bot não configurado. Adicione TELEGRAM_BOT_TOKEN no ambiente</p>
        </div>
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