"use client";

import { ThemeContext } from "@/context/ThemeContext";
import { CSSProperties, useContext } from "react";
import { TextColors } from "./styleGuide";

export default function ButtonComp({children, onClick, className}: {children: any, onClick?: (value?:any)=>any, className?: string}){
    const {mode} = useContext(ThemeContext);
    return (
        <button className={`py-sm md:py-mid font-light relative flex justify-center items-center rounded-std w-full ${className || ""}`}
            style={{
                background: mode.primary
            }}
            onClick={()=>{
                onClick && onClick();
            }}
        >{children}</button>
    )
}

export function Button2Comp({children, onClick, className}: {children: any, onClick?: (value?:any)=>any, className?: string}){
    const {mode} = useContext(ThemeContext);
    const style: CSSProperties = {
        borderColor: `${TextColors.g700}`,
        backgroundImage: `linear-gradient(${mode.background}, rgba(255,255,255,0.05))`,
    }

    const style2: CSSProperties = {
        // borderColor: mode.primary,
        // borderWidth: "1px",
        boxShadow: `0.5px 0.5px 1px 0px #bc042c6a`
        // backgroundImage: `linear-gradient(rgba(255,255,255,0.05), ${mode.primary})`,
    }
    return (
        <button className={`py-sm md:py-mid font-light relative flex justify-center items-center rounded-std border-[2px] ${className || ""}`}
            style={mode.theme== "dark"? style:style2}
            onClick={()=>{
                onClick && onClick();
            }}
        >{children}</button>
    )
}