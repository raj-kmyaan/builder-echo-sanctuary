import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppLayout from "@/components/common/AppLayout";
import DashboardPage from "@/pages/Dashboard";
import Placeholder from "@/pages/Placeholder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/courses" element={<Placeholder title={'My Courses'} />} />
            <Route path="/classes" element={<Placeholder title={'My Classes'} />} />
            <Route path="/students" element={<Placeholder title={'Students'} />} />
            <Route path="/fees" element={<Placeholder title={'Fees'} />} />
            <Route path="/marketplace" element={<Placeholder title={'Marketplace'} />} />
            <Route path="/mentorship" element={<Placeholder title={'Mentorship'} />} />
            <Route path="/portfolio" element={<Placeholder title={'My Portfolio'} />} />
            <Route path="/helpdesk" element={<Placeholder title={'Helpdesk'} />} />
            <Route path="/map" element={<Placeholder title={'Interactive Campus Map'} />} />
            <Route path="/settings" element={<Placeholder title={'Settings'} />} />
            <Route path="/profile/:id" element={<Placeholder title={'Student Profile'} />} />
            <Route path="/class/:id/attendance" element={<Placeholder title={'Attendance'} />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
