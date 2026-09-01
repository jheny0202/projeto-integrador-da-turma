import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Users, Pencil, Trash2, Power, X, Loader2, AlertCircle, Check } from 'lucide-react';
import { useApp } from '@/store';
import { fetchClasses, createClass, updateClass, deleteClass, fetchStudentsInClass } from '@/lib/api';
import type { ClassRow, ProfileRow } from '@/lib/api';
import { ProgressBar } from '@/components/ui';

export function TeacherClassesPage() {
  const { user, navigate, refreshClasses } = useApp();
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ClassRow | null>(null);
  const [studentsByClass, setStudentsByClass] = useState<Record<string, ProfileRow[]>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const cls = await fetchClasses();
      setClasses(cls);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [user]);

  const toggleExpand = async (classId: string) => {
    if (expanded === classId) { setExpanded(null); return; }
    setExpanded(classId);
    if (!studentsByClass[classId]) {
      try {
        const students = await fetchStudentsInClass(classId);
        setStudentsByClass((prev) => ({ ...prev, [classId]: students }));
      } catch { setStudentsByClass((prev) => ({ ...prev, [classId]: [] })); }
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir a turma "${name}"? Os alunos vinculados ficarão sem turma.`)) return;
    try {
      await deleteClass(id);
      await load();
      await refreshClasses();
    } catch (err: any) {
      alert('Erro ao excluir: ' + err.message);
    }
  };

  const toggleActive = async (cls: ClassRow) => {
    try {
      await updateClass(cls.id, { is_active: !cls.is_active });
      await load();
      await refreshClasses();
    } catch (err: any) {
      alert('Erro: ' + err.message);
    }
  };

  return (
    <div className="space-y-5">
      <button onClick={() => navigate({ name: 'teacher' })} className="flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> Área do professor
      </button>

      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Gerenciar turmas</h1>
          <p className="mt-1 text-sm text-ink-500">Crie e gerencie as turmas dos alunos.</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary px-4 py-2.5 text-sm">
          <Plus className="h-4 w-4" /> Criar turma
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div>
      ) : classes.length === 0 ? (
        <div className="card p-10 text-center">
          <Users className="mx-auto h-12 w-12 text-ink-300" />
          <p className="mt-3 text-sm font-semibold text-ink-600">Nenhuma turma criada ainda.</p>
          <p className="text-xs text-ink-400">Crie sua primeira turma para que os alunos possam selecioná-la ao se cadastrar.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {classes.map((cls) => {
            const students = studentsByClass[cls.id] ?? [];
            const isExpanded = expanded === cls.id;
            return (
              <div key={cls.id} className="card overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                  <button onClick={() => toggleExpand(cls.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink-900">{cls.name}</p>
                      <p className="truncate text-xs text-ink-500">{cls.semester ?? 'Sem semestre'} · {students.length || '...'} aluno(s)</p>
                    </div>
                  </button>
                  <span className={`chip ${cls.is_active ? 'bg-success-100 text-success-700' : 'bg-ink-100 text-ink-500'}`}>{cls.is_active ? 'Ativa' : 'Inativa'}</span>
                  <button onClick={() => toggleActive(cls)} className="btn-ghost p-2" title={cls.is_active ? 'Desativar' : 'Ativar'}>
                    <Power className="h-4 w-4" />
                  </button>
                  <button onClick={() => { setEditing(cls); setShowForm(true); }} className="btn-ghost p-2"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(cls.id, cls.name)} className="btn-ghost p-2 text-error-600 hover:bg-error-50"><Trash2 className="h-4 w-4" /></button>
                </div>
                {cls.description && <p className="px-4 pb-2 text-xs text-ink-500">{cls.description}</p>}
                {isExpanded && (
                  <div className="border-t border-ink-100 p-4 animate-fade-in">
                    <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">Alunos da turma</h4>
                    {students.length === 0 ? (
                      <p className="text-sm text-ink-400">Nenhum aluno vinculado a esta turma.</p>
                    ) : (
                      <div className="space-y-2">
                        {students.map((s) => (
                          <div key={s.id} className="flex items-center gap-3 rounded-xl bg-ink-50 p-3">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${s.avatar_color} text-xs font-bold text-white`}>{s.name.charAt(0)}</div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-ink-900">{s.name}</p>
                              <p className="truncate text-xs text-ink-500">Nível {s.level} · {s.xp} XP</p>
                            </div>
                            <ProgressBar value={Math.min(100, (s.xp / 5300) * 100)} className="w-20 h-1.5" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <ClassFormModal
          editing={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={async () => { setShowForm(false); setEditing(null); await load(); await refreshClasses(); }}
        />
      )}
    </div>
  );
}

function ClassFormModal({ editing, onClose, onSaved }: { editing: ClassRow | null; onClose: () => void; onSaved: () => void }) {
  const { user } = useApp();
  const [name, setName] = useState(editing?.name ?? '');
  const [description, setDescription] = useState(editing?.description ?? '');
  const [semester, setSemester] = useState(editing?.semester ?? '');
  const [isActive, setIsActive] = useState(editing?.is_active ?? true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Nome da turma é obrigatório.'); return; }
    if (!user) return;
    setBusy(true);
    setError('');
    try {
      if (editing) {
        await updateClass(editing.id, { name: name.trim(), description: description.trim() || null, semester: semester.trim() || null, is_active: isActive });
      } else {
        await createClass(name.trim(), description.trim(), semester.trim(), user.id);
      }
      onSaved();
    } catch (err: any) {
      setError(err.message);
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/50 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-float animate-slide-up sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink-900">{editing ? 'Editar turma' : 'Criar turma'}</h2>
          <button onClick={onClose} className="btn-ghost p-2"><X className="h-5 w-5" /></button>
        </div>
        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-2xl bg-error-50 p-3 ring-1 ring-error-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-error-600" />
            <p className="text-sm font-semibold text-error-700">{error}</p>
          </div>
        )}
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="label">Nome da turma *</label>
            <input className="input" placeholder="Ex: Turma 72" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">Descrição (opcional)</label>
            <input className="input" placeholder="Ex: Técnico em Enfermagem — manhã" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="label">Semestre/Ano (opcional)</label>
            <input className="input" placeholder="Ex: 2026.1" value={semester} onChange={(e) => setSemester(e.target.value)} />
          </div>
          <label className="flex items-center gap-3 rounded-2xl bg-ink-50 p-3">
            <button type="button" onClick={() => setIsActive(!isActive)} className={`relative h-6 w-11 rounded-full transition ${isActive ? 'bg-primary-600' : 'bg-ink-300'}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${isActive ? 'left-5' : 'left-0.5'}`} />
            </button>
            <span className="text-sm font-semibold text-ink-700">Turma ativa</span>
          </label>
          <button type="submit" disabled={busy} className="btn-primary w-full py-3.5">
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Check className="h-5 w-5" /> {editing ? 'Salvar alterações' : 'Criar turma'}</>}
          </button>
        </form>
      </div>
    </div>
  );
}
