"use client";

import { useEffect, useState } from "react";

export default function PromptInstall() {
  const [show, setShow] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-lg rounded-lg p-4 max-w-2xs">
      <p className="text-sm font-medium mb-2">Install DiagnoAI</p>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
        Add this app to your home screen for quick access.
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShow(false)}
          className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
        >
          Dismiss
        </button>
        <button
          onClick={handleInstall}
          className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Download
        </button>
      </div>
    </div>
  );
}
