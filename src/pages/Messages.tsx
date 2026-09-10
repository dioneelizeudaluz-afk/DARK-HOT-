import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

interface MessageItem {
  id: string;
  name: string;
  text: string;
  active: boolean;
}

export default function Messages() {
  const defaultMessages: MessageItem[] = [
    { id: '1', name: 'Boas-vindas', text: 'Bem-vindo ao DARK HOT!', active: true },
    { id: '2', name: 'Apresentação', text: 'Somos uma plataforma de automação.', active: true },
    { id: '3', name: 'Oferta', text: 'Temos uma oferta especial para você.', active: true },
    { id: '4', name: 'Pagamento', text: 'Escolha a forma de pagamento.', active: true },
    { id: '5', name: 'Pagamento confirmado', text: 'Seu pagamento foi confirmado!', active: true },
    { id: '6', name: 'Suporte', text: 'Como podemos ajudar?', active: true },
    { id: '7', name: 'Recuperação de lead', text: 'Vi que você se interessou...', active: true },
    { id: '8', name: 'Pós-venda', text: 'Obrigado pela sua compra!', active: true },
  ];

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('dh_messages');
    if (saved) setMessages(JSON.parse(saved));
    else {
      setMessages(defaultMessages);
      localStorage.setItem('dh_messages', JSON.stringify(defaultMessages));
    }
  }, []);

  const updateMessage = (id: string, text: string) => {
    setMessages(messages.map(m => m.id === id ? { ...m, text } : m));
  };

  const saveMessage = (id: string) => {
    localStorage.setItem('dh_messages', JSON.stringify(messages));
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
  };

  const toggleActive = (id: string) => {
    const updated = messages.map(m => m.id === id ? { ...m, active: !m.active } : m);
    setMessages(updated);
    localStorage.setItem('dh_messages', JSON.stringify(updated));
  };

  return (
    <div>
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 4 }}>Mensagens</h1>
        <p style={{ color: '#666', fontSize: 13 }}>Configure as mensagens que o bot enviará</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.map((msg) => (
          <div key={msg.id} className="dh-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{msg.name}</h3>
              <button onClick={() => toggleActive(msg.id)} style={{ background: msg.active ? 'rgba(0,255,136,0.15)' : 'rgba(107,114,128,0.15)', color: msg.active ? '#00ff88' : '#9ca3af', padding: '4px 12px', borderRadius: 6, fontSize: 10, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                {msg.active ? 'ATIVO' : 'INATIVO'}
              </button>
            </div>
            <textarea className="dh-input" rows={3} value={msg.text} onChange={(e) => updateMessage(msg.id, e.target.value)} style={{ marginBottom: 12, resize: 'vertical', fontFamily: 'inherit' }} />
            <button onClick={() => saveMessage(msg.id)} className="dh-btn" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Save size={14} />
              {saved === msg.id ? 'GUARDADO!' : 'GUARDAR'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}