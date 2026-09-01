import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Loader2, ChevronRight, TrendingUp, Target, CheckCircle, AlertCircle, Star } from 'lucide-react';
import { useApp } from '@/store';
import { fetchClassReportData, fetchClasses } from '@/lib/api';
import type { ClassRow, ProfileRow } from '@/lib/api';
import { ProgressBar, StatCard } from '@/components/ui';

export function TeacherReportClassPage({ classId }: { classId: string }) {
  const { navigate } = useApp();
  const [data, setData] = useState<ReturnType<typeof useFetchClassReport>['data'] | null>(null);
  const [className, setClassName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [report, classes] = await Promise.all([fetchClassReportData(classId), fetchClasses()]);
        setData(report);
        const cls = classes.find((c) => c.id === classId);
        setClassName(cls?.name ?? 'Turma');
      } finally { setLoading(false); }
    })();
  }, [classId]);

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div>;
  if (!data) return null;

  const { students, activities, flashcards, cases, allActivityResults, allFlashcardProgress, allCaseResults } = data;
  const avgXp = students.length > 0 ? Math.round(students.reduce((s, st) => s + st.xp, 0) / students.length) : 0;
  const avgLevel = students.length > 0 ? Math.round(students.reduce((s, st) => s + st.level, 0) / students.length) : 0;
  const avgProgress = students.length > 0 ? Math.round(students.reduce((s, st) => s + Math.min(100, (st.xp / 5300) * 100), 0) / students.length) : 0;
  const totalActivities = activities.length;
  const correctCount = allActivityResults.filter((r: any) => r.correct).length;
  const incorrectCount = allActivityResults.filter((r: any) => !r.correct).length;
  const accuracy = allActivityResults.length > 0 ? Math.round((correctCount / allActivityResults.length) * 100) : 0;
  const flashcardsReviewed = allFlashcardProgress.length;
  const casesCompleted = allCaseResults.length;

  return (
    <div className="space-y-5">
      <button onClick={() => navigate({ name: 'teacher-reports' })} className="flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> Relatórios
      </button>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-ocean-700 p-5 text-white shadow-card">
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="relative">
          <p className="text-xs font-semibold text-primary-200">Relatório da turma</p>
          <h1 className="font-display text-2xl font-bold">{className}</h1>
          <p className="mt-1 text-sm text-primary-200">{students.length} aluno(s) · {activities.length} atividade(s) atribuída(s)</p>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={<Users className="h-5 w-5" />} label="Alunos" value={students.length} accent="accent" />
        <StatCard icon={<TrendingUp className="h-5 w-5" />} label="XP médio" value={avgXp} accent="primary" />
        <StatCard icon={<Target className="h-5 w-5" />} label="Nível médio" value={avgLevel} accent="ocean" />
        <StatCard icon={<CheckCircle className="h-5 w-5" />} label="Progresso" value={`${avgProgress}%`} accent="success" />
      </div>

 {/* Class performance overview */}
      <div className="card p-5">
        <h3 className="font-display font-bold text-ink-900 mb-3">Visão geral da turma</h3>
        <div className="space-y-3">
          <MetricBar label="Progresso médio" value={avgProgress} color="from-primary-400 to-primary-600" />
          <MetricBar label="Precisão nas questões" value={accuracy} color="from-accent-400 to-accent-600" />
          <MetricBar label="Conclusão de atividades" value={totalActivities > 0 ? Math.round((allActivityResults.length / (students.length * totalActivities || 1)) * 100) : 0} color="from-ocean-400 to-ocean-600" />
        </div>
      </div>

      {/* Activity stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <h3 className="font-display font-bold text-ink-900 mb-3">Questões respondidas</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-success-50 p-3 text-center">
              <CheckCircle className="mx-auto h-6 w-6 text-success-600" />
              <p className="mt-1 font-display text-xl font-bold text-success-700">{correctCount}</p>
              <p className="text-xs font-semibold text-success-600">Corretas</p>
            </div>
            <div className="rounded-xl bg-error-50 p-3 text-center">
              <AlertCircle className="mx-auto h-6 w-6 text-error-600" />
              <p className="mt-1 font-display text-xl font-bold text-error-700">{incorrectCount}</p>
              <p className="text-xs font-semibold text-error-600">Incorretas</p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-display font-bold text-ink-900 mb-3">Engajamento</h3>
          <div className="space-y-2">
            <Row label="Flashcards revisados" value={flashcardsReviewed} icon={<Target className="h-4 w-4" />} />
            <Row label="Casos clínicos concluídos" value={casesCompleted} icon={<Star className="h-4 w-4" />} />
            <Row label="Atividades concluídas" value={allActivityResults.length} icon={<CheckCircle className="h-4 w-4" />} />
          </div>
        </div>
      </div>

      {/* Students table */}
      <div>
        <h2 className="section-title mb-3">Desempenho individual</h2>
        {students.length === 0 ? (
          <div className="card p-8 text-center">
            <Users className="mx-auto h-10 w-10 text-ink-300" />
            <p className="mt-2 text-sm text-ink-400">Nenhum aluno matriculado nesta turma.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {students.map((s) => {
              const studentResults = allActivityResults.filter((r: any) => r.student_id === s.id);
              const studentCorrect = studentResults.filter((r: any) => r.correct).length;
              const studentProgress = Math.min(100, Math.round((s.xp / 5300) * 100));
              const perf = studentResults.length > 0 ? Math.round((studentCorrect / studentResults.length) * 100) : 0;
              return (
                <button key={s.id} onClick={() => navigate({ name: 'teacher-report-student', studentId: s.id })} className="card flex w-full items-center gap-3 p-4 text-left transition hover:shadow-soft">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${s.avatar_color} text-sm font-bold text-white`}>{s.name.charAt(0)}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink-900">{s.name}</p>
                    <p className="truncate text-xs text-ink-500">Nível {s.level} · {s.xp} XP</p>
                  </div>
                  <div className="hidden sm:block w-20"><ProgressBar value={studentProgress} /></div>
                  <span className="chip bg-primary-100 text-primary-700">{studentProgress}%</span>
                  <span className="chip bg-accent-100 text-accent-700">{s.xp}</span>
                  <span className="chip bg-success-100 text-success-700">{studentResults.length}/{activities.length}</span>
                  <span className={`chip ${perf >= 70 ? 'bg-success-100 text-success-700' : perf >= 50 ? 'bg-warning-100 text-warning-700' : 'bg-error-100 text-error-700'}`}>{perf}%</span>
                  <ChevronRight className="h-4 w-4 text-ink-300" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function useFetchClassReport() { return { data: null as any }; }

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold text-ink-600">
        <span>{label}</span><span>{value}%</span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-ink-200">
        <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

function Row({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-ink-50 p-2.5">
      <span className="flex items-center gap-2 text-sm font-semibold text-ink-700">{icon} {label}</span>
      <span className="font-display font-bold text-ink-900">{value}</span>
    </div>
  );
}
