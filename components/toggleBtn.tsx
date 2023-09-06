import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";

export default function ToggleBtn({on, toggle}:{on: boolean, toggle?: (on: boolean)=>any}) {
    const {mode} = useContext(ThemeContext);
    return (
        <div className="w-[40px] h-[20px] rounded-full p-[3px] flex cursor-pointer relative" style={{borderColor: on? mode.primary: "#71717A", background:  on? mode.primary: "#71717A"}}
            onClick={()=>{
                toggle&&toggle(on)
            }}
        >
            <div className="w-[20px] h-[20px] rounded-full bg-white absolute top-0 left-0" style={{transition: "0.5s ease-in 0s", left: on? "calc(20px)": "0px"}}>

            </div>
        </div>
    )
}