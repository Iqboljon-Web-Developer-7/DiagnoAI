"use client";

import React, { useState, useLayoutEffect, useRef, useCallback, useEffect } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

interface DebouncedFunction<T extends unknown[]> {
  (...args: T) : void;
}

const debounce = <T extends unknown[]>(func: DebouncedFunction<T>, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: T) => {
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
  className?: string
}

const CollapsibleTabs: React.FC<CollapsibleTabsProps> = ({ tabs, className }) => {
  const [visibleTabs, setVisibleTabs] = useState<Tab[]>([]);
  const [hiddenTabs, setHiddenTabs] = useState<Tab[]>(tabs);
  const containerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lastContainerWidth = useRef<number>(0);

  const pathname = usePathname();

  // Move document usage into useEffect to avoid SSR issues
  useEffect(() => {
    if (typeof window === "undefined") return;
    const header = document.querySelector("header");
    if (pathname === '/ai-medic') {
      header?.classList.add("hidden");
    } else {
      header?.classList.remove("hidden");
    }
  }, [pathname]);

  const calculateVisibleTabs = useCallback(() => {
    if (!containerRef.current || !tabs.length) {
      setVisibleTabs([]);
      setHiddenTabs(tabs);
      return;
    }

    const updateTabs = () => {
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

      const firstTabWidth = tabsRef.current[0]?.offsetWidth || 100;
      if (tabs.length > 0 && firstTabWidth > containerWidth && containerWidth !== 0) {
        hidden.push(...tabs);
      } else {
        tabs.forEach((tab, index) => {
          const tabWidth = tabsRef.current[index]?.offsetWidth || 100;
          totalWidth += tabWidth;

          if (totalWidth <= containerWidth || containerWidth === 0) {
            visible.push(tab);
          } else {
            hidden.push(tab);
          }
        });
      }

      setVisibleTabs(visible);
      setHiddenTabs(hidden);
    };

    requestAnimationFrame(updateTabs);
  }, [tabs]);

  const debouncedCalculateVisibleTabs = useCallback(() => {
    const debouncedFn = debounce(() => calculateVisibleTabs(), 250);
    debouncedFn();
  }, [calculateVisibleTabs]);

  useLayoutEffect(() => {
    calculateVisibleTabs();
    const currentContainer = containerRef.current;

    const resizeObserver = new ResizeObserver(debouncedCalculateVisibleTabs);

    if (currentContainer) {
      resizeObserver.observe(currentContainer);
    }

    window.addEventListener('resize', debouncedCalculateVisibleTabs);

    return () => {
      if (currentContainer) {
        resizeObserver.unobserve(currentContainer);
      }
      window.removeEventListener('resize', debouncedCalculateVisibleTabs);
    };
  }, [debouncedCalculateVisibleTabs, calculateVisibleTabs]);

  useLayoutEffect(() => {
    tabsRef.current = tabs.map((_, i) => tabsRef.current[i] || null);
  }, [tabs]);

  return (
    <div className={`relative flex w-full items-center z-30 ${className}`}>
      <div className="flex flex-1 overflow-hidden relative items-center" ref={containerRef}>
        <div className={`w-full flex items-center justify-center ${visibleTabs?.length && 'animate-fade-in-down'}`}>
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
            <Button size={"icon"} variant={"link"} className="ml-0 p-2 text-gray-600 hover:text-blue-500 focus:outline-none bg-transparent animate-fade-in-down opacity-0 delay-700">
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