import { Users, UserCheck, MessageSquare, ShoppingCart, DollarSign, TrendingUp, Wallet, Clock } from 'lucide-react';

export default function Dashboard() {
  const metrics = [
    { label: 'Pessoas no Bot', value: 0, icon: Users, color: '#00ff88' },
    { label: 'Pessoas Ativas', value: 0, icon: UserCheck, color: '#00ff88' },
    { label: 'Leads', value: 0, icon: Users, color: '#00ff88' },
    { label: 'Vendas', value: 0, icon: ShoppingCart, color: '#00ff88' },
    { label: 'Mensagens Enviadas', value: 0, icon: MessageSquare, color: '#00ff88' },
    { label: 'Taxa de Conversão', value: '0%', icon: TrendingUp, color: '#00ff88' },
    { label: 'Saldo', value: '0 MT', icon: DollarSign, color: '#00ff88' },
    { label: 'Cashout Pendente', value: '0 MT', icon: Wallet, color: '#f59e0b' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 4 }}>Dashboard</h1>
        <p style={{ color: '#666', fontSize: 13 }}>Visão geral do seu bot</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 30 }}>
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="dh-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <p style={{ fontSize: 11, color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{m.label}</p>
                <Icon size={16} color={m.color} />
              </div>
              <p style={{ fontSize: 26, fontWeight: 900, color: m.color }}>{m.value}</p>
              <p style={{ fontSize: 10, color: '#444', marginTop: 4 }}>Aguardando dados</p>
            </div>
          );
        })}
      </div>

      <div className="dh-card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#fff' }}>Atividade Recente</h3>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Clock size={32} color="#333" style={{ marginBottom: 10 }} />
          <p style={{ color: '#666', fontSize: 13 }}>Nenhuma atividade registrada</p>
          <p style={{ color: '#444', fontSize: 11, marginTop: 4 }}>As atividades aparecerão quando o bot estiver conectado</p>
        </div>
      </div>
    </div>
  );
}