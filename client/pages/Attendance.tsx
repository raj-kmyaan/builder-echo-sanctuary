import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, LogIn, Plus, Save } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { scopeKey, getStudents as storeGetStudents, setStudents as storeSetStudents, addAttendance, getAttendance } from "@/lib/store";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useRole } from "@/context/role";

const DEPARTMENTS = ["Computer Science", "Electronics & Communication", "Mechanical Engineering"] as const;
const YEARS = ["First", "Second", "Third", "Fourth"] as const;
const SUBJECTS = ["Data Structures", "Algorithms", "DBMS", "OS"] as const;

function yearToSemesters(year: typeof YEARS[number]) {
  switch (year) {
    case "First":
      return ["Sem 1", "Sem 2"] as const;
    case "Second":
      return ["Sem 3", "Sem 4"] as const;
    case "Third":
      return ["Sem 5", "Sem 6"] as const;
    case "Fourth":
      return ["Sem 7", "Sem 8"] as const;
  }
}

type Student = {
  rollNo: string;
  name: string;
  year: typeof YEARS[number];
  semester: string;
  department: typeof DEPARTMENTS[number];
  present?: boolean;
  medicalLeave?: boolean;
  urgency?: string;
  remark?: string;
  overall?: number;
};

function toCSV(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(","))].join("\n");
  return csv;
}

export default function AttendancePage() {
  const { user, setRole } = useRole();
  const [college, setCollege] = useState("IPEM");
  const [activeDept, setActiveDept] = useState<(typeof DEPARTMENTS)[number]>(DEPARTMENTS[0]);
  const [year, setYear] = useState<(typeof YEARS)[number]>("First");
  const [semester, setSemester] = useState<string>(yearToSemesters("First")[0]);
  const [subject, setSubject] = useState<(typeof SUBJECTS)[number]>(SUBJECTS[0]);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState<Student[]>([]);

  const loadStudents = () => {
    const key = scopeKey(activeDept, year, semester);
    const stored = storeGetStudents(key) as unknown as Student[];
    if (stored.length) setStudents(stored);
  };
  const [nameDraft, setNameDraft] = useState("");
  const [rollDraft, setRollDraft] = useState("");

  const semesters = useMemo(() => yearToSemesters(year), [year]);

  useMemo(() => { loadStudents(); return undefined; }, [activeDept, year, semester]);

  const isFaculty = user.role === "faculty";

  const handleAddStudent = () => {
    if (!nameDraft || !rollDraft) return;
    setStudents((prev) => {
      const next = [
        ...prev,
        {
          rollNo: rollDraft,
          name: nameDraft,
          year,
          semester,
          department: activeDept,
          present: true,
          overall: 0,
        },
      ];
      storeSetStudents(scopeKey(activeDept, year, semester), next);
      return next;
    });
    setNameDraft("");
    setRollDraft("");
  };

  const downloadStudentsCSV = () => {
    const csv = toCSV(
      students.map((s) => ({ rollNo: s.rollNo, name: s.name, year: s.year, semester: s.semester, department: s.department }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeDept}-${year}-${semester}-students.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAttendanceCSV = () => {
    const csv = toCSV(
      students.map((s) => ({
        date,
        subject,
        rollNo: s.rollNo,
        name: s.name,
        present: !!s.present,
        medicalLeave: !!s.medicalLeave,
        urgency: s.urgency || "",
        remark: s.remark || "",
        overall: s.overall ?? 0,
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeDept}-${year}-${semester}-${subject}-attendance.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveAttendance = () => {
    const scope = scopeKey(activeDept, year, semester);
    addAttendance({ scope, date, subject, rows: students.map(s => ({ rollNo: s.rollNo, name: s.name, present: !!s.present, medicalLeave: !!s.medicalLeave, urgency: s.urgency, remark: s.remark })) });
    setStudents((prev) => {
      const next = prev.map((s) => ({ ...s, overall: (s.overall ?? 0) + (s.present ? 1 : 0) }));
      storeSetStudents(scope, next);
      return next;
    });
  };

  const chartData = SUBJECTS.map((sub, i) => ({
    subject: sub,
    percent: 20 + i * 15,
  }));

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/90 to-accent/80 text-white border-none">
        <CardHeader>
          <CardTitle className="text-white">College Attendance Management</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4 items-end">
          <div className="md:col-span-2 text-white/90 text-sm">
            Subject-wise attendance, monthly analytics, and CSV export per department.
            <div className="mt-2 text-white">Active Department: <span className="font-semibold">{activeDept}</span> <span className="mx-2">•</span> College: <span className="font-semibold">{college}</span></div>
          </div>
          <div>
            <Label className="text-white">College Name</Label>
            <Input value={college} onChange={(e) => setCollege(e.target.value)} className="bg-white/10 text-white placeholder:text-white/70 border-white/30" />
          </div>
          <div>
            <Label className="text-white">Year</Label>
            <Select value={year} onValueChange={(v) => { setYear(v as typeof YEARS[number]); setSemester(yearToSemesters(v as typeof YEARS[number])[0]); }}>
              <SelectTrigger className="bg-white/10 text-white border-white/30"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {YEARS.map((y) => (<SelectItem key={y} value={y}>{y}</SelectItem>))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {DEPARTMENTS.map((d) => (
          <Card key={d} className={d === activeDept ? "ring-2 ring-primary" : ""}>
            <CardHeader>
              <CardTitle className="text-lg">{d}</CardTitle>
              <div className="text-xs text-muted-foreground">Monthly average attendance: 0%</div>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <Button onClick={() => setActiveDept(d)} className="rounded-lg">View Department</Button>
              <Button variant="outline" size="icon" className="rounded-lg"><Download className="h-4 w-4" /></Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{activeDept} • Attendance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label>to</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div>
              <Label>Subject</Label>
              <Select value={subject} onValueChange={(v) => setSubject(v as typeof SUBJECTS[number])}>
                <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {SUBJECTS.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Year</Label>
              <Select value={year} onValueChange={(v) => { setYear(v as typeof YEARS[number]); setSemester(yearToSemesters(v as typeof YEARS[number])[0]); }}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {YEARS.map((y) => (<SelectItem key={y} value={y}>{y}</SelectItem>))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Semester</Label>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {semesters.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="ml-auto flex items-end gap-2">
              <Button variant={isFaculty ? "secondary" : "default"} className="rounded-lg" onClick={() => setRole(isFaculty ? "student" : "faculty")}>
                <LogIn className="mr-2 h-4 w-4" /> {isFaculty ? "Logged in (Faculty)" : "Faculty Login"}
              </Button>
              <div className="flex items-end gap-2">
                <Input placeholder="Roll No" value={rollDraft} onChange={(e) => setRollDraft(e.target.value)} className="w-28" />
                <Input placeholder="Student name" value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} className="w-44" />
                <Button onClick={handleAddStudent} className="rounded-lg"><Plus className="mr-2 h-4 w-4" /> Add Student</Button>
              </div>
              <Button onClick={downloadStudentsCSV} variant="outline" className="rounded-lg"><Download className="mr-2 h-4 w-4" /> Students CSV</Button>
              <Button onClick={downloadAttendanceCSV} variant="outline" className="rounded-lg"><Download className="mr-2 h-4 w-4" /> Attendance CSV</Button>
              <Button onClick={saveAttendance} className="rounded-lg"><Save className="mr-2 h-4 w-4" /> Save Attendance</Button>
            </div>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead>Medical Leave</TableHead>
                  <TableHead>Urgency/Reason</TableHead>
                  <TableHead>Remark</TableHead>
                  <TableHead className="text-right">Overall %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">No students in {year}. Add students to begin.</TableCell>
                  </TableRow>
                ) : (
                  students.map((s, i) => (
                    <TableRow key={s.rollNo + i}>
                      <TableCell>{s.rollNo}</TableCell>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>
                        <input type="checkbox" checked={!!s.present} onChange={(e) => setStudents((prev) => prev.map((p, idx) => idx === i ? { ...p, present: e.target.checked } : p))} />
                      </TableCell>
                      <TableCell>
                        <input type="checkbox" checked={!!s.medicalLeave} onChange={(e) => setStudents((prev) => prev.map((p, idx) => idx === i ? { ...p, medicalLeave: e.target.checked } : p))} />
                      </TableCell>
                      <TableCell>
                        <Input value={s.urgency || ""} onChange={(e) => setStudents((prev) => prev.map((p, idx) => idx === i ? { ...p, urgency: e.target.value } : p))} />
                      </TableCell>
                      <TableCell>
                        <Input value={s.remark || ""} onChange={(e) => setStudents((prev) => prev.map((p, idx) => idx === i ? { ...p, remark: e.target.value } : p))} />
                      </TableCell>
                      <TableCell className="text-right">{s.overall?.toFixed(0)}%</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Attendance % by Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-64">
            <AreaChart data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="subject" tickLine={false} axisLine={false} />
              <YAxis hide />
              <defs>
                <linearGradient id="a" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <Area dataKey="percent" type="monotone" stroke="hsl(var(--primary))" fill="url(#a)" strokeWidth={2} />
              <ChartTooltip content={<ChartTooltipContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const rec = getAttendance(scopeKey(activeDept, year, semester)).slice(-5).reverse();
            if (rec.length===0) return <div className="text-muted-foreground">No attendance recorded yet.</div>;
            return (
              <div className="rounded-lg border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="p-3">Date</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Present</th>
                      <th className="p-3">Absent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rec.map((r, i) => {
                      const present = r.rows.filter(x=> x.present).length;
                      const absent = r.rows.length - present;
                      return (
                        <tr key={r.date + r.subject + i} className="border-b">
                          <td className="p-3">{r.date}</td>
                          <td className="p-3">{r.subject}</td>
                          <td className="p-3 text-green-600">{present}</td>
                          <td className="p-3 text-red-600">{absent}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}
