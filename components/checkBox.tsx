"use client";
import { useContext } from "react";
import { LightMode } from "./styleGuide";
import { ThemeContext } from "@/context/ThemeContext";

export default function CheckBox({
  checked,
  check,
  className,
  h,
  w
}: {
  checked: boolean;
  check?: (checked: boolean) => void;
  className?: string;
  h?: string;
  w?: string;
}) {
  let {mode} = useContext(ThemeContext);
  return (
    <div
      className={`h-[20px] w-[20px] rounded relative cursor-pointer ${className || ""}`}
      style={{}}
      onClick={() => {
        check && check(checked);
      }}
    >
      {checked ? (
        <div
          className={`h-full w-full relative p-[3px] rounded`}
          style={{ background: mode.primary, transition: "0.2s 0s linear" }}
        >
          <img src="/icons/tick.svg" className="h-full w-full" alt="" />
        </div>
      ) : (
        <div
          style={{ borderColor: mode.border }}
          className={`h-full w-full border-[2px] rounded`}
        ></div>
      )}
    </div>
  );
}
