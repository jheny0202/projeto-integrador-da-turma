import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, FileText, ClipboardList, Star, Trash2, Loader2, ChevronRight } from 'lucide-react';
import { useApp } from '@/store';
import { fetchTeacherActivities, fetchTeacherFlashcards, fetchTeacherClinicalCases, deleteActivity, deleteFlashcard, deleteClinicalCase } from '@/lib/api';
import type { ActivityRow, FlashcardRow, ClinicalCaseRow } from '@/lib/api';

type Tab = 'activities' | 'flashcards' | 'cases';

export function TeacherContentPage() {
  const { user, navigate } = useApp();
  const [tab, setTab] = useState<Tab>('activities');
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [flashcards, setFlashcards] = useState<FlashcardRow[]>([]);
  const [cases, setCases] = useState<ClinicalCaseRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [a, f, c] = await Promise.all([
        fetchTeacherActivities(user.id).catch(() => []),
        fetchTeacherFlashcards(user.id).catch(() => []),
        fetchTeacherClinicalCases(user.id).catch(() => []),
      ]);
      setActivities(a); setFlashcards(f); setCases(c);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [user]);

  const handleDeleteActivity = async (id: string) => {
    if (!confirm('Excluir esta atividade?')) return;
    try { await deleteActivity(id); await load(); } catch (e: any) { alert(e.message); }
  };
  const handleDeleteFlashcard = async (id: string) => {
    if (!confirm('Excluir este flashcard?')) return;
    try { await deleteFlashcard(id); await load(); } catch (e: any) { alert(e.message); }
  };
  const handleDeleteCase = async (id: string) => {
    if (!confirm('Excluir este caso clínico?')) return;
    try { await deleteClinicalCase(id); await load(); } catch (e: any) { alert(e.message); }
  };

  return (
    <div className="space-y-5">
      <button onClick={() => navigate({ name: 'teacher' })} className="flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> Área do professor
      </button>

      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Gerenciar conteúdo</h1>
        <p className="mt-1 text-sm text-ink-500">Crie e gerencie atividades, questões, flashcards e casos clínicos.</p>
      </div>

      {/* tabs */}
      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-ink-100 p-1">
        {([['activities', 'Atividades'], ['flashcards', 'Flashcards'], ['cases', 'Casos clínicos']] as [Tab, string][]).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-xl py-2.5 text-sm font-semibold transition ${tab === t ? 'bg-white text-ink-900 shadow-soft' : 'text-ink-500'}`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div>
      ) : (
        <>
          {tab === 'activities' && (
            <div className="space-y-3">
              <button onClick={() => navigate({ name: 'teacher-create-activity' })} className="btn-primary w-full py-3.5"><Plus className="h-5 w-5" /> Nova atividade</button>
              {activities.length === 0 ? (
                <EmptyBox icon={<FileText />} text="Nenhuma atividade criada." />
              ) : (
                activities.map((a) => (
                  <div key={a.id} className="card flex items-center gap-3 p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700"><FileText className="h-5 w-5" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink-900">{a.title}</p>
                      <p className="truncate text-xs text-ink-500">{a.activity_type} · {a.points} pts · {a.difficulty}</p>
                    </div>
                    <button onClick={() => handleDeleteActivity(a.id)} className="btn-ghost p-2 text-error-600 hover:bg-error-50"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'flashcards' && (
            <div className="space-y-3">
              <button onClick={() => navigate({ name: 'teacher-create-flashcard' })} className="btn-primary w-full py-3.5"><Plus className="h-5 w-5" /> Novo flashcard</button>
              {flashcards.length === 0 ? (
                <EmptyBox icon={<ClipboardList />} text="Nenhum flashcard criado." />
              ) : (
                flashcards.map((f) => (
                  <div key={f.id} className="card flex items-center gap-3 p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ocean-100 text-ocean-700"><ClipboardList className="h-5 w-5" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink-900">{f.front}</p>
                      <p className="truncate text-xs text-ink-500">{f.category}</p>
                    </div>
                    <button onClick={() => handleDeleteFlashcard(f.id)} className="btn-ghost p-2 text-error-600 hover:bg-error-50"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'cases' && (
            <div className="space-y-3">
              <button onClick={() => navigate({ name: 'teacher-create-case' })} className="btn-primary w-full py-3.5"><Plus className="h-5 w-5" /> Novo caso clínico</button>
              {cases.length === 0 ? (
                <EmptyBox icon={<Star />} text="Nenhum caso clínico criado." />
              ) : (
                cases.map((c) => (
                  <div key={c.id} className="card flex items-center gap-3 p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-warning-100 text-warning-700"><Star className="h-5 w-5" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink-900">{c.title}</p>
                      <p className="truncate text-xs text-ink-500">{c.points} pts · {c.difficulty}</p>
                    </div>
                    <button onClick={() => handleDeleteCase(c.id)} className="btn-ghost p-2 text-error-600 hover:bg-error-50"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EmptyBox({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="card flex flex-col items-center justify-center p-10 text-center">
      <div className="text-ink-300">{icon}</div>
      <p className="mt-3 text-sm text-ink-400">{text}</p>
    </div>
  );
}
