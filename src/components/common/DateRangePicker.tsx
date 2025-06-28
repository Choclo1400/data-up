import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

interface DateRangePickerProps {
  from?: Date;
  to?: Date;
  onDateChange: (from: Date | undefined, to: Date | undefined) => void;
  className?: string;
  label?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  from,
  to,
  onDateChange,
  className,
  label = "Rango de fechas"
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {from ? (
              to ? (
                <>
                  {format(from, "dd/MM/yyyy")} - {format(to, "dd/MM/yyyy")}
                </>
              ) : (
                format(from, "dd/MM/yyyy")
              )
            ) : (
              <span>Seleccionar fechas</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={from}
            selected={{ from, to }}
            onSelect={(range) => {
              onDateChange(range?.from, range?.to);
              if (range?.from && range?.to) {
                setIsOpen(false);
              }
            }}
            numberOfMonths={2}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangePicker;