import * as React from "react";

import { cn } from "@/lib/utils";

export interface LogoProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const Logo = React.forwardRef<HTMLHeadingElement, LogoProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h1 className={cn("font-bold text-xl", className)} ref={ref} {...props}>
        Project Leap
      </h1>
    );
  }
);
Logo.displayName = "Logo";

export { Logo };
