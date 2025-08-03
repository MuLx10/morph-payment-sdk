import { morphHolesky } from "viem/chains";
import { createConfig } from "wagmi";
import {
    encodeFunctionData,
    parseUnits,
    parseEther,
    Abi,
    http
  } from "viem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

const config = createConfig({
    chains: [morphHolesky],
    transports: {
      [morphHolesky.id]: http(),
    },
  });
  
  // Create a QueryClient instance
  const queryClient = new QueryClient();


export const WalletWrapper: React.FC<{children: React.ReactNode}> = (props) => {
    return (
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <RainbowKitProvider>
            {props.children}
          </RainbowKitProvider>
        </WagmiProvider>
      </QueryClientProvider>
    );
  };