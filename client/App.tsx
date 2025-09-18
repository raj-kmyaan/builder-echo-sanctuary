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
import AttendancePage from "@/pages/Attendance";
import TimetableWizardPage from "@/pages/TimetableWizard";
import PlacementsPage from "@/pages/Placements";
import ProfilePage from "@/pages/Profile";
import TasksPage from "@/pages/Tasks";
import NotesPage from "@/pages/Notes";
import CalendarPage from "@/pages/Calendar";

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
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/fees" element={<Placeholder title={'Fees'} />} />
            <Route path="/marketplace" element={<Placeholder title={'Marketplace'} />} />
            <Route path="/mentorship" element={<Placeholder title={'Mentorship'} />} />
            <Route path="/portfolio" element={<Placeholder title={'My Portfolio'} />} />
            <Route path="/helpdesk" element={<Placeholder title={'Helpdesk'} />} />
            <Route path="/map" element={<Placeholder title={'Interactive Campus Map'} />} />
            <Route path="/settings" element={<Placeholder title={'Settings'} />} />
            <Route path="/timetable-wizard" element={<TimetableWizardPage />} />
            <Route path="/placements" element={<PlacementsPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/class/:id/attendance" element={<Placeholder title={'Attendance'} />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
