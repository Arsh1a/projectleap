import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Icons } from "./icons";

export interface SeperatorProps
  extends React.ButtonHTMLAttributes<HTMLDivElement> {
  text: string;
}

const Seperator = React.forwardRef<HTMLDivElement, SeperatorProps>(
  ({ text, ...props }, ref) => {
    return (
      <div
        className={cn("relative py-4", props.className)}
        ref={ref}
        {...props}
      >
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-b border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-sm">{text}</span>
        </div>
      </div>
    );
  }
);
Seperator.displayName = "Seperator";

export { Seperator };
