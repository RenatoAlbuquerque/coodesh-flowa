import { render, screen, fireEvent } from '../../../test/utils/AllTheProviders';
import { DatePickerComponent } from './index';
import dayjs from 'dayjs';
import { describe, it, expect, vi } from 'vitest';

describe('DatePickerComponent', () => {
  it('Chama o onChange ao selecionar um dia', async () => {
    const onChange = vi.fn();
    render(
      <DatePickerComponent
        label="Data"
        value={dayjs('2023-10-10')}
        onChange={onChange}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: /choose date|escolha a data/i }),
    );

    const day15 = screen.getByRole('gridcell', { name: '15' });
    fireEvent.click(day15);

    expect(onChange).toHaveBeenCalled();
  });
});
