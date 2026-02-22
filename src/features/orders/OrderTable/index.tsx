import { useState, useCallback } from 'react';
import { DataTable } from '../../../components/molecules/DataTable';
import type { Order, OrderHistory } from '../../../@types/api';
import { historyService } from '../../../services/historyService';
import dayjs from 'dayjs';
import { orderColumns } from './orderColumns';
import { OrderHistoryTimelineModal } from '../../../components/molecules/Modals/OrderHistoryTimeLineModal';

export const OrderTable = ({ data }: { data: Order[] }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewHistory = useCallback(async (order: Order) => {
    setSelectedOrder(order);
    try {
      const results = await historyService.getAll({ orderId: order.id });
      const sorted = results.sort((a, b) =>
        dayjs(b.timestamp).diff(dayjs(a.timestamp)),
      );

      setOrderHistory(sorted);
      setModalOpen(true);
    } catch (err) {
      console.error('Erro ao carregar linha do tempo', err);
    }
  }, []);

  const handleRowClick = useCallback(
    ({ row }: { row: Order }) => {
      handleViewHistory(row);
    },
    [handleViewHistory],
  );

  return (
    <>
      <DataTable
        rows={data as unknown as Record<string, unknown>[]}
        columns={orderColumns}
        onRowClick={handleRowClick}
      />

      <OrderHistoryTimelineModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        order={selectedOrder}
        history={orderHistory}
      />
    </>
  );
};
