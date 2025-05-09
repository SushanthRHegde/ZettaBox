
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./components/MainLayout";
import Index from "./pages/Index";
import PDFConverter from "./pages/PDFConverter";
import NotFound from "./pages/NotFound";
import Profile from "./components/Profile";
// import MobileNav from "./components/MobileNav";
import FloatingDock from "./components/FloatingDock";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground antialiased">
          <div className="relative flex min-h-screen flex-col">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/pdf-converter" element={<PDFConverter />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/webdev" element={<NotFound />} />
                  <Route path="/productivity" element={<NotFound />} />
                  <Route path="/study" element={<NotFound />} />
                  <Route path="/utility" element={<NotFound />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
              <FloatingDock />
            </BrowserRouter>
          </div>
        </div>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
