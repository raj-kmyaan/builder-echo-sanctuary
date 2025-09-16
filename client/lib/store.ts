export type Dept = "Computer Science" | "Electronics & Communication" | "Mechanical Engineering";
export type Year = "First" | "Second" | "Third" | "Fourth";
export type TimetableBlock = { course: string; day: string; time: number; duration: number };

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function scopeKey(dept: Dept, year: Year, semester: string) {
  return `${dept}::${year}::${semester}`;
}

export type StudentLite = { rollNo: string; name: string; year: Year; semester: string; department: Dept; overall?: number };
export function getStudents(scope: string): StudentLite[] {
  return read<StudentLite[]>(`compass:students:${scope}`, []);
}
export function setStudents(scope: string, students: StudentLite[]) {
  write(`compass:students:${scope}`, students);
}

export type AttendanceRow = { rollNo: string; name: string; present: boolean; medicalLeave?: boolean; urgency?: string; remark?: string };
export type AttendanceRecord = { scope: string; date: string; subject: string; rows: AttendanceRow[] };
export function addAttendance(record: AttendanceRecord) {
  const key = `compass:attendance:${record.scope}`;
  const list = read<AttendanceRecord[]>(key, []);
  list.push(record);
  write(key, list);
}
export function getAttendance(scope: string) {
  return read<AttendanceRecord[]>(`compass:attendance:${scope}`, []);
}

export function setTimetable(userId: string, blocks: TimetableBlock[]) {
  write(`compass:timetable:${userId}`, blocks);
}
export function getTimetable(userId: string): TimetableBlock[] {
  return read<TimetableBlock[]>(`compass:timetable:${userId}`, []);
}

export type Application = { id: string; company: string; title: string; date: string; status: string };
export function getApplications(userId: string): Application[] {
  return read<Application[]>(`compass:apps:${userId}`, []);
}
export function addApplication(userId: string, app: Application) {
  const list = getApplications(userId);
  if (!list.find((a) => a.id === app.id)) {
    list.push(app);
    write(`compass:apps:${userId}`, list);
  }
}
