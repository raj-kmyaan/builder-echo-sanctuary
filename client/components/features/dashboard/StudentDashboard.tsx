import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import AttendanceDonutChart from "@/components/charts/AttendanceDonutChart";
import { useRole } from "@/context/role";

const todaySchedule = [
  { time: "9:00 AM", course: "CS101 - Intro to CS", room: "Room A-204" },
  { time: "11:00 AM", course: "MA102 - Calculus II", room: "Room B-109" },
  { time: "1:00 PM", course: "Break", room: "Near Library", gap: true, duration: "90 min" },
  { time: "2:30 PM", course: "PH110 - Physics Lab", room: "Lab C-3" },
];

const upcoming = [
  { title: "CS101 Assignment 3", due: "Today, 11:59 PM" },
  { title: "Calculus Quiz", due: "Tomorrow, 9:00 AM" },
  { title: "Physics Lab Report", due: "Fri, 2:00 PM" },
];

const recentGrades = [
  { course: "CS101", item: "Quiz 2", grade: "18/20" },
  { course: "MA102", item: "Assignment 2", grade: "9/10" },
  { course: "EN105", item: "Essay 1", grade: "A-" },
];

export default function StudentDashboard() {
  const { user } = useRole();
  return (
    <div className="grid grid-cols-12 gap-6">
      <Card className="col-span-12 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome, {user.name}!</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">You have 3 classes and 1 assignment due today.</CardContent>
      </Card>

      <div className="col-span-12 lg:col-span-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {todaySchedule.map((item, idx) => (
                <li key={idx} className={cn("grid grid-cols-12 items-start gap-3 rounded-lg border p-3", item.gap && "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900")}> 
                  <span className="col-span-3 md:col-span-2 flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" /> {item.time}</span>
                  <div className="col-span-9 md:col-span-10">
                    <div className={cn("font-medium", item.gap && "text-amber-700 dark:text-amber-200")}>{item.course}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {item.room}</div>
                    {item.gap ? (
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-sm">You have a {item.duration} break at 1 PM near the library. Suggested: Reserve a study room.</div>
                        <Button className="rounded-lg">Book Now</Button>
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {upcoming.map((u, i) => (
                <li key={i} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{u.title}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{u.due}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-12 lg:col-span-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>My Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceDonutChart percentage={86} breakdown={{ present: 86, absent: 14 }} />
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex justify-between"><span>CS101</span><span className="text-red-600">74%</span></li>
              <li className="flex justify-between"><span>MA102</span><span className="text-amber-600">82%</span></li>
              <li className="flex justify-between"><span>EN105</span><span className="text-green-600">92%</span></li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overall GPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">3.72</div>
            <div className="text-sm text-muted-foreground">Updated this semester</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              {recentGrades.map((g, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{g.course} – {g.item}</span>
                  <span className="font-medium">{g.grade}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
