"use client";

import { useContext, useEffect, useState } from "react";
import Icons from "./icons/icons";
import { Text24, Text16, Text20, Text14 } from "./texts/textSize";
import { ThemeContext } from "@/context/ThemeContext";
import { TextColors } from "./styleGuide";
import { usePathname, useRouter } from "next/navigation";

export default function SideBar() {
  const { toggleMode, mode, showSide } = useContext(ThemeContext);
  const activeRoute = usePathname();
  const [top, setTop] = useState(0);

  useEffect(()=>{
    const sidenav = document.querySelector("#side_nav_"+activeRoute.split("/")[1]);
    //@ts-ignore
    const t = sidenav?.offsetTop;
    console.log(sidenav)
    setTop(t as number);
  }, [activeRoute]);

  return (
    <div
      className="w-[300px] xl:h-[initial] pl-10 lg:block border-r absolute z-[60] left-[-100%] xl:static h-screen"
      style={{
        borderColor: mode.border,
        backgroundColor: mode.background,
        left: showSide? "0" : "-100%",
        transition: "left 0.5s ease-in"
      }}
    >
      <div className="flex items-center h-[70px] ">
        <Icons icon="logo" className="h-[35px]" />
        <Text20 light="black" className="ml-5 font-bold">
          Radio Vault
        </Text20>
      </div>

      <div className="my-7 pl-5 relative">
        <div
          className="h-[35px] rounded-l w-[3.5px] ml-auto absolute right-0"
          style={{ background: mode.primary, top: top, transition: "0.3s ease-in" }}
        ></div>
        <div className="pb-4">
          <SideBarNav
            icon="element_4"
            label="Dashboard"
            route="/"
            activeRoute={activeRoute}
          />
          <SideBarNav
            icon="folder_2"
            label="Tracks"
            route="/tracks"
            activeRoute={activeRoute}
          />
          <SideBarNav
            icon="box_add"
            label="Create"
            route="/upload-vault"
            activeRoute={activeRoute}
          />
          <SideBarNav
            icon="send_square_2"
            label="Deploy"
            route="/deploy"
            activeRoute={activeRoute}
          />
          <SideBarNav
            icon="document_text"
            label="Whitelist"
            route="/whitelist"
            activeRoute={activeRoute}
          />
        </div>

        <hr
          className="mr-10"
          style={{
            borderColor:
              mode.theme == "light" ? TextColors.g100 : TextColors.g800,
          }}
        />

        <div className="pt-5">
          <SideBarNav
            icon="user_edit"
            label="Profile"
            route="/profile"
            activeRoute={activeRoute}
          />
          {/* <SideBarNav
            icon="setting"
            label="Settings"
            route="/settings"
            activeRoute={activeRoute}
          /> */}
          <div onClick={async()=>{
            await fetch("/api/logout")
            location.reload();
        }}>
          <SideBarNav icon="logout" label="Log out" activeRoute={activeRoute}/>
          </div>
        </div>

        <div
          onClick={() => {
            toggleMode();
          }}
          className="mt-10 cursor-pointer w-[60px] bg-transparent relative flex items-center border justify-around h-[30px] rounded-full"
          style={{ borderColor: mode.border }}
        >
          <div className="h-[30px] flex justify-center items-center w-[30px] absolute left-0 z-10">
            <Icons icon={"sun"} />
          </div>
          <div className="h-[30px] flex justify-center items-center w-[30px] left-[calc(100%-30px)] absolute z-10">
            <Icons icon={"moon"} className="bg-transparent" />
          </div>
          <div
            className="h-[28px] flex justify-center items-center w-[30px] absolute bg-white rounded-full"
            style={{
              backgroundColor:
                mode.theme == "light" ? TextColors.g100 : TextColors.g700,
              left: mode.theme == "light" ? "0" : "calc(100% - 30px)",
              transition: "0.3s ease-in",
            }}
          ></div>

          {/* <Text14 light={mode.primary} dark={mode.primary} className="capitalize">{mode.theme}</Text14> */}
        </div>
      </div>
    </div>
  );
}

function SideBarNav({
  icon,
  label,
  activeRoute,
  route,
}: {
  icon: string;
  label: string;
  activeRoute?: string;
  route?: string;
}) {
  const { mode } = useContext(ThemeContext);
  const active = activeRoute?.split("/")[1] == route?.split("/")[1];
  const router = useRouter();
  const theme = {
    dark: active ? mode.primary : TextColors.g300,
    light: active ? mode.primary : TextColors.g400,
  };
  const cls = active ? "font-bold" : "";
  return (
    <div
      className="flex items-center mb-6 relative h-[35px] cursor-pointer"
      onClick={() => {
        router.push(route as string);
      }}
      id={"side_nav_" + route?.split("/")[1]}
    >
      <Icons icon={icon + (active ? "_active" : "")} className="mr-2 transition ease-in" />
      <Text14 light={theme.light} dark={theme.dark} className={`${cls} transition ease-in`}>
        {label}
      </Text14>

      {/* {active && (
        <div
          className="h-full rounded-l w-[3.5px] ml-auto"
          style={{ background: mode.primary }}
        ></div>
      )} */}
    </div>
  );
}
