import React, { useState, useEffect } from 'react';

export const PasswordProtection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('site_auth');
    if (auth === 'true') setIsAuthorized(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Sekaneseka3') {
      setIsAuthorized(true);
      localStorage.setItem('site_auth', 'true');
    } else {
      alert('Špatné heslo!');
    }
  };

  if (!isAuthorized) {
    return (
      <div style={{ 
        height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center', 
        backgroundColor: '#000', color: '#fff', fontFamily: 'sans-serif',
        position: 'fixed', top: 0, left: 0, zIndex: 9999
      }}>
        <h1 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Lojzovy Paseky - Soukromá zóna</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Zadejte heslo"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#111', color: '#fff' }}
          />
          <button type="submit" style={{ 
            padding: '12px 24px', borderRadius: '8px', border: 'none', 
            backgroundColor: '#fff', color: '#000', cursor: 'pointer', fontWeight: 'bold' 
          }}>
            Vstoupit
          </button>
        </form>
        <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#888' }}>
          Vstup pouze pro pana doktora.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
