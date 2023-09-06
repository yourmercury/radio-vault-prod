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
import { AuthContext } from "@/context/AuthContext";
import { ThemeContext } from "@/context/ThemeContext";
import { useState, useContext, useRef } from "react";
import Icons from "../icons/icons";
import { ResponseCodes } from "@/utils/responseCodes";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Magic } from "magic-sdk";

export default function SignupPage() {
  const { onLogin } = useContext(AuthContext);
  const [checked, check] = useState(false);
  const { toggleMode } = useContext(ThemeContext);
  const sending = useRef(false);

  const router = useRouter();

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });

  const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY as string);

  async function signup() {
    sending.current = true;
    try {
      // Validate the form
      if (!(form.email && form.firstName && form.lastName)) {
        throw "Please complete the form";
      }

      let r = await fetch(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/signup`,
        { method: "POST", body: JSON.stringify({ email: form.email }) }
      );

      if(r.status == ResponseCodes.OK) {
        console.log(r.status);
        return "/login"
      }

      let didToken = await magic.auth.loginWithEmailOTP({ email: form.email });
      let auth = await magic.user.getInfo();

      let res = await fetch(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/register`,
        { method: "POST", body: JSON.stringify({ ...form, didToken }) }
      );
      if (res.status == ResponseCodes.CREATED) {
        let r = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/login`, {method: "POST", body: JSON.stringify({didToken})})
        if(r.status == ResponseCodes.CREATED) return "/";
        else return "/login "
      } else if (res.status == ResponseCodes.FORBIDDEN) {
        return "/login";
      } else {
        throw "Something went wrong!";
      }
    } catch (error) {
      throw(error);
    }
    finally {
      sending.current = false;
    }
  }

  return (
    <div className="flex h-screen overflow-hidden relative">
      <div className="px-big pt-[30px] sm:px-[50px] sm:pt-[100px] flex sm:block flex-col">
        <button onClick={toggleMode}>toggle</button>
        <div className="mb-10 sm:mb-4 flex items-center">
          <Icons icon="logo" className="mr-2" />

          <Text14 light="black" className="font-[600]">
            Radio Vault
          </Text14>
        </div>
        <Text24
          dark={TextColors.white}
          light={TextColors.black}
          className="block md:text-[32px]"
        >
          Create an account
        </Text24>
        <Text14
          light={TextColors.g600}
          dark={TextColors.g200}
          className="font-light md:text-[16px]"
        >
          You can be registed via magic link, send a verification code to your
          email and verify in seconds
        </Text14>
        <br />
        <br />
        <InputComp
          icon={"person1"}
          label={"First name"}
          placeholder="eg. John"
          className="mb-3 text-white"
          value={form.firstName}
          onChange={(value) => {
            setForm({ ...form, firstName: value });
          }}
        />
        <InputComp
          icon={"person1"}
          label={"Last name"}
          placeholder="eg. Doe"
          className="mb-3 text-white"
          value={form.lastName}
          onChange={(value) => {
            setForm({ ...form, lastName: value });
          }}
        />
        <InputComp
          icon={"at"}
          label={"Email address"}
          placeholder="eg. johnbull@gmail.com"
          className="mb-3 text-white"
          value={form.email}
          onChange={(value) => {
            setForm({ ...form, email: value });
          }}
        />

        <div className="flex">
          <CheckBox checked={checked} check={() => check(!checked)} />
          <Text14
            light={TextColors.g600}
            dark={TextColors.g200}
            className="ml-2 font-extralight"
          >
            You have read the <TextLink>Terms and conditions</TextLink>
          </Text14>
        </div>
        <br />
        <ButtonComp
          className="mt-auto"
          onClick={() => {
            if(sending.current) return;

            toast.promise(signup, {
              pending: "Signing you up",
              success: {
                render: ({ data }) => {
                  console.log(data)
                  setTimeout(() => {
                    router.push(data as string);
                  }, 1500);
                  if (data == "/") {
                    return "Signup successful";
                  } else if(data == "/login "){
                    return "Signup successful"
                  }
                   else {
                    return "You are already signed up";
                  }
                },
              },
              error: {
                render: ({data})=>{
                  console.log(data);
                  return data as string
                }
              }
            });
          }}
        >
          <div className="flex">
            <Text16 className="text-white font-medium">
              Send verification
            </Text16>
            <Icons icon="arrow_right_dark" noToggle className="ml-2" />
          </div>
        </ButtonComp>
        <Text16
          light={TextColors.g600}
          dark={TextColors.g200}
          className="mt-1 block font-light mb-5 sm:mb-[inital] text-center sm:text-start"
        >
          Already have an account? <TextLink onClick={(e)=>{router.push("/login")}}>Sign in</TextLink>
        </Text16>
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
