import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/orders')({
  beforeLoad: () => {
    document.title = 'Ordens 🧾 | FlowaStock';
  },
  component: () => <div>Bem-vindo à ordens!</div>,
});
