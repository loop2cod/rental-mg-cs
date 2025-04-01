'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';

interface WheelPickerItem {
  value: string | number;
  label: string;
}

interface WheelPickerProps {
  hourItems: WheelPickerItem[];
  hourValue: string;
  onHourChange: (value: string) => void;
  minuteItems: WheelPickerItem[];
  minuteValue: string;
  onMinuteChange: (value: string) => void;
  ampmItems: WheelPickerItem[];
  ampmValue: string;
  onAmpmChange: (value: string) => void;
  onCancel: () => void;
  onSelect: () => void;
}

const WheelPickerComponent: React.FC<WheelPickerProps> = ({
  hourItems,
  hourValue,
  onHourChange,
  minuteItems,
  minuteValue,
  onMinuteChange,
  ampmItems,
  ampmValue,
  onAmpmChange,
  onCancel,
  onSelect,
}) => {
  const [initialValues] = useState({ hourValue, minuteValue, ampmValue });
  const hourRef = useRef<HTMLUListElement>(null);
  const minuteRef = useRef<HTMLUListElement>(null);
  const ampmRef = useRef<HTMLUListElement>(null);
  const itemHeight = 44;
  const visibleItems = 5;

  const scrollToValue = useCallback((container: HTMLUListElement | null, value: string | number) => {
    if (!container) return;
    const index = [...container.children].findIndex(
      el => el.getAttribute('data-value') === value.toString()
    );
    if (index !== -1) {
      const scrollPosition = index * itemHeight - (itemHeight * Math.floor(visibleItems / 2));
      container.scrollTo({ top: scrollPosition, behavior: 'auto' });
    }
  }, []);

  const handleItemClick = (container: HTMLUListElement | null, value: string, items: WheelPickerItem[], onChange: (value: string) => void) => {
    if (!container) return;
    const index = items.findIndex(item => item.value.toString() === value);
    const scrollPosition = index * itemHeight - (itemHeight * Math.floor(visibleItems / 2));
    container.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    onChange(value);
  };

  useEffect(() => {
    scrollToValue(hourRef.current, hourValue);
    scrollToValue(minuteRef.current, minuteValue);
    scrollToValue(ampmRef.current, ampmValue);
  }, [hourValue, minuteValue, ampmValue, scrollToValue]);

  const handleScroll = useCallback((container: HTMLUListElement | null, items: WheelPickerItem[], onChange: (value: string) => void) => {
    if (!container) return;
    const selectedIndex = Math.round(container.scrollTop / itemHeight);
    const clampedIndex = Math.min(Math.max(selectedIndex, 0), items.length - 1);
    onChange(items[clampedIndex].value.toString());
  }, []);

  return (
    <div className="flex flex-col items-center p-2 w-full mx-auto text-xs md:text-sm lg:text-base">
      <div className="flex items-center justify-center gap-4 w-full">
        {[
          { ref: hourRef, items: hourItems, value: hourValue, onChange: onHourChange },
          { ref: minuteRef, items: minuteItems, value: minuteValue, onChange: onMinuteChange },
          { ref: ampmRef, items: ampmItems, value: ampmValue, onChange: onAmpmChange }
        ].map((column, i) => (
          <div key={i} className="relative flex-1 h-[220px] overflow-hidden">
            {/* Selection highlight */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-11 bg-accent/10 border-y border-primary rounded-lg pointer-events-none" />
            
            <ul
              ref={column.ref}
              className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
              onScroll={(e) => {
                handleScroll(e.currentTarget, column.items, column.onChange);
              }}
              style={{ scrollBehavior: 'smooth' }}
            >
              {Array.from({ length: Math.floor(visibleItems / 2) }).map((_, i) => (
                <li key={`padding-top-${i}`} className="h-11" aria-hidden="true" />
              ))}
              
              {column.items.map((item) => {
                const isSelected = item.value.toString() === column.value;
                return (
                  <li
                    key={item.value}
                    data-value={item.value}
                    className="h-11 flex items-center justify-center snap-center cursor-pointer"
                    onClick={() => handleItemClick(column.ref.current, item.value.toString(), column.items, column.onChange)}
                  >
                    <span className={`text-lg transition-all duration-200 ${
                      isSelected 
                        ? 'text-primary font-bold scale-110'
                        : 'text-muted-foreground scale-100 hover:text-foreground'
                    }`}>
                      {item.label}
                    </span>
                  </li>
                );
              })}

              {Array.from({ length: Math.floor(visibleItems / 2) }).map((_, i) => (
                <li key={`padding-bottom-${i}`} className="h-11" aria-hidden="true" />
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 w-full flex justify-between gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            onHourChange(initialValues.hourValue);
            onMinuteChange(initialValues.minuteValue);
            onAmpmChange(initialValues.ampmValue);
            onCancel();
          }}
        >
          Cancel
        </Button>
        <Button className="flex-1" onClick={onSelect}>
          Confirm
        </Button>
      </div>
    </div>
  );
};

export const WheelPicker = React.memo(WheelPickerComponent);

//wheelPickerComponent