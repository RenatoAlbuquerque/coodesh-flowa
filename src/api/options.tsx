import type { OrderSide, OrderStatus } from "../@types/api";

export const SIDE_OPTIONS: OrderSide[] = ['COMPRA', 'VENDA'];
export const STATUS_OPTIONS: OrderStatus[] = ['Aberta', 'Parcial', 'Executada', 'Cancelada'];