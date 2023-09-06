import { useContext } from "react"
import { LightMode } from "../styleGuide"
import { ThemeContext } from "@/context/ThemeContext"

export function HighEmph({children}: {children: any}){
    let {mode} = useContext(ThemeContext);
    return(
        <span style={{color: mode.highEm, fontWeight: "lighter"}}>
            {children}
        </span>
    )
}

export function LowEmph({children}: {children: any}){
    let {mode} = useContext(ThemeContext);
    return(
        <span style={{color: mode.lowEm, fontWeight: "lighter"}}>
            {children}
        </span>
    )
}