import { useRole } from "@/context/role";
import StudentDashboard from "@/components/features/dashboard/StudentDashboard";
import FacultyDashboard from "@/components/features/dashboard/FacultyDashboard";

export default function DashboardPage() {
  const { user } = useRole();
  if (user.role === "faculty") return <FacultyDashboard />;
  return <StudentDashboard />;
}
