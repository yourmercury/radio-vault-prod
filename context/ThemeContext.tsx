"use client";
import { DarkMode, LightMode } from "@/components/styleGuide";
import { Dispatch, SetStateAction, createContext, useEffect, useState } from "react";

export const ThemeContext = createContext<{mode: any, toggleMode: any, activeRoute: string, setActiveRoute: Dispatch<SetStateAction<string>>, showSide: boolean, setSide: (a:boolean)=> any }>({} as any)

export default function ThemeContextProvider({children}:{children: any}){
    const [mode, setMode] = useState<any>(null);
    const [activeRoute, setActiveRoute] = useState("");
    const [showSide, setSide] = useState(false);

    useEffect(()=>{
        let x = typeof window != "undefined"? localStorage?.getItem("mode") : null;
        let mode = x=="dark" || !x ? DarkMode : LightMode;
        setMode(mode);
    }, []);
    
    function toggleMode(){
        if(localStorage.getItem("mode") == "dark"){
            setMode(LightMode);
            localStorage.setItem("mode", "light");
        }else {
            setMode(DarkMode);
            localStorage.setItem("mode", "dark");
        }
    }

    if(!mode) {
        return (
            <div className="h-screen bg-black">

            </div>
        )
    }

    return (
        <ThemeContext.Provider value={{mode, toggleMode, activeRoute, setActiveRoute, showSide, setSide}}>
            {children}
        </ThemeContext.Provider>
    )
}