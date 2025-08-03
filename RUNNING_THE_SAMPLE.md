# Running the Morpho Crypto Payment Gateway SDK Sample

This guide will help you run the demo application that showcases the Morpho Crypto Payment Gateway SDK.

## Project Structure

The project is organized as a monorepo with the following structure:

```
morph-stablecoin-sdk/
├── packages/
│   ├── sdk/          # The main SDK package
│   └── demo/         # Demo application
├── package.json      # Root workspace configuration
└── README.md         # Project documentation
```

## Prerequisites

- Node.js 18+ 
- npm or yarn
- A crypto wallet (MetaMask, Rainbow, etc.)

## Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install SDK dependencies
cd packages/sdk
npm install

# Install demo dependencies
cd ../demo
npm install
```

### 2. Build the SDK

```bash
# From the root directory
cd packages/sdk
npm run build
```

### 3. Run the Demo

```bash
# From the root directory
cd packages/demo
npm run dev
```

### 4. Access the Demo

Open your browser and navigate to:
- **Main Demo**: http://localhost:3000
- **Test Page**: http://localhost:3000/test
- **Payment Links**: http://localhost:3000/pay

## Available Scripts

### Root Level Scripts

```bash
# Install all dependencies
npm run install:all

# Build the SDK
npm run build:sdk

# Build the demo
npm run build:demo

# Build everything
npm run build:all

# Start SDK in watch mode
npm run dev:sdk

# Start demo in development mode
npm run dev:demo
```

### SDK Package Scripts

```bash
cd packages/sdk

# Build the SDK
npm run build

# Watch mode for development
npm run dev
```

### Demo Package Scripts

```bash
cd packages/demo

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Demo Features

### 1. Home Page (`/`)
- Overview of the SDK
- Navigation to demo pages
- Quick start guide

### 2. Demo Page (`/demo`)
- Interactive payment gateway
- QR code generation
- POS terminal interface
- Payment link generation
- Real-time payment status

### 3. Payment Links (`/pay`)
- Handles incoming payment links
- Payment completion interface
- Transaction verification

### 4. Test Page (`/test`)
- Basic SDK functionality test
- Material UI component showcase

## Using the Demo

### 1. Connect Your Wallet

1. Click "Connect Wallet" in the top right
2. Choose your preferred wallet (MetaMask, Rainbow, etc.)
3. Connect to Morpho Holesky testnet

### 2. Test QR Code Payments

1. Go to the Demo page
2. Enter a merchant address (or use the default)
3. Click "Launch Payment Gateway"
4. Switch to "QR Code" tab
5. Create a payment request
6. Scan the QR code with your wallet

### 3. Test POS Terminal

1. In the Demo page, switch to "POS Terminal" tab
2. Use the numeric keypad to enter an amount
3. Select a currency
4. Add an optional description
5. Create payment request
6. Complete the payment

### 4. Test Payment Links

1. In the Demo page, switch to "Payment Links" tab
2. Create a payment request
3. Copy the generated link
4. Share the link or open in a new tab
5. Complete the payment

## Configuration

### Merchant Address

The demo uses a default merchant address: `0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6`

You can change this to your own address in the demo interface.

### Supported Currencies

- **ETH**: Native Morpho token
- **USDT**: Tether USD stablecoin  
- **USDC**: USD Coin stablecoin
- **cUSD**: Celo Dollar stablecoin
- **DAI**: Decentralized stablecoin

### Network

The demo runs on **Morpho Holesky testnet**. Make sure your wallet is connected to this network.

## Troubleshooting

### Common Issues

1. **Wallet Connection Issues**
   - Ensure your wallet supports Morpho Holesky testnet
   - Try refreshing the page and reconnecting

2. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check TypeScript version compatibility

3. **Port Already in Use**
   - The demo will automatically try port 3001 if 3000 is occupied
   - Check the terminal output for the correct URL

4. **SDK Import Errors**
   - Ensure the SDK is built: `cd packages/sdk && npm run build`
   - Check that the demo package.json references the SDK correctly

### Development Tips

1. **SDK Development**
   - Use `npm run dev:sdk` for watch mode
   - Changes will automatically rebuild the SDK

2. **Demo Development**
   - Use `npm run dev:demo` for hot reloading
   - Changes to the demo will reflect immediately

3. **Testing**
   - Use the test page to verify basic functionality
   - Check browser console for any errors

## Next Steps

Once you have the demo running:

1. **Explore the SDK**: Try different payment methods and currencies
2. **Integrate into Your App**: Use the SDK in your own application
3. **Customize the UI**: Modify themes and components
4. **Add Features**: Extend the SDK with additional functionality

## Support

If you encounter issues:

1. Check the browser console for errors
2. Verify your wallet is connected to the correct network
3. Ensure all dependencies are installed correctly
4. Try clearing browser cache and refreshing

For more help, refer to the main README.md or open an issue on GitHub. 