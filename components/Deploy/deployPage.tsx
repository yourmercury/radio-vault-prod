"use client";

import { useContext, useEffect, useRef, useState } from "react";
import Icons from "../icons/icons";
import { TextColors } from "../styleGuide";
import { Text14, Text16, Text20 } from "../texts/textSize";
import { ThemeContext } from "@/context/ThemeContext";
import { Deployed, Vault } from "@/types";
import { useRouter } from "next/navigation";
import { getIPFSLink } from "@/utils/NFTStorage";
import { VaultContext } from "@/context/VaultContext";
import DeployedComp from "./deployedComp";
import InputComp from "../input";
import ButtonComp from "../button";
import { mainnet, filecoin, bsc, goerli } from "wagmi/chains";
import { Web3Button, useWeb3Modal } from "@web3modal/react";
import ChooseWalletModal from "./chooseWalletModal";
import {
  useAccount,
  useWalletClient,
  useBalance,
  usePublicClient,
} from "wagmi";
import { stuntAddress } from "@/utils/utils";
import { changeNetwork, connectToMetamask } from "@/utils/deployment";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { deployContract } from "viem/dist/types/actions/wallet/deployContract";
import NFT from "@/backend_/artifacts/contracts/NFT.sol/NFT.json";
import DeploySuccessModal from "./deploySuccessModal";
import { ResponseCodes } from "@/utils/responseCodes";

export default function DeployPage() {
  const { mode } = useContext(ThemeContext);
  const { tracks } = useContext(VaultContext);
  const [deployComp, setDeployComp] = useState<Vault | null>(null);
  const blockchains = [
    { chain: filecoin, icon: "filecoin" },
    { chain: bsc, icon: "binance" },
    { chain: mainnet, icon: "eth" },
    { chain: goerli, icon: "eth" },
  ];
  const [chain, setChain] = useState<{ chain: any; icon: string }>();
  const [toggle, setToggle] = useState({ chain: false, chooseWallet: false });
  const { open, close } = useWeb3Modal();
  const pubClient = usePublicClient();

  const { isConnected } = useAccount();
  const { data: wallet } = useWalletClient();
  const { data, isError, isLoading } = useBalance({
    address: wallet?.account.address,
  });
  const [deployed, setDeployed] = useState<{
    contractAddress: string;
    txHash: string;
    chain: { id: number; name: string };
    vaultId: string;
  } | null>(null);

  const [form, setForm] = useState({
    name: "",
    symbol: "",
    maxSupply: "",
    mintPrice: "0",
  });
  const [error, setError] = useState({
    name: false,
    symbol: false,
    maxSupply: false,
    mintPrice: false,
  });

  const [deps, setDeps] = useState<string>("");

  console.log("wallet", wallet?.chain);

  console.log("status:", isConnected);

  async function deploy() {
    // try {

    // }catch(error){
    //     console.log(error);
    // }

    let err = {
      name: false,
      symbol: false,
      maxSupply: false,
      mintPrice: false,
    };

    if (!form.name) err.name = true;
    if (!form.symbol) err.symbol = true;
    if (!form.maxSupply) err.maxSupply = true;

    if (Object.values(err).includes(true)) {
      setError(err);
      throw "Complete the form";
    } else {
      let result = await wallet?.deployContract({
        abi: NFT.abi,
        account: wallet.account.address,
        bytecode: NFT.bytecode as `0x${string}`,
        args: [
          form.name,
          form.symbol,
          Number(form.maxSupply),
          (process.env.NEXT_PUBLIC_NEXTAUTH_URL + "/api/metadata/"+ deployComp?.id),
          Number(form.mintPrice),
        ],
        chain: wallet.chain,
      });


      if (!result) throw "Something went wrong";
      const res = await pubClient.waitForTransactionReceipt({ hash: result });

      if (res.contractAddress) {
        let d = {
          contractAddress: res.contractAddress,
          txHash: result,
          chain: {
            id: wallet?.chain.id as number,
            name: wallet?.chain.name as string,
            explorer: wallet?.chain.blockExplorers?.default
          },
          vaultId: deployComp?.id as string,
        };

        let r = await fetch(`/api/deployed`, {
          method: "POST",
          body: JSON.stringify(d),
        });

        if(r.status != ResponseCodes.CREATED) {
            localStorage.setItem("deployed", JSON.stringify(d));
        }

        return { contractAddress: res.contractAddress, txHash: result };
      } else throw "Deployment Failed";
    }
  }

  useEffect(() => {
    // const chain = window.localStorage.getItem("chain");
    // // if (chain) setChain(blockchains[Number(chain)]);
    // // else setChain(blockchains[0]);
  }, []);

  useEffect(() => {
    if (!wallet) return;

    blockchains.forEach((chain) => {
      if (chain.chain.id == wallet.chain.id) {
        setChain(chain);
      }
    });
  }, [wallet]);

  console.log(tracks);

  if (!isConnected) {
    return (
      <div className="w-full h-[calc(100vh-76px)] flex justify-center items-center">
        <div className="max-w-[400px] mx-10 flex flex-col items-center">
          <Icons icon="no_wallet" className="h-[100px] mb-5" />
          <Text20 light="black" className="font-[700]">
            No wallet connected
          </Text20>
          <Text14
            light={TextColors.g600}
            dark={TextColors.g300}
            className="font-[200] text-center"
          >
            You have to connect a wallet to deploy vaults to the blockchain
          </Text14>
          <ButtonComp
            className="mt-5"
            onClick={async () => {
              //   let t = await connectToMetamask();
              //   console.log(t);
              //   if (t) {
              //     location.reload();
              //   }
              open({ route: "SelectNetwork" });
            }}
          >
            <Icons icon="wallet_2" noToggle className="mr-2" />{" "}
            <Text14>Connect Wallet</Text14>
          </ButtonComp>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="border-y mb-5 flex p-big py-sm justify-end"
        style={{ borderColor: mode.return(TextColors.grey100, mode.border) }}
      >
        {chain && (
          <div
            className="flex relative p-sm rounded-lg w-fit items-center ml-auto mr-5"
            style={{ borderColor: TextColors.grey100 }}
          >
            <Icons icon={chain.icon} noToggle className="mr-3 w-[25px]" />

            <Text16 className="mr-4" light="black">
              {chain.chain.name.split(" ")[0]}
            </Text16>

            <div
              className="ml-auto"
              onClick={() => {
                // setToggle({ ...toggle, chain: true });
                open({ route: "SelectNetwork" });
              }}
            >
              <Icons icon="caret_down" className="ml-auto h-[8px]" />
            </div>

            {/* {toggle.chain && (
              <div
                className="absolute top-full z-[35] left-0 w-[250px] shadow-md rounded-xl border"
                style={{
                  background: mode.background,
                  borderColor: TextColors.grey100,
                }}
              >
                {blockchains.map((chain, index) => (
                  <div
                    className="flex p-mid px-big hover:bg-gray-300"
                    onClick={() => {
                    //     wallet?.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: `0x${chain.chain.id.toString(16)}` }], })
                    //   setChain(blockchains[index]);
                    //   localStorage.setItem("chain", String(index));
                    //   setToggle({ ...toggle, chain: false });
                        open({route: "SelectNetwork"});
                    }}
                    key={index}
                  >
                    <Icons
                      icon={chain.icon}
                      noToggle
                      className="mr-3 w-[25px]"
                    />

                    <Text16 className="mr-4" light="black">
                      {chain.chain.name}
                    </Text16>
                  </div>
                ))}
              </div>
            )} */}
          </div>
        )}

        {/* {!wallet && <div
          className="flex items-center p-sm px-big rounded-lg cursor-pointer"
          style={{ background: mode.primary }}
          onClick={() => {
            // connect()
            setToggle({...toggle, chooseWallet: true})
        }}
        >
          <Text16>Connect wallet</Text16>
        </div>} */}

        {wallet && (
          <div
            className="flex items-center p-sm px-big rounded-lg cursor-pointer"
            onClick={() => {
              open();
            }}
          >
            <div
              className="h-[45px] w-[45px] rounded-full flex justify-center items-center mr-2"
              style={{
                background: mode.return(TextColors.neutral50, TextColors.g800),
              }}
            >
              <Icons icon="wallet_connect" noToggle />
            </div>
            <div className="flex flex-col items-center">
              <Text16 light="black" className="font-[Montserrat]">
                {stuntAddress(wallet.account.address)}
              </Text16>
              <Text16
                light="black"
                className="font-[Montserrat] flex items-center"
              >
                <Icons icon={chain?.icon || ""} noToggle className="mr-1" />{" "}
                {Number(data?.formatted as string).toFixed(4)}
              </Text16>
            </div>
          </div>
        )}
        {/* <Web3Button /> */}
      </div>
      <div className="p-big relative">
        <div className="relative">
          <div>
            <div>
              <div
                className="py-2 px-2 rounded flex items-center"
                style={{
                  background: mode.return(
                    TextColors.trackHeaderColor,
                    TextColors.g800
                  ),
                }}
              >
                {/* <div className="w-[40px]">
              <div
              className="h-[20px] w-[20px] rounded flex justify-center items-center"
              style={{ background: mode.primary }}
              >
              <Icons icon="minus" noToggle />
              </div>
            </div> */}
                <div className="flex-[1.8]">
                  <Text14 light="black">Track</Text14>
                </div>
                <div className="flex-1 md:block hidden">
                  <Text14 light="black">Date added</Text14>
                </div>
                <div className="flex-1">
                  <Text14 light="black"><span className="md:inline hidden">Deployment</span> count</Text14>
                </div>
                <div className="sm:flex-1 hidden sm:block">
                  <Text14 light="black">Streams</Text14>
                </div>
                <div className="flex-[0.5]">
                  <Text14 light="black">Action</Text14>
                </div>
              </div>
            </div>

            <div>
              {tracks?.map((track, index) => (
                <TableTrack
                  mode={mode}
                  track={track}
                  index={index}
                  key={track.id}
                  toggleDeploy={setDeployComp}
                  action={()=>{
                    setDeps(track.id)
                  }}
                />
              ))}
            </div>
          </div>

          {deployed && (
            <DeploySuccessModal
              link={`${wallet?.chain.blockExplorers?.default.url}/tx/${deployed.txHash}`}
              explorer={wallet?.chain.blockExplorers?.default.name as string}
              toggle={() => {
                setDeployed(null);
              }}
            />
          )}

          {deployComp && (
            <div
              className="fixed top-0 left-0 h-screen w-screen justify-center items-center z-[100] shadow-lg flex"
              style={{ background: "rgba(0,0,0,0.5)" }}
            >
              <div
                className="h-fit rounded-xl border"
                style={{
                  background: mode.background,
                  borderColor: mode.return(mode.background, mode.border),
                }}
              >
                <div className="flex p-big justify-between">
                  <div className="flex flex-col">
                    <Text20 light="black">Deploy "{deployComp?.title}"</Text20>
                    <Text14 light={TextColors.g600} dark={TextColors.g200}>
                      Deploy your NFT with this vault
                    </Text14>
                  </div>

                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      console.log("clicked");
                      setDeployComp(null);
                    }}
                  >
                    <Icons icon="close_circle" />
                  </div>
                </div>

                <div
                  style={{ borderColor: mode.border }}
                  className="border-y flex flex-col items-center p-big"
                >
                  {/* <Text16 light={"black"}>Kiss from a rose</Text16> */}
                  <audio
                    style={{ filter: mode.return("", "invert(1)") }}
                    controls
                    src={getIPFSLink(deployComp.metadata.media)}
                  ></audio>
                </div>

                <div className="p-big">
                  <InputComp
                    label={"Token Name"}
                    placeholder="Wondeful world"
                    className="mb-3"
                    value={form.name}
                    onChange={(value) => {
                      setForm({ ...form, name: value });
                    }}
                    hasError={error.name}
                    required
                  />
                  <InputComp
                    label={"Token Symbol"}
                    placeholder="WDW"
                    className="mb-3"
                    value={form.symbol}
                    onChange={(value) => {
                      setForm({ ...form, symbol: value });
                    }}
                    hasError={error.symbol}
                    required
                  />
                  <InputComp
                    label={"Max supply"}
                    placeholder=""
                    className="mb-3"
                    value={form.maxSupply}
                    onChange={(value) => {
                      setForm({ ...form, maxSupply: value });
                    }}
                    hasError={error.maxSupply}
                    required
                    type="number"
                  />
                  <InputComp
                    label={"Mint price"}
                    placeholder=""
                    className="mb-3"
                    value={form.mintPrice}
                    onChange={(value) => {
                      setForm({ ...form, mintPrice: value });
                    }}
                    hasError={error.mintPrice}
                    required
                    type="number"
                  />

                  <ButtonComp
                    onClick={() => {
                      toast.promise(deploy, {
                        pending: "Deploying NFT contract",
                        success: {
                          render({ data }) {
                            if (data) {
                              //   let d = {
                              //     contractAddress: data.contractAddress,
                              //     txHash: data.txHash,
                              //     chain: {
                              //       id: wallet?.chain.id as number,
                              //       name: wallet?.chain.name as string,
                              //     },
                              //     vaultId: deployComp.id,
                              //   };

                              //   await fetch(`/api/deployed`, {method: "POST", body: JSON.stringify(d)});
                              //   setDeployed({ ...d });

                              return "Deployed successfully.";
                            } else {
                              return "Something went wrong!";
                            }
                          },
                        },
                        error: {
                          render({ data }) {
                            return typeof data == "string"
                              ? data
                              : "Something went wrong!";
                          },
                        },
                      });
                    }}
                  >
                    <Text14>Deploy</Text14>
                    <Icons className="ml-2" icon="arrow_right_dark" noToggle />
                  </ButtonComp>
                </div>
              </div>
            </div>
          )}

          {deps && <div><DeployedComp vaultId={deps} toggle={()=>{
            setDeps("");
          }}/></div>}
        </div>
        {toggle.chooseWallet && (
          <ChooseWalletModal
            toggle={(a) => {
              setToggle({ ...toggle, chooseWallet: a });
            }}
          />
        )}
      </div>
    </>
  );
}

function TableTrack({
  mode,
  track,
  index,
  toggleDeploy,
  action,
}: {
  mode: any;
  index: number;
  track: Vault;
  toggleDeploy: (vault: Vault) => any;
  action: (id: string) => any;
}) {
  const router = useRouter();
  return (
    <div
      className="flex items-center py-3 px-2 border-b "
      style={{ borderColor: mode.return("#E3E3E8", TextColors.g700) }}
      // onClick={()=>{
      //   router.push(`/tracks/${track.id}`)
      // }}
    >
      {/* <div className="w-[40px]">
          <CheckBox checked={false} check={() => {}} />
        </div> */}

      <div className="flex items-center flex-[1.8]">
        <img
          src={getIPFSLink(track.metadata.image)}
          className="h-[60px] w-[80px] rounded-lg mr-2 sm:block hidden"
          alt=""
        />
        <div className="flex flex-col pr-2">
          <Text16 dark={TextColors.g300} light={"black"}>
            {track.title}
          </Text16>
          <div className="flex flex-col">
            <div className="">
              <span
                style={{ color: TextColors.g300 }}
                className="flex items-center text-[12px]"
              >
                <Icons icon="tag_right" className="h-[12px] mr-1" noToggle />{" "}
                {/* @ts-ignore */}
                Deployed {track.deploymentCount}
              </span>
            </div>

            <div>
              <span
                style={{ color: TextColors.g300 }}
                className="flex items-center text-[12px]"
              >
                <Icons icon="cloud_cross" className="h-[12px] mr-1" noToggle />{" "}
                blacklist {"6"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 md:block hidden">
        <Text14 light="black">
          {new Date(track.createdAt).toLocaleDateString()}
        </Text14>
      </div>
      <div className="flex-1 sm:block">
        <Text14 light="black">{track.deploymentCount}</Text14>
      </div>
      <div className="sm:flex-1 sm:block hidden">
        <Text14 light="black">{track.streams}</Text14>
      </div>
      <div className="md:flex-[0.5] flex flex-col ">
        <span
          className="mr-4 cursor-pointer"
          onClick={() => {
            toggleDeploy(track);
          }}
        >
          <Text14
            light={mode.primary}
            dark={mode.primary}
            className="underline"
          >
            Deploy
          </Text14>
        </span>
        <span className="cursor-pointer"
            onClick={()=>{
                action(track.id)
            }}
        >
          <Text14
            light={mode.primary}
            dark={mode.primary}
            className="underline"
          >
            view
          </Text14>
        </span>
      </div>
    </div>
  );
}
