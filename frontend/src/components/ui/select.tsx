import React, { useState, createContext, useContext } from "react";
import { cn } from "../../lib/utils";

interface SelectContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextValue | undefined>(undefined);

export function Select({
  children,
  value,
  onValueChange,
}: {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
}) {
  const context = useContext(SelectContext);

  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm",
        className
      )}
      onClick={() => context?.setOpen(!context.open)}
      {...props}
    >
      {children}
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const context = useContext(SelectContext);
  return <span className="text-gray-500">{context?.value || placeholder}</span>;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  const context = useContext(SelectContext);

  if (!context?.open) return null;

  return (
    <div className="absolute z-50 mt-1 w-full rounded-md border bg-white p-1 shadow">
      {children}
    </div>
  );
}

export function SelectItem({
  children,
  value,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const context = useContext(SelectContext);

  return (
    <div
      className="cursor-pointer rounded px-2 py-1 text-sm hover:bg-gray-100"
      onClick={() => {
        context?.onValueChange?.(value);
        context?.setOpen(false);
      }}
      {...props}
    >
      {children}
    </div>
  );
}
