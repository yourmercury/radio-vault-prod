"use client";

import ButtonComp from "@/components/button";
import { ThemeContext } from "@/context/ThemeContext";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import {
  Web3Modal,
  useWeb3Modal,
  Web3NetworkSwitch,
  Web3Button,
} from "@web3modal/react";
import { useContext } from "react";
import { configureChains, createConfig, useConnect, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon, filecoin, bsc } from "wagmi/chains";
import {InjectedConnector} from "wagmi/connectors/injected";

const chains = [filecoin, arbitrum, mainnet, polygon, bsc];
const projectId = "a2e57b7816007ca2cb63d6c7caac9adc";
//@ts-ignore
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function Test() {
  const { open, close } = useWeb3Modal();
  const { mode } = useContext(ThemeContext);


  
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <Web3NetworkSwitch />
      </WagmiConfig>

      <Web3Modal
        themeVariables={{
          "--w3m-background-color": mode.primary+"2a",
          "--w3m-accent-color": mode.primary,
          "--w3m-logo-image-url": "/icons/" + mode.return("logo.svg", "logo_dark.svg"),
        }}
        projectId={projectId}
        ethereumClient={ethereumClient}
      />
    </>
  );
}
