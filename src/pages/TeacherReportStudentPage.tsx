import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Star, Target, CheckCircle, AlertCircle, Flame, Trophy, BookOpen } from 'lucide-react';
import { useApp } from '@/store';
import { supabase } from '@/lib/supabase';
import type { ProfileRow, ClassRow } from '@/lib/api';
import { ProgressBar, StatCard } from '@/components/ui';

export function TeacherReportStudentPage({ studentId }: { studentId: string }) {
  const { navigate } = useApp();
  const [student, setStudent] = useState<ProfileRow | null>(null);
  const [className, setClassName] = useState('');
  const [activityResults, setActivityResults] = useState<any[]>([]);
  const [flashcardProgress, setFlashcardProgress] = useState<any[]>([]);
  const [caseResults, setCaseResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', studentId).maybeSingle();
        setStudent(profile as ProfileRow | null);
        if (profile?.class_id) {
          const { data: cls } = await supabase.from('classes').select('name').eq('id', profile.class_id).maybeSingle();
          if (cls) setClassName((cls as any).name);
        }
        const [ar, fp, cr] = await Promise.all([
          supabase.from('activity_results').select('*').eq('student_id', studentId),
          supabase.from('flashcard_progress').select('*').eq('student_id', studentId),
          supabase.from('clinical_case_results').select('*').eq('student_id', studentId),
        ]);
        setActivityResults(ar.data ?? []);
        setFlashcardProgress(fp.data ?? []);
        setCaseResults(cr.data ?? []);
      } finally { setLoading(false); }
    })();
  }, [studentId]);

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div>;
  if (!student) return <div className="p-6 text-center text-ink-500">Aluno não encontrado.</div>;

  const correctCount = activityResults.filter((r) => r.correct).length;
  const incorrectCount = activityResults.filter((r) => !r.correct).length;
  const accuracy = activityResults.length > 0 ? Math.round((correctCount / activityResults.length) * 100) : 0;
  const progress = Math.min(100, Math.round((student.xp / 5300) * 100));
  const knownFlashcards = flashcardProgress.filter((f) => f.known).length;

  return (
    <div className="space-y-5">
      <button onClick={() => navigate({ name: 'teacher-reports' })} className="flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> Relatórios
      </button>

      {/* Student header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-600 to-accent-800 p-5 text-white shadow-card">
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="relative flex items-center gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold ring-1 ring-white/25`}>{student.name.charAt(0)}</div>
          <div>
            <p className="text-xs font-semibold text-white/80">Desenvolvimento do aluno</p>
            <h1 className="font-display text-xl font-bold">{student.name}</h1>
            <p className="text-sm text-white/80">{student.username} · {className || 'Sem turma'}</p>
          </div>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={<Trophy className="h-5 w-5" />} label="Nível" value={student.level} accent="warning" />
        <StatCard icon={<Star className="h-5 w-5" />} label="XP" value={student.xp} accent="accent" />
        <StatCard icon={<Flame className="h-5 w-5" />} label="Sequência" value={`${student.streak} dias`} accent="error" />
        <StatCard icon={<Target className="h-5 w-5" />} label="Progresso" value={`${progress}%`} accent="primary" />
      </div>

      {/* Overall progress */}
      <div className="card p-5">
        <h3 className="font-display font-bold text-ink-900 mb-3">Progresso geral</h3>
        <ProgressBar value={progress} barClassName="bg-gradient-to-r from-primary-400 to-accent-400" />
        <p className="mt-2 text-sm text-ink-500">{student.xp} / 5300 XP para concluir todos os níveis</p>
      </div>

      {/* Activity performance */}
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
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs font-semibold text-ink-600"><span>Precisão</span><span>{accuracy}%</span></div>
            <ProgressBar value={accuracy} barClassName="bg-gradient-to-r from-success-400 to-success-600" />
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-display font-bold text-ink-900 mb-3">Engajamento</h3>
          <div className="space-y-2">
            <Row label="Atividades concluídas" value={activityResults.length} icon={<CheckCircle className="h-4 w-4 text-success-600" />} />
            <Row label="Flashcards dominados" value={knownFlashcards} icon={<BookOpen className="h-4 w-4 text-ocean-600" />} />
            <Row label="Flashcards revisados" value={flashcardProgress.length} icon={<Target className="h-4 w-4 text-primary-600" />} />
            <Row label="Casos clínicos concluídos" value={caseResults.length} icon={<Star className="h-4 w-4 text-warning-600" />} />
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="card p-5">
        <h3 className="font-display font-bold text-ink-900 mb-3">Conquistas</h3>
        {student.badge_ids && student.badge_ids.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {student.badge_ids.map((b) => <span key={b} className="chip bg-accent-100 text-accent-700">{b}</span>)}
          </div>
        ) : (
          <p className="text-sm text-ink-400">Nenhuma conquista desbloqueada ainda.</p>
        )}
      </div>

      {/* Recent activity */}
      <div className="card p-5">
        <h3 className="font-display font-bold text-ink-900 mb-3">Atividade recente</h3>
        {activityResults.length === 0 && caseResults.length === 0 ? (
          <p className="text-sm text-ink-400">Nenhuma atividade registrada ainda.</p>
        ) : (
          <div className="space-y-2">
            {[...activityResults.map((r) => ({ type: 'activity', date: r.completed_at, correct: r.correct, xp: r.xp_earned })),
              ...caseResults.map((r) => ({ type: 'case', date: r.completed_at, correct: true, xp: r.xp_earned }))]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 8)
              .map((r, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-ink-50 p-3">
                  {r.type === 'activity' ? (r.correct ? <CheckCircle className="h-5 w-5 text-success-600" /> : <AlertCircle className="h-5 w-5 text-error-600" />) : <Star className="h-5 w-5 text-warning-600" />}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink-800">{r.type === 'activity' ? (r.correct ? 'Resposta correta' : 'Resposta incorreta') : 'Caso clínico concluído'}</p>
                    <p className="text-xs text-ink-500">{new Date(r.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  {r.xp > 0 && <span className="chip bg-accent-100 text-accent-700">+{r.xp} XP</span>}
                </div>
              ))}
          </div>
        )}
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
