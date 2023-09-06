"use client";

import PageContainer from "@/components/PageContainer";
import ButtonComp from "@/components/button";
import CheckBox from "@/components/checkBox";
import { AtIcon } from "@/components/icons/loginIcons";
import InputComp from "@/components/input";
import SecuredByMagicLink from "@/components/securedByMagicLink";
import { TextColors } from "@/components/styleGuide";
import {
  Text12,
  Text32,
  Text16,
  Text14,
  TextLink,
  Text24,
} from "@/components/texts/textSize";
import { ThemeContext } from "@/context/ThemeContext";
import { ResponseCodes } from "@/utils/responseCodes";
import { Magic } from "magic-sdk";
import { useState, useContext } from "react";
import Icons from "../icons/icons";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [checked, check] = useState(false);
  const { toggleMode } = useContext(ThemeContext);
  const [loginError, setLoginError] = useState(false);
  const router = useRouter();

  const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY as string);

  async function login() {
    let res = await fetch(`/api/signup`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    console.log(res.status);

    if (res.status == ResponseCodes.INTERNAL_SERVER_ERROR) {
      throw "Something went wrong!";
    } else if (res.status != ResponseCodes.OK) {
      location.replace("/signup");
      return;
    }

    let count = 0;
    let didToken = await magic.auth.loginWithEmailOTP({ email });
    let auth = await magic.user.getInfo();
    let response = await fetch(`/api/login`, {
      method: "POST",
      body: JSON.stringify({ didToken }),
    });
    if (response.status < 300) {
      location.replace("/");
      return;
    } else {
      setLoginError(true);
      throw "";
    }
  }

  return (
    <div className="flex h-screen overflow-hidden relative">
      <div className="px-big sm:px-[50px] pt-[30px] sm:pt-[100px] flex sm:block flex-col">
        <div className="mb-4 flex items-center">
          <Icons icon="logo" className="mr-2" />

          <Text14 light="black" className="font-[600]">
            Radio Vault
          </Text14>
        </div>
        <Text24
          dark={TextColors.white}
          light={TextColors.black}
          className="block pt-10 sm:pt-[initial] md:text-[32px]"
        >
          SignIn
        </Text24>
        <Text14
          light={TextColors.g600}
          dark={TextColors.g200}
          className="font-light md:text-[16px]"
        >
          You can be registed via magic link, send a verification code to your
          email and verify in seconds
        </Text14>
        
        <InputComp
          icon={"at"}
          label={"Email address"}
          placeholder="eg. johnbull@gmail.com"
          className="mb-3 text-white my-5"
          value={email}
          onChange={setEmail}
        />

        <div className="flex my-5 mt-3">
          <CheckBox checked={checked} check={() => check(!checked)} />
          <Text14
            light={TextColors.g600}
            dark={TextColors.g200}
            className="ml-2 font-extralight cursor-pointer"
          >
            You have read the <TextLink>Terms and conditions</TextLink>
          </Text14>
        </div>
    
        <ButtonComp className="mt-auto"
          onClick={async () => {
            toast.promise(login, {
              pending: "Logging you in",
              // success: "Welcome back " + email,
              error: "Something went wrong!",
            });
          }}
        >
          <div className="flex">
            <Text16 className="text-white font-medium">
              Send verification
            </Text16>
            <Icons icon="arrow_right" className="ml-3" />
          </div>
        </ButtonComp>
        <Text16 light={TextColors.g600} dark={TextColors.g200} className="mb-5 mt-1 block font-light text-center sm:text-left">Don't have an account? <TextLink onClick={()=>{
          router.push("/signup");
        }}>Sign up</TextLink></Text16>
        <br />
        <div className="fixed top-[90vh] hidden sm:block">
          <SecuredByMagicLink />
        </div>
      </div>


      <div className="w-[70%] hidden sm:block">
        <img
          src="/assets/login_image.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
