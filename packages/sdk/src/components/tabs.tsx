import React from 'react';
import { 
  Tabs as MuiTabs, 
  TabsProps as MuiTabsProps,
  Tab,
  Box
} from '@mui/material';

export interface TabsProps extends Omit<MuiTabsProps, 'variant'> {
  variant?: 'default' | 'outline';
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <MuiTabs
        className={className}
        ref={ref}
        {...props}
      >
        {children}
      </MuiTabs>
    );
  }
);

Tabs.displayName = 'Tabs';

export interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children }, ref) => {
    return (
      <Box
        className={className}
        ref={ref}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        {children}
      </Box>
    );
  }
);

TabsList.displayName = 'TabsList';

export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsTrigger = React.forwardRef<HTMLDivElement, TabsTriggerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Tab
        className={className}
        ref={ref}
        {...props}
        label={children}
      />
    );
  }
);

TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={className}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsContent.displayName = 'TabsContent';
