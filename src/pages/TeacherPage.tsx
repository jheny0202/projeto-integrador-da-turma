import { Stethoscope, Users, FileText, BarChart3, Plus, AlertTriangle, TrendingUp, Trophy, ClipboardList, Settings, ArrowLeft, ChevronRight, Layers, Star } from 'lucide-react';
import { useApp } from '@/store';
import { LEVELS } from '@/data';
import { ProgressBar, StatCard, accentGrad } from '@/components/ui';
import { useState, useEffect } from 'react';
import { fetchClasses, fetchTeacherActivities, fetchTeacherFlashcards, fetchTeacherClinicalCases, fetchStudentsInClass } from '@/lib/api';
import type { ClassRow, ActivityRow, FlashcardRow, ClinicalCaseRow, ProfileRow } from '@/lib/api';

export function TeacherPage() {
  const { user, logout, navigate } = useApp();
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [flashcards, setFlashcards] = useState<FlashcardRow[]>([]);
  const [cases, setCases] = useState<ClinicalCaseRow[]>([]);
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetchClasses().catch(() => []),
      fetchTeacherActivities(user.id).catch(() => []),
      fetchTeacherFlashcards(user.id).catch(() => []),
      fetchTeacherClinicalCases(user.id).catch(() => []),
    ]).then(([c, a, f, cc]) => {
      setClasses(c);
      setActivities(a);
      setFlashcards(f);
      setCases(cc);
      Promise.all(c.map((cls) => fetchStudentsInClass(cls.id).catch(() => [])))
        .then((students) => setStudentCount(students.flat().length));
    });
  }, [user]);

  if (!user) return null;

  const totalXp = studentCount > 0 ? '—' : 0;

  return (
    <div className="space-y-5">
      <button onClick={() => { logout(); navigate({ name: 'landing' }); }} className="flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> Sair
      </button>

      {/* header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-600 to-accent-800 p-5 text-white shadow-card">
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
            <Stethoscope className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white/80">Área do professor</p>
            <h1 className="font-display text-xl font-bold">{user.name}</h1>
          </div>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={<Users className="h-5 w-5" />} label="Alunos" value={studentCount} accent="accent" />
        <StatCard icon={<Layers className="h-5 w-5" />} label="Turmas" value={classes.length} accent="primary" />
        <StatCard icon={<FileText className="h-5 w-5" />} label="Atividades" value={activities.length} accent="ocean" />
        <StatCard icon={<ClipboardList className="h-5 w-5" />} label="Flashcards" value={flashcards.length} accent="success" />
      </div>

      {/* main navigation */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <NavTile icon={<Users />} label="Gerenciar turmas" sub={`${classes.length} turmas`} color="bg-primary-100 text-primary-700" onClick={() => navigate({ name: 'teacher-classes' })} />
        <NavTile icon={<Plus />} label="Gerenciar conteúdo" sub="Atividades, questões, cards, casos" color="bg-accent-100 text-accent-700" onClick={() => navigate({ name: 'teacher-content' })} />
        <NavTile icon={<BarChart3 />} label="Relatórios" sub="Desempenho por turma" color="bg-success-100 text-success-700" onClick={() => navigate({ name: 'teacher-reports' })} />
      </div>

      {/* quick create shortcuts */}
      <div>
        <h2 className="section-title mb-3">Criar conteúdo</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <CreateTile icon={<Plus />} label="Nova atividade" color="bg-primary-100 text-primary-700" onClick={() => navigate({ name: 'teacher-create-activity' })} />
          <CreateTile icon={<FileText />} label="Nova questão" color="bg-accent-100 text-accent-700" onClick={() => navigate({ name: 'teacher-create-question' })} />
          <CreateTile icon={<ClipboardList />} label="Novo flashcard" color="bg-ocean-100 text-ocean-700" onClick={() => navigate({ name: 'teacher-create-flashcard' })} />
          <CreateTile icon={<Star />} label="Novo caso clínico" color="bg-warning-100 text-warning-700" onClick={() => navigate({ name: 'teacher-create-case' })} />
        </div>
      </div>

      {/* recent content */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <h3 className="font-display font-bold text-ink-900 mb-3">Turmas recentes</h3>
          {classes.length === 0 ? (
            <EmptyState text="Nenhuma turma criada ainda." action={<button onClick={() => navigate({ name: 'teacher-classes' })} className="btn-primary mt-2 text-sm">Criar turma</button>} />
          ) : (
            <div className="space-y-2">
              {classes.slice(0, 4).map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-xl bg-ink-50 p-3">
                  <div>
                    <p className="text-sm font-bold text-ink-900">{c.name}</p>
                    <p className="text-xs text-ink-500">{c.semester ?? 'Sem semestre'}</p>
                  </div>
                  <span className={`chip ${c.is_active ? 'bg-success-100 text-success-700' : 'bg-ink-100 text-ink-500'}`}>{c.is_active ? 'Ativa' : 'Inativa'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5">
          <h3 className="font-display font-bold text-ink-900 mb-3">Conteúdo recente</h3>
          <div className="space-y-2">
            {activities.slice(0, 2).map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-xl bg-ink-50 p-3">
                <div><p className="text-sm font-bold text-ink-900">{a.title}</p><p className="text-xs text-ink-500">Atividade · {a.points} pts</p></div>
              </div>
            ))}
            {cases.slice(0, 2).map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-xl bg-ink-50 p-3">
                <div><p className="text-sm font-bold text-ink-900">{c.title}</p><p className="text-xs text-ink-500">Caso clínico · {c.points} pts</p></div>
              </div>
            ))}
            {activities.length === 0 && cases.length === 0 && (
              <EmptyState text="Nenhum conteúdo criado ainda." action={<button onClick={() => navigate({ name: 'teacher-content' })} className="btn-primary mt-2 text-sm">Criar conteúdo</button>} />
            )}
          </div>
        </div>
      </div>

      {/* levels overview */}
      <div className="card p-5">
        <h3 className="flex items-center gap-2 font-display font-bold text-ink-900"><Trophy className="h-5 w-5 text-primary-600" /> Visão geral dos níveis</h3>
        <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-10">
          {LEVELS.map((l) => (
            <div key={l.id} className={`flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br ${accentGrad[l.accent]} text-white`}>
              <span className="font-display text-sm font-bold">{l.id}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NavTile({ icon, label, sub, color, onClick }: { icon: React.ReactNode; label: string; sub: string; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="card flex flex-col items-start gap-2 p-5 text-left transition hover:shadow-soft">
      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${color}`}>{icon}</div>
      <div>
        <p className="font-display text-sm font-bold text-ink-900">{label}</p>
        <p className="text-xs text-ink-500">{sub}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-ink-300" />
    </button>
  );
}

function CreateTile({ icon, label, color, onClick }: { icon: React.ReactNode; label: string; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="card flex flex-col items-center gap-2 p-4 text-center transition hover:shadow-soft">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>{icon}</div>
      <span className="text-xs font-bold text-ink-800">{label}</span>
    </button>
  );
}

function EmptyState({ text, action }: { text: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <p className="text-sm text-ink-400">{text}</p>
      {action}
    </div>
  );
}
