"use client";

import { ThemeContext } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import { MouseEvent, useContext } from "react";

export function Text12({
  children,
  className,
  dark,
  light,
}: {
  children: any;
  className?: string;
  dark?: string;
  light?: string;
}) {
  const { mode } = useContext(ThemeContext);
  let color = mode.theme == "dark" ? dark : light;
  return (
    <span
      className={`text-[12px] relative ${className}`}
      style={{ color: color || "white" }}
    >
      {children}
    </span>
  );
}

export function Text14({
  children,
  className,
  dark,
  light,
}: {
  children: any;
  className?: string;
  dark?: string;
  light?: string;
}) {
  const { mode } = useContext(ThemeContext);
  let color = mode.theme == "dark" ? dark : light;
  return (
    <span
      className={`text-[14px] relative ${className}`}
      style={{ color: color || "white" }}
    >
      {children}
    </span>
  );
}

export function Text16({
  children,
  className,
  dark,
  light,
}: {
  children: any;
  className?: string;
  dark?: string;
  light?: string;
}) {
  const { mode } = useContext(ThemeContext);
  let color = mode.theme == "dark" ? dark : light;
  return (
    <span
      className={`text-[16px] relative ${className}`}
      style={{ color: color || "white" }}
    >
      {children}
    </span>
  );
}

export function Text18({
  children,
  className,
  dark,
  light,
}: {
  children: any;
  className?: string;
  dark?: string;
  light?: string;
}) {
  const { mode } = useContext(ThemeContext);
  let color = mode.theme == "dark" ? dark : light;
  return (
    <span
      className={`text-[18px] relative ${className}`}
      style={{ color: color || "white" }}
    >
      {children}
    </span>
  );
}

export function Text20({
  children,
  className,
  dark,
  light,
}: {
  children: any;
  className?: string;
  dark?: string;
  light?: string;
}) {
  const { mode } = useContext(ThemeContext);
  let color = mode.theme == "dark" ? dark : light;
  return (
    <span
      className={`text-[20px] relative ${className}`}
      style={{ color: color || "white" }}
    >
      {children}
    </span>
  );
}

export function Text24({
  children,
  className,
  dark,
  light,
}: {
  children: any;
  className?: string;
  dark?: string;
  light?: string;
}) {
  const { mode } = useContext(ThemeContext);
  let color = mode.theme == "dark" ? dark : light;
  return (
    <span
      className={`text-[24px] relative ${className}`}
      style={{ color: color || "white" }}
    >
      {children}
    </span>
  );
}

export function Text32({
  children,
  className,
  dark,
  light,
}: {
  children: any;
  className?: string;
  dark?: string;
  light?: string;
}) {
  const { mode } = useContext(ThemeContext);
  let color = mode.theme == "dark" ? dark : light;
  return (
    <span
      className={`${className} text-[32px] relative`}
      style={{ color: color || "white" }}
    >
      {children}
    </span>
  );
}

export function Text40({
  children,
  className,
  dark,
  light,
}: {
  children: any;
  className?: string;
  dark?: string;
  light?: string;
}) {
  const { mode } = useContext(ThemeContext);
  let color = mode.theme == "dark" ? dark : light;
  return (
    <span
      className={`text-[40px] relative ${className}`}
      style={{ color: color || "white" }}
    >
      {children}
    </span>
  );
}

export function TextLink({
  children,
  onClick,
  className,
  link,
}: {
  children: any;
  onClick?: (e: MouseEvent<HTMLSpanElement>) => any;
  className?: string;
  link?: string;
}) {
  const { mode } = useContext(ThemeContext);
  const router = useRouter();
  return (
    <span
      className={`cursor-pointer ${className}`}
      onClick={(e) => {
        onClick?.(e);
        link && router.push(link);
      }}
      style={{ color: mode.primary }}
    >
      {children}
    </span>
  );
}
