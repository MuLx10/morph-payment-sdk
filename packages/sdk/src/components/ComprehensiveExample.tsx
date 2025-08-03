import React, { useState, useEffect } from 'react';
import { 
  VendorPaymentGateway
} from '../components/VendorPaymentGateway';
import { PaymentLinkHandler } from '../components/PaymentLinkHandler';
import { QRCodeGenerator } from '../components/QRCodeGenerator';
import { 
  createVendorSDK,
  validateMerchantAddress 
} from '../lib/VendorSDK';
import { VendorSDK } from '../lib/VendorSDK';

export const ComprehensiveExample: React.FC = () => {
  const [merchantAddress, setMerchantAddress] = useState('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6');
  const [sdk, setSdk] = useState<VendorSDK | null>(null);
  const [paymentStats, setPaymentStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'gateway' | 'sdk' | 'qr' | 'links'>('gateway');

  useEffect(() => {
    if (validateMerchantAddress(merchantAddress)) {
      const newSdk = createVendorSDK({
        merchantAddress,
        supportedCurrencies: ['USDT', 'USDC', 'ETH', 'cUSD', 'DAI'],
        theme: 'light'
      });
      setSdk(newSdk);
      setPaymentStats(newSdk.getPaymentStats());
    }
  }, [merchantAddress]);

  const handlePaymentSuccess = (payment: any) => {
    console.log('Payment successful:', payment);
    if (sdk) {
      sdk.updatePaymentStatus(payment.id, 'completed', payment.txHash);
      setPaymentStats(sdk.getPaymentStats());
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
  };

  const createSamplePayment = () => {
    if (!sdk) return;
    
    const payment = sdk.createPayment({
      amount: '50.00',
      currency: 'USDT',
      description: 'Sample payment for demo',
      expiresIn: 24
    });
    
    setPaymentStats(sdk.getPaymentStats());
    return payment;
  };

  const exportData = (format: 'json' | 'csv') => {
    if (!sdk) return;
    const data = sdk.exportPaymentData(format);
    const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Comprehensive SDK Example
          </h1>
          <p className="text-xl text-gray-600">
            Demonstrating all features of the Morpho Crypto Payment Gateway SDK
          </p>
        </div>

        {/* Configuration */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Merchant Address
              </label>
              <input
                type="text"
                value={merchantAddress}
                onChange={(e) => setMerchantAddress(e.target.value)}
                placeholder="0x..."
                className={`w-full p-3 border rounded-lg ${
                  merchantAddress && !validateMerchantAddress(merchantAddress)
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('gateway')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'gateway'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Payment Gateway
          </button>
          <button
            onClick={() => setActiveTab('sdk')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'sdk'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            SDK Demo
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'qr'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            QR Code Demo
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'links'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Payment Links
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg">
          {activeTab === 'gateway' && (
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Payment Gateway Component</h3>
              <VendorPaymentGateway
                merchantAddress={merchantAddress}
                supportedCurrencies={["USDT", "USDC", "ETH", "cUSD", "DAI"]}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                theme="light"
                showQRCode={true}
                showPOS={true}
                showPayLink={true}
              />
            </div>
          )}

          {activeTab === 'sdk' && (
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">SDK Demo</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <button
                    onClick={createSamplePayment}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Create Sample Payment
                  </button>
                  <button
                    onClick={() => exportData('json')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Export JSON
                  </button>
                  <button
                    onClick={() => exportData('csv')}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                  >
                    Export CSV
                  </button>
                </div>

                {paymentStats && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">Payment Statistics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{paymentStats.total}</div>
                        <div className="text-sm text-gray-600">Total Payments</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{paymentStats.completed}</div>
                        <div className="text-sm text-gray-600">Completed</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">{paymentStats.pending}</div>
                        <div className="text-sm text-gray-600">Pending</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{paymentStats.successRate.toFixed(1)}%</div>
                        <div className="text-sm text-gray-600">Success Rate</div>
                      </div>
                    </div>
                  </div>
                )}

                {sdk && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">Recent Payments</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {sdk.getPaymentRequests().slice(0, 5).map((payment) => (
                        <div key={payment.id} className="p-3 bg-white rounded border">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-semibold">{payment.amount} {payment.currency}</span>
                              {payment.description && (
                                <span className="text-sm text-gray-600 ml-2">- {payment.description}</span>
                              )}
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${
                              payment.status === "completed" ? "bg-green-100 text-green-800" :
                              payment.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {payment.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">QR Code Demo</h3>
              <div className="flex justify-center">
                <QRCodeGenerator
                  data={JSON.stringify({
                    type: "crypto_payment",
                    merchant: merchantAddress,
                    amount: "100.00",
                    currency: "USDT",
                    network: "morph-holesky",
                    timestamp: Date.now()
                  })}
                  size={256}
                />
              </div>
            </div>
          )}

          {activeTab === 'links' && (
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Payment Links Demo</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-bold text-blue-900 mb-2">Generated Payment Links</h4>
                  <p className="text-sm text-blue-700 mb-4">
                    These links can be shared with customers for remote payments
                  </p>
                  {sdk && sdk.getPaymentRequests().slice(0, 3).map((payment) => (
                    <div key={payment.id} className="mb-2 p-3 bg-white rounded border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{payment.amount} {payment.currency}</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(sdk.generatePaymentLink(payment))}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                        >
                          Copy Link
                        </button>
                      </div>
                      <div className="text-xs text-gray-600 break-all">
                        {sdk.generatePaymentLink(payment)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features Overview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="text-xl font-bold mb-2">Easy Integration</h3>
            <p className="text-gray-600">
              Simple component-based integration with minimal configuration required.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">SDK Features</h3>
            <p className="text-gray-600">
              Full SDK with payment management, statistics, and data export capabilities.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-2">Customizable</h3>
            <p className="text-gray-600">
              Multiple themes, modes, and configuration options for any use case.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 