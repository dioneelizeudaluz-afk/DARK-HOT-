import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface Lead {
  id: string;
  telegram_id: number;
  name: string;
  username: string | null;
  status: 'novo' | 'interessado' | 'recuperacao' | 'comprou' | 'inativo';
  last_activity: string;
  created_at: string;
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('todos');

  useEffect(() => {
    const saved = localStorage.getItem('dh_leads');
    if (saved) setLeads(JSON.parse(saved));
  }, []);

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || String(l.telegram_id).includes(search);
    const matchFilter = filter === 'todos' || l.status === filter;
    return matchSearch && matchFilter;
  });

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      novo: 'dh-badge-green',
      interessado: 'dh-badge-yellow',
      recuperacao: 'dh-badge-yellow',
      comprou: 'dh-badge-green',
      inativo: 'dh-badge-gray',
    };
    return map[status] || 'dh-badge-gray';
  };

  return (
    <div>
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 4 }}>Leads</h1>
        <p style={{ color: '#666', fontSize: 13 }}>Gerencie os leads do seu bot</p>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={16} color="#666" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input className="dh-input" placeholder="Pesquisar por nome ou ID" value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
        </div>
        <select className="dh-input" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: 180 }}>
          <option value="todos">Todos os estados</option>
          <option value="novo">Novo</option>
          <option value="interessado">Interessado</option>
          <option value="recuperacao">Recuperação</option>
          <option value="comprou">Comprou</option>
          <option value="inativo">Inativo</option>
        </select>
      </div>

      <div className="dh-card" style={{ overflowX: 'auto' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: '#666', fontSize: 14 }}>Nenhum lead encontrado</p>
            <p style={{ color: '#444', fontSize: 12, marginTop: 4 }}>Os leads aparecerão quando o bot estiver conectado</p>
          </div>
        ) : (
          <table className="dh-table">
            <thead>
              <tr>
                <th>Telegram</th>
                <th>Nome</th>
                <th>Estado</th>
                <th>Última Atividade</th>
                <th>Data Entrada</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id}>
                  <td style={{ color: '#00ff88', fontFamily: 'monospace' }}>{lead.telegram_id}</td>
                  <td style={{ color: '#fff' }}>{lead.name}</td>
                  <td><span className={`dh-badge ${statusBadge(lead.status)}`}>{lead.status.toUpperCase()}</span></td>
                  <td style={{ color: '#9ca3af' }}>{lead.last_activity}</td>
                  <td style={{ color: '#9ca3af' }}>{lead.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}