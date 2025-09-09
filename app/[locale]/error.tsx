"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  const router = useRouter();
 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6 text-center">
      <h2 className="text-3xl font-semibold">Something went wrong!</h2>
      <p className="max-w-lg text-muted-foreground">{error.message || "An unexpected error occurred."}</p>

      <div className="flex flex-wrap items-center justify-center gap-4" onMouseEnter={() => reset()}>
        <Button variant="secondary" onClick={() => reset()}>
          Retry
        </Button>
        <Button onClick={() => router.push("/")}>Go to Home</Button>
      </div>
    </div>
  );
}