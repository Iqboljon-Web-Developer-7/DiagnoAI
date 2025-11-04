'use client'; // <-- remove if you are not using Next.js App Router

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Download } from 'lucide-react'; // optional icons

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PomptInstall() {
  // ----------------------------------------------------------------------
  // 1. State
  // ----------------------------------------------------------------------
  const [deferredEvt, setDeferredEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ----------------------------------------------------------------------
  // 2. Detect if we are already running as a PWA
  // ----------------------------------------------------------------------
  const checkInstalled = useCallback(() => {
    const standalone = (window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true);
    setIsInstalled(standalone);
  }, []);

  // ----------------------------------------------------------------------
  // 3. Capture the native beforeinstallprompt
  // ----------------------------------------------------------------------
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredEvt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // ----------------------------------------------------------------------
  // 4. Auto-hide logic (10 s inactivity)
  // ----------------------------------------------------------------------
  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsVisible(false), 10_000);
  }, []);

  const handleMouseEnter = () => {
    resetTimer();
    setIsVisible(true);
  };

  const handleMouseLeave = () => resetTimer();

  // start timer on mount
  useEffect(() => {
    checkInstalled();
    resetTimer();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [checkInstalled, resetTimer]);

  // ----------------------------------------------------------------------
  // 5. Install handler
  // ----------------------------------------------------------------------
  const handleInstall = async () => {
    if (!deferredEvt) return;

    await deferredEvt.prompt();
    const { outcome } = await deferredEvt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsVisible(false);
    }
    setDeferredEvt(null);
  };

  const handleClose = () => setIsVisible(false);

  // ----------------------------------------------------------------------
  // 6. Render
  // ----------------------------------------------------------------------
  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex max-w-xs flex-col gap-3 rounded-lg bg-white p-4 shadow-xl ring-1 ring-gray-200 transition-all hover:shadow-2xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Des</h3>
        <button
          onClick={handleClose}
          className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close banner"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <p className="text-sm text-gray-600">
        {isInstalled
          ? 'You already have Des installed!'
          : 'Install Des on your device for a native-like experience.'}
      </p>

      {/* Buttons */}
      <div className="flex gap-2">
        {!isInstalled && deferredEvt && (
          <button
            onClick={handleInstall}
            className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            <Download className="h-4 w-4" />
            Install
          </button>
        )}

        <button
          onClick={handleClose}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          {isInstalled ? 'Close' : 'Later'}
        </button>
      </div>
    </div>
  );
}