import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement & HTMLTextAreaElement,
  React.ComponentProps<"input"> & React.ComponentProps<"textarea"> & { type?: string }
>(({ className, type = "text", ...props }, ref) => {
  if (type === "textarea") {
    return (
      <textarea
        ref={ref as React.Ref<HTMLTextAreaElement>}
        className={cn(
          "flex w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        {...(props as React.ComponentProps<"textarea">)}
      />
    );
  }

  return (
    <input
      ref={ref as React.Ref<HTMLInputElement>}
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...(props as React.ComponentProps<"input">)}
    />
  );
});

Input.displayName = "Input";

export { Input };
