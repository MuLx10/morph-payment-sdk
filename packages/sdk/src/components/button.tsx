import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const getMuiVariant = (variant: string): 'text' | 'outlined' | 'contained' => {
      switch (variant) {
        case 'outline':
          return 'outlined';
        case 'ghost':
        case 'link':
          return 'text';
        default:
          return 'contained';
      }
    };

    const getMuiSize = (size: string): 'small' | 'medium' | 'large' => {
      switch (size) {
        case 'sm':
          return 'small';
        case 'lg':
          return 'large';
        default:
          return 'medium';
      }
    };

    const getMuiColor = (variant: string): 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
      switch (variant) {
        case 'destructive':
          return 'error';
        case 'secondary':
          return 'secondary';
        default:
          return 'primary';
      }
    };

    return (
      <MuiButton
        className={className}
        variant={getMuiVariant(variant)}
        size={getMuiSize(size)}
        color={getMuiColor(variant)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
