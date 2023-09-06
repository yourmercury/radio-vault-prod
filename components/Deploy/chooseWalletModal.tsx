"use client";

import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";
import { Text14, Text16, Text20 } from "../texts/textSize";
import Icons from "../icons/icons";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useConnect } from "wagmi";
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'


export default function ChooseWalletModal({toggle, onData}:{toggle?: (b:boolean)=> any; onData?:(data: any)=> any}) {
  const { mode } = useContext(ThemeContext);
  const {open, close} = useWeb3Modal();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  })
  return (
    <div className="fixed flex justify-center items-center w-screen h-screen top-0 left-0 bg-[#0000004f] z-[60]" 
        onClick={()=>{
            toggle && toggle(false);
        }}
    >
      <div
        style={{ background: mode.background }}
        className="rounded-xl p-[35px] shadow"
        onClick={(e)=>{
            e.stopPropagation();
        }}
      >
        <div className="flex flex-col mb-4">
          <Text20 light="black">Choose Wallet</Text20>
          <Text14 light="black">Pick a choice to connect your wallet</Text14>
        </div>

        <div className="">
            <div className="flex py-3 px-mid cursor-pointer hover:bg-gray-200"
                onClick={async ()=>{
                    connect();
                    toggle && toggle(false);
                }}
            >
                <Icons icon="metamask" noToggle className="mr-3"/>
                <Text16 light="black">MetaMask</Text16>
                <Icons icon="caret_right"  className="ml-auto"/>
            </div>

            <div className="flex py-3 px-mid cursor-pointer hover:bg-gray-200" 
                onClick={async ()=>{
                    await open();
                    toggle && toggle(false);
                }}
            >
                <Icons icon="wallet_connect" noToggle className="mr-3"/>
                <Text16 light="black">Wallet Connect</Text16>
                <Icons icon="caret_right"  className="ml-auto"/>
            </div>
        </div>
      </div>
    </div>
  );
}
