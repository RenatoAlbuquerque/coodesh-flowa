import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/history')({
  beforeLoad: () => {
    document.title = 'Histórico 📑 | FlowaStock';
  },
  component: () => <div>Bem-vindo à history!</div>,
});
