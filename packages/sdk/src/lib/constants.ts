import {
    encodeFunctionData,
    parseUnits,
    parseEther,
    Abi,
    getAddress,
    http
  } from "viem";

// Token addresses on Morpho Holesky
export const TOKEN_ADDRESSES = {
    USDT: "0x07d9b60c7F719994c07C96a7f87460a0cC94379F",
    USDC: "0xe3B620B1557696DA5324EFcA934Ea6c27ad69e00",
    cUSD: "0x07d9b60c7F719994c07C96a7f87460a0cC94379F", // Using USDT as cUSD for demo
    DAI: "0xe3B620B1557696DA5324EFcA934Ea6c27ad69e00", // Using USDC as DAI for demo
  };

export const ERC20_ABI: Abi = [
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
    },
    {
      type: 'function',
      name: 'balanceOf',
      stateMutability: 'view',
      inputs: [
        { name: '_owner', type: 'address' }
      ],
      outputs: [
        { name: '', type: 'uint256' }
      ]
    }
  ];
  
  export type PaymentMethod = "CRYPTO_MORPH_PAY" | "QR" | "POS" | "PAY_LINK";
  export type SupportedCurrency = "ETH" | "USDT" | "USDC" | "cUSD" | "DAI" | "USD";