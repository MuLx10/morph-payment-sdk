
# Morpho Crypto Payment Gateway SDK

A plug-and-play SDK for vendors to accept crypto payments (USDT, cUSD, ETH, etc.) via QR codes, POS terminals, or payment links—with stablecoin settlement on the Morpho network.

**Live Demo:** [Try it out](https://morph-payments-sdk-demo.vercel.app/)

## Vision

To democratize crypto payments by providing merchants with a seamless, secure, and user-friendly way to accept cryptocurrency payments. We envision a future where crypto payments are as simple and ubiquitous as traditional payment methods.

## What We're Trying to Achieve

- **Simplify Crypto Adoption:** Remove the technical barriers for merchants to accept cryptocurrency payments
- **Bridge Traditional & Crypto Commerce:** Enable seamless integration between existing business models and crypto payment infrastructure
- **Stablecoin-First Approach:** Focus on stablecoins to minimize volatility concerns for both merchants and customers
- **Universal Compatibility:** Support multiple wallets and networks to ensure broad accessibility

## Description

The Morpho Crypto Payment Gateway SDK is a comprehensive solution that transforms any business into a crypto-ready merchant. Built on the Morpho network, it provides:

- **Instant Settlement:** Real-time payment processing with immediate confirmation
- **Multi-Currency Support:** Accept ETH, USDT, USDC, cUSD, and DAI payments
- **Flexible Integration:** Works as embedded components or standalone applications
- **User-Friendly Interface:** Clean, accessible UI that works across all devices

## Key Features

- Generate **QR codes** for instant crypto payments
- POS terminal interface for in-store payments
- Shareable **payment links** for online and remote transactions
- **Multi-currency** support: ETH, USDT, USDC, cUSD, DAI
- Real-time settlement on the Morpho network
- **Wallet integration** with popular crypto wallets
- **Customizable UI:** light/dark themes, embedded/standalone
- Modern, accessible Material UI components

## Quick Start

### 1. Install the SDK

```bash
npm install morph-payments-sdk
```

### 2. Basic Integration

```jsx
import { CryptomorphPay } from 'morph-payments-sdk';

function App() {
  return (
    <CryptomorphPay
      address="0x7312Ee30515CAe8B03EF1dF6B75e0D2dBb71B0E4"
      amount={0.1}
      currency="ETH"
      onSuccess={tx => console.log('Payment success:', tx)}
      onError={err => console.error('Payment error:', err)}
    />
  );
}
```

## Project Structure

This is a monorepo containing multiple packages:

- **`packages/sdk`** — Core SDK package with payment gateway logic
- **`packages/demo`** — Demo application showcasing SDK features

## Demo

Run the demo locally:

```bash
cd packages/demo
npm run dev
```

Open your browser at `http://localhost:3000`

## SDK Components

### `CryptomorphPay`

The main component for accepting payments:

```jsx
<CryptomorphPay
  address="0x..."            // Merchant wallet address
  amount={0.1}               // Payment amount
  currency="ETH"             // Currency type
  onSuccess={tx => {}}       // Success callback
  onError={err => {}}        // Error callback
  theme="light"              // Optional: 'light' or 'dark'
  posEnabled={false}         // Optional: Enable POS mode
/>
```

### `PaymentLinkHandler`

Handles incoming payment links:

```jsx
<PaymentLinkHandler
  onPaymentSuccess={(txHash) => console.log(txHash)}
  onPaymentError={(error) => console.error(error)}
  theme="light"
/>
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

## Development

### Prerequisites

- Node.js v18 or higher
- npm or yarn

### Setup

```bash
git clone <repository-url>
cd morph-payments-sdk

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