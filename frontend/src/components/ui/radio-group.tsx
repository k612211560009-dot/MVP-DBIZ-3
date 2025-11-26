import React, { createContext, useContext } from "react";

interface RadioGroupContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue>({});

interface RadioGroupProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function RadioGroup({
  children,
  value,
  onValueChange,
  className,
}: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div className={className || "flex flex-col gap-2"}>{children}</div>
    </RadioGroupContext.Provider>
  );
}

interface RadioGroupItemProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value"> {
  id: string;
  value: string;
}

export function RadioGroupItem({ id, value, ...props }: RadioGroupItemProps) {
  const context = useContext(RadioGroupContext);

  const handleChange = () => {
    console.log("RadioGroupItem clicked:", value);
    context.onValueChange?.(value);
  };

  return (
    <input
      id={id}
      type="radio"
      value={value}
      checked={context.value === value}
      onChange={handleChange}
      className="w-4 h-4 text-pink-600 focus:ring-pink-500"
      {...props}
    />
  );
}
