'use client';

import React, { useState } from 'react';
import { VendorPaymentGateway } from 'morph-stablecoin-sdk';
import { createVendorSDK, validateMerchantAddress } from 'morph-stablecoin-sdk';
import { 
  Button, 
  TextField, 
  Paper, 
  Typography, 
  Box, 
  Grid,
  Alert,
  Chip
} from '@mui/material';

export default function DemoPage() {
  const [merchantAddress, setMerchantAddress] = useState('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6');
  const [showGateway, setShowGateway] = useState(false);

  const handlePaymentSuccess = (payment: any) => {
    console.log('Payment successful:', payment);
    alert(`Payment successful! Transaction: ${payment.txHash}`);
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    alert(`Payment failed: ${error.message}`);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setMerchantAddress(address);
    setShowGateway(false);
  };

  const isValidAddress = validateMerchantAddress(merchantAddress);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h2" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
            Crypto Payment Gateway Demo
          </Typography>
          <Typography variant="h5" color="text.secondary">
            A plug-and-play SDK for vendors to accept crypto payments
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
            Configuration
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                Merchant Address
              </Typography>
              <TextField
                type="text"
                value={merchantAddress}
                onChange={handleAddressChange}
                placeholder="0x..."
                fullWidth
                error={!!(merchantAddress && !isValidAddress)}
                helperText={merchantAddress && !isValidAddress ? "Please enter a valid Ethereum address" : ""}
              />
            </Box>
            
            <Button
              onClick={() => setShowGateway(true)}
              disabled={!isValidAddress}
              variant="contained"
              color="success"
              size="large"
              fullWidth
            >
              Launch Payment Gateway
            </Button>
          </Box>
        </Paper>

        {showGateway && isValidAddress && (
          <Paper elevation={3}>
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
          </Paper>
        )}

        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h2" sx={{ mb: 2 }}>📱</Typography>
              <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
                QR Code Payments
              </Typography>
              <Typography color="text.secondary">
                Generate QR codes for instant crypto payments. Customers can scan and pay directly from their wallets.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h2" sx={{ mb: 2 }}>💳</Typography>
              <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
                POS Terminal
              </Typography>
              <Typography color="text.secondary">
                Point-of-sale interface for in-store payments. Enter amounts and create payment requests instantly.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h2" sx={{ mb: 2 }}>🔗</Typography>
              <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
                Payment Links
              </Typography>
              <Typography color="text.secondary">
                Generate shareable payment links for online and remote payments. Send to customers via email or messaging.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
            Supported Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                Supported Currencies
              </Typography>
              <Box component="ul" sx={{ color: 'text.secondary', pl: 2 }}>
                <Typography component="li">• ETH (Native)</Typography>
                <Typography component="li">• USDT (Stablecoin)</Typography>
                <Typography component="li">• USDC (Stablecoin)</Typography>
                <Typography component="li">• cUSD (Celo Dollar)</Typography>
                <Typography component="li">• DAI (Decentralized)</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                Payment Methods
              </Typography>
              <Box component="ul" sx={{ color: 'text.secondary', pl: 2 }}>
                <Typography component="li">• QR Code Scanning</Typography>
                <Typography component="li">• POS Terminal Interface</Typography>
                <Typography component="li">• Shareable Payment Links</Typography>
                <Typography component="li">• Direct Wallet Integration</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
            Integration Guide
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>1. Install the SDK</Typography>
              <Paper sx={{ p: 1, mt: 1, bgcolor: 'grey.100' }}>
                <Typography variant="body2" component="code">
                  npm install morph-stablecoin-sdk
                </Typography>
              </Paper>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>2. Import and Configure</Typography>
              <Paper sx={{ p: 1, mt: 1, bgcolor: 'grey.100' }}>
                <Typography variant="body2" component="code">
                  {`import { VendorPaymentGateway, createVendorSDK } from 'morph-stablecoin-sdk';

const sdk = createVendorSDK({
  merchantAddress: '0x...',
  supportedCurrencies: ['USDT', 'USDC', 'ETH']
});`}
                </Typography>
              </Paper>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>3. Use the Component</Typography>
              <Paper sx={{ p: 1, mt: 1, bgcolor: 'grey.100' }}>
                <Typography variant="body2" component="code">
                  {`<VendorPaymentGateway
  merchantAddress="0x..."
  onPaymentSuccess={handleSuccess}
  onPaymentError={handleError}
/>`}
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Alert>
      </Box>
    </Box>
  );
} 