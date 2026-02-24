import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { OrderHistory } from '../../@types/api';

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const generateHistoryReport = (historyData: OrderHistory[]) => {
  const doc = new jsPDF('p', 'mm', 'a4');

  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text('Histórico de Eventos - Flowa Stock', 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  doc.text(`Relatório gerado em: ${dataAtual}`, 14, 30);

  doc.setDrawColor(200, 200, 200);
  doc.line(14, 35, 196, 35);

  const tableColumns = [
    'Data/Hora',
    'Ordem',
    'Instrumento',
    'Evento',
    'Detalhes',
    'Origem',
  ];

  const tableRows =
    historyData?.map((item: OrderHistory) => [
      formatDateTime(item.timestamp),
      item.orderId,
      item.instrument,
      item.eventType,
      item.details,
      item.origin,
    ]) || [];

  autoTable(doc, {
    head: [tableColumns],
    body: tableRows,
    startY: 45,
    theme: 'striped',
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [25, 118, 210],
      textColor: 255,
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { fontStyle: 'bold' },
      4: { cellWidth: 'auto' },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 3) {
        const eventType = data.cell.raw;
        if (eventType === 'Execução Total') {
          data.cell.styles.textColor = [25, 135, 84];
          data.cell.styles.fontStyle = 'bold';
        } else if (eventType === 'Execução Parcial') {
          data.cell.styles.textColor = [253, 126, 20];
          data.cell.styles.fontStyle = 'bold';
        } else if (eventType === 'Cancelamento') {
          data.cell.styles.textColor = [220, 53, 69];
        }
      }
    },
  });

  doc.save(`historico_eventos_flowastock_${dataAtual.replace(/\//g, '-')}.pdf`);
};
