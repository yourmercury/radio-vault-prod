import { useEffect, useState } from "react";
import { Text18, Text24 } from "./texts/textSize";

export default function LoadingDots(){
    const [dots, setDots] = useState(".");

    useEffect(()=>{
        let interval = setInterval(()=>{
            setDots((d)=>{
                if(d.length > 3) return "."
                return d + " ."
            });
        }, 500)

        return ()=>{
            clearInterval(interval);
        }
    }, []);

    return (
        <Text24 light="black" className="lg:text-[32px]">{dots}</Text24>
    )
}