import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }
    if (login(email, password)) {
      navigate('/dashboard');
    } else {
      setError('Credenciais inválidas');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', padding: 16 }}>
      <div className="dh-card" style={{ padding: 32, width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h1 style={{ color: '#00ff88', fontWeight: 900, fontSize: 28, letterSpacing: 2, marginBottom: 5 }}>DARK HOT</h1>
          <p style={{ color: '#666', fontSize: 12 }}>Painel Administrativo</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 15 }}>
            <label style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 5, fontWeight: 600 }}>EMAIL</label>
            <input className="dh-input" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 5, fontWeight: 600 }}>PALAVRA-PASSE</label>
            <input className="dh-input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', color: '#ff6666', padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 15 }}>{error}</div>}
          <button type="submit" className="dh-btn" style={{ width: '100%' }}>ENTRAR</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: '#666' }}>Acesso restrito ao proprietário</p>
      </div>
    </div>
  );
}