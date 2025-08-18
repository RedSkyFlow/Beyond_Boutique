
'use client';

import * as React from 'react';
import { X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from './ui/button';
import type { LucideIcon } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

interface MultiSelectFilterProps {
  id?: string;
  placeholder: string;
  icon?: LucideIcon;
  options: {
    label: string;
    value: string;
  }[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  className?: string;
}

export function MultiSelectFilter({
  id,
  placeholder,
  icon: Icon,
  options,
  selectedValues,
  onChange,
  className,
}: MultiSelectFilterProps) {
  const [open, setOpen] = React.useState(false);
  const allValues = options.map(o => o.value);

  const handleSelect = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newSelectedValues);
  };

  const handleSelectOnly = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([value]);
  }
  
  const handleToggleAll = () => {
    if (selectedValues.length === allValues.length) {
      onChange([]); // Clear selection
    } else {
      onChange(allValues); // Select all
    }
  }


  return (
    <div id={id} className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-full justify-start font-normal bg-background"
          >
            <div className="flex items-center gap-2 truncate">
              {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
              <div className="flex-1 text-left">
                {selectedValues.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {selectedValues.length > 2 ? (
                      <Badge
                        variant="secondary"
                        className="rounded-sm px-1 font-normal"
                      >
                        {selectedValues.length} selected
                      </Badge>
                    ) : (
                      options
                        .filter((option) => selectedValues.includes(option.value))
                        .map((option) => (
                          <Badge
                            variant="secondary"
                            key={option.value}
                            className="rounded-sm px-1 font-normal"
                          >
                            {option.label}
                          </Badge>
                        ))
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground">{placeholder}</span>
                )}
              </div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-0" align="start">
          <div className="p-2">
             <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start h-8 text-xs"
                onClick={handleToggleAll}
            >
                {selectedValues.length === allValues.length ? 'Clear Selection' : 'Select All'}
             </Button>
          </div>
          <Separator />
          <ScrollArea className="max-h-60">
            <div className="p-1">
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className="relative group flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <Check className={cn('h-4 w-4')} />
                    </div>
                    <span className="flex-1">{option.label}</span>
                    <Button 
                        variant="ghost" 
                        size="sm"
                        className="absolute right-1 h-6 px-2 text-muted-foreground opacity-0 group-hover:opacity-100"
                        onClick={(e) => handleSelectOnly(option.value, e)}
                    >
                        only
                    </Button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}
