import type { EventType, OrderSide, OrderStatus } from '../@types/api';

export const SIDE_OPTIONS: OrderSide[] = ['COMPRA', 'VENDA'];
export const STATUS_OPTIONS: OrderStatus[] = [
  'Aberta',
  'Parcial',
  'Executada',
  'Cancelada',
];
export const EVENT_OPTIONS: EventType[] = [
  'Cancelamento',
  'Execução Parcial',
  'Execução Total',
  'Ordem Criada',
];
