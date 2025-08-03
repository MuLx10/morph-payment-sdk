'use client';

import React from 'react';
import { PaymentLinkHandler } from 'morph-stablecoin-sdk';

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="w-full max-w-md">
        <PaymentLinkHandler
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
          theme="light"
        />
      </div>
    </div>
  );
} 