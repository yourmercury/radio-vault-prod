"use client";
import DeployPage from "@/components/Deploy/deployPage";
import ButtonComp from "@/components/button";
import { TextColors } from "@/components/styleGuide";
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
import { arbitrum, mainnet, polygon, filecoin, bsc, fantomTestnet, goerli } from "wagmi/chains";

const chains = [filecoin, goerli];
const projectId = "a2e57b7816007ca2cb63d6c7caac9adc";
//@ts-ignore
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function Deploy() {
  const { open, close } = useWeb3Modal();
  const { mode } = useContext(ThemeContext);
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <DeployPage />
      </WagmiConfig>

      <Web3Modal
        themeVariables={{
          "--w3m-background-color": mode.return(TextColors.g300, TextColors.g800),
          "--w3m-accent-color": mode.primary,
          "--w3m-logo-image-url": "/icons/" + mode.return("logo.svg", "logo_dark.svg"),
        }}
        projectId={projectId}
        ethereumClient={ethereumClient}
      />
    </>
  );
}
