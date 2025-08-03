import { PaymentRequest } from '../components/VendorPaymentGateway';
import { SupportedCurrency } from './constants';

export interface VendorSDKConfig {
  merchantAddress: string;
  supportedCurrencies?: SupportedCurrency[];
  network?: 'morph-holesky' | 'morph-mainnet';
  theme?: 'light' | 'dark';
  mode?: 'standalone' | 'embedded';
}

export interface CreatePaymentOptions {
  amount: string;
  currency: SupportedCurrency;
  description?: string;
  expiresIn?: number; // hours
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  txHash?: string;
  error?: string;
  paymentRequest?: PaymentRequest;
}

export class VendorSDK {
  private config: VendorSDKConfig;
  private paymentRequests: PaymentRequest[] = [];

  constructor(config: VendorSDKConfig) {
    this.config = {
      supportedCurrencies: ['USDT', 'USDC', 'ETH'],
      network: 'morph-holesky',
      theme: 'light',
      mode: 'standalone',
      ...config
    };
  }

  /**
   * Create a new payment request
   */
  createPayment(options: CreatePaymentOptions): PaymentRequest {
    const paymentRequest: PaymentRequest = {
      id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      merchantAddress: this.config.merchantAddress,
      amount: options.amount,
      currency: options.currency,
      description: options.description,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + (options.expiresIn || 24) * 60 * 60 * 1000),
    };

    this.paymentRequests.unshift(paymentRequest);
    return paymentRequest;
  }

  /**
   * Generate QR code data for a payment request
   */
  generateQRData(paymentRequest: PaymentRequest): string {
    const paymentData = {
      type: "crypto_payment",
      merchant: this.config.merchantAddress,
      amount: paymentRequest.amount,
      currency: paymentRequest.currency,
      requestId: paymentRequest.id,
      description: paymentRequest.description,
      network: this.config.network,
      timestamp: paymentRequest.createdAt.getTime(),
    };
    return JSON.stringify(paymentData);
  }

  /**
   * Generate a payment link for a payment request
   */
  generatePaymentLink(paymentRequest: PaymentRequest, baseUrl?: string): string {
    const url = baseUrl || window.location.origin;
    const paymentData = encodeURIComponent(JSON.stringify({
      merchant: this.config.merchantAddress,
      amount: paymentRequest.amount,
      currency: paymentRequest.currency,
      requestId: paymentRequest.id,
      description: paymentRequest.description,
    }));
    return `${url}/pay?data=${paymentData}`;
  }

  /**
   * Get all payment requests
   */
  getPaymentRequests(): PaymentRequest[] {
    return this.paymentRequests;
  }

  /**
   * Get payment request by ID
   */
  getPaymentRequest(id: string): PaymentRequest | undefined {
    return this.paymentRequests.find(p => p.id === id);
  }

  /**
   * Update payment request status
   */
  updatePaymentStatus(id: string, status: PaymentRequest['status'], txHash?: string): boolean {
    const payment = this.paymentRequests.find(p => p.id === id);
    if (payment) {
      payment.status = status;
      if (txHash) {
        payment.txHash = txHash;
        payment.completedAt = new Date();
      }
      return true;
    }
    return false;
  }

  /**
   * Get payment statistics
   */
  getPaymentStats() {
    const total = this.paymentRequests.length;
    const completed = this.paymentRequests.filter(p => p.status === 'completed').length;
    const pending = this.paymentRequests.filter(p => p.status === 'pending').length;
    const totalAmount = this.paymentRequests
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);

    return {
      total,
      completed,
      pending,
      totalAmount,
      successRate: total > 0 ? (completed / total) * 100 : 0
    };
  }

  /**
   * Validate payment request
   */
  validatePaymentRequest(paymentRequest: PaymentRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!paymentRequest.amount || parseFloat(paymentRequest.amount) <= 0) {
      errors.push('Invalid amount');
    }

    if (!this.config.supportedCurrencies?.includes(paymentRequest.currency)) {
      errors.push('Unsupported currency');
    }

    if (!paymentRequest.merchantAddress || paymentRequest.merchantAddress.length !== 42) {
      errors.push('Invalid merchant address');
    }

    if (paymentRequest.expiresAt && paymentRequest.expiresAt < new Date()) {
      errors.push('Payment request expired');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Export payment data
   */
  exportPaymentData(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = ['ID', 'Amount', 'Currency', 'Status', 'Created', 'Completed', 'TX Hash'];
      const rows = this.paymentRequests.map(p => [
        p.id,
        p.amount,
        p.currency,
        p.status,
        p.createdAt.toISOString(),
        p.completedAt?.toISOString() || '',
        p.txHash || ''
      ]);
      
      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
      
      return csvContent;
    }

    return JSON.stringify(this.paymentRequests, null, 2);
  }

  /**
   * Get SDK configuration
   */
  getConfig(): VendorSDKConfig {
    return { ...this.config };
  }

  /**
   * Update SDK configuration
   */
  updateConfig(newConfig: Partial<VendorSDKConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Utility functions for easy integration
export const createVendorSDK = (config: VendorSDKConfig): VendorSDK => {
  return new VendorSDK(config);
};

export const validateMerchantAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const formatAmount = (amount: string, currency: SupportedCurrency): string => {
  const num = parseFloat(amount);
  if (isNaN(num)) return '0.00';
  
  if (currency === 'ETH') {
    return num.toFixed(6);
  }
  return num.toFixed(2);
};

export const getSupportedCurrencies = (): SupportedCurrency[] => {
  return ['ETH', 'USDT', 'USDC', 'cUSD', 'DAI', 'USD'];
}; 