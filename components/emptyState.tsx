"use client";

import { useContext } from "react";
import Icons from "./icons/icons";
import ModalBackground from "./modalBackground";
import { Text14, Text16 } from "./texts/textSize";
import { ThemeContext } from "@/context/ThemeContext";
import { TextColors } from "./styleGuide";

export default function EmptyState({children, title}:{children?: any, title?: string}) {
  const { mode } = useContext(ThemeContext);
  return (
    <div className="flex flex-col items-center w-[300px] p-big rounded-xl">
      <Icons icon="empty_state" className="mb-10" />

      <div className="flex flex-col items-center">
        <Text16 className="font-[600]">{title}</Text16>
        <Text14
          light={TextColors.g600}
          dark={TextColors.g200}
          className="text-center"
        >
          {children}
        </Text14>
      </div>
    </div>
  );
}

// export default function EmptyState(){
//     const {mode} = useContext(ThemeContext);
//     return (
//         <ModalBackground>
//             <div className="h-screen w-100 flex justify-center items-center">
//                 <div className="flex flex-col items-center w-[300px] p-big rounded-xl" style={{background: mode.background}}>
//                     <Icons icon="empty_state" className="mb-10"/>

//                     <div className="flex flex-col items-center">
//                         <Text16 className="font-[600]">No activity</Text16>
//                         <Text14 light={TextColors.g600} dark={TextColors.g200} className="text-center">
//                             You have not completed any activity with this account, upload a file to start
//                         </Text14>
//                     </div>
//                 </div>
//             </div>
//         </ModalBackground>
//     )
// }
