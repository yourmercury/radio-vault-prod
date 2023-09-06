"use client";

import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";
import { TextColors } from "./styleGuide";
import Icons from "./icons/icons";
import { VaultContext } from "@/context/VaultContext";
import { getIPFSLink } from "@/utils/NFTStorage";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const { mode, setSide } = useContext(ThemeContext);
  const {dashboard} = useContext(VaultContext);
  const router = useRouter();

  
  return (
    <div
      className="border-b-[1px] sticky top-0 flex items-center h-[70px] px-big xl:px-20 z-50"
      style={{
        borderColor: mode.border,
        backgroundColor: mode.background,
      }}
    >
      <div onClick={()=>{
        setSide(true);
      }}>
        <Icons icon="menu" className="cursor-pointer block xl:hidden" />
      </div>
      <div className="ml-auto" 
        onClick={()=>{
          router.push("/profile");
        }}
      >
        <img
          src={getIPFSLink(dashboard?.user.avatar) || "https://ionicframework.com/docs/img/demos/avatar.svg"}
          alt=""
          className="h-[35px] w-[35px] rounded-full"
        />
      </div>
    </div>
  );
}
