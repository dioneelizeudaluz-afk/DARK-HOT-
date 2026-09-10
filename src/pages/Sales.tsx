import { useState, useEffect } from 'react';
import { ShoppingCart, DollarSign, TrendingUp, Clock, XCircle, RotateCcw } from 'lucide-react';

interface Sale {
  id: string;
  customer_name: string;
  product: string;
  amount: number;
  status: 'confirmada' | 'pendente' | 'cancelada' | 'reembolsada';
  created_at: string;
}

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('dh_sales');
    if (saved) setSales(JSON.parse(saved));
  }, []);

  const totalSales = sales.length;
  const totalValue = sales.filter(s => s.status === 'confirmada').reduce((a, s) => a + s.amount, 0);
  const confirmed = sales.filter(s => s.status === 'confirmada').length;
  const pending = sales.filter(s => s.status === 'pendente').length;
  const refunds = sales.filter(s => s.status === 'reembolsada').length;

  const metrics = [
    { label: 'Total Vendas', value: totalSales, icon: ShoppingCart },
    { label: 'Valor Vendido', value: `${totalValue} MT`, icon: DollarSign },
    { label: 'Confirmadas', value: confirmed, icon: TrendingUp },
    { label: 'Pendentes', value: pending, icon: Clock },
    { label: 'Reembolsos', value: refunds, icon: RotateCcw },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      confirmada: 'dh-badge-green',
      pendente: 'dh-badge-yellow',
      cancelada: 'dh-badge-red',
      reembolsada: 'dh-badge-gray',
    };
    return map[status] || 'dh-badge-gray';
  };

  return (
    <div>
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 4 }}>Vendas</h1>
        <p style={{ color: '#666', fontSize: 13 }}>Acompanhe suas vendas</p>
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
              <p style={{ fontSize: 22, fontWeight: 900, color: '#00ff88' }}>{m.value}</p>
            </div>
          );
        })}
      </div>

      <div className="dh-card" style={{ overflowX: 'auto' }}>
        {sales.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <ShoppingCart size={32} color="#333" style={{ marginBottom: 10 }} />
            <p style={{ color: '#666', fontSize: 14 }}>Nenhuma venda registrada</p>
            <p style={{ color: '#444', fontSize: 12, marginTop: 4 }}>As vendas aparecerão quando integradas com EscalePay</p>
          </div>
        ) : (
          <table className="dh-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Produto</th>
                <th>Valor</th>
                <th>Estado</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td style={{ color: '#00ff88', fontFamily: 'monospace', fontSize: 12 }}>{sale.id}</td>
                  <td style={{ color: '#fff' }}>{sale.customer_name}</td>
                  <td style={{ color: '#9ca3af' }}>{sale.product}</td>
                  <td style={{ color: '#00ff88', fontWeight: 700 }}>{sale.amount} MT</td>
                  <td><span className={`dh-badge ${statusBadge(sale.status)}`}>{sale.status.toUpperCase()}</span></td>
                  <td style={{ color: '#9ca3af' }}>{sale.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}