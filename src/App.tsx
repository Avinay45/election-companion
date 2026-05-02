import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppShell } from "@/components/layout/AppShell";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy-load heavy / route-only pages to shrink initial bundle
const Auth = lazy(() => import("./pages/auth/Auth"));
const Profile = lazy(() => import("./pages/Profile"));
const Chat = lazy(() => import("./pages/Chat"));
const Journey = lazy(() => import("./pages/Journey"));
const Timeline = lazy(() => import("./pages/Timeline"));
const BoothFinder = lazy(() => import("./pages/BoothFinder"));
const Quiz = lazy(() => import("./pages/Quiz"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min — avoid refetch storms
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

const RouteFallback = () => (
  <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
    Loading…
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster richColors position="top-right" />
            <BrowserRouter>
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route element={<AppShell />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/journey" element={<Journey />} />
                    <Route path="/timeline" element={<Timeline />} />
                    <Route path="/booth" element={<BoothFinder />} />
                    <Route path="/quiz" element={<Quiz />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
