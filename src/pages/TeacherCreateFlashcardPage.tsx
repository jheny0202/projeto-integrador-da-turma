import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, AlertCircle, Check, ClipboardList } from 'lucide-react';
import { useApp } from '@/store';
import { fetchClasses, createFlashcard, assignFlashcardToClasses } from '@/lib/api';
import type { ClassRow } from '@/lib/api';
import { ClassAssignSelector } from '@/components/ClassAssignSelector';

const CATEGORIES = ['Sinais e sintomas', 'Terminologias', 'Sinais vitais', 'Procedimentos', 'Comunicação', 'Registros de enfermagem'];
const DIFFICULTIES = [{ value: 'easy', label: 'Fácil' }, { value: 'medium', label: 'Médio' }, { value: 'hard', label: 'Difícil' }];

export function TeacherCreateFlashcardPage() {
  const { user, navigate } = useApp();
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [category, setCategory] = useState('Terminologias');
  const [difficulty, setDifficulty] = useState('medium');
  const [explanation, setExplanation] = useState('');
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => { fetchClasses().then(setClasses).catch(() => {}); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!front.trim() || !back.trim()) { setError('Frente e verso são obrigatórios.'); return; }
    setBusy(true); setError('');
    try {
      const fc = await createFlashcard({
        front: front.trim(), back: back.trim(), category, difficulty,
        explanation: explanation.trim() || null, teacher_id: user.id,
      });
      await assignFlashcardToClasses(fc.id, selectedClasses);
      setDone(true);
      setFront(''); setBack(''); setExplanation(''); setSelectedClasses([]);
    } catch (err: any) { setError(err.message); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-5">
      <button onClick={() => navigate({ name: 'teacher-content' })} className="flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> Gerenciar conteúdo
      </button>
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Criar flashcard</h1>
        <p className="mt-1 text-sm text-ink-500">Crie um flashcard e atribua a turmas.</p>
      </div>

      {done && (
        <div className="flex items-start gap-2 rounded-2xl bg-success-50 p-4 ring-1 ring-success-200 animate-fade-in">
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-success-600" />
          <div>
            <p className="text-sm font-bold text-success-700">Flashcard criado e atribuído!</p>
            <p className="text-xs text-success-600">Crie outro ou volte para gerenciar conteúdo.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-2xl bg-error-50 p-3 ring-1 ring-error-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-error-600" />
          <p className="text-sm font-semibold text-error-700">{error}</p>
        </div>
      )}

      <form onSubmit={save} className="card space-y-4 p-5">
        <div>
          <label className="label">Frente (pergunta) *</label>
          <textarea className="input min-h-[60px]" placeholder="Ex: O que significa 'eupneico'?" value={front} onChange={(e) => setFront(e.target.value)} />
        </div>
        <div>
          <label className="label">Verso (resposta) *</label>
          <textarea className="input min-h-[60px]" placeholder="Ex: Respiração dentro do padrão esperado." value={back} onChange={(e) => setBack(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Categoria</label>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Dificuldade</label>
            <select className="input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              {DIFFICULTIES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Explicação (opcional)</label>
          <input className="input" placeholder="Contexto adicional..." value={explanation} onChange={(e) => setExplanation(e.target.value)} />
        </div>
        <ClassAssignSelector classes={classes} selected={selectedClasses} onChange={setSelectedClasses} />
        <button type="submit" disabled={busy} className="btn-primary w-full py-3.5">
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Check className="h-5 w-5" /> Criar flashcard</>}
        </button>
      </form>
    </div>
  );
}
