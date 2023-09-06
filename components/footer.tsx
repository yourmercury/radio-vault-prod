"use client";

import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";
import Icons from "./icons/icons";
import { Text14 } from "./texts/textSize";
import { TextColors } from "./styleGuide";

export default function Footer() {
  const { mode, setSide } = useContext(ThemeContext);
  
  return (
    <div
      className="fixed bottom-0 w-screen z-[65] flex justify-center items-center py-5 border-t"
      style={{
        borderColor: mode.border,
        backgroundColor: mode.background,
      }}
    >
        <Icons icon="copyright" />
        <Text14 className="ml-2" light={TextColors.g600} dark={TextColors.g200}>2023 Radio vaults. All rights reserved</Text14>
    </div>
  );
}
