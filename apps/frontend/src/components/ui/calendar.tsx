'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  onYearChange?: (year: number) => void;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  onYearChange,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());

  // Handle year change
  const handleYearChange = React.useCallback(
    (year: number) => {
      const newDate = new Date(currentMonth);
      newDate.setFullYear(year);
      setCurrentMonth(newDate);
      onYearChange?.(year);
    },
    [currentMonth, onYearChange]
  );

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      month={currentMonth}
      onMonthChange={setCurrentMonth}
      classNames={{
        month: 'space-y-4',
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-y-0 relative',
        month_caption: 'flex justify-center pt-1 relative items-center',
        month_grid: 'w-full border-collapse space-y-1',
        caption: 'flex justify-center pt-1 relative items-center gap-1',
        caption_label: 'text-sm font-medium flex items-center gap-2',
        nav: 'flex items-center justify-between absolute inset-x-0',
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-10'
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-10'
        ),
        weeks: 'w-full border-collapse space-y-',
        weekdays: 'flex',
        weekday: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        week: 'flex w-full mt-2',
        day_button:
          'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100'
        ),
        range_end: 'day-range-end',
        selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        today: 'bg-accent text-accent-foreground',
        outside:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        disabled: 'text-muted-foreground opacity-50',
        range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ ...props }) =>
          props.orientation === 'left' ? (
            <ChevronLeft {...props} className="h-4 w-4" />
          ) : (
            <ChevronRight {...props} className="h-4 w-4" />
          ),
      }}
      modifiersClassNames={{
        selected: 'selected',
        today: 'today',
      }}
      footer={
        <div className="flex items-center justify-center w-full mt-2">
          <YearSelect date={currentMonth} onChange={handleYearChange} />
        </div>
      }
      {...props}
    />
  );
}

interface YearSelectProps {
  date: Date;
  onChange: (year: number) => void;
}

function YearSelect({ date, onChange }: YearSelectProps) {
  // Create an array of years from 1920 to 2050
  const years = Array.from({ length: 2051 - 1920 }, (_, i) => 1920 + i);

  return (
    <Select
      value={date.getFullYear().toString()}
      onValueChange={(value: string) => onChange(parseInt(value, 10))}
    >
      <SelectTrigger className="h-7 text-xs w-full">
        <SelectValue placeholder={date.getFullYear().toString()} />
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {years.map((year: number) => (
          <SelectItem key={year} value={year.toString()} className="text-sm">
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

Calendar.displayName = 'Calendar';

export { Calendar };
