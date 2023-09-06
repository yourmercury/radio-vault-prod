"use client";
import { useContext, useEffect, useState } from "react";
import { TextColors } from "../styleGuide";
import { Text14, Text16 } from "../texts/textSize";
import { ThemeContext } from "@/context/ThemeContext";
import Icons from "../icons/icons";
import { useRouter } from "next/navigation";
import { Deployed, Vault } from "@/types";
import { toast } from "react-toastify";
import LoadingDots from "../loading";
import { stuntAddress } from "@/utils/utils";

export default function DeployedComp({ vaultId, toggle, }: { vaultId: string, toggle: (a:boolean)=>any }) {
  const { mode } = useContext(ThemeContext);
  const [deployed, setDeployed] = useState<Deployed[] | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/deployed/${vaultId}`)
      .then(async (res) => {
        if(res.status !== 200){
            setDeployed([]);
            return;
        }

        let dep: Deployed[] = await res.json();
        console.log(dep)
        setDeployed(dep || []);
      })
      .catch((error) => {
        console.log(error);
        setDeployed([]);
        toast.error("Something went wrong!");
      });
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-screen w-screen justify-center items-center z-[101] shadow-lg flex"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={()=>{
        toggle&&toggle(false);
      }}
    >
      <div className="w-[300px] h-[500px] border rounded-xl" style={{background: mode.background, borderColor: mode.return(mode.background, mode.border)}}
        onClick={(e)=>{
            e.stopPropagation();
        }}
      >
        <div
          className="py-2 px-2 rounded flex items-center"
          style={{
            background: mode.return(
              TextColors.trackHeaderColor,
              TextColors.g800
            ),
          }}
        >
          <div className="flex-[1] flex justify-start pl-mid">
            <Text14 light="black">Blockchain</Text14>
          </div>
          <div className="flex-[1.8] flex justify-center">
            <Text14 light="black" className="">Contract</Text14>
          </div>
          {/* <div className="flex-[1.5] md:block hidden">
          <Text14 light="black">Token Name</Text14>
        </div>
        <div className="flex-1 sm:block hidden">
          <Text14 light="black">Max supply</Text14>
        </div>
        <div className="md:flex-1">
          <Text14 light="black">Mint price</Text14>
        </div>
        <div className="md:flex-1">
          <Text14 light="black">Minted</Text14>
        </div> */}
          <div className="flex-1 pr-mid flex justify-end">
            <Text14 light="black">Action</Text14>
          </div>
        </div>

        {!deployed && (
          <div className="w-full flex justify-center">
            <LoadingDots />
          </div>
        )}

        {deployed && (
          <div>
            {deployed.map((contract, index) => (
              <TableTrack
                mode={mode}
                contract={{
                  //   maxSupply: 10,
                  blockhain: contract.chain.name,
                  //   minted: 3,
                  address: contract.contractAddress,
                  explorer: contract.chain.explorer,
                  //   tokenName: "Radcliff",
                  //   tokenSymbol: "RAD",
                  //   mintPrice: 10,
                }}
                index={index}
                key={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TableTrack({
  mode,
  contract,
  index,
}: {
  mode: any;
  index: number;
  contract: {
    // maxSupply: number;
    blockhain: string;
    address: string;
    explorer: string;
    // tokenName: string;
    // tokenSymbol: string;
    // mintPrice: number;
    // minted: number;
  };
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
      <div className="flex-1 pl-mid flex justify-start">
        <Text14 light="black">{contract.blockhain}</Text14>
      </div>

      <div className="flex items-center flex-[1.8] justify-center">
        <Text14 light="black">{stuntAddress(contract.address, 8)}</Text14>
      </div>

      {/* <div className="flex-[1.5] md:block hidden">
        <Text14 light="black">{contract.tokenName}</Text14>
      </div>
      <div className="md:flex-1">
        <Text14 light="black">{contract.maxSupply}</Text14>
      </div>
      <div className="md:flex-1">
        <Text14 light="black">{contract.minted}</Text14>
      </div>
      <div className="md:flex-1">
        <Text14 light="black">{contract.mintPrice}</Text14>
      </div> */}
      <div className="flex-1 pr-mid flex justify-end">
        <span
          className="mr-4 cursor-pointer"
          onClick={() => {
            window.open(
              contract.explorer + "/address/" + contract.address,
              "_blank"
            );
          }}
        >
          <Text14
            light={mode.primary}
            dark={mode.primary}
            className="underline"
          >
            scan
          </Text14>
        </span>
      </div>
    </div>
  );
}
