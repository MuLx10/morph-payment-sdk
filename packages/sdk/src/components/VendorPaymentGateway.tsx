import React, { useState, useEffect, useCallback } from "react";
import { useWalletClient, WagmiProvider, createConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import {  } from 'qrcode-generator'
import '@rainbow-me/rainbowkit/styles.css';
import {
  encodeFunctionData,
  parseUnits,
  parseEther,
  Abi,
  getAddress,
  http
} from "viem";
import { morphHolesky } from "viem/chains";
import { 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Box,
  Typography,
  Alert,
  Paper,
  Grid,
  Chip,
  Input
} from '@mui/material';
import { CryptomorphPay } from "./CryptoMorphPay";

import { TOKEN_ADDRESSES, SupportedCurrency, PaymentMethod, ERC20_ABI } from "../lib/constants";
import { WalletWrapper } from "./WalletWrapper";

export interface PaymentRequest {
  id: string;
  merchantAddress: string;
  amount: string;
  currency: SupportedCurrency;
  description?: string;
  expiresAt?: Date;
  status: "pending" | "completed" | "expired" | "cancelled";
  createdAt: Date;
  completedAt?: Date;
  txHash?: string;
}

export interface VendorPaymentGatewayProps {
  merchantAddress: string;
  supportedCurrencies?: SupportedCurrency[];
  onPaymentSuccess?: (payment: PaymentRequest) => void;
  onPaymentError?: (error: any) => void;
  theme?: "light" | "dark";
  mode?: "standalone" | "embedded";
  showCryptoMorphPay?: boolean;
  showQRCode?: boolean;
  showPOS?: boolean;
  showPayLink?: boolean;
}

const VendorPaymentGatewayComponent: React.FC<VendorPaymentGatewayProps> = ({
  merchantAddress,
  supportedCurrencies = ["USDT", "USDC", "ETH", "cUSD", "DAI", "USD"],
  onPaymentSuccess,
  onPaymentError,
  theme = "light",
  mode = "standalone",
  showCryptoMorphPay = true,
  showQRCode = true,
  showPOS = false,
  showPayLink = true,
}) => {
  const { data: walletClient } = useWalletClient();
  const [activeTab, setActiveTab] = useState<PaymentMethod>("CRYPTO_MORPH_PAY");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<SupportedCurrency>("USDT");
  const [description, setDescription] = useState("");
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string>("");

  // Generate QR code data
  const generateQRData = useCallback((paymentRequest: PaymentRequest) => {
    const paymentData = {
      type: "crypto_payment",
      merchant: merchantAddress,
      amount: paymentRequest.amount,
      currency: paymentRequest.currency,
      requestId: paymentRequest.id,
      description: paymentRequest.description,
      network: "morph-holesky",
      timestamp: paymentRequest.createdAt.getTime(),
    };
    return JSON.stringify(paymentData);
  }, [merchantAddress]);

  // Create new payment request
  const createPaymentRequest = useCallback(() => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    const paymentRequest: PaymentRequest = {
      id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      merchantAddress,
      amount,
      currency,
      description,
      status: "pending",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };

    setPaymentRequests(prev => [paymentRequest, ...prev]);
    setQrCodeData(generateQRData(paymentRequest));
    setError(null);
  }, [amount, currency, description, merchantAddress, generateQRData]);

  // Process payment
  const processPayment = async (paymentRequest: PaymentRequest) => {
    if (!walletClient) {
      setError("Please connect your wallet");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      let hash: string;
      const tokenToUse = paymentRequest.currency === "USD" ? "USDT" : paymentRequest.currency;

      if (tokenToUse === "ETH") {
        hash = await walletClient.sendTransaction({
          to: merchantAddress as `0x${string}`,
          value: parseEther(paymentRequest.amount),
          chain: morphHolesky,
        });
      } else if (["USDT", "USDC", "cUSD", "DAI"].includes(tokenToUse)) {
        const tokenAddress = TOKEN_ADDRESSES[tokenToUse as keyof typeof TOKEN_ADDRESSES];
        const decimals = 6; // USDT/USDC decimals
        const data = encodeFunctionData({
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [merchantAddress, parseUnits(paymentRequest.amount, decimals)],
        });
        hash = await walletClient.sendTransaction({
          to: tokenAddress as `0x${string}`,
          data,
          chain: morphHolesky,
        });
      } else {
        throw new Error("Unsupported currency");
      }

      // Update payment request
      const updatedPayment = {
        ...paymentRequest,
        status: "completed" as const,
        completedAt: new Date(),
        txHash: hash,
      };

      setPaymentRequests(prev => 
        prev.map(p => p.id === paymentRequest.id ? updatedPayment : p)
      );

      onPaymentSuccess?.(updatedPayment);
    } catch (err: any) {
      const errorMessage = err.message || String(err);
      setError(errorMessage);
      onPaymentError?.(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate pay link
  const generatePayLink = (paymentRequest: PaymentRequest) => {
    const baseUrl = window.location.origin;
    const paymentData = encodeURIComponent(JSON.stringify({
      merchant: merchantAddress,
      amount: paymentRequest.amount,
      currency: paymentRequest.currency,
      requestId: paymentRequest.id,
      description: paymentRequest.description,
    }));
    return `${baseUrl}/pay?data=${paymentData}`;
  };

  // QR Code Component
  const QRCodeDisplay = ({ data }: { data: string }) => (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Input
          value={amount}
          type="decimal"
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          fullWidth
          size="medium"
          sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}
        />
        <FormControl fullWidth>
          <InputLabel>Currency</InputLabel>
          <Select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
            label="Currency"
          >
            {supportedCurrencies.map(c => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <TextField
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Payment description (optional)"
        fullWidth
      />
      <Button
        onClick={createPaymentRequest}
        variant="contained"
        color="success"
        size="large"
        fullWidth
      >
        Create Payment Request
      </Button>
    </div>
  );

  // POS Component
  const POSDisplay = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Grid container spacing={1}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, ".", "C"].map((key) => (
          <Grid item xs={4} key={key}>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              onClick={() => {
                if (key === "C") {
                  setAmount("");
                } else if (key === ".") {
                  if (!amount.includes(".")) {
                    setAmount(prev => prev + ".");
                  }
                } else {
                  setAmount(prev => prev + key.toString());
                }
              }}
              sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}
            >
              {key}
            </Button>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          fullWidth
          size="medium"
          sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}
        />
        <FormControl fullWidth>
          <InputLabel>Currency</InputLabel>
          <Select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
            label="Currency"
          >
            {supportedCurrencies.map(c => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <TextField
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Payment description (optional)"
        fullWidth
      />
      <Button
        onClick={createPaymentRequest}
        variant="contained"
        color="success"
        size="large"
        fullWidth
      >
        Create Payment Request
      </Button>
    </Box>
  );

  // Pay Link Component
  const PayLinkDisplay = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Alert severity="info">
        <Typography variant="h6" sx={{ mb: 1 }}>
          Payment Links
        </Typography>
        <Typography variant="body2">
          Generate shareable payment links for your customers
        </Typography>
      </Alert>
      
      {paymentRequests.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Recent Payment Requests:
          </Typography>
          {paymentRequests.slice(0, 5).map((payment) => (
            <Paper key={payment.id} sx={{ p: 2, border: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {payment.amount} {payment.currency}
                </Typography>
                <Chip 
                  label={payment.status}
                  color={
                    payment.status === "completed" ? "success" :
                    payment.status === "pending" ? "warning" : "error"
                  }
                  size="small"
                />
              </Box>
              {payment.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {payment.description}
                </Typography>
              )}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  onClick={() => navigator.clipboard.writeText(generatePayLink(payment))}
                  variant="outlined"
                  size="small"
                  color="primary"
                >
                  Copy Link
                </Button>
                {payment.status === "pending" && (
                  <Button
                    onClick={() => processPayment(payment)}
                    disabled={isProcessing}
                    variant="contained"
                    size="small"
                    color="success"
                  >
                    Pay Now
                  </Button>
                )}
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        maxWidth: '800px', 
        mx: 'auto', 
        p: 3,
        bgcolor: theme === "dark" ? 'grey.900' : 'white',
        color: theme === "dark" ? 'white' : 'text.primary'
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 1, fontWeight: 'bold' }}>
          Crypto Payment Gateway
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Accept crypto payments via QR codes, POS, or payment links
        </Typography>
      </Box>

      {/* Tab Navigation */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        {showCryptoMorphPay && (
          <Button
            onClick={() => setActiveTab("CRYPTO_MORPH_PAY")}
            variant={activeTab === "CRYPTO_MORPH_PAY" ? "contained" : "outlined"}
            color="success"
          >
            Pay with Cryptomorph
          </Button>
        )}
        {showQRCode && (
          <Button
            onClick={() => setActiveTab("QR")}
            variant={activeTab === "QR" ? "contained" : "outlined"}
            color="success"
          >
            QR Code
          </Button>
        )}
        {showPOS && (
          <Button
            onClick={() => setActiveTab("POS")}
            variant={activeTab === "POS" ? "contained" : "outlined"}
            color="success"
          >
            POS Terminal
          </Button>
        )}
        {showPayLink && (
          <Button
            onClick={() => setActiveTab("PAY_LINK")}
            variant={activeTab === "PAY_LINK" ? "contained" : "outlined"}
            color="success"
          >
            Payment Links
          </Button>
        )}
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tab Content */}
      <Box sx={{ minHeight: '400px' }}>
        {activeTab === "CRYPTO_MORPH_PAY" && (
          <>
          <Box sx={{ display: 'flex', gap: 2 }}>
        <Input
          value={amount}
          type="decimal"
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          fullWidth
          size="medium"
          sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}
        />
        <FormControl fullWidth>
          <InputLabel>Currency</InputLabel>
          <Select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
            label="Currency"
          >
            {supportedCurrencies.map(c => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
  
          <CryptomorphPay
          address={merchantAddress}
          amount={amount}
          currency={currency}
          onSuccess={tx => console.log('Payment success:', tx)}
          onError={err => console.error('Payment error:', err)}
        />
                </>
        )}
        {activeTab === "QR" && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="info">
              <Typography variant="h6" sx={{ mb: 1 }}>
                QR Code Payments
              </Typography>
              <Typography variant="body2">
                Generate QR codes for instant crypto payments
              </Typography>
            </Alert>
            
            <QRCodeDisplay data={qrCodeData} />
          </Box>
        )}

        {activeTab === "POS" && (
          <POSDisplay />
        )}

        {activeTab === "PAY_LINK" && (
          <PayLinkDisplay />
        )}
      </Box>

      {/* Payment Status */}
      {paymentRequests.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Payment Status
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: '200px', overflow: 'auto' }}>
            {paymentRequests.map((payment) => (
              <Paper key={payment.id} sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {payment.amount} {payment.currency}
                    </Typography>
                    {payment.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        - {payment.description}
                      </Typography>
                    )}
                  </Box>
                  <Chip 
                    label={payment.status}
                    color={
                      payment.status === "completed" ? "success" :
                      payment.status === "pending" ? "warning" : "error"
                    }
                    size="small"
                  />
                </Box>
                {payment.txHash && (
                  <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                    <a 
                      href={`https://explorer-holesky.morphl2.io/tx/${payment.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'inherit', textDecoration: 'underline' }}
                    >
                      View Transaction ↗
                    </a>
                  </Typography>
                )}
              </Paper>
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export function VendorPaymentGateway(props: VendorPaymentGatewayProps) {
  return (
    <WalletWrapper>
      <VendorPaymentGatewayComponent {...props} />
    </WalletWrapper>
  );
}