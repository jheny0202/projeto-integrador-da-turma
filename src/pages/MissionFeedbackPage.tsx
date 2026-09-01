import { Check, AlertTriangle, Lightbulb, Zap, ArrowRight, Trophy, ClipboardList } from 'lucide-react';
import { useApp } from '@/store';
import { MISSIONS } from '@/data';
import { ProgressBar } from '@/components/ui';

export function MissionFeedbackPage({ answers }: { missionId: string; answers: Record<string, string> }) {
  const { navigate, addXp, unlockBadge } = useApp();
  const mission = MISSIONS[0];

  // Criteria-based heuristic evaluation (prototype): check presence of key terms in the annotation (q4)
  const annotation = (answers.q4 ?? '').toLowerCase();
  const checks = [
    { label: 'Contém horário', ok: /\b\d{2}h\d{2}\b|horário|08h/.test(annotation) || /08h00|09h00/.test(annotation) },
    { label: 'Contém sinais vitais', ok: /pa|fc|fr|spo|temperatura|\b\d{2,3}x\d{2,3}\b|bpm|irpm/.test(annotation) },
    { label: 'Usa terminologia técnica', ok: /lúcido|orientado|eupneico|normotenso|dor|náusea|queixoso/.test(annotation) },
    { label: 'Menciona queixa (dor/náusea)', ok: /dor|náusea|abdominal/.test(annotation) },
    { label: 'Comunica o enfermeiro', ok: /enfermeiro|comunicado|informado|avali/.test(annotation) },
    { label: 'Contém identificação (COREN)', ok: /coren|tec\.?\s*enf|enferm/.test(annotation) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const pct = Math.round((score / checks.length) * 100);
  const xpEarned = Math.round((pct / 100) * mission.rewardXp);

  const handleContinue = () => {
    addXp(xpEarned);
    unlockBadge('clinical-mission');
    navigate({ name: 'completion', xp: xpEarned, badgeId: 'clinical-mission', title: 'Missão clínica concluída!', nextRoute: { name: 'dashboard' } });
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-accent-700 text-white shadow-glow">
          <ClipboardList className="h-8 w-8" />
        </div>
        <h1 className="mt-3 font-display text-2xl font-bold text-ink-900">Avaliação da anotação</h1>
        <p className="mt-1 text-sm text-ink-500">Feedback baseado em critérios definidos pelo professor.</p>
      </div>

      {/* Score */}
      <div className="card p-6 text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Sua pontuação</p>
        <p className="mt-1 font-display text-4xl font-extrabold text-ink-900">{score}<span className="text-ink-300">/{checks.length}</span></p>
        <div className="mx-auto mt-3 max-w-xs">
          <ProgressBar value={pct} barClassName="bg-gradient-to-r from-accent-400 to-accent-600" showGlow />
        </div>
        <p className="mt-2 text-sm font-semibold text-ink-600">{pct}% de aderência aos critérios</p>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent-100 px-3 py-1 font-display font-bold text-accent-700">
          <Zap className="h-4 w-4" /> +{xpEarned} XP conquistado
        </div>
      </div>

      {/* O que acertou */}
      <div className="card p-5">
        <h3 className="flex items-center gap-2 font-display font-bold text-success-700"><Check className="h-5 w-5" /> O que você acertou</h3>
        <ul className="mt-3 space-y-2">
          {checks.filter((c) => c.ok).map((c) => (
            <li key={c.label} className="flex items-center gap-2 text-sm text-ink-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success-100 text-success-700"><Check className="h-3 w-3" /></span>
              {c.label}
            </li>
          ))}
          {checks.filter((c) => c.ok).length === 0 && <li className="text-sm text-ink-500">Nenhum critério atendido ainda — revise o caso e tente novamente.</li>}
        </ul>
      </div>

      {/* O que pode melhorar */}
      <div className="card p-5">
        <h3 className="flex items-center gap-2 font-display font-bold text-warning-700"><AlertTriangle className="h-5 w-5" /> O que pode melhorar</h3>
        <ul className="mt-3 space-y-2">
          {checks.filter((c) => !c.ok).map((c) => (
            <li key={c.label} className="flex items-center gap-2 text-sm text-ink-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-warning-100 text-warning-700"><AlertTriangle className="h-3 w-3" /></span>
              {c.label}
            </li>
          ))}
          {checks.filter((c) => !c.ok).length === 0 && <li className="text-sm text-success-700 font-semibold">Atendeu a todos os critérios! Registro completo.</li>}
        </ul>
      </div>

      {/* Your annotation */}
      <div className="card p-5">
        <h3 className="font-display font-bold text-ink-900">Sua anotação</h3>
        <p className="mt-2 whitespace-pre-wrap rounded-xl bg-ink-50 p-4 text-sm text-ink-700">{answers.q4 || '(em branco)'}</p>
      </div>

      {/* Model answer */}
      <div className="card p-5">
        <h3 className="font-display font-bold text-ink-900">Resposta-modelo do professor</h3>
        <p className="mt-2 whitespace-pre-wrap rounded-xl bg-primary-50 p-4 text-sm text-ink-800 ring-1 ring-primary-100">{mission.modelAnswer}</p>
      </div>

      {/* Teacher tip */}
      <div className="card flex items-start gap-3 p-5">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-warning-600" />
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-warning-700">Dica do professor</p>
          <p className="mt-1 text-sm text-ink-600">Compare sua anotação com a resposta-modelo. Note como cada informação tem um propósito: horário, dados objetivos, terminologia e identificação. Pratique escrever registros completos sempre.</p>
        </div>
      </div>

      <button onClick={handleContinue} className="btn-primary w-full py-4 text-base">
        <Trophy className="h-5 w-5" /> Concluir missão <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
}
