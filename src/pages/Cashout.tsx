import { useState, useEffect } from 'react';
import { Wallet, DollarSign, CheckCircle, Clock } from 'lucide-react';

interface Cashout {
  id: string;
  amount: number;
  status: 'pendente' | 'processado' | 'rejeitado';
  created_at: string;
}

export default function Cashout() {
  const [cashouts, setCashouts] = useState<Cashout[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('dh_cashouts');
    if (saved) setCashouts(JSON.parse(saved));
  }, []);

  const totalWithdrawn = cashouts.filter(c => c.status === 'processado').reduce((a, c) => a + c.amount, 0);
  const pending = cashouts.filter(c => c.status === 'pendente').reduce((a, c) => a + c.amount, 0);

  const metrics = [
    { label: 'Saldo Disponível', value: '0 MT', icon: DollarSign },
    { label: 'Saldo Pendente', value: `${pending} MT`, icon: Clock },
    { label: 'Total Retirado', value: `${totalWithdrawn} MT`, icon: CheckCircle },
    { label: 'Último Cashout', value: cashouts.length > 0 ? cashouts[cashouts.length - 1].created_at : '—', icon: Wallet },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pendente: 'dh-badge-yellow',
      processado: 'dh-badge-green',
      rejeitado: 'dh-badge-red',
    };
    return map[status] || 'dh-badge-gray';
  };

  return (
    <div>
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 4 }}>Cashout</h1>
        <p style={{ color: '#666', fontSize: 13 }}>Gestão de retiradas</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="dh-card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <p style={{ fontSize: 10, color: '#666', fontWeight: 600, textTransform: 'uppercase' }}>{m.label}</p>
                <Icon size={14} color="#00ff88" />
              </div>
              <p style={{ fontSize: 20, fontWeight: 900, color: '#00ff88' }}>{m.value}</p>
            </div>
          );
        })}
      </div>

      <div className="dh-card" style={{ overflowX: 'auto' }}>
        {cashouts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Wallet size={32} color="#333" style={{ marginBottom: 10 }} />
            <p style={{ color: '#666', fontSize: 14 }}>Nenhuma retirada realizada</p>
            <p style={{ color: '#444', fontSize: 12, marginTop: 4 }}>O saldo real será integrado com a plataforma de pagamentos</p>
          </div>
        ) : (
          <table className="dh-table">
            <thead>
              <tr>
                <th>Valor</th>
                <th>Estado</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {cashouts.map((c) => (
                <tr key={c.id}>
                  <td style={{ color: '#00ff88', fontWeight: 700 }}>{c.amount} MT</td>
                  <td><span className={`dh-badge ${statusBadge(c.status)}`}>{c.status.toUpperCase()}</span></td>
                  <td style={{ color: '#9ca3af' }}>{c.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}