"use client";

import { createContext, useState, useEffect } from "react";
import { Magic, RPCError, RPCErrorCode } from "magic-sdk";
import { useRouter } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { ResponseCodes } from "@/utils/responseCodes";
import LoginPage from "@/components/login/loginPage";

export const AuthContext = createContext({} as any);

export default function AuthContextProvider({ children }: { children: any }) {
  const [auth, setAuth] = useState<any>(null);
  const [authenticating, finishAuthentication] = useState(true);
  const router = useRouter();

  const signup = async (email: string, firstName: string, lastName: string) => {
    try {
      // first check if the user has an account
  
      let magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY as string, {
        testMode: process.env.NODE_ENV === "development",
      });
      let didToken = await magic.auth.loginWithMagicLink({ email });
      const res = await fetch(`/api/signup`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + didToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, firstName, lastName }),
      });
  
      if (res.status == ResponseCodes.CREATED) {
        localStorage.setItem("email", email);
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const onLogin = async (email: string) => {
    try {
      // first check if user has account
      // *******************************
  
      let magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY as string, {
        testMode: process.env.NODE_ENV === "development",
      });
      let didToken = await magic.auth.loginWithMagicLink({ email });
  
      const res = await fetch(`/api/login`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + didToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
  
      if (res.status == ResponseCodes.CREATED) {
        localStorage.setItem("email", email);
      }
      console.log(res.status);
    } catch (error) {
      if (error instanceof RPCError) {
        switch (error.code) {
          case RPCErrorCode.MagicLinkFailedVerification:
          case RPCErrorCode.MagicLinkExpired:
          case RPCErrorCode.MagicLinkRateLimited:
          case RPCErrorCode.UserAlreadyLoggedIn:
            console.log("already logged in");
            break;
        }
      }
    }
  };
  

  const checkAuthStatus = async () => {
    try {
      let magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY as string);
      let isLoggedin = await magic.user.isLoggedIn();
      console.log(isLoggedin)
      if (isLoggedin) {
        let metadata = await magic.user.getInfo();
        console.log(metadata);
        return metadata;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("this is running");
    checkAuthStatus()
      .then((metadata) => {
        if (metadata) {
          console.log(metadata);
          setAuth(metadata);
        }
        finishAuthentication(false);
      })
      .catch((error) => {
        // console.error(error);
        finishAuthentication(false);
      });
  }, []);

  if (authenticating) {
    return <span>Authenticating</span>;
  }

  if(!authenticating && !auth) {
    return <AuthContext.Provider value={{ auth, setAuth }}><LoginPage /></AuthContext.Provider>;
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>
  );
}

