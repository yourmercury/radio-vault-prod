"use client";

import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";
import Icons from "../icons/icons";
import { Text14, Text20 } from "../texts/textSize";
import { TextColors } from "../styleGuide";
import ButtonComp from "../button";

export default function DeploySuccessModal({
  link,
  toggle,
  explorer,
}: {
  link: string;
  toggle: (a: boolean) => any;
  explorer: string;
}) {
  const { mode } = useContext(ThemeContext);

  console.log(link)
  return (
    <div
      className="fixed top-0 left-0 h-screen w-screen justify-center items-center z-[101] shadow-lg flex"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="h-fit rounded-xl border flex flex-col items-center p-big w-[300px]"
        style={{
          background: mode.background,
          borderColor: mode.return(mode.background, mode.border),
        }}
      >
        <div
          className="cursor-pointer w-full flex justify-end"
          onClick={() => {
            console.log("clicked");
            toggle(false)
          }}
        >
          <Icons icon="close_circle" />
        </div>
        <Icons icon="deploy_success" noToggle className="h-[120px] mb-8" />

        <Text20 light="black" className="font-[700]">
          Vault Deployed
        </Text20>
        <Text14
          light={TextColors.g600}
          dark={TextColors.g300}
          className="font-[200] text-center mb-5"
        >
          You have to connect a wallet to deploy vaults to the blockchain
        </Text14>
        <ButtonComp
          className="mt-5"
          onClick={async () => {
            window.open(link, "_blank");
          }}
        >
          <Text14>View on {explorer}</Text14>
          <Icons
            icon="open_in_new_dark"
            noToggle
            className="ml-2 h-[14px]"
          />{" "}
        </ButtonComp>
      </div>
    </div>
  );
}
