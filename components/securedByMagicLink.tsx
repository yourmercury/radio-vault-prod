"use client";

import { useContext } from "react";
import { DarkMode, LightMode, TextColors } from "./styleGuide"
import { LowEmph } from "./texts/textEmphasis"
import { Text16 } from "./texts/textSize"
import { ThemeContext } from "@/context/ThemeContext";

export default function SecuredByMagicLink(){
    let {mode} = useContext(ThemeContext);
    return (
        <div className={`flex items-center`}>
            <img src={`/icons/${mode.getIcon("lock", "svg")}`} alt="" className="mr-2" />
            <Text16 light={TextColors.g400} dark={TextColors.g200}>Secured by MagicLink</Text16>
        </div>
    )
}