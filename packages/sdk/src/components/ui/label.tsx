import React from 'react';
import { FormLabel, FormLabelProps } from '@mui/material';

export interface LabelProps extends FormLabelProps {
  variant?: 'default' | 'outline';
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <FormLabel
        className={className}
        ref={ref}
        {...props}
      >
        {children}
      </FormLabel>
    );
  }
);

Label.displayName = 'Label';
