import { describe, it, expect, vi, beforeEach } from 'vitest';
import jsPDF from 'jspdf';
import autoTable, { CellHookData } from 'jspdf-autotable';
import { generateHistoryReport } from './generateHistoryReport';
import type { OrderHistory } from '../../@types/api';

type MockAutoTableOptions = {
  head: string[][];
  body: string[][];
  didParseCell?: IDidParseCell;
};

type MockDataTotal = {
  section: string;
  column: {
    index: number;
  };
  cell: {
    raw: string;
    styles: {
      textColor?: number[];
      fontStyle?: string;
    };
  };
};

type IDidParseCell = (data: string) => void;

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

describe('generateHistoryReport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockHistoryData: OrderHistory[] = [
    {
      id: 'a8ee',
      orderId: 'ORD-9444',
      instrument: 'B3SA3',
      eventType: 'Ordem Criada',
      details: 'Ordem de VENDA inserida',
      origin: 'Renato Abreu',
      timestamp: '2026-02-24T02:17:41.821Z',
    },
    {
      id: '077a',
      orderId: 'ORD-1079',
      instrument: 'TESOURO_SELIC',
      eventType: 'Execução Total',
      details: 'COMPRA de 1 @ R$ 1015 contra ORD-9013',
      origin: 'Sistema de Matching',
      timestamp: '2026-02-23T18:00:44.000Z',
    },
    {
      id: '077b',
      orderId: 'ORD-1078',
      instrument: 'TESOURO_SELIC',
      eventType: 'Cancelamento',
      details: 'COMPRA de 2 @ R$ 1015 contra ORD-9013',
      origin: 'Sistema de Matching',
      timestamp: '2026-02-23T18:00:44.000Z',
    },
  ];

  it('Instancia o jsPDF e salva o arquivo com nome correto', () => {
    generateHistoryReport(mockHistoryData);

    const dataAtual = new Date()
      .toLocaleDateString('pt-BR')
      .replace(/\//g, '-');
    expect(jsPDF.prototype.save).toHaveBeenCalledWith(
      `historico_eventos_flowastock_${dataAtual}.pdf`,
    );
  });

  it('Formata a data ISO e mapeia corretamente as linhas no autoTable', () => {
    generateHistoryReport(mockHistoryData);

    const autoTableArgs = vi.mocked(autoTable).mock.calls[0];
    const tableOptions = autoTableArgs[1] as MockAutoTableOptions;

    expect(tableOptions.head[0]).toEqual([
      'Data/Hora',
      'Ordem',
      'Instrumento',
      'Evento',
      'Detalhes',
      'Origem',
    ]);

    expect(tableOptions.body[0][0]).toContain('2026');

    expect(tableOptions.body[0][1]).toBe('ORD-9444');
    expect(tableOptions.body[0][3]).toBe('Ordem Criada');

    expect(tableOptions.body[1][2]).toBe('TESOURO_SELIC');
    expect(tableOptions.body[1][3]).toBe('Execução Total');
  });

  it('Passa a função didParseCell corretamente para customização de cores', () => {
    generateHistoryReport(mockHistoryData);

    const autoTableArgs = vi.mocked(autoTable).mock.calls[0];
    const tableOptions = autoTableArgs[1];

    expect(typeof tableOptions.didParseCell).toBe('function');
  });

  it('Aplica as cores corretas na coluna de Evento (didParseCell)', () => {
    generateHistoryReport(mockHistoryData);

    const autoTableArgs = vi.mocked(autoTable).mock.calls[0];
    const tableOptions = autoTableArgs[1];

    const didParseCell = tableOptions?.didParseCell;

    const createMockCellData = (
      section: string,
      colIndex: number,
      rawValue: string,
    ) => ({
      section,
      column: { index: colIndex },
      cell: {
        raw: rawValue,
        styles: {} as { textColor?: number[]; fontStyle?: string },
      },
    });

    const mockDataTotal: MockDataTotal = createMockCellData(
      'body',
      3,
      'Execução Total',
    );
    didParseCell?.(mockDataTotal as CellHookData);
    expect(mockDataTotal.cell.styles.textColor).toEqual([25, 135, 84]);
    expect(mockDataTotal.cell.styles.fontStyle).toBe('bold');

    const mockDataParcial = createMockCellData('body', 3, 'Execução Parcial');
    didParseCell?.(mockDataParcial as CellHookData);
    expect(mockDataParcial.cell.styles.textColor).toEqual([253, 126, 20]);
    expect(mockDataParcial.cell.styles.fontStyle).toBe('bold');

    const mockDataCancel = createMockCellData('body', 3, 'Cancelamento');
    didParseCell?.(mockDataCancel as CellHookData);
    expect(mockDataCancel.cell.styles.textColor).toEqual([220, 53, 69]);

    const mockDataOtherCol = createMockCellData('body', 2, 'Execução Total');
    didParseCell?.(mockDataOtherCol as CellHookData);
    expect(mockDataOtherCol.cell.styles).toEqual({});

    const mockDataHead = createMockCellData('head', 3, 'Execução Total');
    didParseCell?.(mockDataHead as CellHookData);
    expect(mockDataHead.cell.styles).toEqual({});
  });
});
