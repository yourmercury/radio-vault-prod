"use client";

export default function ContentContainer({ children }: { children: any }) {
  return (
    <div className="relative h-[calc(100vh-70px)] overflow-y-scroll pb-20">
      <div className="">{children}</div>
    </div>
  );
}
