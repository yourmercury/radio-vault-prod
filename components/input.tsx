import { useContext } from "react";
import { AtIcon } from "./icons/loginIcons";
import { LightMode, TextColors } from "./styleGuide";
import { LowEmph } from "./texts/textEmphasis";
import { Text12 } from "./texts/textSize";
import { ThemeContext } from "@/context/ThemeContext";

export default function InputComp({
  icon,
  label,
  placeholder,
  className,
  value,
  theme,
  onChange,
  type,
  hasError,
  required,
}: {
  icon?: string;
  label?: any;
  placeholder: string;
  className?: string;
  theme?: string;
  value?: string;
  onChange?: (value: any) => any;
  type?: string;
  hasError?: boolean;
  required?: boolean;
}) {
  let { mode } = useContext(ThemeContext);
  return (
    <div
      className={`rounded-std border-[1.7px] flex items-center relative py-sm px-mid ${className}`}
      style={{
        borderColor: required && hasError ? "red" : mode.border,
      }}
    >
      {icon && (
        <img
          src={`/icons/${mode.getIcon(icon, "svg")}`}
          alt=""
          className="mr-5"
        />
      )}
      <div className="flex flex-col relative w-full">
        {label && (
          <label htmlFor="">
            <Text12
              light={TextColors.g400}
              dark={TextColors.g200}
              className="font-extralight"
            >
              {label}
            </Text12>
          </label>
        )}
        <input
          type={type || "text"}
          name=""
          id=""
          className="bg-transparent text-[16px] w-full placeholder:text-[16px] placeholder:font-extralight outline-none font-light"
          placeholder={placeholder}
          style={{
            color: type?.includes("date") ? "initial": (mode.theme == "dark" ? "white" : "black"),
            filter: (mode.theme == "dark" && type?.includes("date") ? "invert(1)" : ""),
            width: type?.includes("date")? "fit-content": "100%" 
          }}
          value={value}
          onChange={(e) => {
            let v = e.target.value;
            onChange && onChange(v);
          }}
        />
      </div>
    </div>
  );
}
