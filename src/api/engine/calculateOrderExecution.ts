import type { Order, OrderStatus } from '../../@types/api';
import type { OrderFormData } from '../../components/molecules/Modals/NewOrderModal/newOrderScheme';

export const calculateOrderExecution = (
  newOrderData: OrderFormData,
  existingOrders: Order[],
) => {
  const possibleMatches = existingOrders.filter(
    (orderCurrent) =>
      orderCurrent.instrument === newOrderData.instrument &&
      orderCurrent.side !== newOrderData.side &&
      (orderCurrent.status === 'Aberta' || orderCurrent.status === 'Parcial') &&
      (newOrderData.side === 'COMPRA'
        ? newOrderData.price >= orderCurrent.price
        : newOrderData.price <= orderCurrent.price),
  );

  possibleMatches.sort((a, b) =>
    newOrderData.side === 'COMPRA' ? a.price - b.price : b.price - a.price,
  );

  const match = possibleMatches[0];

  if (!match) {
    return {
      hasMatch: false,
      status: 'Aberta' as OrderStatus,
      remainingQuantity: newOrderData.quantity,
    };
  }

  const executionQty = Math.min(newOrderData.quantity, match.remainingQuantity);
  const newOrderRemaining = newOrderData.quantity - executionQty;
  const counterpartRemaining = match.remainingQuantity - executionQty;

  return {
    hasMatch: true,
    match,
    status: (newOrderRemaining === 0 ? 'Executada' : 'Parcial') as OrderStatus,
    remainingQuantity: newOrderRemaining,

    counterpartUpdate: {
      status: (counterpartRemaining === 0
        ? 'Executada'
        : 'Parcial') as OrderStatus,
      remainingQuantity: counterpartRemaining,
    },
  };
};
