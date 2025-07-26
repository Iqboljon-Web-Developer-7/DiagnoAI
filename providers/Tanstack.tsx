'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function TanstackProvider({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5, // 5 minutes
            },
        },
    })

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}