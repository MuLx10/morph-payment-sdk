import React from 'react';
import { VendorPaymentGateway } from './VendorPaymentGateway';

interface SimpleIntegrationProps {
  merchantAddress: string;
  theme?: 'light' | 'dark';
}

export const SimpleIntegration: React.FC<SimpleIntegrationProps> = ({
  merchantAddress,
  theme = 'light'
}) => {
  const handlePaymentSuccess = (payment: any) => {
    console.log('Payment successful:', payment);
    // Handle successful payment
    // You can update your database, send confirmation email, etc.
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    // Handle payment error
    // You can show error message to user
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Accept Crypto Payments</h2>
        <p className="text-gray-600">
          Simple integration - just add your merchant address
        </p>
      </div>

      <VendorPaymentGateway
        merchantAddress={merchantAddress}
        supportedCurrencies={["USDT", "USDC", "ETH"]}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
        theme={theme}
        showQRCode={true}
        showPOS={true}
        showPayLink={true}
      />
    </div>
  );
}; 