import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { IPortfolioResponse } from '../../@types/portfolio';
import { formatCurrency } from '../../utils/formatNumber';
import type { DashboardStats } from '../../@types/api';

export const generatePortfolioReport = (
  positions: IPortfolioResponse[],
  allocation: Record<string, number>,
  stats: DashboardStats,
) => {
  const doc = new jsPDF('p', 'mm', 'a4');

  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text('Relatório do Portfólio - Flowa Stock', 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  doc.text(`Gerado em: ${dataAtual}`, 14, 30);

  doc.setDrawColor(200, 200, 200);
  doc.line(14, 35, 196, 35);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Resumo Financeiro', 14, 45);

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(
    `Patrimônio Total: ${formatCurrency(stats?.patrimonio_total || 0)}`,
    14,
    53,
  );
  doc.text(
    `Valor Investido: ${formatCurrency(stats?.valor_investido || 0)}`,
    14,
    60,
  );
  doc.text(
    `Saldo Disponível: ${formatCurrency(stats?.saldo_disponivel || 0)}`,
    14,
    67,
  );

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Alocação por Classe', 100, 45);

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Ações: ${formatCurrency(allocation?.Ações || 0)}`, 100, 53);
  doc.text(
    `Renda Fixa: ${formatCurrency(allocation?.['Renda Fixa'] || 0)}`,
    100,
    60,
  );
  doc.text(`Caixa: ${formatCurrency(allocation?.Caixa || 0)}`, 100, 67);

  const tableColumns = [
    'Ativo',
    'Tipo',
    'Quantidade',
    'Preço Médio',
    'Preço Atual',
    'Valor Total',
    'Rentabilidade',
  ];

  const tableRows =
    positions?.map((pos) => [
      pos.symbol,
      pos.type.toUpperCase(),
      pos.quantity,
      formatCurrency(pos.avgPrice || pos.totalCost / pos.quantity),
      formatCurrency(pos.currentPrice),
      formatCurrency(pos.totalValue || pos.quantity * pos.currentPrice),
      `${pos.profitPercent?.toFixed(2) || '0.00'}%`,
    ]) || [];

  autoTable(doc, {
    head: [tableColumns],
    body: tableRows,
    startY: 80,
    theme: 'striped',
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [25, 118, 210],
      textColor: 255,
      halign: 'left',
    },
    columnStyles: {
      2: { halign: 'center' },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right' },
    },
  });

  doc.save(`portfolio_flowastock_${dataAtual.replace(/\//g, '-')}.pdf`);
};
