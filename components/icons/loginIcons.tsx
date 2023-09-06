"use client";
export const AtIcon = ({ stroke, className = "" }: { stroke?: string, className?: string }) => {
  return (
    <div className={className}>
      <svg
        width="14"
        height="18"
        viewBox="0 0 14 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.25 4C10.25 5.79493 8.79493 7.25 7 7.25C5.20507 7.25 3.75 5.79493 3.75 4C3.75 2.20507 5.20507 0.75 7 0.75C8.79493 0.75 10.25 2.20507 10.25 4Z"
          stroke={stroke || `#121212`}
          stroke-width="1.5"
          stroke-linejoin="round"
        />
        <path
          d="M0.75 15.625C0.75 12.9326 2.93261 10.75 5.625 10.75H8.375C11.0674 10.75 13.25 12.9326 13.25 15.625C13.25 16.5225 12.5225 17.25 11.625 17.25H2.375C1.47754 17.25 0.75 16.5225 0.75 15.625Z"
          stroke={stroke || `#121212`}
          stroke-width="1.5"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
};
