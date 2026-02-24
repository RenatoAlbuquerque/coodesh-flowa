import { describe, it, expect, vi, beforeEach } from 'vitest';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { generatePortfolioReport } from './generatePortfolioReport';

type MockAutoTableOptions = {
  head: string[][];
  body: string[][];
  didParseCell?: (data: string) => void;
};

vi.mock('jspdf', () => {
  const jsPDFMock = vi.fn();
  jsPDFMock.prototype.setFontSize = vi.fn();
  jsPDFMock.prototype.setTextColor = vi.fn();
  jsPDFMock.prototype.text = vi.fn();
  jsPDFMock.prototype.setDrawColor = vi.fn();
  jsPDFMock.prototype.line = vi.fn();
  jsPDFMock.prototype.save = vi.fn();
  return { default: jsPDFMock };
});

vi.mock('jspdf-autotable', () => ({ default: vi.fn() }));

describe('generatePortfolioReport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockStats = {
    patrimonio_total: 10000,
    saldo_disponivel: 2110,
    valor_investido: 7890,
  };

  const mockAllocation = {
    Ações: 2425,
    'Renda Fixa': 2040,
    Caixa: 2110,
  };

  const mockPositions = [
    {
      symbol: 'ITUB4',
      type: 'Ações',
      quantity: 10,
      totalCost: 350,
      currentPrice: 35,
      profitPercent: 0,
    },
    {
      symbol: 'TESOURO_SELIC',
      type: 'Renda Fixa',
      quantity: 2,
      totalCost: 2040,
      currentPrice: 1020,
      profitPercent: 0,
    },
  ];

  it('Instancia o jsPDF e chama o save com o nome correto', () => {
    generatePortfolioReport(mockPositions, mockAllocation, mockStats);

    expect(jsPDF).toHaveBeenCalledWith('p', 'mm', 'a4');

    const dataAtual = new Date()
      .toLocaleDateString('pt-BR')
      .replace(/\//g, '-');
    expect(jsPDF.prototype.save).toHaveBeenCalledWith(
      `portfolio_flowastock_${dataAtual}.pdf`,
    );
  });

  it('Mapeia corretamente os dados financeiros e renderizar o cabeçalho e textos', () => {
    generatePortfolioReport(mockPositions, mockAllocation, mockStats);

    expect(jsPDF.prototype.text).toHaveBeenCalledWith(
      expect.stringContaining('R$ 10.000,00'),
      14,
      53,
    );
    expect(jsPDF.prototype.text).toHaveBeenCalledWith(
      expect.stringContaining('R$ 2.110,00'),
      14,
      67,
    );
  });

  it('Envia as colunas e as linhas formatadas para o autoTable', () => {
    generatePortfolioReport(mockPositions, mockAllocation, mockStats);

    const autoTableArgs = vi.mocked(autoTable).mock.calls[0];
    const docInstance = autoTableArgs[0];
    const tableOptions = autoTableArgs[1] as MockAutoTableOptions;

    expect(docInstance).toBeDefined();

    expect(tableOptions?.head[0]).toContain('Ativo');
    expect(tableOptions?.head[0]).toContain('Valor Total');

    expect(tableOptions?.body[0][0]).toBe('ITUB4');
    expect(tableOptions?.body[0][1]).toBe('AÇÕES');
    expect(tableOptions?.body[0][2]).toBe(10);
    expect(tableOptions?.body[0][4]).toContain('35,00');

    expect(tableOptions?.body[1][0]).toBe('TESOURO_SELIC');
  });
});
