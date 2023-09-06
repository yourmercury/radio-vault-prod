"use client";

import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";
import Icons from "../icons/icons";
import { Text16, Text20, Text24, Text32 } from "../texts/textSize";
import { TextColors } from "../styleGuide";
import ButtonComp from "../button";
import RecentActivites from "./recentActivity";
import EmptyState from "../emptyState";

export default function DashboardPage({data}:{data: any}) {
  const { mode } = useContext(ThemeContext);
    console.log(data);
  return (
    <div className="px-big xl:pr-20 pb-big mt-5">
      <div
        className="md:border-[1px] md:rounded-[20px] rounded-[10px] md:p-big"
        style={{
          borderColor: mode.theme == "light" ? mode.border : TextColors.g800,
        }}
      >
        <div className="flex flex-col md:flex-row justify-between mb-5">
          <div>
            <span
              style={{ color: mode.theme == "dark" ? "white" : "black" }}
              className="flex items-center text-[18px] md:text-[24px]"
            >
              Hello, welcome back{" "}
              <Icons icon="noto_waving_hand" noToggle className="ml-2" />
            </span>
            <Text16
              light={TextColors.g400}
              dark={TextColors.g200}
              className="hidden md:block"
            >
              Radio vault allows you save your media files, register its meta
              data and can be streamed to all other platforms
            </Text16>
          </div>
          {/* <div className="h-[50px] w-[200px] hidden md:flex items-center justify-center rounded-xl" style={{backgroundColor: mode.primary}}>
            <Text16>Upload track</Text16>{" "}
            <Icons icon="arrow_right_dark" noToggle className="ml-2" />
          </div> */}
        </div>

        <div className="box-border overflow-x-scroll mb-10">
          <div className="flex gap-3 sm:gap-[20px] w-fit md:w-full break-inside-avoid">
            <Stat
              icon="illust_play"
              count={data.user.streams || data.month?.streams || 0}
              label="Streams"
              mode={mode}
            />
            <Stat
              icon="illust_play"
              count={data.month?.streams || 0}
              label="This Month"
              mode={mode}
            />
            <Stat
              icon="illust_shares"
              count={data.users?.shares || 0}
              label="Shares"
              mode={mode}
            />
            <Stat
              icon="illust_shares"
              count={data.month?.shares || 0}
              label="This Month"
              mode={mode}
            />
          </div>
        </div>

        {/* <div
          style={mode.return(
            {},
            {
              backgroundColor: TextColors.g800,
              borderColor: TextColors.g700,
              backgroundImage: "none",
            }
          )}
          className={`mt-5 border rounded-[10px] md:rounded-[20px] flex sm:items-center justify-between md:bg-gradient-to-t from-[#DFE1E72f] md:shadow-md md:shadow-[#BB002915] bg-[#1974F81f] sm:bg-transparent mb-5`}
        >
          <Icons icon="illust_new" className="h-[100px] md:h-[120px]" />
          <div className="p-mid sm:p-0">
            <div
              className="text-[14px] md:text-[16px]"
              style={{ color: mode.return("black", "white") }}
            >
              You can now use our new service
            </div>
            <div
              className="text-[14px] md:text-[16px]"
              style={{ color: mode.return(TextColors.g400, TextColors.g200) }}
            >
              {` I honestly don't know what the new service is, there might not
              even be a new service, but if there was, this is how to show it`}
            </div>
            <div
              className="text-[12px] md:text-[14px]"
              style={{ color: mode.primary }}
            >
              Keep showing me this information
              <span
                className="ml-3"
                style={{ color: mode.return(TextColors.g400, TextColors.g200) }}
              >
                Don't show this again
              </span>
            </div>
          </div>

          <Icons
            icon="vault_comfetti"
            className="h-[100px] md:h-[120px] hidden sm:block"
            noToggle
          />
        </div> */}
      </div>

      <RecentActivites mode={mode} vaults={data?.vaults}/>
    </div>
  );
}

function Stat({
  mode,
  count,
  label,
  icon,
  noToggle,
}: {
  mode: any;
  count: number;
  label: string;
  icon: string;
  noToggle?: boolean;
}) {
  return (
    <div
      className="border-[0.5px] rounded-[10px] flex w-[200px] sm:flex-1 items-center flex-1 h-[100px]  md:h-[120px]"
      style={{
        borderColor: mode.theme == "light" ? mode.border : TextColors.g700,
      }}
    >
      <Icons
        icon={icon}
        noToggle={noToggle}
        className="h-[100px] md:h-[120px]"
      />
      <div className="relative md:ml-4 md:top-[-8px] ">
        <div
          className="font-[500] text-[16px] lg:text-[32px] text-center sm:text-start"
          style={{ color: mode.theme == "dark" ? "white" : TextColors.g600 }}
        >
          {count}
        </div>
        <div
          className="font-[600] text-center text-[12px] lg:text-[16px]"
          style={{
            color: mode.theme == "dark" ? TextColors.g200 : TextColors.g400,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
