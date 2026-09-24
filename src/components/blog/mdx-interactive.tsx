"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  ChevronRight,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  File as FileIcon,
  FileCode2,
  FileText,
  FileJson,
  ArrowUpRight,
  Check,
  Copy,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  BookOpen,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeTabsContext } from "./code-context";

/* -------------------------------------------------------------------------- */
/*                                   STEPS                                    */
/* -------------------------------------------------------------------------- */

interface StepsProps {
  children: React.ReactNode;
  className?: string;
}

interface StepProps {
  title: string;
  step?: number | string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
}

export function Steps({ children, className }: StepsProps) {
  let stepIndex = 1;
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement<StepProps>(child)) {
      const stepNumber = child.props.step ?? stepIndex++;
      return React.cloneElement(child, { step: stepNumber });
    }
    return child;
  });

  return (
    <div className={cn("not-prose my-10 ml-4 relative", className)}>
      {/* Continuous Timeline Gradient Line */}
      <div
        className="pointer-events-none absolute left-[15px] top-4 bottom-4 w-px bg-gradient-to-b from-neutral-800 via-neutral-200 to-neutral-100 dark:via-neutral-800 dark:to-transparent"
        aria-hidden="true"
      />
      <div className="flex flex-col gap-2">{enhancedChildren}</div>
    </div>
  );
}

export function Step({ title, step = 1, badge, children, className }: StepProps) {
  return (
    <div className={cn("group relative pl-10 pb-8 last:pb-2 transition-all", className)}>
      {/* Step Marker with Dub Pill & Hover Glow */}
      <div
        className="absolute left-0 top-0.5 z-10 flex size-[31px] items-center justify-center rounded-full border border-neutral-300/80 bg-white font-mono text-xs font-semibold text-neutral-900 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] ring-4 ring-neutral-50 transition-all duration-300 group-hover:scale-110 group-hover:border-neutral-900 group-hover:bg-neutral-900 group-hover:text-white group-hover:ring-neutral-200/70 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:ring-neutral-950"
        aria-hidden="true"
      >
        {step}
      </div>

      {/* Step Header */}
      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        <h3 className="font-display text-lg font-semibold tracking-tight text-neutral-900 transition-colors group-hover:text-black dark:text-neutral-100">
          {title}
        </h3>
        {badge && (
          <span className="inline-flex items-center rounded-full border border-neutral-200/90 bg-neutral-50 px-2.5 py-0.5 text-[11px] font-medium tracking-tight text-neutral-600 shadow-2xs">
            {badge}
          </span>
        )}
      </div>

      {/* Step Body */}
      <div className="mt-2.5 text-[0.95rem] leading-relaxed text-neutral-600 dark:text-neutral-300 [&>p]:my-2 [&>pre]:my-3.5">
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 CODE TABS                                  */
/* -------------------------------------------------------------------------- */

interface CodeTabsProps {
  items?: string[];
  children: React.ReactNode;
  defaultValue?: string;
  className?: string;
}

interface TabProps {
  label: string;
  children: React.ReactNode;
}

export function Tab({ children }: TabProps) {
  return <div>{children}</div>;
}

export function CodeTabs({ items, children, defaultValue, className }: CodeTabsProps) {
  const childArray = React.Children.toArray(children).filter(React.isValidElement);
  
  const tabLabels = items || childArray.map((child: any) => {
    return child.props?.label || child.props?.tab || child.props?.filename || "Code";
  });

  const [activeTab, setActiveTab] = useState<string>(
    defaultValue || tabLabels[0] || ""
  );
  const [copied, setCopied] = useState(false);
  const layoutId = useId();

  // Extract raw text for copy button
  const extractCodeText = (node: React.ReactNode): string => {
    if (!node) return "";
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(extractCodeText).join("");
    if (React.isValidElement(node) && node.props) {
      return extractCodeText((node.props as { children?: React.ReactNode }).children);
    }
    return "";
  };

  const activeIndex = tabLabels.indexOf(activeTab);
  let activeContent: React.ReactNode = null;

  if (activeIndex >= 0 && childArray[activeIndex]) {
    activeContent = (childArray[activeIndex] as any).props?.children || childArray[activeIndex];
  } else if (childArray[0]) {
    activeContent = (childArray[0] as any).props?.children || childArray[0];
  }

  const handleCopy = async () => {
    const text = extractCodeText(activeContent);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <CodeTabsContext.Provider value={true}>
      <div
        className={cn(
          "not-prose my-6 overflow-hidden rounded-2xl border border-neutral-800 bg-[#0d0d0e] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-all",
          className
        )}
      >
        {/* Dub Style Mac Terminal Header Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 bg-neutral-900/70 px-4 py-2.5 backdrop-blur-md">
          {/* Left: Window Dots & Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
            <div className="hidden sm:flex items-center gap-1.5 pr-2 border-r border-neutral-800" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-neutral-700/80" />
              <span className="size-2.5 rounded-full bg-neutral-700/80" />
              <span className="size-2.5 rounded-full bg-neutral-700/80" />
            </div>

            <div className="flex items-center space-x-1">
              {tabLabels.map((tab) => {
                const isActive = tab === activeTab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "relative z-10 rounded-lg px-3 py-1 font-mono text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400",
                      isActive
                        ? "text-white"
                        : "text-neutral-400 hover:text-neutral-200"
                    )}
                  >
                    {/* Smooth Motion Sliding Pill (Dub Style) */}
                    {isActive && (
                      <motion.div
                        layoutId={`active-tab-${layoutId}`}
                        className="absolute inset-0 -z-10 rounded-md bg-neutral-800/90 shadow-sm border border-neutral-700/60"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Copy Button with Micro-Animation */}
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Code copied to clipboard" : "Copy code to clipboard"}
            className="flex items-center gap-1.5 rounded-md border border-neutral-800 bg-neutral-850 px-2.5 py-1 text-xs font-medium text-neutral-300 transition-all hover:border-neutral-700 hover:bg-neutral-800 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="copied"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-1 text-emerald-400"
                >
                  <Check className="size-3.5" />
                  <span>Copied</span>
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-1"
                >
                  <Copy className="size-3.5 text-neutral-400" />
                  <span>Copy</span>
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Tabs Code Area with Smooth Fade Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="p-4 sm:p-5 font-mono text-sm leading-relaxed text-neutral-200 [&_pre]:!my-0 [&_pre]:!border-0 [&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!text-inherit"
          >
            {activeContent}
          </motion.div>
        </AnimatePresence>
      </div>
    </CodeTabsContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 FILE TREE                                  */
/* -------------------------------------------------------------------------- */

interface FileTreeProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  badge?: string;
}

interface FolderProps {
  name: string;
  defaultOpen?: boolean;
  badge?: string;
  comment?: string;
  children: React.ReactNode;
}

interface FileProps {
  name: string;
  comment?: string;
  badge?: string;
  active?: boolean;
}

export function FileTree({ children, className, title, badge = "EXPLORER" }: FileTreeProps) {
  return (
    <div
      className={cn(
        "not-prose my-6 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.04)] dark:border-neutral-800 dark:bg-neutral-900 transition-all",
        className
      )}
    >
      {/* Dub Style File Tree Header Bar */}
      <div className="flex items-center justify-between border-b border-neutral-200/80 bg-neutral-50/80 px-4 py-2.5 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-850/60">
        <div className="flex items-center gap-3 font-mono">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span className="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span className="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-neutral-200 dark:border-neutral-800">
            <FolderOpenIcon className="size-3.5 text-amber-500" />
            <span className="font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              {title || "project-tree"}
            </span>
          </div>
        </div>

        <span className="rounded-md border border-neutral-200/80 bg-white px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-neutral-500 shadow-2xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
          {badge}
        </span>
      </div>

      <div className="p-3.5 sm:p-4 font-mono text-xs space-y-0.5 text-neutral-700 dark:text-neutral-300">
        {children}
      </div>
    </div>
  );
}

export function Folder({
  name,
  defaultOpen = true,
  badge,
  comment,
  children,
}: FolderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="select-none">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left font-medium text-neutral-800 transition-colors hover:bg-neutral-100/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-800/60 cursor-pointer"
      >
        <div className="flex items-center gap-2 min-w-0">
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="shrink-0"
          >
            <ChevronRight className="size-3.5 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300" />
          </motion.div>
          {isOpen ? (
            <FolderOpenIcon className="size-4 shrink-0 text-amber-500" />
          ) : (
            <FolderIcon className="size-4 shrink-0 text-amber-500/90" />
          )}
          <span className="truncate text-xs font-semibold">{name}</span>
          {badge && (
            <span className="inline-flex items-center rounded border border-neutral-200/80 bg-neutral-100/80 px-1.5 py-0.2 font-mono text-[9px] font-medium text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
              {badge}
            </span>
          )}
        </div>

        {comment && (
          <span className="text-[11px] font-sans italic text-neutral-400 dark:text-neutral-500 truncate shrink-0">
            {comment}
          </span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="ml-3.5 border-l border-neutral-200/80 pl-3 pt-1 space-y-0.5 dark:border-neutral-800">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getFileIcon(filename: string) {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".ts") || lower.endsWith(".tsx")) {
    return <FileCode2 className="size-3.5 text-sky-500" />;
  }
  if (lower.endsWith(".js") || lower.endsWith(".jsx")) {
    return <FileCode2 className="size-3.5 text-amber-500" />;
  }
  if (lower.endsWith(".json")) {
    return <FileJson className="size-3.5 text-emerald-500" />;
  }
  if (lower.endsWith(".sql") || lower.endsWith(".prisma")) {
    return <FileCode2 className="size-3.5 text-purple-500" />;
  }
  if (lower.endsWith(".md") || lower.endsWith(".mdx")) {
    return <FileText className="size-3.5 text-indigo-500" />;
  }
  if (lower.endsWith(".css") || lower.endsWith(".scss")) {
    return <FileCode2 className="size-3.5 text-pink-500" />;
  }
  if (lower.startsWith(".env")) {
    return <FileCode2 className="size-3.5 text-yellow-500" />;
  }
  if (lower.includes("docker") || lower.endsWith(".yml") || lower.endsWith(".yaml")) {
    return <FileCode2 className="size-3.5 text-blue-500" />;
  }
  return <FileIcon className="size-3.5 text-neutral-400" />;
}

export function File({ name, comment, badge, active }: FileProps) {
  return (
    <div
      className={cn(
        "group flex items-center justify-between gap-2 rounded-lg px-2 py-1 text-xs transition-colors select-none",
        active
          ? "bg-neutral-100/90 font-medium text-neutral-900 dark:bg-neutral-800/80 dark:text-neutral-100"
          : "text-neutral-600 hover:bg-neutral-100/70 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/50 dark:hover:text-neutral-200"
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="shrink-0">{getFileIcon(name)}</span>
        <span className="truncate">{name}</span>
        {active && (
          <span className="size-1.5 rounded-full bg-blue-500 shrink-0" />
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {badge && (
          <span className="rounded border border-neutral-200/80 bg-neutral-50 px-1.5 py-0.2 font-mono text-[9px] font-medium text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
            {badge}
          </span>
        )}
        {comment && (
          <span className="text-[11px] font-sans italic text-neutral-400 dark:text-neutral-500 truncate">
            {comment}
          </span>
        )}
      </div>
    </div>
  );
}

FileTree.Folder = Folder;
FileTree.File = File;

/* -------------------------------------------------------------------------- */
/*                            METRICS & STAT CARDS                            */
/* -------------------------------------------------------------------------- */

interface MetricsGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
}

export function MetricsGrid({ children, columns = 3 }: MetricsGridProps) {
  const colClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <div className={cn("not-prose my-8 grid gap-4", colClass)}>
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  description?: string;
}

export function StatCard({
  title,
  value,
  change,
  trend = "neutral",
  description,
}: StatCardProps) {
  const trendColor = {
    up: "text-emerald-700 bg-emerald-50 border-emerald-200/90 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-800",
    down: "text-rose-700 bg-rose-50 border-rose-200/90 dark:text-rose-400 dark:bg-rose-950/40 dark:border-rose-800",
    neutral: "text-neutral-700 bg-neutral-100 border-neutral-200 dark:text-neutral-300 dark:bg-neutral-800 dark:border-neutral-700",
  }[trend];

  const TrendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
  }[trend];

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04),0px_4px_16px_rgba(0,0,0,0.02)] transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900"
    >
      {/* Dub Subtle Top Radial Glow */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 size-36 rounded-full bg-gradient-to-br from-indigo-100/50 via-sky-100/30 to-transparent blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-indigo-900/20"
        aria-hidden="true"
      />

      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {title}
        </span>
        {change && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[11px] font-semibold tracking-tight shadow-2xs",
              trendColor
            )}
          >
            <TrendIcon className="size-3" />
            {change}
          </span>
        )}
      </div>

      <div className="mt-4 font-display text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl dark:text-neutral-100">
        {value}
      </div>

      {description && (
        <p className="mt-2 text-xs leading-normal text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      )}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 ACCORDION                                  */
/* -------------------------------------------------------------------------- */

import {
  Accordion as BaseAccordion,
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
  AccordionContent,
  AccordionPrimitive,
} from "@/components/ui/accordion";

export {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
  AccordionContent,
  AccordionPrimitive,
};

interface AccordionProps {
  title?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export function Accordion({
  title,
  defaultOpen = false,
  children,
  className,
  ...props
}: AccordionProps) {
  // If user provides title="..." (single item shortcut)
  if (title) {
    return (
      <div className="not-prose my-4">
        <BaseAccordion
          defaultValue={defaultOpen ? ["item-1"] : undefined}
          className={cn("w-full transition-all hover:border-neutral-300", className)}
          {...props}
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>{title}</AccordionTrigger>
            <AccordionPanel>{children}</AccordionPanel>
          </AccordionItem>
        </BaseAccordion>
      </div>
    );
  }

  // Compound Accordion (<Accordion><AccordionItem>...</AccordionItem></Accordion>)
  return (
    <div className="not-prose my-6">
      <BaseAccordion className={className} {...props}>
        {children}
      </BaseAccordion>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                           LINK LIST & LINK CARD                            */
/* -------------------------------------------------------------------------- */

const LinkListContext = React.createContext<boolean>(false);

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export interface LinkListProps {
  children: React.ReactNode;
  className?: string;
}

export function LinkList({ children, className }: LinkListProps) {
  return (
    <LinkListContext.Provider value={true}>
      <div
        className={cn(
          "not-prose my-6 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.04)] divide-y divide-neutral-200/80 dark:border-neutral-800 dark:bg-neutral-900 dark:divide-neutral-800",
          className
        )}
      >
        {children}
      </div>
    </LinkListContext.Provider>
  );
}

export const LinkGroup = LinkList;
export const ResourceList = LinkList;

export interface LinkCardProps {
  title: string;
  href: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function LinkCard({
  title,
  href,
  description,
  badge,
  icon,
  className,
}: LinkCardProps) {
  const isInsideList = React.useContext(LinkListContext);
  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  const hrefLower = href.toLowerCase();
  const badgeLower = badge?.toLowerCase() || "";
  const isGitHub =
    hrefLower.includes("github.com") ||
    badgeLower.includes("git") ||
    badgeLower.includes("open source");
  const isDocs =
    hrefLower.includes("docs") ||
    hrefLower.includes("documentation") ||
    badgeLower.includes("doc");

  const Content = (
    <div
      className={cn(
        "group flex items-center justify-between gap-4 transition-colors",
        isInsideList
          ? "px-5 py-4 hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40"
          : "rounded-2xl border border-neutral-200/90 bg-white p-4.5 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] hover:border-neutral-300 hover:bg-neutral-50/80 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800/40",
        className
      )}
    >
      {/* Left: Icon & Text content */}
      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
        <div className="mt-0.5 sm:mt-0 flex size-9 shrink-0 items-center justify-center rounded-xl border border-neutral-200/80 bg-neutral-50 text-neutral-600 transition-colors group-hover:border-neutral-300 group-hover:bg-white group-hover:text-neutral-950 dark:border-neutral-700/80 dark:bg-neutral-800 dark:text-neutral-300 dark:group-hover:border-neutral-600 dark:group-hover:bg-neutral-750 dark:group-hover:text-white">
          {icon ? (
            icon
          ) : isGitHub ? (
            <GithubIcon className="size-4" />
          ) : isDocs ? (
            <BookOpen className="size-4" />
          ) : (
            <Globe className="size-4" />
          )}
        </div>

        <div className="min-w-0 space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-display text-sm font-semibold tracking-tight text-neutral-900 transition-colors group-hover:text-black dark:text-neutral-100 dark:group-hover:text-white">
              {title}
            </h4>
            {badge && (
              <span className="inline-flex items-center rounded-full border border-neutral-200/80 bg-neutral-100/80 px-2 py-0.5 font-mono text-[10px] font-medium text-neutral-600 dark:border-neutral-700/80 dark:bg-neutral-800 dark:text-neutral-400">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 sm:line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Right: Circular Arrow Action */}
      <div className="shrink-0 flex items-center">
        <div className="flex size-7 items-center justify-center rounded-full border border-neutral-200/80 bg-neutral-50/80 text-neutral-400 shadow-2xs transition-all duration-200 group-hover:border-neutral-400 group-hover:bg-neutral-900 group-hover:text-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:group-hover:border-neutral-600 dark:group-hover:bg-white dark:group-hover:text-neutral-950">
          <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </div>
  );

  const containerClasses = isInsideList
    ? "block w-full no-underline"
    : "not-prose my-4 block w-full no-underline";

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={containerClasses}
      >
        {Content}
      </a>
    );
  }

  return (
    <Link href={href} className={containerClasses}>
      {Content}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    BADGE                                   */
/* -------------------------------------------------------------------------- */

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info" | "purple";
  dot?: boolean;
}

export function Badge({ children, variant = "default", dot = true }: BadgeProps) {
  const styles = {
    default: "border-neutral-200/90 bg-neutral-100 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/80 dark:bg-emerald-950/50 dark:text-emerald-300",
    warning: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/80 dark:bg-amber-950/50 dark:text-amber-300",
    error: "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800/80 dark:bg-rose-950/50 dark:text-rose-300",
    info: "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-800/80 dark:bg-sky-950/50 dark:text-sky-300",
    purple: "border-purple-200 bg-purple-50 text-purple-800 dark:border-purple-800/80 dark:bg-purple-950/50 dark:text-purple-300",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs font-medium tracking-tight shadow-2xs",
        styles
      )}
    >
      {dot && <span className="mr-1.5 size-1.5 rounded-full bg-current opacity-80" aria-hidden="true" />}
      {children}
    </span>
  );
}
