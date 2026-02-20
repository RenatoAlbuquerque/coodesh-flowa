import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

function HomePage() {
  const [filter, setFilter] = useState('mensal');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard 📊</h1>
      <p>Bem-vindo à Home do FlowaStock!</p>

      <div style={{ marginTop: '10px' }}>
        <button onClick={() => setFilter('diário')}>Diário</button>
        <button onClick={() => setFilter('mensal')}>Mensal</button>
        <p>
          Visualizando relatório: <strong>{filter}</strong>
        </p>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    document.title = 'Dashboard 📊 | FlowaStock';
  },
  component: HomePage,
});
