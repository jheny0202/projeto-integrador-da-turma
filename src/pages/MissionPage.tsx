import { useState } from 'react';
import { ArrowLeft, Zap, Heart, Activity, Thermometer, Droplet, Gauge, User, Send, Star } from 'lucide-react';
import { useApp } from '@/store';
import { MISSIONS } from '@/data';

const vitalIcon: Record<string, typeof Heart> = {
  'PA': Gauge, 'FC': Heart, 'FR': Activity, 'SpO₂': Droplet, 'T': Thermometer,
};

export function MissionPage() {
  const { navigate } = useApp();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const mission = MISSIONS[0];

  const allAnswered = mission.questions.every((q) => (answers[q.id] ?? '').trim().length > 0);

  return (
    <div className="space-y-5">
      <button onClick={() => navigate({ name: 'challenges' })} className="flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> Desafios
      </button>

      {/* header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-600 to-accent-800 p-5 text-white shadow-card">
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="chip bg-white/15 text-white ring-1 ring-white/20"><Star className="h-3 w-3" /> Missão clínica</span>
            <span className="chip bg-white/15 text-white ring-1 ring-white/20"><Zap className="h-3 w-3" /> {mission.rewardXp} XP</span>
          </div>
          <h1 className="mt-3 font-display text-xl font-bold sm:text-2xl">{mission.title}</h1>
        </div>
      </div>

      {/* scenario */}
      <div className="card p-5">
        <h2 className="section-title">Cenário</h2>
        <p className="mt-2 text-sm text-ink-700">{mission.scenario}</p>
      </div>

      {/* patient + vitals */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-100 text-accent-700">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display font-bold text-ink-900">{mission.patient.name}, {mission.patient.age} anos</p>
              <p className="text-xs text-ink-500">Paciente fictício</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-ink-700">{mission.patient.info}</p>
        </div>

        <div className="card p-5">
          <h3 className="text-xs font-bold uppercase tracking-wide text-ink-400">Sinais vitais</h3>
          <div className="mt-3 grid grid-cols-1 gap-2">
            {mission.vitals.map((v) => {
              const Icon = vitalIcon[v.label] ?? Activity;
              return (
                <div key={v.label} className="flex items-center justify-between rounded-xl bg-ink-50 px-3 py-2.5">
                  <span className="flex items-center gap-2 text-sm font-semibold text-ink-600"><Icon className="h-4 w-4 text-accent-600" /> {v.label}</span>
                  <span className="font-display font-bold text-ink-900">{v.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* questions */}
      <div className="space-y-4">
        {mission.questions.map((q, i) => (
          <div key={q.id} className="card p-5">
            <div className="flex items-start gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-600 text-xs font-bold text-white">{i + 1}</span>
              <p className="font-display font-bold text-ink-900">{q.text}</p>
            </div>
            <textarea
              value={answers[q.id] ?? ''}
              onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
              placeholder={q.placeholder}
              rows={i === 3 ? 6 : 3}
              className="mt-3 w-full rounded-2xl bg-ink-100 p-4 text-sm text-ink-900 placeholder:text-ink-400 ring-1 ring-inset ring-transparent transition focus:bg-white focus:ring-2 focus:ring-accent-500 focus:outline-none"
            />
          </div>
        ))}
      </div>

      {/* rubric preview */}
      <div className="card p-5">
        <h3 className="font-display font-bold text-ink-900">Critérios de avaliação</h3>
        <p className="mt-1 text-xs text-ink-500">Sua anotação será avaliada por estes critérios, definidos pelo professor.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {mission.rubric.map((r) => (
            <span key={r.criterion} className="chip bg-accent-50 text-accent-700 ring-1 ring-accent-200">{r.criterion}</span>
          ))}
        </div>
      </div>

      <button
        disabled={!allAnswered}
        onClick={() => navigate({ name: 'mission-feedback', missionId: mission.id, answers })}
        className="btn-primary w-full py-4 text-base"
      >
        <Send className="h-5 w-5" /> Enviar para avaliação
      </button>
      {!allAnswered && <p className="text-center text-xs text-ink-400">Responda todas as perguntas para enviar.</p>}
    </div>
  );
}
