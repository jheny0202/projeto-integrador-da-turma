import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, AlertCircle, Check, Plus, Trash2, FileText } from 'lucide-react';
import { useApp } from '@/store';
import { fetchTeacherActivities, createQuestion, fetchQuestionsForActivity, deleteQuestion } from '@/lib/api';
import type { ActivityRow, QuestionRow } from '@/lib/api';

export function TeacherCreateQuestionPage() {
  const { user, navigate } = useApp();
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchTeacherActivities(user.id).then((a) => { setActivities(a); setLoading(false); }).catch(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (selectedActivity) {
      fetchQuestionsForActivity(selectedActivity).then(setQuestions).catch(() => setQuestions([]));
    } else { setQuestions([]); }
  }, [selectedActivity]);

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta questão?')) return;
    try { await deleteQuestion(id); setQuestions((prev) => prev.filter((q) => q.id !== id)); } catch (e: any) { alert(e.message); }
  };

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div>;

  return (
    <div className="space-y-5">
      <button onClick={() => navigate({ name: 'teacher-content' })} className="flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> Gerenciar conteúdo
      </button>
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Criar pergunta</h1>
        <p className="mt-1 text-sm text-ink-500">Selecione uma atividade e adicione questões.</p>
      </div>

      {activities.length === 0 ? (
        <div className="card flex flex-col items-center justify-center p-10 text-center">
          <FileText className="h-12 w-12 text-ink-300" />
          <p className="mt-3 text-sm font-semibold text-ink-600">Nenhuma atividade criada ainda.</p>
          <p className="text-xs text-ink-400">Crie uma atividade primeiro para poder adicionar questões.</p>
          <button onClick={() => navigate({ name: 'teacher-create-activity' })} className="btn-primary mt-3 text-sm">Criar atividade</button>
        </div>
      ) : (
        <>
          <div>
            <label className="label">Atividade</label>
            <select className="input" value={selectedActivity} onChange={(e) => setSelectedActivity(e.target.value)}>
              <option value="">Selecione uma atividade...</option>
              {activities.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
            </select>
          </div>

          {selectedActivity && (
            <>
              {questions.length > 0 && (
                <div className="space-y-2">
                  <h2 className="section-title">Questões existentes</h2>
                  {questions.map((q, i) => (
                    <div key={q.id} className="card flex items-center gap-3 p-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-sm font-bold text-primary-700">{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink-900">{q.question_text}</p>
                        <p className="text-xs text-ink-500">{q.question_type} · {q.points} pts · Resp: {q.correct_answer}</p>
                      </div>
                      <button onClick={() => handleDelete(q.id)} className="btn-ghost p-2 text-error-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              )}
              <QuestionForm activityId={selectedActivity} onCreated={(q) => setQuestions((prev) => [...prev, q])} />
            </>
          )}
        </>
      )}
    </div>
  );
}

function QuestionForm({ activityId, onCreated }: { activityId: string; onCreated: (q: QuestionRow) => void }) {
  const [text, setText] = useState('');
  const [type, setType] = useState('multiple-choice');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correct, setCorrect] = useState('A');
  const [explanation, setExplanation] = useState('');
  const [points, setPoints] = useState(10);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) { alert('Escreva o enunciado.'); return; }
    setBusy(true);
    try {
      let opts: any[] | null = null;
      let correctAnswer = correct;
      if (type === 'multiple-choice') {
        opts = options.map((o, i) => ({ id: String.fromCharCode(65 + i), text: o.trim() })).filter((o) => o.text);
        correctAnswer = correct;
      } else if (type === 'true-false') {
        correctAnswer = correct === 'A' ? 'Verdadeiro' : 'Falso';
      }
      const created = await createQuestion({
        activity_id: activityId,
        question_text: text.trim(),
        question_type: type,
        options: opts as any,
        correct_answer: correctAnswer,
        explanation: explanation.trim() || null,
        difficulty: 'medium',
        points,
      });
      onCreated(created);
      setText(''); setOptions(['', '', '', '']); setExplanation(''); setCorrect('A');
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
          {options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            return (
              <div key={i} className="flex items-center gap-2">
                <button type="button" onClick={() => setCorrect(letter)} className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition ${correct === letter ? 'bg-success-600 text-white' : 'bg-ink-100 text-ink-500'}`}>{letter}</button>
                <input className="input" placeholder={`Alternativa ${letter}`} value={opt} onChange={(e) => setOptions((prev) => prev.map((o, j) => j === i ? e.target.value : o))} />
              </div>
            );
          })}
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
        <input className="input" placeholder="Feedback..." value={explanation} onChange={(e) => setExplanation(e.target.value)} />
      </div>
      <button type="submit" disabled={busy} className="btn-primary w-full py-3">
        {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Check className="h-5 w-5" /> Adicionar questão</>}
      </button>
    </form>
  );
}
