# Morpho Crypto Payment Gateway SDK

A plug-and-play SDK for vendors to accept crypto payments (USDT, cUSD, etc.) via QR codes, POS terminals, or payment links with stablecoin settlement on the Morpho network.

## Project Structure

This is a monorepo containing:

- **`packages/sdk`** - The main SDK package
- **`packages/demo`** - Demo application showcasing the SDK

## Features

- **QR Code Payments**: Generate QR codes for instant crypto payments
- **POS Terminal**: Point-of-sale interface for in-store payments
- **Payment Links**: Shareable payment links for online and remote payments
- **Multi-Currency Support**: ETH, USDT, USDC, cUSD, DAI
- **Real-time Settlement**: Instant stablecoin settlement on Morpho network
- **Wallet Integration**: Seamless integration with popular crypto wallets
- **Customizable UI**: Light/dark themes and embedded/standalone modes
- **Material UI Components**: Modern, accessible UI components

## Quick Start

### 1. Install the SDK

```bash
npm install morph-stablecoin-sdk
```

### 2. Basic Integration

```tsx
import { VendorPaymentGateway } from 'morph-stablecoin-sdk';

function App() {
  const handlePaymentSuccess = (payment) => {
    console.log('Payment successful:', payment);
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
  };

  return (
    <VendorPaymentGateway
      merchantAddress="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
      supportedCurrencies={["USDT", "USDC", "ETH"]}
      onPaymentSuccess={handlePaymentSuccess}
      onPaymentError={handlePaymentError}
    />
  );
}
```

### 3. SDK Integration

```tsx
import { createVendorSDK } from 'morph-stablecoin-sdk';

const sdk = createVendorSDK({
  merchantAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  supportedCurrencies: ['USDT', 'USDC', 'ETH'],
  network: 'morph-holesky',
  theme: 'light'
});

// Create a payment request
const payment = sdk.createPayment({
  amount: '100.00',
  currency: 'USDT',
  description: 'Coffee purchase'
});

// Generate QR code data
const qrData = sdk.generateQRData(payment);

// Generate payment link
const paymentLink = sdk.generatePaymentLink(payment);
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone <repository>
cd morph-stablecoin-sdk

# Install all dependencies
npm run install:all

# Build the SDK
npm run build:sdk

# Start the demo
npm run dev:demo
```

### Available Scripts

- `npm run build:sdk` - Build the SDK package
- `npm run dev:sdk` - Watch mode for SDK development
- `npm run dev:demo` - Start the demo application
- `npm run build:demo` - Build the demo application
- `npm run install:all` - Install dependencies for all packages
- `npm run build:all` - Build all packages

## Demo

The demo application is located in `packages/demo` and showcases all features of the SDK:

- **Home Page**: Overview and navigation
- **Demo Page**: Interactive payment gateway demonstration
- **Payment Links**: Handles incoming payment links

To run the demo:

```bash
cd packages/demo
npm run dev
```

Visit `http://localhost:3000` to see the demo in action.

## SDK Components

### VendorPaymentGateway

The main component for accepting crypto payments.

```tsx
<VendorPaymentGateway
  merchantAddress="0x..."
  supportedCurrencies={["USDT", "USDC", "ETH"]}
  onPaymentSuccess={(payment) => console.log(payment)}
  onPaymentError={(error) => console.error(error)}
  theme="light"
  mode="standalone"
  showQRCode={true}
  showPOS={true}
  showPayLink={true}
/>
```

### PaymentLinkHandler

Handles incoming payment links.

```tsx
<PaymentLinkHandler
  onPaymentSuccess={(txHash) => console.log(txHash)}
  onPaymentError={(error) => console.error(error)}
  theme="light"
/>
```

### QRCodeGenerator

Generates QR codes for payment data.

```tsx
<QRCodeGenerator
  data={paymentData}
  size={256}
  className="custom-class"
/>
```

## SDK Methods

### createVendorSDK(config)

Creates a new SDK instance.

```tsx
const sdk = createVendorSDK({
  merchantAddress: '0x...',
  supportedCurrencies: ['USDT', 'USDC', 'ETH'],
  network: 'morph-holesky',
  theme: 'light',
  mode: 'standalone'
});
```

### SDK Methods

- `createPayment(options)` - Create a new payment request
- `generateQRData(payment)` - Generate QR code data
- `generatePaymentLink(payment, baseUrl)` - Generate payment link
- `getPaymentRequests()` - Get all payment requests
- `getPaymentRequest(id)` - Get specific payment request
- `updatePaymentStatus(id, status, txHash)` - Update payment status
- `getPaymentStats()` - Get payment statistics
- `validatePaymentRequest(payment)` - Validate payment request
- `exportPaymentData(format)` - Export payment data

## Configuration

### VendorSDKConfig

```tsx
interface VendorSDKConfig {
  merchantAddress: string;
  supportedCurrencies?: SupportedCurrency[];
  network?: 'morph-holesky' | 'morph-mainnet';
  theme?: 'light' | 'dark';
  mode?: 'standalone' | 'embedded';
}
```

### CreatePaymentOptions

```tsx
interface CreatePaymentOptions {
  amount: string;
  currency: SupportedCurrency;
  description?: string;
  expiresIn?: number; // hours
  metadata?: Record<string, any>;
}
```

## Supported Currencies

- **ETH**: Native Morpho token
- **USDT**: Tether USD stablecoin
- **USDC**: USD Coin stablecoin
- **cUSD**: Celo Dollar stablecoin
- **DAI**: Decentralized stablecoin

## Payment Methods

### QR Code Payments

Generate QR codes that customers can scan with their crypto wallets for instant payments.

### POS Terminal

Point-of-sale interface with numeric keypad for in-store payments.

### Payment Links

Generate shareable links that customers can use to complete payments remotely.

## Network Support

Currently supports Morpho Holesky testnet. Mainnet support coming soon.

## Examples

### Basic Integration

```tsx
import { VendorPaymentGateway } from 'morph-stablecoin-sdk';

function MyApp() {
  return (
    <VendorPaymentGateway
      merchantAddress="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
      onPaymentSuccess={(payment) => {
        alert(`Payment successful! TX: ${payment.txHash}`);
      }}
    />
  );
}
```

### Advanced Integration

```tsx
import { createVendorSDK, VendorPaymentGateway } from 'morph-stablecoin-sdk';

const sdk = createVendorSDK({
  merchantAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  supportedCurrencies: ['USDT', 'USDC', 'ETH'],
  theme: 'dark'
});

function AdvancedApp() {
  const [paymentRequests, setPaymentRequests] = useState([]);

  useEffect(() => {
    setPaymentRequests(sdk.getPaymentRequests());
  }, []);

  return (
    <div>
      <VendorPaymentGateway
        merchantAddress="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
        onPaymentSuccess={(payment) => {
          sdk.updatePaymentStatus(payment.id, 'completed', payment.txHash);
          setPaymentRequests(sdk.getPaymentRequests());
        }}
        theme="dark"
        mode="embedded"
      />
      
      <div>
        <h3>Payment Statistics</h3>
        <pre>{JSON.stringify(sdk.getPaymentStats(), null, 2)}</pre>
      </div>
    </div>
  );
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support and questions, please open an issue on GitHub.
