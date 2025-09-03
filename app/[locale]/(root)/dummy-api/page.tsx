"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DummyApiPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dummy")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError("Failed to load data");
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle>Dummy API Test</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500">{error}</p>}
          {data ? (
            <pre className="whitespace-pre-wrap break-words">{JSON.stringify(data, null, 2)}</pre>
          ) : !error ? (
            <p>Loading...</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}