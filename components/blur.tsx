"use client";
import { ThemeContext } from "@/context/ThemeContext"
import { useContext } from "react"

export default function Blur(){
    const {showSide, setSide} = useContext(ThemeContext)
    // if(!showSide) return null
    return (
        <div className="h-screen w-screen fixed z-40" style={{background: "rgba(0,0,0,0.7)", transition: "0.5s ease-in", height: showSide? "100vh":"0px"}} onClick={()=>{
            setSide(false);
        }}>

        </div>
    )
}