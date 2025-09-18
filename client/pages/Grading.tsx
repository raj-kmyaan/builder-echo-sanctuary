import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GradeEntry, getGrades, setGrades } from "@/lib/store";

export default function GradingPage(){
  const [courseId, setCourseId] = useState("CS101");
  const [assignment, setAssignment] = useState("Assignment 1");
  const [rows, setRows] = useState<GradeEntry[]>(()=> getGrades(courseId));

  const addRow = () => { setRows(prev=> [...prev, { rollNo: "", assignment, score: 0, total: 10 }]); };
  const save = () => { setGrades(courseId, rows); };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Effortless Grading</h1>
      <Card>
        <CardHeader><CardTitle>Grades for {courseId}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <div>
              <Label>Course</Label>
              <Input value={courseId} onChange={e=> { setCourseId(e.target.value); setRows(getGrades(e.target.value)); }} />
            </div>
            <div>
              <Label>Assignment</Label>
              <Input value={assignment} onChange={e=> setAssignment(e.target.value)} />
            </div>
            <div className="md:col-span-2 flex items-end gap-2">
              <Button onClick={addRow} className="rounded-lg">Add Row</Button>
              <Button onClick={save} variant="outline" className="rounded-lg">Save</Button>
            </div>
          </div>
          <div className="rounded-lg border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-3">Roll No</th>
                  <th className="p-3">Assignment</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i)=> (
                  <tr key={i} className="border-b">
                    <td className="p-3"><Input value={r.rollNo} onChange={e=> setRows(prev=> prev.map((p, idx)=> idx===i? { ...p, rollNo: e.target.value }: p))} /></td>
                    <td className="p-3"><Input value={r.assignment} onChange={e=> setRows(prev=> prev.map((p, idx)=> idx===i? { ...p, assignment: e.target.value }: p))} /></td>
                    <td className="p-3"><Input type="number" value={r.score} onChange={e=> setRows(prev=> prev.map((p, idx)=> idx===i? { ...p, score: Number(e.target.value) }: p))} /></td>
                    <td className="p-3"><Input type="number" value={r.total} onChange={e=> setRows(prev=> prev.map((p, idx)=> idx===i? { ...p, total: Number(e.target.value) }: p))} /></td>
                  </tr>
                ))}
                {rows.length===0 ? <tr><td className="p-3 text-muted-foreground" colSpan={4}>No rows. Add one.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
