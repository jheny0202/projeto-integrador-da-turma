import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, AlertCircle, Check, Star, Plus, Trash2 } from 'lucide-react';
import { useApp } from '@/store';
import { fetchClasses, createClinicalCase, assignClinicalCaseToClasses } from '@/lib/api';
import type { ClassRow } from '@/lib/api';
import { ClassAssignSelector } from '@/components/ClassAssignSelector';

const DIFFICULTIES = [{ value: 'easy', label: 'Fácil' }, { value: 'medium', label: 'Médio' }, { value: 'hard', label: 'Difícil' }];

export function TeacherCreateCasePage() {
  const { user, navigate } = useApp();
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [title, setTitle] = useState('');
  const [scenario, setScenario] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number | ''>('');
  const [patientInfo, setPatientInfo] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [vitals, setVitals] = useState('');
  const [relevantInfo, setRelevantInfo] = useState('');
  const [modelAnswer, setModelAnswer] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [topic, setTopic] = useState('');
  const [points, setPoints] = useState(200);
  const [levelId, setLevelId] = useState(9);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [questions, setQuestions] = useState<{ id: string; text: string; placeholder: string }[]>([
    { id: 'q1', text: 'Quais informações são importantes neste caso?', placeholder: 'Liste os dados relevantes...' },
  ]);
  const [rubric, setRubric] = useState<{ criterion: string; description: string }[]>([
    { criterion: 'Clareza', description: 'Texto compreensível e organizado.' },
  ]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => { fetchClasses().then(setClasses).catch(() => {}); }, []);

  const addQuestion = () => setQuestions((prev) => [...prev, { id: `q${prev.length + 1}-${Date.now()}`, text: '', placeholder: 'Resposta do aluno...' }]);
  const removeQuestion = (id: string) => setQuestions((prev) => prev.filter((q) => q.id !== id));
  const addRubric = () => setRubric((prev) => [...prev, { criterion: '', description: '' }]);
  const removeRubric = (idx: number) => setRubric((prev) => prev.filter((_, i) => i !== idx));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!title.trim() || !scenario.trim()) { setError('Título e cenário são obrigatórios.'); return; }
    if (questions.length === 0) { setError('Adicione pelo menos uma questão.'); return; }
    setBusy(true); setError('');
    try {
      const vitalsArray = vitals.trim() ? vitals.split('\n').map((line) => {
        const [label, value] = line.split(':').map((s) => s.trim());
        return { label: label || '', value: value || '' };
      }).filter((v) => v.label) : null;

      const cc = await createClinicalCase({
        title: title.trim(),
        scenario: scenario.trim(),
        patient_name: patientName.trim() || null,
        patient_age: patientAge || null,
        patient_info: patientInfo.trim() || null,
        symptoms: symptoms.trim() || null,
        vitals: vitalsArray,
        relevant_info: relevantInfo.trim() || null,
        questions: questions.filter((q) => q.text.trim()) as any,
        rubric: rubric.filter((r) => r.criterion.trim()) as any,
        model_answer: modelAnswer.trim() || null,
        difficulty,
        topic: topic.trim() || null,
        points,
        level_id: levelId,
        teacher_id: user.id,
      });
      await assignClinicalCaseToClasses(cc.id, selectedClasses);
      setDone(true);
    } catch (err: any) { setError(err.message); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-5">
      <button onClick={() => navigate({ name: 'teacher-content' })} className="flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> Gerenciar conteúdo
      </button>
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Novo caso clínico</h1>
        <p className="mt-1 text-sm text-ink-500">Crie um caso educacional fictício para os alunos.</p>
      </div>
      <p className="rounded-2xl bg-warning-50 p-3 text-xs font-semibold text-warning-700 ring-1 ring-warning-200">
        Todos os casos são educacionais e fictícios. Não use dados reais de pacientes.
      </p>

      {done && (
        <div className="flex items-start gap-2 rounded-2xl bg-success-50 p-4 ring-1 ring-success-200 animate-fade-in">
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-success-600" />
          <div>
            <p className="text-sm font-bold text-success-700">Caso clínico criado e atribuído!</p>
            <button onClick={() => navigate({ name: 'teacher-content' })} className="text-xs font-bold text-success-700 underline">Voltar para conteúdo</button>
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
          <label className="label">Título do caso *</label>
          <input className="input" placeholder="Ex: Dor abdominal na internação" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="label">Cenário clínico *</label>
          <textarea className="input min-h-[80px]" placeholder="Descreva o contexto..." value={scenario} onChange={(e) => setScenario(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Nome do paciente (fictício)</label>
            <input className="input" placeholder="Ex: João S." value={patientName} onChange={(e) => setPatientName(e.target.value)} />
          </div>
          <div>
            <label className="label">Idade</label>
            <input type="number" className="input" placeholder="67" value={patientAge} onChange={(e) => setPatientAge(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
        </div>
        <div>
          <label className="label">Informações do paciente</label>
          <input className="input" placeholder="Consciente, orientado..." value={patientInfo} onChange={(e) => setPatientInfo(e.target.value)} />
        </div>
        <div>
          <label className="label">Sinais e sintomas</label>
          <input className="input" placeholder="Dor abdominal, náusea..." value={symptoms} onChange={(e) => setSymptoms(e.target.value)} />
        </div>
        <div>
          <label className="label">Sinais vitais (um por linha, formato: Rótulo: Valor)</label>
          <textarea className="input min-h-[80px]" placeholder={'PA: 138x82 mmHg\nFC: 92 bpm\nFR: 20 irpm'} value={vitals} onChange={(e) => setVitals(e.target.value)} />
        </div>
        <div>
          <label className="label">Informações relevantes</label>
          <input className="input" placeholder="Alergias, medicações..." value={relevantInfo} onChange={(e) => setRelevantInfo(e.target.value)} />
        </div>

        {/* Questions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-ink-900">Questões do caso</p>
            <button type="button" onClick={addQuestion} className="btn-ghost text-sm text-primary-600"><Plus className="h-4 w-4" /> Adicionar</button>
          </div>
          {questions.map((q, i) => (
            <div key={q.id} className="flex items-start gap-2">
              <span className="mt-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-xs font-bold text-primary-700">{i + 1}</span>
              <input className="input flex-1" placeholder="Enunciado da questão..." value={q.text} onChange={(e) => setQuestions((prev) => prev.map((x) => x.id === q.id ? { ...x, text: e.target.value } : x))} />
              <button type="button" onClick={() => removeQuestion(q.id)} className="btn-ghost p-2 text-error-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>

        {/* Rubric */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-ink-900">Critérios de avaliação</p>
            <button type="button" onClick={addRubric} className="btn-ghost text-sm text-primary-600"><Plus className="h-4 w-4" /> Adicionar</button>
          </div>
          {rubric.map((r, i) => (
            <div key={i} className="flex items-start gap-2">
              <input className="input w-32" placeholder="Critério" value={r.criterion} onChange={(e) => setRubric((prev) => prev.map((x, j) => j === i ? { ...x, criterion: e.target.value } : x))} />
              <input className="input flex-1" placeholder="Descrição" value={r.description} onChange={(e) => setRubric((prev) => prev.map((x, j) => j === i ? { ...x, description: e.target.value } : x))} />
              <button type="button" onClick={() => removeRubric(i)} className="btn-ghost p-2 text-error-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>

        <div>
          <label className="label">Resposta modelo (opcional)</label>
          <textarea className="input min-h-[80px]" placeholder="Exemplo de resposta ideal..." value={modelAnswer} onChange={(e) => setModelAnswer(e.target.value)} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="label">Dificuldade</label>
            <select className="input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              {DIFFICULTIES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">XP</label>
            <input type="number" className="input" value={points} onChange={(e) => setPoints(Number(e.target.value))} />
          </div>
          <div>
            <label className="label">Nível</label>
            <input type="number" min={1} max={10} className="input" value={levelId} onChange={(e) => setLevelId(Number(e.target.value))} />
          </div>
        </div>
        <div>
          <label className="label">Tópico</label>
          <input className="input" placeholder="Ex: Avaliação clínica" value={topic} onChange={(e) => setTopic(e.target.value)} />
        </div>

        <ClassAssignSelector classes={classes} selected={selectedClasses} onChange={setSelectedClasses} />
        <button type="submit" disabled={busy} className="btn-primary w-full py-3.5">
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Star className="h-5 w-5" /> Criar caso clínico</>}
        </button>
      </form>
    </div>
  );
}
