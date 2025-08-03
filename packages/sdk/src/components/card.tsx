import React from 'react';
import { 
  Card as MuiCard, 
  CardProps as MuiCardProps,
  CardContent as MuiCardContent,
  CardContentProps as MuiCardContentProps,
  CardHeader as MuiCardHeader,
  CardHeaderProps as MuiCardHeaderProps,
  Typography
} from '@mui/material';

export interface CardProps extends Omit<MuiCardProps, 'variant'> {
  variant?: 'default' | 'outline';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <MuiCard
        className={className}
        ref={ref}
        {...props}
      >
        {children}
      </MuiCard>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends MuiCardHeaderProps {
  variant?: 'default' | 'outline';
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <MuiCardHeader
        className={className}
        ref={ref}
        {...props}
      >
        {children}
      </MuiCardHeader>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle = React.forwardRef<HTMLDivElement, CardTitleProps>(
  ({ className, children }, ref) => {
    return (
      <Typography
        variant="h6"
        component="div"
        className={className}
        ref={ref}
      >
        {children}
      </Typography>
    );
  }
);

CardTitle.displayName = 'CardTitle';

export interface CardContentProps extends MuiCardContentProps {
  variant?: 'default' | 'outline';
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <MuiCardContent
        className={className}
        ref={ref}
        {...props}
      >
        {children}
      </MuiCardContent>
    );
  }
);

CardContent.displayName = 'CardContent';
