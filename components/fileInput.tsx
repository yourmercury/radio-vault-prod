import { useContext } from "react";
import { AtIcon } from "./icons/loginIcons";
import { LightMode, TextColors } from "./styleGuide";
import { LowEmph } from "./texts/textEmphasis";
import { Text12, Text16 } from "./texts/textSize";
import { ThemeContext } from "@/context/ThemeContext";

export default function FileInputComp({
  icon,
  label,
  placeholder,
  className,
  value,
  theme,
  onChange,
  accept,
  id,
  hasError,
  required,
}: {
  icon?: string;
  label: any;
  placeholder: string;
  className?: string;
  theme?: string;
  value?: string;
  onChange?: (value: any) => any;
  accept?: string;
  id: string;
  hasError?: boolean;
  required?: boolean;
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
      <label className="flex flex-col relative w-full" htmlFor={id}>
        <label htmlFor={id}>
          <Text12
            light={TextColors.g400}
            dark={TextColors.g200}
            className="font-extralight"
          >
            {label}
          </Text12>
        </label>
        <input
          type="file"
          accept={accept || "*"}
          name=""
          id={id}
          className="hidden"
          placeholder={placeholder}
          // style={{ color: theme == "dark" ? "white" : "black" }}
          
          onChange={(e) => {
            let file = e.target.files && e.target.files[0];
            if (file) {
              if(accept && !file.type.startsWith(accept?.substring(0, accept?.length-2))){
                e.target.value = ""
              }
              console.log(file);
              onChange && onChange(file);
            }
          }}
        />

        <div className="break-words">
          {value ? (
            <Text16 dark="white" light="black" className="break-words">
              {value}
            </Text16>
          ) : (
            <Text16
              dark="grey"
              light="grey"
              className="w-full font-extralight text-[grey] break-words"
            >
              {placeholder}
            </Text16>
          )}
        </div>
      </label>
    </div>
  );
}
