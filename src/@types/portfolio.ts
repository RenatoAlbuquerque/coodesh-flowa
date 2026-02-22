import type { AssetType } from './api';

export interface IPortfolioResponse {
  avgPrice: number;
  currentPrice: number;
  profitPercent: number;
  quantity: number;
  symbol: string;
  totalCost: number;
  totalValue: number;
  type: AssetType;
}

export interface IPortfolioStatusResponse {
  patrimonio_total: number;
  saldo_disponivel: number;
  valor_investido: number;
  rentabilidade_mes: number;
  variacao_diaria_percent: number;
  evolucao_patrimonial: { data: string; valor: number }[];
}
