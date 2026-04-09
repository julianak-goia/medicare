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
  value?: string[];
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
    const containerRef = React.useRef<HTMLDivElement>(null);
    const selectedValues = value ?? [];

    React.useEffect(() => {
      const handleOutsideClick = (event: MouseEvent) => {
        if (!containerRef.current) {
          return;
        }

        const target = event.target as Node;
        if (!containerRef.current.contains(target)) {
          setOpen(false);
        }
      };

      document.addEventListener("mousedown", handleOutsideClick);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }, []);

    const setRefs = (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (!ref) {
        return;
      }

      if (typeof ref === "function") {
        ref(node);
      } else {
        ref.current = node;
      }
    };

    const handleSelect = (optionValue: string) => {
      if (selectedValues.includes(optionValue)) {
        onChange(selectedValues.filter((item) => item !== optionValue));
      } else {
        onChange([...selectedValues, optionValue]);
      }
    };

    const handleRemove = (optionValue: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(selectedValues.filter((item) => item !== optionValue));
    };

    const selectedOptions = options.filter((opt) =>
      selectedValues.includes(opt.value),
    );
    const availableOptions = options.filter(
      (opt) => !selectedValues.includes(opt.value),
    );

    return (
      <div ref={setRefs} className={cn("relative w-full", className)}>
        <div
          onClick={() => setOpen(!open)}
          className={cn(
            "border-input bg-background hover:bg-accent/50 flex min-h-10 cursor-pointer flex-wrap items-center gap-2 rounded-md border px-3 py-2 transition-colors",
            open && "ring-ring ring-1",
          )}
        >
          {selectedValues.length === 0 ? (
            <span className="text-muted-foreground text-sm">{placeholder}</span>
          ) : (
            selectedOptions.map((option) => (
              <div key={option.value} className="flex items-center">
                <Badge variant="secondary">{option.label}</Badge>
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={(e) => handleRemove(option.value, e)}
                />
              </div>
            ))
          )}
        </div>

        {open && (
          <div className="border-input bg-background absolute top-full right-0 left-0 z-50 mt-1 rounded-md border shadow-md">
            <div className="max-h-48 overflow-y-auto p-2">
              {availableOptions.length === 0 ? (
                <p className="text-muted-foreground p-2 text-sm">
                  Nenhuma opção disponível.
                </p>
              ) : (
                <div className="space-y-1">
                  {availableOptions.map((option) => (
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
