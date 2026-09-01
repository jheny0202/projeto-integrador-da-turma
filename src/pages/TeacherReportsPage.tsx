import { useState, useEffect } from 'react';
import { ArrowLeft, BarChart3, Users, ChevronRight, Loader2 } from 'lucide-react';
import { useApp } from '@/store';
import { fetchClasses, fetchClassReportData } from '@/lib/api';
import type { ClassRow } from '@/lib/api';
import { ProgressBar } from '@/components/ui';

export function TeacherReportsPage() {
  const { navigate } = useApp();
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Record<string, { students: number; avgXp: number; avgLevel: number; avgProgress: number }>>({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const cls = await fetchClasses();
        setClasses(cls);
        const statsMap: Record<string, any> = {};
        await Promise.all(cls.map(async (c) => {
          try {
            const data = await fetchClassReportData(c.id);
            const students = data.students;
            const avgXp = students.length > 0 ? Math.round(students.reduce((s, st) => s + st.xp, 0) / students.length) : 0;
            const avgLevel = students.length > 0 ? Math.round(students.reduce((s, st) => s + st.level, 0) / students.length) : 0;
            const avgProgress = students.length > 0 ? Math.round(students.reduce((s, st) => s + Math.min(100, (st.xp / 5300) * 100), 0) / students.length) : 0;
            statsMap[c.id] = { students: students.length, avgXp, avgLevel, avgProgress };
          } catch { statsMap[c.id] = { students: 0, avgXp: 0, avgLevel: 0, avgProgress: 0 }; }
        }));
        setStats(statsMap);
      } finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="space-y-5">
      <button onClick={() => navigate({ name: 'teacher' })} className="flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> Área do professor
      </button>
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Relatórios</h1>
        <p className="mt-1 text-sm text-ink-500">Selecione uma turma para ver o desempenho detalhado.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div>
      ) : classes.length === 0 ? (
        <div className="card flex flex-col items-center justify-center p-10 text-center">
          <BarChart3 className="h-12 w-12 text-ink-300" />
          <p className="mt-3 text-sm font-semibold text-ink-600">Nenhuma turma disponível.</p>
          <p className="text-xs text-ink-400">Crie uma turma para visualizar relatórios.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {classes.map((c) => {
            const s = stats[c.id] ?? { students: 0, avgXp: 0, avgLevel: 0, avgProgress: 0 };
            return (
              <button key={c.id} onClick={() => navigate({ name: 'teacher-report-class', classId: c.id })} className="card w-full p-5 text-left transition hover:shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700"><Users className="h-6 w-6" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-bold text-ink-900">{c.name}</p>
                    <p className="truncate text-xs text-ink-500">{s.students} aluno(s) · {c.semester ?? 'Sem semestre'}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-ink-300" />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-ink-50 p-2">
                    <p className="text-[10px] font-bold uppercase text-ink-400">XP médio</p>
                    <p className="font-display text-sm font-bold text-ink-900">{s.avgXp}</p>
                  </div>
                  <div className="rounded-xl bg-ink-50 p-2">
                    <p className="text-[10px] font-bold uppercase text-ink-400">Nível médio</p>
                    <p className="font-display text-sm font-bold text-ink-900">{s.avgLevel}</p>
                  </div>
                  <div className="rounded-xl bg-ink-50 p-2">
                    <p className="text-[10px] font-bold uppercase text-ink-400">Progresso</p>
                    <p className="font-display text-sm font-bold text-ink-900">{s.avgProgress}%</p>
                  </div>
                </div>
                <div className="mt-2"><ProgressBar value={s.avgProgress} /></div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
