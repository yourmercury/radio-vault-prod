import { useContext } from "react";
import { AtIcon } from "./icons/loginIcons";
import { LightMode, TextColors } from "./styleGuide";
import { LowEmph } from "./texts/textEmphasis";
import { Text12 } from "./texts/textSize";
import { ThemeContext } from "@/context/ThemeContext";

export default function TextAreaComp({
  icon,
  label,
  cols,
  placeholder,
  className,
  value,
  theme,
  onChange,
  hasError,
  required,
}: {
  icon?: string
  cols?: number
  label: any;
  placeholder: string;
  theme?: string
  className?: string;
  value?: string;
  onChange?: (value: any)=> any
  hasError?: boolean;
  required?: boolean
}) {
  let { mode } = useContext(ThemeContext);
  return (
    <div
      className={`rounded-std border-[1.7px] flex items-center relative py-sm px-mid ${className}`}
      style={{
        borderColor:required && hasError? "red": mode.border,
      }}
    >
      {icon && <img src={`/icons/${mode.getIcon(icon, "svg")}`} alt="" className="mr-5" />}
      <div className="flex flex-col relative w-full">
        <label htmlFor="">
          <Text12 light={TextColors.g400} dark={TextColors.g200} className="font-extralight">{label}</Text12>
        </label>
        <textarea
          name=""
          cols={cols || 1}
          id=""
          className="bg-transparent text-[16px] w-full placeholder:text-[16px] placeholder:font-extralight outline-none font-light"
          placeholder={placeholder}
          style={{color: theme == "dark"? "white": "black"}}
          value={value}
          onChange={(e)=>{
            let v = e.target.value
            onChange && onChange(v);
          }}
        ></textarea>
      </div>
    </div>
  );
}
