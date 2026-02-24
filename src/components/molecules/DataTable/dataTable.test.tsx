import { DataTable } from '.';
import { render, screen, fireEvent } from '../../../test/utils/AllTheProviders';
import { describe, it, expect } from 'vitest';

const columns = [
  { field: 'id', headerName: 'ID', sortable: true },
  { field: 'name', headerName: 'Nome', sortable: true },
];

const rows = [{ id: 1, name: 'Teste 1' }];

describe('Teste na Tabela de Dados', () => {
  it('Exibe o overlay customizado "Nenhum resultado encontrado" quando a tabela estiver vazia', () => {
    render(<DataTable rows={[]} columns={columns} />);

    expect(
      screen.getByText(/nenhum resultado encontrado/i),
    ).toBeInTheDocument();

    const message = screen.getByText(/nenhum resultado encontrado/i);
    expect(message.tagName).toBe('H2');
  });

  it('Exibe os ícones de ordenação customizados (KeyboardArrowUp/Down) ao interagir com o cabeçalho', async () => {
    render(<DataTable rows={rows} columns={columns} />);
    const columnHeader = screen.getByRole('columnheader', { name: /id/i });

    fireEvent.click(columnHeader);

    expect(screen.getByTestId('KeyboardArrowUpIcon')).toBeInTheDocument();

    fireEvent.click(columnHeader);

    expect(screen.getByTestId('KeyboardArrowDownIcon')).toBeInTheDocument();
  });
});
