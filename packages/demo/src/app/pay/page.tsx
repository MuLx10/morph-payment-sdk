'use client';

import React from 'react';
import { PaymentLinkHandler } from 'morph-payments-sdk';
import { Box, Container } from '@mui/material';

export default function PayPage() {
  const handlePaymentSuccess = (txHash: string) => {
    console.log('Payment successful:', txHash);
    // You can redirect or show success message
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    // You can show error message
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'grey.50', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      py: 4
    }}>
      <Container maxWidth="sm">
        <PaymentLinkHandler
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
          theme="light"
        />
      </Container>
    </Box>
  );
} 