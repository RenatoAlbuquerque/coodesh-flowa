import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';

interface DatePickerProps {
  label?: string;
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null) => void;
}

export const DatePicker = ({ label, value, onChange }: DatePickerProps) => {
  return (
    <MuiDatePicker
      label={label}
      value={value}
      onChange={onChange}
      format="DD/MM/YYYY"
      disableFuture
      dayOfWeekFormatter={(date) => {
        const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
        return days[date.day()];
      }}
      slotProps={{
        textField: {
          size: 'small',
          fullWidth: true,
          variant: 'outlined',
          sx: {
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#fff',
              color: '#0F172A',
            },
          },
        },
        layout: {
          sx: {
            '& .MuiDateCalendar-root': {
              minHeight: 'auto',
              height: 'auto',
            },
            '& .MuiDayCalendar-header .MuiTypography-root': {
              fontSize: '0.9rem',
              fontWeight: 700,
            },
            '& .MuiDayCalendar-monthContainer': {
              minHeight: 'unset',
            },
          },
        },
        calendarHeader: {
          sx: {
            '& .MuiPickersCalendarHeader-label': {
              fontSize: '1rem !important',
              color: '#0F172A !important',
              textTransform: 'capitalize',
            },
          },
        },
        desktopPaper: {
          sx: {
            backgroundColor: '#fff !important',
            borderRadius: '12px',
            boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            '& .MuiTypography-root': { color: '#0F172A !important' },
            '& .MuiSvgIcon-root': { color: '#0b66ff !important' },
          },
        },
        day: {
          sx: {
            color: '#0F172A',
            fontSize: '0.95rem',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#e6f0ff !important',
            },
            '&.MuiPickersDay-today': {
              borderColor: '#0b66ff !important',
              borderWidth: '1px',
            },
            '&.Mui-selected': {
              backgroundColor: '#092D66 !important',
              color: '#fff !important',
              '&:hover': {
                backgroundColor: '#0b66ff !important',
              },
            },
            '&.Mui-disabled': {
              color: '#94A3B8 !important',
            },
          },
        },
      }}
    />
  );
};
