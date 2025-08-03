import React, { useState, useEffect } from "react";
import { useWalletClient } from 'wagmi';
import {
  encodeFunctionData,
  parseUnits,
  parseEther,
  Abi
} from "viem";
import { morphHolesky } from "viem/chains";
import { 
  Button, 
  TextField, 
  Paper, 
  Typography, 
  Alert, 
  Box,
  Chip
} from '@mui/material';

const TOKEN_ADDRESSES = {
  USDT: "0x07d9b60c7F719994c07C96a7f87460a0cC94379F",
  USDC: "0xe3B620B1557696DA5324EFcA934Ea6c27ad69e00",
  cUSD: "0x07d9b60c7F719994c07C96a7f87460a0cC94379F",
  DAI: "0xe3B620B1557696DA5324EFcA934Ea6c27ad69e00",
};

const ERC20_ABI: Abi = [
  {
    type: 'function',
    name: 'transfer',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    outputs: [
      { name: '', type: 'bool' }
    ]
  }
];

interface PaymentData {
  merchant: string;
  amount: string;
  currency: string;
  requestId: string;
  description?: string;
}

interface PaymentLinkHandlerProps {
  onPaymentSuccess?: (txHash: string) => void;
  onPaymentError?: (error: any) => void;
  theme?: "light" | "dark";
}

export const PaymentLinkHandler: React.FC<PaymentLinkHandlerProps> = ({
  onPaymentSuccess,
  onPaymentError,
  theme = "light"
}) => {
  const { data: walletClient } = useWalletClient();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    // Parse payment data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');
    
    if (dataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(dataParam));
        setPaymentData(decodedData);
      } catch (err) {
        setError("Invalid payment link");
      }
    }
  }, []);

  const handlePayment = async () => {
    if (!walletClient || !paymentData) {
      setError("Please connect your wallet");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      let hash: string;
      const tokenToUse = paymentData.currency === "USD" ? "USDT" : paymentData.currency;

      if (tokenToUse === "ETH") {
        hash = await walletClient.sendTransaction({
          to: paymentData.merchant as `0x${string}`,
          value: parseEther(paymentData.amount),
          chain: morphHolesky,
        });
      } else if (["USDT", "USDC", "cUSD", "DAI"].includes(tokenToUse)) {
        const tokenAddress = TOKEN_ADDRESSES[tokenToUse as keyof typeof TOKEN_ADDRESSES];
        const decimals = 6;
        const data = encodeFunctionData({
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [paymentData.merchant, parseUnits(paymentData.amount, decimals)],
        });
        hash = await walletClient.sendTransaction({
          to: tokenAddress as `0x${string}`,
          data,
          chain: morphHolesky,
        });
      } else {
        throw new Error("Unsupported currency");
      }

      setTxHash(hash);
      onPaymentSuccess?.(hash);
    } catch (err: any) {
      const errorMessage = err.message || String(err);
      setError(errorMessage);
      onPaymentError?.(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!paymentData) {
    return (
      <Paper 
        elevation={3} 
        sx={{ 
          maxWidth: '400px', 
          mx: 'auto', 
          p: 3,
          bgcolor: theme === "dark" ? 'grey.900' : 'white',
          color: theme === "dark" ? 'white' : 'text.primary'
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ mb: 2 }}>🔗</Typography>
          <Typography variant="h5" component="h2" sx={{ mb: 1, fontWeight: 'bold' }}>
            Payment Link
          </Typography>
          <Typography color="text.secondary">
            No payment data found in URL
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        maxWidth: '400px', 
        mx: 'auto', 
        p: 3,
        bgcolor: theme === "dark" ? 'grey.900' : 'white',
        color: theme === "dark" ? 'white' : 'text.primary'
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h3" sx={{ mb: 2 }}>💳</Typography>
        <Typography variant="h5" component="h2" sx={{ mb: 1, fontWeight: 'bold' }}>
          Complete Payment
        </Typography>
        <Typography color="text.secondary">
          Pay securely with your crypto wallet
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Amount:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
              {paymentData.amount} {paymentData.currency}
            </Typography>
          </Box>
          {paymentData.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {paymentData.description}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary">
            Merchant: {paymentData.merchant.slice(0, 6)}...{paymentData.merchant.slice(-4)}
          </Typography>
        </Paper>

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {txHash && (
          <Alert severity="success">
            Payment successful! 
            <a 
              href={`https://explorer-holesky.morphl2.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'underline', marginLeft: '8px' }}
            >
              View Transaction ↗
            </a>
          </Alert>
        )}

        {!walletClient ? (
          <Alert severity="warning">
            Please connect your wallet to continue
          </Alert>
        ) : !txHash ? (
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            variant="contained"
            color="success"
            size="large"
            fullWidth
          >
            {isProcessing ? "Processing..." : `Pay ${paymentData.amount} ${paymentData.currency}`}
          </Button>
        ) : (
          <Button
            onClick={() => window.close()}
            variant="contained"
            color="inherit"
            size="large"
            fullWidth
          >
            Close
          </Button>
        )}
      </Box>
    </Paper>
  );
}; 