"use client";

export default function ModalBackground({toggle, visible, children}:{toggle?:(b: boolean)=> any, visible?: boolean, children: any}){
    return (
        <div className="h-screen w-screen fixed z-[60] top-0 left-0" style={{background: "rgba(0,0,0,0.3)"}} onClick={()=>{
            toggle?.(visible as boolean);
        }}>
            {children}
        </div>
    )
}