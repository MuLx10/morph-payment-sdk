
# Morpho Crypto Payment Gateway SDK

A plug-and-play SDK for vendors to accept crypto payments (USDT, cUSD, ETH, etc.) via QR codes, POS terminals, or payment links—with stablecoin settlement on the Morpho network.

Try out at [app](https://morph-payment-sdk-demo.vercel.app/)
## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Demo](#demo)
- [SDK Components](#sdk-components)
- [SDK Methods](#sdk-methods)
- [Configuration](#configuration)
- [Supported Currencies](#supported-currencies)
- [Payment Methods](#payment-methods)
- [Network Support](#network-support)
- [Examples](#examples)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Features

- Generate **QR codes** for instant crypto payments
- POS terminal interface for in-store payments
- Shareable **payment links** for online and remote transactions
- **Multi-currency** support: ETH, USDT, USDC, cUSD, DAI
- Real-time settlement on the Morpho network
- **Wallet integration** with popular crypto wallets
- **Customizable UI:** light/dark themes, embedded/standalone
- Modern, accessible Material UI components

## Project Structure

This is a monorepo containing multiple packages:

- **`packages/sdk`** — Core SDK package with payment gateway logic
- **`packages/demo`** — Demo application showcasing SDK features

## Quick Start

### 1. Install the SDK

```

npm install morph-stablecoin-sdk

```

### 2. Basic Integration Using `CryptomorphPay`

```

import { CryptomorphPay } from 'morph-stablecoin-sdk';

function App() {
return (
<CryptomorphPay
  address="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
  amount={0.1}
  currency="ETH"
  onSuccess={tx => console.log('Payment success:', tx)}
  onError={err => console.error('Payment error:', err)}
/>
);
}

```

### 3. SDK Integration with Vendor SDK

```

import { createVendorSDK } from 'morph-stablecoin-sdk';

const sdk = createVendorSDK({
  merchantAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  supportedCurrencies: ['USDT', 'USDC', 'ETH'],
  network: 'morph-holesky',
  theme: 'light',
});

// Create a payment request
const payment = sdk.createPayment({
  amount: '100.00',
  currency: 'USDT',
  description: 'Coffee purchase',
});

// Generate QR code data
const qrData = sdk.generateQRData(payment);

// Generate payment link
const paymentLink = sdk.generatePaymentLink(payment);

```

## Demo

The demo app demonstrates all SDK features.

### To run the demo:

```

cd packages/demo
npm run dev

```

Open your browser at `http://localhost:3000`

## SDK Components

### `CryptomorphPay`

The main component for accepting payments:

```

<CryptomorphPay
address="0x..."            // Merchant wallet address
amount={0.1}               // Payment amount
currency="ETH"             // Currency type (ETH, USDT, USDC, USD, etc.)
onSuccess={tx => {}}       // Success callback
onError={err => {}}        // Error callback
theme="light"              // Optional: 'light' or 'dark'
tokenAddress="0x..."       // Optional: override token contract address
posEnabled={false}         // Optional: Enable POS mode
/>

```

**Features:**
- Wallet payment via connected wallet
- QR code for mobile wallet payments
- Payment link generation
- Multi-currency and stablecoin support
- Material UI: clean, responsive interface

### `PaymentLinkHandler`

Handles incoming payment links:

```

<PaymentLinkHandler
  onPaymentSuccess={(txHash) => console.log(txHash)}
  onPaymentError={(error) => console.error(error)}
  theme="light"
/>

```

### `QRCodeGenerator`

Generates QR codes for the given payment data:

```

<QRCodeGenerator
  data={paymentData}
  size={256}
  className="custom-class"
/>

```

## SDK Methods

### `createVendorSDK(config)`

Creates an SDK instance.

```

const sdk = createVendorSDK({
  merchantAddress: '0x...',
  supportedCurrencies: ['USDT', 'USDC', 'ETH'],
  network: 'morph-holesky',
  theme: 'light',
  mode: 'standalone',
});

```

### Available Methods:

- `createPayment(options)`
- `generateQRData(payment)`
- `generatePaymentLink(payment, baseUrl)`
- `getPaymentRequests()`
- `getPaymentRequest(id)`
- `updatePaymentStatus(id, status, txHash)`
- `getPaymentStats()`
- `validatePaymentRequest(payment)`
- `exportPaymentData(format)`

## Configuration

### VendorSDKConfig

```

interface VendorSDKConfig {
  merchantAddress: string;
  supportedCurrencies?: Array<'ETH' | 'USDT' | 'USDC' | 'cUSD' | 'DAI'>;
  network?: 'morph-holesky' | 'morph-mainnet';
  theme?: 'light' | 'dark';
  mode?: 'standalone' | 'embedded';
}

```

### CreatePaymentOptions

```

interface CreatePaymentOptions {
amount: string;
currency: string;
description?: string;
expiresIn?: number; // hours
metadata?: Record<string, any>;
}

```

## Supported Currencies

| Symbol | Description               |
|--------|---------------------------|
| ETH    | Native Morpho token       |
| USDT   | Tether USD stablecoin     |
| USDC   | USD Coin stablecoin       |
| cUSD   | Celo Dollar stablecoin    |
| DAI    | Decentralized stablecoin  |

## Payment Methods

- **QR Code Payments:** Customers scan with their wallet for instant payment
- **POS Terminal:** Numeric keypad and in-store point-of-sale
- **Payment Links:** Shareable links for remote payments

## Network Support

- Supports Morpho Holesky Testnet
- Mainnet support planned for future updates

## Examples

### Multiple Payment Options

```

import { CryptomorphPay } from 'morph-stablecoin-sdk';

function PaymentPage() {
return (
<div>
      <CryptomorphPay
        address="0x742..."
        amount={0.1}
        currency="ETH"
        onSuccess={tx => console.log('ETH payment:', tx)}
      />

      <CryptomorphPay
        address="0x742..."
        amount={50}
        currency="USD"
        onSuccess={tx => console.log('USD payment:', tx)}
      />
    
      <CryptomorphPay
        address="0x742..."
        amount={100}
        currency="USDT"
        onSuccess={tx => console.log('USDT payment:', tx)}
      />
    </div>
    );
}

```

## Development

### Prerequisites

- Node.js v18 or higher
- npm or yarn

### Setup

```

git clone <repository-url>
cd morph-stablecoin-sdk

# Install dependencies

npm run install:all

# Build SDK

npm run build:sdk

# Start Demo

npm run dev:demo

```

### Available Scripts

| Command                | Description                        |
|------------------------|------------------------------------|
| `npm run build:sdk`    | Build SDK package                  |
| `npm run dev:sdk`      | Watch and develop SDK              |
| `npm run dev:demo`     | Run demo app locally               |
| `npm run build:demo`   | Build demo for production          |
| `npm run install:all`  | Install dependencies for all pkgs  |
| `npm run build:all`    | Build all packages                 |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License — see the [LICENSE](LICENSE) file for details.

## Support

For support or questions, please open an issue on the GitHub repository.
```

