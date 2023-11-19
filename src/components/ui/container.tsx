import * as React from "react";

import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

const Container = React.forwardRef<HTMLInputElement, ContainerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn("container mx-auto my-10", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Container.displayName = "Container";

export { Container };
