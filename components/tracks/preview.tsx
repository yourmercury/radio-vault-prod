"use client";

import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useState } from "react";
import { TextColors } from "../styleGuide";
import Icons from "../icons/icons";
import {
  Text12,
  Text14,
  Text16,
  Text20,
  Text24,
  TextLink,
} from "../texts/textSize";
import { Vault } from "@/types";
import EmbedComp from "../embedComp";
import { VaultContext } from "@/context/VaultContext";
import { getIPFSLink } from "@/utils/NFTStorage";
import { getMonth } from "@/utils/utils";
import { useRouter } from "next/navigation";
import EmptyState from "../emptyState";
import Blur from "../blur";
import ModalBackground from "../modalBackground";
import ButtonComp, { Button2Comp } from "../button";
import { toast } from "react-toastify";
import { ResponseCodes } from "@/utils/responseCodes";

export default function TrackPreview({ vault }: { vault: Vault | undefined }) {
  console.log(vault);
  const { mode } = useContext(ThemeContext);
  const { tracks } = useContext(VaultContext);
  const [modal, setModal] = useState(false);

  if (!vault)
    return (
      <div className="flex justify-center my-10">
        <EmptyState title={"No Vault"}>
          You have not uploaded any vault, go to{" "}
          <TextLink link="/upload-vault">Create</TextLink> to upload a vault
        </EmptyState>
      </div>
    );

  let totalStreams = 0;
  let start = 0;
  // console.log(vault)
  let startMonth = vault.vys ? new Date(vault.vys.firstStream).getMonth() : 0;

  for (let i = startMonth; i < 13; i++) {
    if (!vault.vys) break;
    console.log(getMonth(i));
    let a = vault.vys[getMonth(i)];
    if (!a) continue;
    totalStreams += a?.streams;
    start++;
    if (i == new Date().getMonth()) {
      break;
    }
  }

  let mAvrg = Math.round(totalStreams / start) || 0;
  console.log(totalStreams);
  // const sMonth = vault.vys[getMonth(new Date().getMonth())]?.streams || 0;

  return (
    <div className="px-big flex min-h-[calc(100vh-70px)]">
      <div
        className="pr-mid border-r-0 md:border-r pt-5 flex-1"
        style={{ borderColor: mode.border }}
      >
        <EmbedComp vault={vault} full dontCount>
          <div className="flex mt-5">
            <div className="">
              <span
                style={{ color: TextColors.g300 }}
                className="flex items-center text-[14px]"
              >
                <Icons icon="tag_right" className="h-[14px] mr-1" noToggle />{" "}
                {/* @ts-ignore */}
                Deployed {vault.deploymentCount}
              </span>
            </div>
            <Icons icon="Stopper" noToggle className="mx-3" />
            <div>
              <span
                style={{ color: TextColors.g300 }}
                className="flex items-center text-[14px]"
              >
                <Icons icon="cloud_cross" className="h-[14px] mr-1" noToggle />{" "}
                blacklist {0}
              </span>
            </div>
          </div>
        </EmbedComp>
        {/* /////--------/--------///// */}

        <div
          className="border rounded-lg mt-5"
          style={{ borderColor: mode.border }}
        >
          <div className="p-big flex items-center justify-between">
            <div className="flex flex-col">
              <Text12
                className="font-semibold"
                light={TextColors.g600}
                dark={TextColors.g200}
              >
                Total Stream
              </Text12>
              <Text24 className="font-[600]" light="black">
                {vault.streams}
              </Text24>
              <Text12 light={TextColors.g400} dark={TextColors.g200}>
                {vault.contracts.length} Contracts
              </Text12>
            </div>

            <div>
              <Icons icon="chart_yellow" />
            </div>
          </div>

          <div
            className="flex items-center px-big py-3 border-t rounded-b-lg"
            style={{
              borderColor: mode.border,
              backgroundColor: mode.return("#F9FBFC", TextColors.g800 + ""),
            }}
          >
            <Icons icon="arrow_gain" />
            <Text14
              className="mx-2 mr-3"
              light={TextColors.accent_warning700}
              dark={TextColors.accent_warning300}
            >
              0%
            </Text14>
            <Text14 light={TextColors.g400} dark={TextColors.primary300}>
              Vs last month
            </Text14>
            <Text14
              className="ml-auto"
              light={TextColors.g300}
              dark={TextColors.g300}
            >
              {mAvrg} monthly average
            </Text14>
          </div>
        </div>

        <hr className="my-6" style={{ borderColor: mode.border }} />

        <div>
          <Text16 light="black" className="block mb-5">
            Manage track
          </Text16>

          <div
            className="flex items-start border p-mid rounded-lg"
            style={{ borderColor: mode.primary }}
          >
            <Icons icon="delete" className="mr-5" />
            <div className="flex justify-between flex-1 flex-col md:flex-row">
              <div className="flex flex-col md:mr-5 mb-2 md:mb-0 flex-1">
                <Text16 className="font-bold" light="black">
                  Delete track
                </Text16>
                <Text12 light="black">
                  Be absolutely sure you want to remove this track from your
                  vault
                </Text12>
              </div>
              <div
                className="py-sm px-big rounded-lg w-fit flex items-center "
                style={{ background: mode.primary }}
                onClick={() => {
                  if(vault.deploymentCount > 0){
                    toast.error("Cannot delete vault if already deployed at least once");
                    return;
                  }
                  setModal(true);
                }}
              >
                <Icons icon="delete_dark" noToggle className="mr-2" />
                <Text14>Delete track</Text14>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modal&&<AreYouSure action={(b) => {
        setModal(false);
        if(b){
          toast.promise(async()=>{
            let res = await fetch(`/api/vault/${vault.id}`, {method: "DELETE"});
            if(res.status == ResponseCodes.FORBIDDEN) {
              throw("Cannot delete vault if already deployed at least once");
            }else if(res.status != ResponseCodes.OK){
              throw("Ooops! Something went wrong");
            }
          }, 

          {
            pending: "Deleting Vault",
            success: {
              render: ({data})=>{
                return "Deleted succesfully"
              }
            },
            error: {
              render: ({data})=>{
                return typeof data == "string" ? data : "Ooops! Something went wrong"
              }
            }
          }
          )
        }
      }} />}

      <div className="flex-[0.5] ml-5 pt-5 hidden md:block">
        <Text16 light="black">Tracks</Text16>

        <div className="mt-6">
          {tracks?.map((track, index) => (
            <Track mode={mode} track={track} index={index} key={track.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Track({
  mode,
  track,
  index,
}: {
  mode: any;
  index: number;
  track: Vault;
}) {
  let router = useRouter();
  return (
    <div
      className="flex items-center flex-[1.8] border py-[10px] px-[20px] rounded-lg mb-3"
      style={{ borderColor: mode.border }}
      onClick={() => {
        router.push("/tracks/" + track.id);
      }}
    >
      <img
        src={getIPFSLink(track.metadata.image)}
        className="h-[60px] w-[80px] rounded-lg mr-2"
        alt=""
      />
      <div className="flex flex-col">
        <Text16 dark={TextColors.g300} light={"black"}>
          {track.title}
        </Text16>
        <div className="flex">
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
          <Icons icon="Stopper" noToggle className="mx-1" />
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
  );
}

function AreYouSure({ action }: { action: (b: boolean) => any }) {
  const { mode } = useContext(ThemeContext);
  return (
    <ModalBackground>
      <div className="flex w-screen h-screen justify-center items-center relative">
        <div
          className="mx-10 p-big relative w-[300px] shadow-xl border rounded-xl"
          style={{ borderColor: mode.border, background: mode.background }}
        >
          <Text16 className="font-[600]" light={"black"}>Are you sure?</Text16>
          <div className="flex mt-5">
            <ButtonComp className="mr-5" onClick={() => action(true)}>
              <Text14>Yes</Text14>
            </ButtonComp>
            <Button2Comp
              className="w-full "
              onClick={() => {
                action(false);
              }}
            >
              <Text14 light="black">No</Text14>
            </Button2Comp>
          </div>
        </div>
      </div>
    </ModalBackground>
  );
}
