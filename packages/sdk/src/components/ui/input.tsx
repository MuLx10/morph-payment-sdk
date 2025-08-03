import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'default' | 'outline';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <TextField
        className={className}
        variant="outlined"
        fullWidth
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
