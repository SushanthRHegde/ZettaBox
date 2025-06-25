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
import PDF from "./pages/PDF";
import PDFMerger from "./pages/PDFMergerSplitter";
import PDFEditor from "./pages/PDFEditor";
import WebDev from "./pages/WebDev";
import Productivity from "./pages/Productivity";
import TodoList from "./components/Todo";
import PomodoroTimer from "./components/PomodoroTimer";
import TaskScheduler from "./components/TaskScheduler";
import UtilityPage from "./pages/UtilityPage";
import CurrencyConverter from "./pages/utility/CurrencyConverter";
import UnitConverter from "./pages/utility/UnitConverter";
import PasswordGenerator from "./pages/utility/PasswordGenerator";
import QRCode from "./pages/utility/QRCode";
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
                  <Route path="/pdf" element={<PDF />} />
                  <Route path="/pdf-merger" element={<PDFMerger />} />
                  <Route path="/pdf-editor" element={<PDFEditor />} />
                  <Route path="/pdf-converter" element={<PDFConverter />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/webdev" element={<WebDev />} />
                  <Route path="/productivity" element={<Productivity />} />
                  <Route path="/todo" element={<TodoList />} />
                  <Route path="/pomodoro" element={<PomodoroTimer />} />
                  <Route path="/scheduler" element={<TaskScheduler />} />
                  <Route path="/study" element={<NotFound />} />
                  <Route path="/utility" element={<UtilityPage />} />
                  <Route path="/utility/currency-converter" element={<CurrencyConverter />} />
                  <Route path="/utility/unit-converter" element={<UnitConverter />} />
                  <Route path="/utility/password-generator" element={<PasswordGenerator />} />
                  <Route path="/utility/qr-code" element={<QRCode />} />
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
;
