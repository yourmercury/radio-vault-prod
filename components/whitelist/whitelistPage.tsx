"use client";
import { useContext, useEffect, useState } from "react";
import { Text12, Text14, Text16, Text18 } from "../texts/textSize";
import { ThemeContext } from "@/context/ThemeContext";
import InputComp from "../input";
import ButtonComp from "../button";
import Icons from "../icons/icons";
import { TextColors } from "../styleGuide";
import ToggleBtn from "../toggleBtn";
import { ResponseCodes } from "@/utils/responseCodes";
import { VaultContext } from "@/context/VaultContext";
import { toast } from "react-toastify";
import LoadingDots from "../loading";

export default function WhiteListPage() {
  const { mode } = useContext(ThemeContext);
  const { whitelisted, handleWhitelist, whitelistError } = useContext(VaultContext);
  const [input, setInput] = useState("");

  async function processInput() {
    if (!input.includes(".")) {
      toast.error("Invalid url");
      return;
    }

    let newInp = input;
    if (!(input.includes("https://") || input.includes("http://"))) {
      newInp = "https://" + newInp;
    }

    setInput(newInp);

    toast.promise(
      () => {
        return handleWhitelist("", newInp, true);
      },
      {
        pending: "Adding to whitelist",
        success: {
          render: ({ data }) => {
            return "Added succesfully";
          },
        },
        error: {
          render: ({ data }) => {
            console.log(data);
            return "Something went wrong";
          },
        },
      }
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-70px)] flex-col md:flex-row">
      <div className="flex-1 p-big">
        <div className="flex flex-col">
          <Text18 className="sm:text-[24px]" light="black">
            Whitelist marketplaces and services
          </Text18>
          <Text12 light={TextColors.g600} dark={TextColors.g200}>
            Radio vault will allow these marketplaces and services get access to
            your metadata
          </Text12>
        </div>

        <div
          className="my-5 border-b pb-10"
          style={{ borderColor: mode.border }}
        >
          <InputComp
            placeholder="Eg. www.xyz.com or https://www.xyz.com"
            className="py-big mb-3"
            value={input}
            onChange={(value) => {
              setInput(value);
            }}
          />
          <ButtonComp
            onClick={() => {
              if (!input) {
                toast.error("Please input a valid url");
                return;
              }
              processInput();
            }}
          >
            <Text14>Whitelist</Text14>{" "}
            <Icons icon="arrow_right_dark" className="ml-2" noToggle />
          </ButtonComp>
        </div>

        {/* <div style={{borderColor: mode.border}}>
            <Icons icon="illust_whitelist"/>
        </div> */}

        <div>
          <div className="flex justify-between mb-5">
            <Text16 className="" light="black">
              Whitelisted services
            </Text16>

            {/* <Text16
              className="underline cursor-pointer"
              light={mode.primary}
              dark={mode.primary}
            >
              Remove all
            </Text16> */}
          </div>
          {!whitelistError && whitelisted.length == 0 && <div className="flex justify-center"><LoadingDots /></div>}
          {whitelistError && whitelisted.length == 0 && <div className="flex justify-center"><Text18>Empty</Text18></div>}
          {whitelisted.map((wh, index) => (
            <Service url={wh.service} status={wh.status} key={index} />
          ))}
          <div></div>
        </div>
      </div>
      <div
        className="md:border-l md:w-[300px] lg:w-[500px] p-big"
        style={{ borderColor: mode.border }}
      >
        <div>
          <div>
            <Text16 light="black">FAQs</Text16>
          </div>

          <div>
            <div
              className="flex items-start border-b p-5"
              style={{ borderColor: mode.border }}
            >
              <div>
                <Icons icon="help" className="w-[20px]" />
              </div>

              <div className="ml-3 flex flex-col">
                <Text14 light="black">
                  Would Whitelisted services be able to access my data
                </Text14>
                <Text12 light={TextColors.g600} dark={TextColors.g200}>
                  No they would not. Any service that exists on your whitelist
                  will be allowed{" "}
                </Text12>
              </div>
            </div>

            <div
              className="flex items-start border-b p-5"
              style={{ borderColor: mode.border }}
            >
              <div>
                <Icons icon="help" className="w-[20px]" />
              </div>

              <div className="ml-3 flex flex-col">
                <Text14 light="black">
                  Would Whitelisted services be able to access my data
                </Text14>
                <Text12 light={TextColors.g600} dark={TextColors.g200}>
                  No they would not. Any service that exists on your whitelist
                  will be allowed{" "}
                </Text12>
              </div>
            </div>
            <div
              className="flex items-start border-b p-5"
              style={{ borderColor: mode.border }}
            >
              <div>
                <Icons icon="help" className="w-[20px]" />
              </div>

              <div className="ml-3 flex flex-col">
                <Text14 light="black">
                  Would Whitelisted services be able to access my data
                </Text14>
                <Text12 light={TextColors.g600} dark={TextColors.g200}>
                  No they would not. Any service that exists on your whitelist
                  will be allowed{" "}
                </Text12>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Service({ status, url }: { url: string; status: boolean }) {
  const { mode } = useContext(ThemeContext);
  const [title, setTitle] = useState("");
  const {handleWhitelist} = useContext(VaultContext)

  useEffect(() => {
    // fetch(url)
    //   .then((response) => response.text())
    //   .then((html) => {
    //     const parser = new DOMParser();
    //     const doc = parser.parseFromString(html, "text/html");
    //     const title = doc.querySelector("title")?.textContent;

    //     if(title) {
    //       setTitle(title);
    //     }else {
    //       setTitle("Unknown");
    //     }
    //   })
    //   .catch((error) => {
    //     setTitle("Unknown");
    //   });

    let t = new window.URL(url).host;
    setTitle(t);
  });

  return (
    <div
      className="flex items-center border p-2 px-3 rounded-lg mb-3"
      style={{ borderColor: mode.border }}
    >
      {/* <Icons icon="globe_2" /> */}
      <img
        src={`https://www.google.com/s2/favicons?domain=${
          new window.URL(url).hostname
        }&sz=${64}`}
        className="w-[30px] h-[30px]"
        alt=""
      />
      <div className="flex flex-col ml-4">
        <Text16 light="black">{title}</Text16>
        <Text12 light={TextColors.g600} dark={TextColors.g200}>
          {url}
        </Text12>
      </div>
      <div className="ml-auto">
        <ToggleBtn on={status} toggle={()=>{
          let s = status;
          toast.promise(()=>handleWhitelist("", url, !status),
          {
            pending: `${s? "Removing from":"Adding back to"} whitelist`,
            success: `${s? "Removed succesfully":"Added succesfully"}`,
            error: "Something went wrong"
          }
          )
          
        }}/>
      </div>
    </div>
  );
}
