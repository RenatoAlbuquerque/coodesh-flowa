import { z } from 'zod';

export const orderSchema = z.object({
  instrument: z.string().min(1, 'Selecione um ativo'),
  side: z.enum(['COMPRA', 'VENDA']),
  price: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number('Preço é obrigatório').min(0.01, 'Mínimo R$ 0.01'),
  ),
  quantity: z.coerce.number().int().min(1, 'Quantidade mínima é 1'),
});

export type OrderFormData = z.infer<typeof orderSchema>;

export type OrderFormInput = z.input<typeof orderSchema>;
