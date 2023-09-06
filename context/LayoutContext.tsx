"use client";
import Blur from "@/components/blur";
import ContentContainer from "@/components/content";
import NavBar from "@/components/navbar";
import SideBar from "@/components/sidebar";
import { DarkMode, LightMode } from "@/components/styleGuide";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import Footer from "@/components/footer";

export const LayoutContext = createContext({});

const fullPages = ["/login", "/signup", "/embed"];

export default function LayoutContextProvider({ children }: { children: any }) {
  // const route = usePathname();

  // if(fullPages.includes(route) || route.includes("embed")) {
  //     return (
  //         <ContentContainer>{children}</ContentContainer>
  //     )
  // }

  return (
    <LayoutContext.Provider value={{}}>
      <div className="flex h-screen overflow-y-hidden">
        <SideBar />
        <div className="flex-1 h-screen overflow-y-scroll">
          <Blur />
          <NavBar />
          <ContentContainer>{children}</ContentContainer>
        </div>
        <Footer />
      </div>
    </LayoutContext.Provider>
  );
}
