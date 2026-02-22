import { Autocomplete, TextField } from '@mui/material';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';

interface AssetAutocompleteProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: string[];
  placeholder?: string;
  label?: string;
}

export const AutocompleteAvailableTickets = <T extends FieldValues>({
  name,
  control,
  options,
  placeholder = 'Selecionar ativo',
  label,
}: AssetAutocompleteProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          {...field}
          options={options}
          value={field.value || null}
          onChange={(_, value) => field.onChange(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              size="small"
              placeholder={placeholder}
              fullWidth
            />
          )}
          slotProps={{
            paper: {
              sx: {
                marginTop: '8px',
                backgroundColor: '#f5f5f5',
                boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                '& .MuiAutocomplete-option': { padding: '12px' },
              },
            },
          }}
        />
      )}
    />
  );
};
