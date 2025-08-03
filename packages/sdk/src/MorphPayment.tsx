import React, { useState, useEffect } from "react";
import { useWalletClient } from 'wagmi';
import {
  encodeFunctionData,
  parseUnits,
  parseEther,
} from "viem";
import { morphHolesky } from "viem/chains";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Alert,
  FormControl,
  Select,
  MenuItem,
  Paper,
  Chip,
  Tabs,
  Tab,
  TextField,
  IconButton,
  Tooltip,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  QrCode as QrIcon,
  Link as LinkIcon,
  AccountBalanceWallet as WalletIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { SupportedCurrency, TOKEN_ADDRESSES, ERC20_ABI } from "./lib/constants";
import { WalletWrapper } from "./WalletWrapper";
import { ConnectButton } from '@rainbow-me/rainbowkit';

// QR Code generation
import qrcode from 'qrcode-generator';

export type CryptomorphPayProps = {
  address: string; // merchant address
  amount: string | number;
  currency: SupportedCurrency;
  onSuccess?: (tx: any) => void;
  onError?: (err: any) => void;
  theme?: "light" | "dark";
  tokenAddress?: string;
  posEnabled?: boolean; // POS mode (disabled by default)
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`payment-tabpanel-${index}`}
      aria-labelledby={`payment-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const CryptomorphPayComponent: React.FC<CryptomorphPayProps> = ({
  address,
  amount,
  currency = "ETH",
  onSuccess,
  onError,
  tokenAddress: tokenAddressProp,
  theme = "light",
  posEnabled = false,
}) => {
  const { data: walletClient } = useWalletClient();
  const [open, setOpen] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [selectedStable, setSelectedStable] = useState<SupportedCurrency>("USDT");
  const [tabValue, setTabValue] = useState(0);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [paymentLink, setPaymentLink] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Generate QR code and payment link when component mounts or data changes
  useEffect(() => {
    generateQRCode();
    generatePaymentLink();
  }, [address, amount, currency, selectedStable]);

  const generateQRCode = () => {
    try {
      const qr = qrcode(0, 'M');
      const paymentData = {
        merchant: address,
        amount: String(amount),
        currency: currency === "USD" ? selectedStable : currency,
        timestamp: Date.now(),
      };

      const encodedData = encodeURIComponent(JSON.stringify(paymentData));
      const link = `${window.location.origin}/pay?data=${encodedData}`;
      qr.addData(JSON.stringify({link, ...paymentData}));
      qr.make();
      const qrDataUrl = qr.createDataURL(4);
      setQrCodeDataUrl(qrDataUrl);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const generatePaymentLink = () => {
    const paymentData = {
      merchant: address,
      amount: String(amount),
      currency: currency === "USD" ? selectedStable : currency,
      timestamp: Date.now(),
    };
    const encodedData = encodeURIComponent(JSON.stringify(paymentData));
    const link = `${window.location.origin}/pay?data=${encodedData}`;
    setPaymentLink(link);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePay = async () => {
    setError(null);
    setTxHash(null);
    if (!walletClient) {
      setError("Please connect your wallet.");
      return;
    }
    setIsPending(true);
    try {
      let hash: string;
      let tokenToUse = currency === "USD" ? selectedStable : currency;
      if (tokenToUse === "ETH") {
        hash = await walletClient.sendTransaction({
          to: address as `0x${string}`,
          value: parseEther(String(amount)),
          chain: morphHolesky,
        });
      } else if (tokenToUse === "USDT" || tokenToUse === "USDC") {
        const tokenAddress = tokenAddressProp || TOKEN_ADDRESSES[tokenToUse];
        const decimals = 6; // fixed for USDT/USDC
        const data = encodeFunctionData({
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [address, parseUnits(String(amount), decimals)],
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
      onSuccess?.(hash);
    } catch (err: any) {
      setError(err.message || String(err));
      onError?.(err);
    } finally {
      setIsPending(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Button
        variant="contained"
        size="large"
        onClick={() => setOpen(true)}
        sx={{
          background: '#14A800',
          color: '#white',
          px: 4,
          py: 1.5,
          fontSize: '1.125rem',
          fontWeight: 'bold',
          letterSpacing: 1,
          mb: 2,
          '&:hover': {
            background: 'linear-gradient(45deg, #14A800, #7cb342, #14A800)',
            color: 'white'
          }
        }}
        startIcon={
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              mr: 1,
            }}
          >
            <svg 
              viewBox="0 0 32 32" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              width={24} 
              height={24} 
              style={{ display: 'block' }}
            >
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M0 32H11.0193V15.4745C11.0193 14.9403 11.7875 14.8576 11.9012 15.3795L14.5011 27.3126H21.1127V23.2057C21.1127 22.9593 21.3124 22.7596 21.5588 22.7596H32V0H20.9807V4.1069C20.9807 4.35327 20.781 4.55299 20.5346 4.55299H9.54244L10.4458 8.69935C10.5064 8.97745 10.2946 9.2404 10.01 9.2404H0V32Z" 
                fill="#ffffff"
              />
            </svg>
          </Box>
        }
      >
        Pay with Morph
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px 0 rgba(0,255,170,0.15)',
            bgcolor: theme === "dark" ? 'grey.900' : 'white',
            color: theme === "dark" ? 'white' : 'text.primary',
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Pay {amount} {currency === 'USD' ? selectedStable : currency}
          </Typography>
          <IconButton onClick={() => setOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#4CAF50', mb: 2 }}>
            Choose your preferred payment method
          </Typography>
          
          <Paper sx={{ p: 2, mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }}>
            <Typography variant="caption" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
              Pay to:
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#4CAF50' }}>
              {address}
            </Typography>
          </Paper>

          {currency === "USD" && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#4CAF50', mb: 1, fontWeight: 'bold' }}>
                Choose stablecoin:
              </Typography>
              <Select
                value={selectedStable}
                onChange={(e) => setSelectedStable(e.target.value as "USDT" | "USDC")}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.9)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4CAF50',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#45a049',
                  },
                }}
              >
                <MenuItem value="USDT">USDT</MenuItem>
                <MenuItem value="USDC">USDC</MenuItem>
              </Select>
            </FormControl>
          )}

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="payment methods">
              <Tab 
                icon={<WalletIcon />} 
                label="Wallet" 
                iconPosition="start"
                sx={{ minHeight: 48 }}
              />
              <Tab 
                icon={<QrIcon />} 
                label="QR Code" 
                iconPosition="start"
                sx={{ minHeight: 48 }}
              />
              <Tab 
                icon={<LinkIcon />} 
                label="Payment Link" 
                iconPosition="start"
                sx={{ minHeight: 48 }}
              />
            </Tabs>
          </Box>

          {/* Wallet Payment Tab */}
          <TabPanel value={tabValue} index={0}>
            <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WalletIcon /> Pay with Wallet
                </Typography>
                
                {!walletClient ? (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <ConnectButton />
                    </Box>
                  </Alert>
                ) : (
                  <Button
                    onClick={handlePay}
                    disabled={isPending}
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: '#4CAF50',
                      color: 'white',
                      py: 1.5,
                      '&:hover': {
                        bgcolor: '#45a049',
                      },
                    }}
                  >
                    {isPending ? "Processing..." : `Pay with ${currency === 'USD' ? selectedStable : currency}`}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabPanel>

          {/* QR Code Tab */}
          <TabPanel value={tabValue} index={1}>
            <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <QrIcon /> QR Code Payment
                </Typography>
                
                {qrCodeDataUrl && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Paper sx={{ p: 2, bgcolor: 'white', display: 'inline-block' }}>
                      <img 
                        src={qrCodeDataUrl} 
                        alt="Payment QR Code" 
                        style={{ width: 200, height: 200 }}
                      />
                    </Paper>
                    <Typography variant="body2" color="text.secondary">
                      Scan this QR code with your crypto wallet to complete the payment
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </TabPanel>

          {/* Payment Link Tab */}
          <TabPanel value={tabValue} index={2}>
            <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinkIcon /> Payment Link
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    value={paymentLink}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      readOnly: true,
                      sx: { fontFamily: 'monospace', fontSize: '0.875rem' }
                    }}
                  />
                  <Tooltip title={copied ? "Copied!" : "Copy link"}>
                    <IconButton 
                      onClick={() => copyToClipboard(paymentLink)}
                      sx={{ bgcolor: '#4CAF50', color: 'white', '&:hover': { bgcolor: '#45a049' } }}
                    >
                      <CopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  Share this link with customers to complete their payment
                </Typography>
              </CardContent>
            </Card>
          </TabPanel>

          {txHash && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Payment sent!{' '}
                <a
                  href={`https://explorer-holesky.morphl2.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'underline' }}
                >
                  View on Explorer ↗
                </a>
              </Typography>
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <Typography variant="body2">Error: {error}</Typography>
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{ color: '#4CAF50' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export const MorphPayment: React.FC<CryptomorphPayProps> = (props) => {
  return (
    <WalletWrapper>
      <CryptomorphPayComponent {...props} />
    </WalletWrapper>
  );
};
