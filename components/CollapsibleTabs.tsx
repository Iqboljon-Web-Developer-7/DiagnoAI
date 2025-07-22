"use client";

import React, { useState, useLayoutEffect, useRef, useCallback } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from './ui/button';

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
      setVisibleTabs([]);
      setHiddenTabs(tabs);
      return;
    }

    requestAnimationFrame(() => {
      const containerWidth = Math.max(
        containerRef.current?.offsetWidth ? containerRef.current.offsetWidth - 40 : 0,
        100
      );

      if (Math.abs(containerWidth - lastContainerWidth.current) < 20 && lastContainerWidth.current !== 0) {
        return;
      }
      lastContainerWidth.current = containerWidth;

      let totalWidth = 0;
      const visible: Tab[] = [];
      const hidden: Tab[] = [];

      const firstTabWidth = tabsRef.current[0]?.offsetWidth || 100; // Fallback width
      if (tabs.length > 0 && firstTabWidth > containerWidth && containerWidth !== 0) {
        hidden.push(...tabs);
      } else {
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

  const debouncedCalculateVisibleTabs = useCallback(
    debounce(calculateVisibleTabs, 250),
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
                className="p-2 text-sm whitespace-nowrap text-gray-600 hover:text-blue-500"
              >
                {tab.label}
              </Link>
            </div>
          ))}
        </div>
      </div>
      {hiddenTabs.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"} variant={"link"} className="ml-0 p-2 text-gray-600 hover:text-blue-500 focus:outline-none bg-transparent">
              <Menu className="h-5 w-5" />
            </Button>
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