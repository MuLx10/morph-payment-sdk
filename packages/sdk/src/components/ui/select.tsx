import React from 'react';
import { 
  Select as MuiSelect, 
  SelectProps as MuiSelectProps,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';

export interface SelectProps extends Omit<MuiSelectProps, 'variant'> {
  variant?: 'default' | 'outline';
  options?: Array<{ value: string; label: string }>;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ className, variant = 'default', options = [], children, ...props }, ref) => {
    return (
      <FormControl fullWidth>
        <InputLabel>{props.label}</InputLabel>
        <MuiSelect
          className={className}
          variant="outlined"
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
          {children}
        </MuiSelect>
      </FormControl>
    );
  }
);

Select.displayName = 'Select';

// Export sub-components for compatibility
export const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <MenuItem value={value}>{children}</MenuItem>
);
export const SelectTrigger = ({ children, ...props }: any) => <div {...props}>{children}</div>;
export const SelectValue = ({ placeholder }: { placeholder?: string }) => <span>{placeholder}</span>;
