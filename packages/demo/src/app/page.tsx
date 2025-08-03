"use client";
import React from "react";
import { WagmiProvider, createConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from "viem";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { Button, Typography, Box } from '@mui/material';

// Morph Holesky Testnet config
const morphHolesky = {
  id: 2810,
  name: "Morph Holesky Testnet",
  network: "morph-holesky",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://rpc-quicknode-holesky.morphl2.io"] },
    public: { http: ["https://rpc-quicknode-holesky.morphl2.io"] },
  },
  blockExplorers: {
    default: { name: "Morph Explorer", url: "https://explorer-holesky.morphl2.io" },
  },
  testnet: true,
};

const config = createConfig({
  chains: [morphHolesky],
  transports: {
    [morphHolesky.id]: http(),
  },
});

// Create a QueryClient instance
const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider>
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
              Morpho Crypto Payment SDK
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
              A plug-and-play SDK for vendors to accept crypto payments
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                href="/demo"
                variant="contained"
                color="success"
                size="large"
                sx={{ px: 4, py: 2 }}
              >
                View Demo
              </Button>
            </Box>
          </Box>
        </main>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}