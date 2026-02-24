import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material';
import { Sidebar } from '.';

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: { children: React.ReactNode }) => (
    <a {...props}>{children}</a>
  ),
}));

const mockMediaQuery = vi.fn();
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    useMediaQuery: () => mockMediaQuery(),
  };
});

const renderWithTheme = (ui: React.ReactElement) => {
  const theme = createTheme();
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('Componente Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Renderizar todos os itens de navegação', () => {
    mockMediaQuery.mockReturnValue(true);
    renderWithTheme(<Sidebar />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Ordens')).toBeInTheDocument();
    expect(screen.getByText('Portfólio')).toBeInTheDocument();
    expect(screen.getByText('Histórico')).toBeInTheDocument();
  });

  it('Alternar entre colapsado e expandido no mobile ao clicar no botão', () => {
    mockMediaQuery.mockReturnValue(false);
    renderWithTheme(<Sidebar />);

    const toggleBtn = screen.getByRole('button');

    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();

    fireEvent.click(toggleBtn);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
