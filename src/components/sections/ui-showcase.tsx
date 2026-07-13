"use client";

import { useState } from "react";

import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AnimatedTabsPanel,
  Tabs,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  defaultUiShowcaseCopy,
  type UiShowcaseCopy,
} from "@/lib/i18n/section-copy";

type UiShowcaseProps = {
  copy?: UiShowcaseCopy;
};

/**
 * Demo block: dialog, sheet, animated tabs — wired to the motion stack.
 */
export function UiShowcase({ copy = defaultUiShowcaseCopy }: UiShowcaseProps) {
  const [tab, setTab] = useState(copy.tabs[0]?.id ?? "motion");

  return (
    <FadeIn className="mx-auto w-full max-w-3xl">
      <div className="rounded-3xl border border-border bg-card p-8">
        <h2 className="text-2xl font-semibold">{copy.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{copy.subtitle}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>
              {copy.dialog.trigger}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{copy.dialog.title}</DialogTitle>
                <DialogDescription>{copy.dialog.description}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogTrigger render={<Button variant="secondary" />}>
                  {copy.dialog.close}
                </DialogTrigger>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
              {copy.sheet.trigger}
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>{copy.sheet.title}</SheetTitle>
                <SheetDescription>{copy.sheet.description}</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>

        <Tabs
          value={tab}
          onValueChange={setTab}
          className="mt-8"
        >
          <TabsList>
            {copy.tabs.map((item) => (
              <TabsTrigger key={item.id} value={item.id}>
                {item.label}
              </TabsTrigger>
            ))}
            <TabsIndicator />
          </TabsList>

          {copy.tabs.map((item) => (
            <AnimatedTabsPanel key={item.id} panelValue={item.id} activeValue={tab}>
              <h3 className="font-medium">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </AnimatedTabsPanel>
          ))}
        </Tabs>
      </div>
    </FadeIn>
  );
}
