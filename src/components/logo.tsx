import { type SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="120"
      height="30"
      {...props}
    >
      <style>
        {
          ".logo-text { font-family: 'Inter', sans-serif; font-size: 32px; font-weight: 700; } .pn-text { fill: hsl(var(--primary)); }"
        }
      </style>
      <text x="0" y="35" className="logo-text fill-foreground">
        Meeting<tspan className="pn-text">PN</tspan>
      </text>
    </svg>
  );
}
