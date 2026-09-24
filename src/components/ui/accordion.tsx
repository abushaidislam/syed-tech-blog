"use client";

import { Accordion as AccordionPrimitive } from "@base-ui-components/react/accordion";
import { ChevronDownIcon } from "lucide-react";
import type React from "react";
import { cn } from "@/lib/utils";

export function Accordion(
  props: AccordionPrimitive.Root.Props,
): React.ReactElement {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.04)] dark:border-neutral-800 dark:bg-neutral-900",
        props.className
      )}
      {...props}
    />
  );
}

export function AccordionItem({
  className,
  ...props
}: AccordionPrimitive.Item.Props): React.ReactElement {
  return (
    <AccordionPrimitive.Item
      className={cn(
        "border-b border-neutral-200/80 last:border-b-0 dark:border-neutral-800",
        className
      )}
      data-slot="accordion-item"
      {...props}
    />
  );
}

export function AccordionTrigger({
  className,
  children,
  icon,
  ...props
}: AccordionPrimitive.Trigger.Props & {
  icon?: React.ReactNode;
}) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex flex-1 cursor-pointer items-center justify-between gap-4 px-6 py-4.5 text-left font-display text-[1rem] font-medium tracking-tight text-neutral-900 outline-none transition-all hover:bg-neutral-50/80 focus-visible:bg-neutral-50/80 focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-100 dark:hover:bg-neutral-800/40 [&[data-open]>div>svg]:rotate-180 [&[data-panel-open]>div>svg]:rotate-180",
          className
        )}
        data-slot="accordion-trigger"
        {...props}
      >
        <span>{children}</span>
        {icon || (
          <div className="shrink-0 rounded-full border border-neutral-200/90 bg-neutral-50 p-1 text-neutral-500 shadow-2xs transition-colors group-hover:border-neutral-300 group-hover:text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
            <ChevronDownIcon className="pointer-events-none size-4 transition-transform duration-200 ease-in-out" />
          </div>
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionPanel({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props): React.ReactElement {
  return (
    <AccordionPrimitive.Panel
      className="h-(--accordion-panel-height) overflow-hidden text-[0.95rem] text-neutral-600 transition-[height] duration-200 ease-in-out data-ending-style:h-0 data-starting-style:h-0 dark:text-neutral-300"
      data-slot="accordion-panel"
      {...props}
    >
      <div className={cn("px-6 pt-0 pb-5 leading-relaxed [&>p]:my-2", className)}>
        {children}
      </div>
    </AccordionPrimitive.Panel>
  );
}

export { AccordionPanel as AccordionContent, AccordionPrimitive };

export default Accordion;
