"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  );
}

function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "relative inline-flex h-10 w-fit items-center rounded-xl bg-muted p-1 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative z-10 inline-flex h-8 flex-1 items-center justify-center rounded-lg px-3 text-sm font-medium whitespace-nowrap transition-colors",
        "text-muted-foreground data-[active]:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function TabsIndicator({ className, ...props }: TabsPrimitive.Indicator.Props) {
  return (
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      className={cn(
        "absolute top-1 bottom-1 rounded-lg bg-background shadow-sm transition-[left,width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        className,
      )}
      {...props}
    />
  );
}

type AnimatedTabsPanelProps = Omit<TabsPrimitive.Panel.Props, "value"> & {
  panelValue: string | number;
  activeValue: string | number | undefined;
};

/**
 * Tab panel with Framer Motion crossfade when switching tabs.
 */
function AnimatedTabsPanel({
  panelValue,
  activeValue,
  className,
  children,
  ...props
}: AnimatedTabsPanelProps) {
  const isActive = activeValue === panelValue;

  return (
    <TabsPrimitive.Panel
      value={panelValue}
      keepMounted
      className={cn("relative min-h-[8rem] outline-none", className)}
      {...props}
    >
      <AnimatePresence mode="wait">
        {isActive ? (
          <motion.div
            key={String(panelValue)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </TabsPrimitive.Panel>
  );
}

export { AnimatedTabsPanel, Tabs, TabsIndicator, TabsList, TabsTrigger };
