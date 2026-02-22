export type OrderStatus = 'Aberta' | 'Parcial' | 'Executada' | 'Cancelada';
export type OrderSide = 'COMPRA' | 'VENDA';
export type AssetType = 'Ações' | 'FIIs' | 'Renda Fixa';
export type EventType =
  | 'Ordem Criada'
  | 'Execução Parcial'
  | 'Execução Total'
  | 'Cancelamento';

export interface Order {
  id: string;
  instrument: string;
  category?: string;
  type?: AssetType;
  side: OrderSide;
  price: number;
  currentPrice: number;
  quantity: number;
  remainingQuantity: number;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderHistory {
  id: string;
  orderId: string;
  instrument: string;
  eventType: EventType;
  details: string;
  origin: string;
  timestamp: string;
}

export interface EvolutionData {
  data: string;
  valor: number;
}

export interface DashboardStats {
  patrimonio_total: number;
  saldo_disponivel: number;
  valor_investido: number;
  rentabilidade_mes: number;
  variacao_diaria_percent: number;
  evolucao_patrimonial: EvolutionData[];
}

export interface Database {
  orders: Order[];
  history: OrderHistory[];
  dashboard_stats: DashboardStats;
  available_assets: AvailableAsset[];
}

export interface AvailableAsset {
  symbol: string;
  name: string;
  type: 'Ações' | 'FIIs' | 'Renda Fixa';
}
