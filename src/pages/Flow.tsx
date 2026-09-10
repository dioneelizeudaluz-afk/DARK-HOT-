import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Image, DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Plan {
  id: number;
  name: string;
  price: number;
  link: string;
  active: boolean;
}

export default function Flow() {
  const [startMessage, setStartMessage] = useState('');
  const [startImage, setStartImage] = useState('');
  const [vipMessage, setVipMessage] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadFlow();
  }, []);

  const loadFlow = async () => {
    const saved = localStorage.getItem('dh_flow');
    if (saved) {
      const data = JSON.parse(saved);
      setStartMessage(data.startMessage || '');
      setStartImage(data.startImage || '');
      setVipMessage(data.vipMessage || '');
      setSupportMessage(data.supportMessage || '');
      setPlans(data.plans || []);
    }
  };

  const saveFlow = async () => {
    const flowData = { startMessage, startImage, vipMessage, supportMessage, plans };
    localStorage.setItem('dh_flow', JSON.stringify(flowData));
    if (supabase) {
      await supabase.from('bot_settings').upsert({ id: 1, flow_data: JSON.stringify(flowData) });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addPlan = () => {
    setPlans([...plans, { id: Date.now(), name: 'Novo Plano', price: 0, link: '', active: true }]);
  };

  const updatePlan = (id: number, field: string, value: any) => {
    setPlans(plans.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const deletePlan = (id: number) => {
    if (!confirm('Eliminar este plano?')) return;
    setPlans(plans.filter(p => p.id !== id));
  };

  return (
    <div>
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 4 }}>Fluxo do Bot</h1>
        <p style={{ color: '#666', fontSize: 13 }}>Configure o fluxo de vendas do Telegram</p>
      </div>

      <div className="dh-card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ background: '#00ff88', color: '#0a0a0a', padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700 }}>1</span>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Mensagem de /start</h3>
        </div>
        <textarea className="dh-input" rows={6} value={startMessage} onChange={(e) => setStartMessage(e.target.value)} placeholder="Bem-vindo à Luna VIP!\n\nEscolha o seu plano abaixo" style={{ marginBottom: 12, fontFamily: 'inherit' }} />
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 5, fontWeight: 600 }}>URL DA IMAGEM (OPCIONAL)</label>
          <input className="dh-input" value={startImage} onChange={(e) => setStartImage(e.target.value)} placeholder="https://exemplo.com/imagem.jpg" />
        </div>
        {startImage && (
          <div style={{ marginTop: 12 }}>
            <p style={{ fontSize: 11, color: '#666', marginBottom: 8 }}>Preview:</p>
            <img src={startImage} alt="Preview" style={{ maxWidth: '100%', borderRadius: 8, border: '1px solid #1f1f1f' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
          </div>
        )}
      </div>

      <div className="dh-card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ background: '#00ff88', color: '#0a0a0a', padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700 }}>2</span>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Mensagem de Suporte</h3>
        </div>
        <textarea className="dh-input" rows={3} value={supportMessage} onChange={(e) => setSupportMessage(e.target.value)} placeholder="Entre em contacto com o nosso suporte" style={{ fontFamily: 'inherit' }} />
      </div>

      <div className="dh-card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ background: '#00ff88', color: '#0a0a0a', padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700 }}>3</span>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Planos VIP</h3>
          <button onClick={addPlan} className="dh-btn" style={{ marginLeft: 'auto', fontSize: 11, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Plus size={12} /> ADICIONAR
          </button>
        </div>

        {plans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 30, color: '#666', fontSize: 13 }}>
            Nenhum plano criado. Clica em ADICIONAR.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {plans.map((plan) => (
              <div key={plan.id} style={{ background: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: 10, padding: 16 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <input className="dh-input" value={plan.name} onChange={(e) => updatePlan(plan.id, 'name', e.target.value)} placeholder="Nome do plano" style={{ flex: 2 }} />
                  <input className="dh-input" type="number" value={plan.price} onChange={(e) => updatePlan(plan.id, 'price', parseFloat(e.target.value) || 0)} placeholder="Preço" style={{ flex: 1 }} />
                  <button onClick={() => deletePlan(plan.id)} style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'none', borderRadius: 8, padding: '0 12px', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <input className="dh-input" value={plan.link} onChange={(e) => updatePlan(plan.id, 'link', e.target.value)} placeholder="https://checkout.escalepay.com/xxxxx" style={{ marginBottom: 10, fontSize: 12 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: '#00ff88', fontWeight: 700 }}>R$ {plan.price.toFixed(2)}</span>
                  <button onClick={() => updatePlan(plan.id, 'active', !plan.active)} style={{ background: plan.active ? 'rgba(0,255,136,0.15)' : 'rgba(107,114,128,0.15)', color: plan.active ? '#00ff88' : '#9ca3af', border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>
                    {plan.active ? 'ATIVO' : 'INATIVO'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={saveFlow} className="dh-btn" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Save size={16} />
        {saved ? 'GUARDADO!' : 'GUARDAR FLUXO'}
      </button>
    </div>
  );
}