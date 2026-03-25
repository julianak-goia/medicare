import { X } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "Selecione opções...",
      className,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);

    const handleSelect = (optionValue: string) => {
      if (value.includes(optionValue)) {
        onChange(value.filter((item) => item !== optionValue));
      } else {
        onChange([...value, optionValue]);
      }
    };

    const handleRemove = (optionValue: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(value.filter((item) => item !== optionValue));
    };

    const selectedLabels = options
      .filter((opt) => value.includes(opt.value))
      .map((opt) => opt.label);

    return (
      <div ref={ref} className={cn("relative w-full", className)}>
        <div
          onClick={() => setOpen(!open)}
          className={cn(
            "border-input bg-background hover:bg-accent/50 flex min-h-10 cursor-pointer flex-wrap items-center gap-2 rounded-md border px-3 py-2 transition-colors",
            open && "ring-ring ring-1",
          )}
        >
          {value.length === 0 ? (
            <span className="text-muted-foreground text-sm">{placeholder}</span>
          ) : (
            selectedLabels.map((label, idx) => (
              <Badge key={`${label}-${idx}`} variant="secondary">
                {label}
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={(e) => {
                    handleRemove(
                      options.find((opt) => opt.label === label)?.value || "",
                      e,
                    );
                  }}
                />
              </Badge>
            ))
          )}
        </div>

        {open && (
          <div className="border-input bg-background absolute top-full right-0 left-0 z-50 mt-1 rounded-md border shadow-md">
            <div className="max-h-48 overflow-y-auto p-2">
              {options.length === 0 ? (
                <p className="text-muted-foreground p-2 text-sm">
                  Nenhuma opção disponível.
                </p>
              ) : (
                <div className="space-y-1">
                  {options.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className="hover:bg-accent cursor-pointer rounded p-2 text-sm transition-colors"
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

MultiSelect.displayName = "MultiSelect";
