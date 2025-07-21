"use client";

import React, { useState, useLayoutEffect, useRef, useCallback } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu } from 'lucide-react';
import { Link } from '@/i18n/navigation';

// Utility to debounce a function
const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

interface Tab {
  label: string;
  path: string;
}

interface CollapsibleTabsProps {
  tabs: Tab[];
}

const CollapsibleTabs: React.FC<CollapsibleTabsProps> = ({ tabs }) => {
  const [visibleTabs, setVisibleTabs] = useState<Tab[]>([]);
  const [hiddenTabs, setHiddenTabs] = useState<Tab[]>(tabs); // Initialize with all tabs hidden
  const containerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lastContainerWidth = useRef<number>(0);

  const calculateVisibleTabs = useCallback(() => {
    if (!containerRef.current || !tabs.length) {
      console.warn('Container ref or tabs not available');
      setVisibleTabs([]);
      setHiddenTabs(tabs);
      return;
    }

    requestAnimationFrame(() => {
      const containerWidth = Math.max(
        containerRef.current?.offsetWidth ? containerRef.current.offsetWidth - 40 : 0,
        100 // Minimum container width to avoid erratic behavior
      );

      // Hysteresis: skip updates if width change is less than 20px
      if (Math.abs(containerWidth - lastContainerWidth.current) < 20 && lastContainerWidth.current !== 0) {
        return;
      }
      lastContainerWidth.current = containerWidth;

      console.log('Container width:', containerWidth);

      let totalWidth = 0;
      const visible: Tab[] = [];
      const hidden: Tab[] = [];

      // Check if the first tab fits
      const firstTabWidth = tabsRef.current[0]?.offsetWidth || 100; // Fallback width
      console.log(`Tab ${tabs[0]?.label || 'first'} width:`, firstTabWidth);

      if (tabs.length > 0 && firstTabWidth > containerWidth && containerWidth !== 0) {
        // If the first tab doesn't fit, hide all tabs
        hidden.push(...tabs);
        console.log('All tabs hidden (first tab too wide)');
      } else {
        // Normal calculation for tabs
        tabs.forEach((tab, index) => {
          const tabWidth = tabsRef.current[index]?.offsetWidth || 100; // Fallback width
          console.log(`Tab ${tab.label} width:`, tabWidth);
          totalWidth += tabWidth;

          if (totalWidth <= containerWidth || containerWidth === 0) {
            visible.push(tab);
          } else {
            hidden.push(tab);
          }
        });
      }

      console.log('Visible tabs:', visible.map((t) => t.label));
      console.log('Hidden tabs:', hidden.map((t) => t.label));

      // Only update state if tab arrays differ
      const visibleChanged = visible.length !== visibleTabs.length ||
        visible.some((tab, i) => tab.path !== visibleTabs[i]?.path);
      const hiddenChanged = hidden.length !== hiddenTabs.length ||
        hidden.some((tab, i) => tab.path !== hiddenTabs[i]?.path);

      if (visibleChanged || hiddenChanged) {
        setVisibleTabs(visible);
        setHiddenTabs(hidden);
      }
    });
  }, [tabs, visibleTabs, hiddenTabs]);

  // Debounced resize handler
  const debouncedCalculateVisibleTabs = useCallback(
    debounce(calculateVisibleTabs, 250), // Increased to 250ms
    [calculateVisibleTabs]
  );

  useLayoutEffect(() => {
    calculateVisibleTabs();

    const resizeObserver = new ResizeObserver(() => {
      debouncedCalculateVisibleTabs();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', debouncedCalculateVisibleTabs);

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      window.removeEventListener('resize', debouncedCalculateVisibleTabs);
    };
  }, [debouncedCalculateVisibleTabs]);

  // Initialize refs array
  useLayoutEffect(() => {
    tabsRef.current = tabs.map((_, i) => tabsRef.current[i] || null);
  }, [tabs]);

  return (
    <div className="relative flex w-full items-center z-30">
      <div className="flex flex-1 overflow-hidden relative items-center" ref={containerRef}>
        <div className="w-full flex items-center justify-center">
          {visibleTabs.map((tab, index) => (
            <div
              key={tab.path}
              ref={(el: HTMLDivElement | null) => {
                tabsRef.current[index] = el;
              }}
              className="inline-block"
            >
              <Link
                href={tab.path}
                className="px-4 py-2 text-sm whitespace-nowrap text-gray-600 hover:text-blue-500"
              >
                {tab.label}
              </Link>
            </div>
          ))}
        </div>
        {hiddenTabs.length > 0 && (
          <div
            className="absolute right-0 top-0 bottom-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to left, rgba(0, 0, 0, 0.1), transparent 10px)',
              width: '20px',
            }}
          />
        )}
      </div>
      {hiddenTabs.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-2 p-2 text-gray-600 hover:text-blue-500 focus:outline-none">
              <Menu className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[150px]">
            {hiddenTabs.map((tab) => (
              <DropdownMenuItem key={tab.path} asChild>
                <Link
                  href={tab.path}
                  className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                >
                  {tab.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default CollapsibleTabs;