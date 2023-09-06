"use client"

import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";

export default function PageContainer({children}:{children?: any}){
    const {mode, toggleMode} = useContext(ThemeContext);

    return (
        <div className="min-h-screen w-[100vw] overflow-x-hidden" style={{background: mode?.background}}>
            {/* <button onClick={()=>{
                toggleMode()
            }}>
                change theme
            </button> */}
            {children}
        </div>
    )
}