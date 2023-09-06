"use client";

import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";

export default function Icons({icon, h, w, className, noToggle}:{icon: string, h?: number, w?: number, className?: string, noToggle?: boolean}) {
    const {mode} = useContext(ThemeContext);
  return (
    <img
      src={`/icons/${noToggle ? `${icon}.svg` : mode.getIcon(icon, "svg")}`}
      alt=""
      className={className}
      height={h}
      width={w}
    />
  );
}
