'use client'; // <-- remove if you are not using Next.js App Router

import { useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Download } from 'lucide-react'; // optional icons

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PromptInstall() {
  const t = useTranslations('PromptInstall');
  const [deferredEvt, setDeferredEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkInstalled = useCallback(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(standalone);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredEvt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsVisible(false), 5_000);
  }, []);

  const handleMouseEnter = () => {
    resetTimer();
    setIsVisible(true);
  };

  const handleMouseLeave = () => resetTimer();

  useEffect(() => {
    checkInstalled();
    resetTimer();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [checkInstalled, resetTimer]);

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

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex max-w-xs flex-col gap-3 rounded-lg bg-white p-4 shadow-xl ring-1 ring-gray-200 transition-all hover:shadow-2xl dark:bg-gray-800 dark:ring-gray-700"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('title')}
        </h3>
        <button
          onClick={handleClose}
          className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          aria-label={t('close')}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {isInstalled ? t('installed') : t('description')}
      </p>

      {/* Buttons */}
      <div className="flex gap-2">
        {!isInstalled && deferredEvt && (
          <button
            onClick={handleInstall}
            className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            <Download className="h-4 w-4" />
            {t('install')}
          </button>
        )}
      </div>
    </div>
  );
}