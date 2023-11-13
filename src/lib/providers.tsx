"use client";

import { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function ReactQueryProvider({ children }: React.PropsWithChildren) {
  const queryClient = new QueryClient({
    // defaultOptions: {
    //   queries: {
    //     // cacheTime: 0, // default: 5 * 60 * 1000
    //     // staleTime: Infinity, // default: 0
    //     retry: 1, // default: true
    //     refetchOnWindowFocus: false, // default: true
    //     refetchOnMount: false, // default: true
    //     refetchOnReconnect: false, // default: true
    //   },
    // },
  });
  const [client] = useState(queryClient);

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
