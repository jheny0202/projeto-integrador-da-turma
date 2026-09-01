import { useState, useEffect } from 'react';
import { ArrowLeft, X, Loader2, AlertCircle, Check, Plus, Trash2 } from 'lucide-react';
import { useApp } from '@/store';
import { fetchClasses, createActivity, assignActivityToClasses, createQuestion, fetchQuestionsForActivity, deleteQuestion } from '@/lib/api';
import type { ClassRow, QuestionRow } from '@/lib/api';
import { ClassAssignSelector } from '@/components/ClassAssignSelector';

const ACTIVITY_TYPES = [
  { value: 'multiple-choice', label: 'Múltipla escolha' },
  { value: 'true-false', label: 'Verdadeiro ou falso' },
  { value: 'fill-blank', label: 'Complete a frase' },
];

const DIFFICULTIES = [
  { value: 'easy', label: 'Fácil' },
  { value: 'medium', label: 'Médio' },
  { value: 'hard', label: 'Difícil' },
];

export function TeacherCreateActivityPage() {
  const { user, navigate } = useApp();
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [points, setPoints] = useState(50);
  const [estimatedMinutes, setEstimatedMinutes] = useState(15);
  const [activityType, setActivityType] = useState('multiple-choice');
  const [levelId, setLevelId] = useState(1);
  const [status, setStatus] = useState('active');
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);

  useEffect(() => { fetchClasses().then(setClasses).catch(() => {}); }, []);

  // Load questions after activity is created
  useEffect(() => {
    if (createdId) fetchQuestionsForActivity(createdId).then(setQuestions).catch(() => {});
  }, [createdId]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!title.trim()) { setError('Título é obrigatório.'); return; }
    setBusy(true); setError('');
    try {
      const activity = await createActivity({
        title: title.trim(),
        description: description.trim() || null,
        subject: subject.trim() || null,
        difficulty,
        points,
        estimated_minutes: estimatedMinutes || null,
        status,
        activity_type: activityType,
        level_id: levelId,
        teacher_id: user.id,
      });
      await assignActivityToClasses(activity.id, selectedClasses);
      setCreatedId(activity.id);
    } catch (err: any) { setError(err.message); } finally { setBusy(false); }
  };

  const addQuestion = async (q: Partial<QuestionRow>) => {
    if (!createdId) return;
    try {
      const created = await createQuestion({ ...q, activity_id: createdId } as any);
      setQuestions((prev) => [...prev, created]);
    } catch (e: any) { alert(e.message); }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Excluir esta questão?')) return;
    try { await deleteQuestion(id); setQuestions((prev) => prev.filter((q) => q.id !== id)); } catch (e: any) { alert(e.message); }
  };

  return (
    <div className="space-y-5">
      <button onClick={() => navigate({ name: 'teacher-content' })} className="flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> Gerenciar conteúdo
      </button>
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Criar atividade</h1>
        <p className="mt-1 text-sm text-ink-500">Crie uma atividade e adicione questões a ela.</p>
      </div>

      {createdId && (
        <div className="flex items-start gap-2 rounded-2xl bg-success-50 p-4 ring-1 ring-success-200">
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-success-600" />
          <div>
            <p className="text-sm font-bold text-success-700">Atividade criada com sucesso!</p>
            <p className="text-xs text-success-600">Agora você pode adicionar questões abaixo. A atividade já está atribuída às turmas selecionadas.</p>
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
          <label className="label">Título *</label>
          <input className="input" placeholder="Ex: Identificar sinais vitais" value={title} onChange={(e) => setTitle(e.target.value)} disabled={!!createdId} />
        </div>
        <div>
          <label className="label">Descrição / Instruções</label>
          <textarea className="input min-h-[80px]" placeholder="Instruções para o aluno..." value={description} onChange={(e) => setDescription(e.target.value)} disabled={!!createdId} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Tipo</label>
            <select className="input" value={activityType} onChange={(e) => setActivityType(e.target.value)} disabled={!!createdId}>
              {ACTIVITY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Dificuldade</label>
            <select className="input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} disabled={!!createdId}>
              {DIFFICULTIES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Recompensa XP</label>
            <input type="number" className="input" value={points} onChange={(e) => setPoints(Number(e.target.value))} disabled={!!createdId} />
          </div>
          <div>
            <label className="label">Tempo estimado (min)</label>
            <input type="number" className="input" value={estimatedMinutes} onChange={(e) => setEstimatedMinutes(Number(e.target.value))} disabled={!!createdId} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Nível</label>
            <input type="number" min={1} max={10} className="input" value={levelId} onChange={(e) => setLevelId(Number(e.target.value))} disabled={!!createdId} />
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value)} disabled={!!createdId}>
              <option value="active">Publicado</option>
              <option value="inactive">Rascunho</option>
            </select>
          </div>
        </div>
        <div>
          <label className="label">Tópico / Disciplina</label>
          <input className="input" placeholder="Ex: Sinais vitais" value={subject} onChange={(e) => setSubject(e.target.value)} disabled={!!createdId} />
        </div>
        <ClassAssignSelector classes={classes} selected={selectedClasses} onChange={setSelectedClasses} />
        {!createdId && (
          <button type="submit" disabled={busy} className="btn-primary w-full py-3.5">
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Check className="h-5 w-5" /> Criar atividade</>}
          </button>
        )}
      </form>

      {createdId && (
        <div className="space-y-3">
          <h2 className="section-title">Questões da atividade</h2>
          {questions.length > 0 && (
            <div className="space-y-2">
              {questions.map((q, i) => (
                <div key={q.id} className="card flex items-center gap-3 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-sm font-bold text-primary-700">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink-900">{q.question_text}</p>
                    <p className="text-xs text-ink-500">{q.question_type} · {q.points} pts · Resp: {q.correct_answer}</p>
                  </div>
                  <button onClick={() => handleDeleteQuestion(q.id)} className="btn-ghost p-2 text-error-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          )}
          <QuestionForm onCreate={addQuestion} />
          <button onClick={() => navigate({ name: 'teacher-content' })} className="btn-secondary w-full py-3">Concluir</button>
        </div>
      )}
    </div>
  );
}

function QuestionForm({ onCreate }: { onCreate: (q: Partial<QuestionRow>) => Promise<void> }) {
  const [text, setText] = useState('');
  const [type, setType] = useState('multiple-choice');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correct, setCorrect] = useState('A');
  const [explanation, setExplanation] = useState('');
  const [points, setPoints] = useState(10);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) { alert('Escreva o enunciado da questão.'); return; }
    setBusy(true);
    try {
      let options: any[] | null = null;
      let correctAnswer = correct;
      if (type === 'multiple-choice') {
        options = [
          { id: 'A', text: optionA.trim() },
          { id: 'B', text: optionB.trim() },
          { id: 'C', text: optionC.trim() },
          { id: 'D', text: optionD.trim() },
        ].filter((o) => o.text);
        correctAnswer = correct;
      } else if (type === 'true-false') {
        correctAnswer = correct === 'A' ? 'Verdadeiro' : 'Falso';
      }
      await onCreate({
        question_text: text.trim(),
        question_type: type,
        options: options ? JSON.stringify(options) as any : null,
        correct_answer: correctAnswer,
        explanation: explanation.trim() || null,
        difficulty: 'medium',
        points,
      });
      setText(''); setOptionA(''); setOptionB(''); setOptionC(''); setOptionD(''); setExplanation(''); setCorrect('A');
    } catch (e: any) { alert(e.message); } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="card space-y-3 p-5">
      <div className="flex items-center gap-2 text-sm font-bold text-ink-900"><Plus className="h-4 w-4" /> Nova questão</div>
      <div>
        <label className="label">Enunciado *</label>
        <textarea className="input min-h-[60px]" placeholder="Escreva a pergunta..." value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Tipo</label>
          <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="multiple-choice">Múltipla escolha</option>
            <option value="true-false">Verdadeiro/Falso</option>
            <option value="fill-blank">Complete a frase</option>
          </select>
        </div>
        <div>
          <label className="label">Pontos</label>
          <input type="number" className="input" value={points} onChange={(e) => setPoints(Number(e.target.value))} />
        </div>
      </div>
      {type === 'multiple-choice' && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-ink-500">Alternativas (marque a correta):</p>
          {(['A', 'B', 'C', 'D'] as const).map((letter) => (
            <div key={letter} className="flex items-center gap-2">
              <button type="button" onClick={() => setCorrect(letter)} className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition ${correct === letter ? 'bg-success-600 text-white' : 'bg-ink-100 text-ink-500'}`}>{letter}</button>
              <input className="input" placeholder={`Alternativa ${letter}`} value={letter === 'A' ? optionA : letter === 'B' ? optionB : letter === 'C' ? optionC : optionD} onChange={(e) => { if (letter === 'A') setOptionA(e.target.value); else if (letter === 'B') setOptionB(e.target.value); else if (letter === 'C') setOptionC(e.target.value); else setOptionD(e.target.value); }} />
            </div>
          ))}
        </div>
      )}
      {type === 'true-false' && (
        <div>
          <label className="label">Resposta correta</label>
          <select className="input" value={correct} onChange={(e) => setCorrect(e.target.value)}>
            <option value="A">Verdadeiro</option>
            <option value="B">Falso</option>
          </select>
        </div>
      )}
      {type === 'fill-blank' && (
        <div>
          <label className="label">Resposta correta</label>
          <input className="input" placeholder="Palavra correta" value={correct} onChange={(e) => setCorrect(e.target.value)} />
        </div>
      )}
      <div>
        <label className="label">Explicação (opcional)</label>
        <input className="input" placeholder="Feedback para o aluno..." value={explanation} onChange={(e) => setExplanation(e.target.value)} />
      </div>
      <button type="submit" disabled={busy} className="btn-primary w-full py-3">
        {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Plus className="h-5 w-5" /> Adicionar questão</>}
      </button>
    </form>
  );
}
