import { cn } from "../../lib/utils";

interface AlertProps {
  className?: string;
  [key: string]: any;
}

export function Alert({ className, ...props }: AlertProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-yellow-300 bg-yellow-50 p-3 text-yellow-800",
        className
      )}
      {...props}
    />
  );
}

export function AlertDescription({ className, ...props }: AlertProps) {
  return <div className={cn("text-sm", className)} {...props} />;
}
