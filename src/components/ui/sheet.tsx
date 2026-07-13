"use client";

import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type SheetSide = "right" | "left";

type SheetProps = SheetPrimitive.Root.Props;

/**
 * Edge panel built on Dialog (Base UI). Slides from left/right — no swipe gestures.
 */
function Sheet({ ...props }: SheetProps) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetContent({
  side = "right",
  className,
  children,
  ...props
}: SheetPrimitive.Popup.Props & { side?: SheetSide }) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Backdrop
        className={cn(
          "fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px]",
          "transition-opacity duration-300 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
        )}
      />
      <SheetPrimitive.Viewport
        className={cn(
          "fixed inset-0 z-50 flex",
          side === "right" ? "justify-end" : "justify-start",
        )}
      >
        <SheetPrimitive.Popup
          data-slot="sheet-content"
          className={cn(
            "relative flex h-full w-full max-w-sm flex-col border-border bg-popover p-6 text-popover-foreground shadow-xl outline-none",
            side === "right" ? "border-l" : "border-r",
            "transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)]",
            side === "right"
              ? "data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full"
              : "data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full",
            className,
          )}
          {...props}
        >
          {children}
          <SheetClose
            className="absolute top-4 right-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <XIcon className="size-4" />
          </SheetClose>
        </SheetPrimitive.Popup>
      </SheetPrimitive.Viewport>
    </SheetPrimitive.Portal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-2 pr-8", className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
};
