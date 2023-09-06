import { useContext } from "react";
import { AtIcon } from "./icons/loginIcons";
import { LightMode, TextColors } from "./styleGuide";
import { LowEmph } from "./texts/textEmphasis";
import { Text12 } from "./texts/textSize";
import { ThemeContext } from "@/context/ThemeContext";

export default function SelectComp({
  icon,
  label,
  className,
  value,
  theme,
  onChange,
  options,
  values,
  hasError,
  required,
  noNull
}: {
  icon?: string;
  label: any;
  className?: string;
  theme?: string;
  value?: string;
  options?: any[],
  values?: any[]
  hasError?: boolean
  required?: boolean
  noNull?: boolean
  onChange?: (value: any) => any;
}) {
  let { mode } = useContext(ThemeContext);
  return (
    <div
      className={`rounded-std border-[1.7px] flex items-center relative py-sm px-mid ${className}`}
      style={{
        borderColor: required && hasError? "red": mode.border,
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
        <label htmlFor="">
          <Text12
            light={TextColors.g400}
            dark={TextColors.g200}
            className="font-extralight"
          >
            {label}
          </Text12>
        </label>
        {/* <input
          type="text"
          name=""
          id=""
          className="bg-transparent text-[16px] w-full placeholder:text-[16px] placeholder:font-extralight outline-none font-light"
          placeholder={placeholder}
            style={{color: theme == "dark"? "white": "black"}}
          value={value}
          onChange={(e)=>{
            let v = e.target.value
            onChange && onChange(v);
          }}
        /> */}

        <select
          name=""
          id=""
          className="bg-transparent text-[16px] w-full placeholder:text-[16px] placeholder:font-extralight outline-none font-light pb-1"
          style={{ 
            // color: theme == "dark" ? "white" : "black"
            filter: mode.theme == "dark" ?"invert(1)": ""
         }}
         value={value}
          onChange={(e)=>{
            let v = e.target.value
            onChange && onChange(v);
          }}
        >
          {!noNull && <option value={undefined} className={``}>
            none
          </option>}
          {options && (
            options.map((option, index)=>(
                <option className="" value={(values||[])[index]} key={index}>
                    {option}
                </option>
            ))
          )}
        </select>
      </div>
    </div>
  );
}
