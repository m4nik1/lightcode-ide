import type { SVGProps } from "react";

export default function SendArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 18.5V6.5" />
      <path d="M6.75 11.25 12 6l5.25 5.25" />
    </svg>
  );
}
