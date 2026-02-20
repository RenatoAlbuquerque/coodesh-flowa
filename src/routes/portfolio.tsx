import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/portfolio')({
  beforeLoad: () => {
    document.title = 'Portfólio 💼 | FlowaStock';
  },
  component: () => <div>Bem-vindo à portfolio!</div>,
});
