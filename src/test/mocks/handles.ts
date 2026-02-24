import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('*/orders', () => {
    return HttpResponse.json([
      {
        id: 'ORD-EXISTING-001',
        instrument: 'PETR4',
        side: 'VENDA',
        status: 'Aberta',
        price: 30,
        remainingQuantity: 100,
        quantity: 100,
      },
    ]);
  }),

  http.post('*/orders', () => HttpResponse.json({}, { status: 201 })),
  http.patch('*/orders/:id', () => HttpResponse.json({}, { status: 200 })),
  http.post('*/history', () => HttpResponse.json({}, { status: 201 })),
  http.get('*/dashboard_stats', () =>
    HttpResponse.json({ saldo_disponivel: 10000, valor_investido: 5000 }),
  ),
];
