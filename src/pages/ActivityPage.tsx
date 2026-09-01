import { useState, useMemo } from 'react';
import { ArrowLeft, Check, X, Zap, Lightbulb, ArrowRight, RotateCcw, AlertTriangle, Sparkles } from 'lucide-react';
import { useApp } from '@/store';
import { ACTIVITIES, LEVELS } from '@/data';
import type { Activity } from '@/types';
import { accentGrad, ProgressBar } from '@/components/ui';
import * as Lucide from 'lucide-react';

export function ActivityPage({ activityId }: { activityId: string }) {
  const { user, navigate, addXp, unlockBadge } = useApp();
  const activity = ACTIVITIES.find((a) => a.id === activityId);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [pickedList, setPickedList] = useState<string[]>([]);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [order, setOrder] = useState<number[]>([]);
  const [errorsFound, setErrorsFound] = useState<Set<string>>(new Set());

  if (!user || !activity) return null;
  const lvl = LEVELS.find((l) => l.id === activity.levelId)!;
  const Icon = (Lucide as any)[lvl.icon] ?? Sparkles;

  const shuffledRights = useMemo(() => {
    if (activity.type !== 'association' || !activity.pairs) return [];
    return [...activity.pairs].map((p) => p.right).sort(() => Math.random() - 0.5);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityId]);

  const shuffledFragments = useMemo(() => {
    if (activity.type !== 'order-info' || !activity.fragments) return [];
    const idx = activity.fragments.map((_, i) => i).sort(() => Math.random() - 0.5);
    return idx;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityId]);

  const check = () => {
    let ok = false;
    if (activity.type === 'multiple-choice' || activity.type === 'true-false') {
      const opt = activity.options?.find((o) => o.id === picked);
      ok = !!opt?.correct;
    } else if (activity.type === 'fill-blank') {
      ok = picked === activity.blankAnswer;
    } else if (activity.type === 'association') {
      ok = activity.pairs!.every((p) => matches[p.left] === p.right);
    } else if (activity.type === 'order-info') {
      ok = order.join(',') === activity.correctOrder!.join(',');
    } else if (activity.type === 'find-error') {
      ok = activity.errorSegments!.every((s) => s.isError === errorsFound.has(s.id));
    } else if (activity.type === 'best-note') {
      const opt = activity.noteOptions?.find((o) => o.id === picked);
      ok = !!opt?.isBest;
    }
    setCorrect(ok);
    setSubmitted(true);
    if (ok) {
      addXp(activity.xp);
      if (activity.id === 'a6') unlockBadge('error-hunter');
      if (activity.id === 'a4' || activity.id === 'a5') unlockBadge('term-ninja');
    }
  };

  const reset = () => {
    setSubmitted(false);
    setCorrect(false);
    setPicked(null);
    setPickedList([]);
    setMatches({});
    setOrder([]);
    setErrorsFound(new Set());
  };

  const canSubmit = (() => {
    if (submitted) return false;
    if (activity.type === 'multiple-choice' || activity.type === 'true-false' || activity.type === 'fill-blank' || activity.type === 'best-note') return !!picked;
    if (activity.type === 'association') return Object.keys(matches).length === (activity.pairs?.length ?? 0);
    if (activity.type === 'order-info') return order.length === (activity.fragments?.length ?? 0);
    if (activity.type === 'find-error') return errorsFound.size > 0;
    return false;
  })();

  return (
    <div className="space-y-5">
      {/* header */}
      <button onClick={() => navigate({ name: 'level', levelId: activity.levelId })} className="flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> Nível {activity.levelId}
      </button>

      <div className={`rounded-3xl bg-gradient-to-br ${accentGrad[lvl.accent]} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white/80">{typeLabel(activity)}</p>
              <p className="font-display font-bold">{activity.title}</p>
            </div>
          </div>
          <span className="chip bg-white/15 text-white"><Zap className="h-3 w-3" /> {activity.xp}</span>
        </div>
      </div>

      {/* prompt */}
      <div className="card p-5">
        <p className="font-display text-lg font-bold text-ink-900">{activity.prompt}</p>
      </div>

      {/* body by type */}
      {!submitted && (
        <div className="space-y-3">
          {(activity.type === 'multiple-choice' || activity.type === 'true-false' || activity.type === 'best-note') && (
            <div className="space-y-2.5">
              {(activity.options ?? activity.noteOptions)!.map((o: any) => (
                <button
                  key={o.id}
                  onClick={() => setPicked(o.id)}
                  className={`w-full rounded-2xl p-4 text-left text-sm font-semibold ring-1 transition ${
                    picked === o.id ? 'bg-primary-50 text-primary-800 ring-2 ring-primary-500' : 'bg-white text-ink-700 ring-ink-200 hover:bg-ink-50'
                  }`}
                >
                  {o.text}
                </button>
              ))}
            </div>
          )}

          {activity.type === 'fill-blank' && (
            <div className="space-y-3">
              <div className="card p-5 text-center font-display text-lg font-bold text-ink-900">
                {activity.sentenceParts![0]}
                <span className="mx-1 inline-block min-w-[120px] rounded-lg bg-primary-100 px-3 py-0.5 text-primary-700">
                  {picked ?? '____'}
                </span>
                {activity.sentenceParts![1]}
              </div>
              <div className="flex flex-wrap gap-2">
                {activity.blankOptions!.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setPicked(opt)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold ring-1 transition ${
                      picked === opt ? 'bg-primary-600 text-white ring-primary-600' : 'bg-white text-ink-700 ring-ink-200 hover:bg-ink-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activity.type === 'association' && (
            <AssociationView activity={activity} shuffledRights={shuffledRights} matches={matches} setMatches={setMatches} />
          )}

          {activity.type === 'order-info' && (
            <OrderView activity={activity} shuffledFragments={shuffledFragments} order={order} setOrder={setOrder} />
          )}

          {activity.type === 'find-error' && (
            <FindErrorView activity={activity} errorsFound={errorsFound} setErrorsFound={setErrorsFound} />
          )}

          <button disabled={!canSubmit} onClick={check} className="btn-primary w-full py-4">
            Verificar resposta
          </button>
        </div>
      )}

      {/* feedback */}
      {submitted && (
        <FeedbackView activity={activity} correct={correct} picked={picked} onReset={reset} />
      )}
    </div>
  );
}

function typeLabel(a: Activity) {
  return {
    'multiple-choice': 'Múltipla escolha',
    'true-false': 'Verdadeiro ou falso',
    'association': 'Associação',
    'fill-blank': 'Complete a frase',
    'order-info': 'Organize as informações',
    'find-error': 'Encontre o erro',
    'best-note': 'Melhor anotação',
    'build-note': 'Monte a anotação',
    'mission': 'Missão clínica',
  }[a.type];
}

function AssociationView({ activity, shuffledRights, matches, setMatches }: { activity: Activity; shuffledRights: string[]; matches: Record<string, string>; setMatches: (m: Record<string, string>) => void }) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      <p className="text-sm text-ink-500">Toque em um termo à esquerda e depois no significado à direita.</p>
      <div className="grid grid-cols-2 gap-2.5">
        <div className="space-y-2">
          {activity.pairs!.map((p) => {
            const matched = matches[p.left];
            return (
              <button
                key={p.left}
                onClick={() => setSelectedLeft(p.left)}
                className={`w-full rounded-xl p-3 text-left text-sm font-semibold ring-1 transition ${
                  selectedLeft === p.left ? 'bg-primary-600 text-white ring-primary-600' : matched ? 'bg-success-50 text-success-700 ring-success-200' : 'bg-white text-ink-700 ring-ink-200'
                }`}
              >
                {p.left}
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          {shuffledRights.map((r) => {
            const used = Object.values(matches).includes(r);
            return (
              <button
                key={r}
                disabled={used}
                onClick={() => {
                  if (selectedLeft) {
                    setMatches({ ...matches, [selectedLeft]: r });
                    setSelectedLeft(null);
                  }
                }}
                className={`w-full rounded-xl p-3 text-left text-sm font-semibold ring-1 transition ${
                  used ? 'bg-ink-100 text-ink-400 ring-ink-100' : 'bg-white text-ink-700 ring-ink-200 hover:bg-ink-50'
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function OrderView({ activity, shuffledFragments, order, setOrder }: { activity: Activity; shuffledFragments: number[]; order: number[]; setOrder: (o: number[]) => void }) {
  const remaining = shuffledFragments.filter((i) => !order.includes(i));
  return (
    <div className="space-y-3">
      <p className="text-sm text-ink-500">Toque nas informações na ordem correta do registro.</p>
      <div className="space-y-2 rounded-2xl bg-ink-50 p-3 min-h-[80px]">
        {order.length === 0 && <p className="py-4 text-center text-sm text-ink-400">Sua sequência aparecerá aqui</p>}
        {order.map((idx, pos) => (
          <div key={idx} className="flex items-center gap-2 rounded-xl bg-white p-3 ring-1 ring-ink-200">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">{pos + 1}</span>
            <span className="text-sm font-semibold text-ink-800">{activity.fragments![idx]}</span>
            <button onClick={() => setOrder(order.filter((o) => o !== idx))} className="ml-auto text-ink-300 hover:text-error-500"><X className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {remaining.map((idx) => (
          <button key={idx} onClick={() => setOrder([...order, idx])} className="w-full rounded-xl bg-white p-3 text-left text-sm font-semibold text-ink-700 ring-1 ring-ink-200 hover:bg-primary-50 hover:ring-primary-200">
            {activity.fragments![idx]}
          </button>
        ))}
      </div>
    </div>
  );
}

function FindErrorView({ activity, errorsFound, setErrorsFound }: { activity: Activity; errorsFound: Set<string>; setErrorsFound: (s: Set<string>) => void }) {
  const toggle = (id: string) => {
    const next = new Set(errorsFound);
    if (next.has(id)) next.delete(id); else next.add(id);
    setErrorsFound(next);
  };
  return (
    <div className="space-y-3">
      <p className="text-sm text-ink-500">Toque nos trechos que contêm erros.</p>
      <div className="rounded-2xl bg-ink-50 p-5 text-lg leading-relaxed">
        {activity.errorSegments!.map((seg) => (
          <button
            key={seg.id}
            onClick={() => toggle(seg.id)}
            className={`mx-0.5 my-0.5 rounded-lg px-2 py-1 text-left font-semibold transition ${
              errorsFound.has(seg.id) ? 'bg-warning-200 text-warning-800 ring-1 ring-warning-400' : 'bg-white text-ink-800 ring-1 ring-transparent hover:ring-ink-200'
            }`}
          >
            {seg.text}
          </button>
        ))}
      </div>
    </div>
  );
}

function FeedbackView({ activity, correct, picked, onReset }: { activity: Activity; correct: boolean; picked: string | null; onReset: () => void }) {
  const { navigate, addXp } = useApp();
  const [animatedXp, setAnimatedXp] = useState(correct ? activity.xp : 0);

  const goCompletion = () => {
    if (correct) {
      navigate({ name: 'completion', xp: activity.xp, title: 'Atividade concluída!', nextRoute: { name: 'level', levelId: activity.levelId } });
    }
  };

  return (
    <div className="space-y-4 animate-slide-up">
      {/* result banner */}
      <div className={`rounded-3xl p-5 text-center text-white ${correct ? 'bg-gradient-to-br from-success-500 to-success-700' : 'bg-gradient-to-br from-warning-500 to-warning-600'}`}>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
          {correct ? <Check className="h-8 w-8" /> : <AlertTriangle className="h-8 w-8" />}
        </div>
        <h2 className="mt-3 font-display text-xl font-bold">{correct ? 'Mandou bem!' : 'Quase!'}</h2>
        <p className="mt-1 text-sm text-white/90">
          {correct ? 'Sua resposta está correta.' : 'Esse erro faz parte do aprendizado. Vamos entender por que.'}
        </p>
        {correct && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 font-display font-bold">
            <Zap className="h-4 w-4" /> +{animatedXp} XP
          </div>
        )}
      </div>

      {/* why / explanation */}
      <div className="card p-5">
        <h3 className="font-display font-bold text-ink-900">{correct ? 'Por que está correto' : 'Por que sua resposta não é a mais adequada'}</h3>
        <p className="mt-2 text-sm text-ink-600">{activity.explanation}</p>

        {/* per-option feedback */}
        {activity.type === 'best-note' && activity.noteOptions && (
          <div className="mt-4 space-y-2">
            {activity.noteOptions.map((o) => (
              <div key={o.id} className={`rounded-xl p-3 ring-1 ${o.isBest ? 'bg-success-50 ring-success-200' : picked === o.id ? 'bg-error-50 ring-error-200' : 'bg-ink-50 ring-ink-100'}`}>
                <p className="text-sm font-semibold text-ink-800">{o.text}</p>
                <p className={`mt-1 text-xs font-semibold ${o.isBest ? 'text-success-700' : 'text-ink-500'}`}>{o.feedback}</p>
              </div>
            ))}
          </div>
        )}

        {activity.type === 'find-error' && activity.errorSegments && (
          <div className="mt-4 space-y-2">
            {activity.errorSegments.filter((s) => s.isError).map((s) => (
              <div key={s.id} className="rounded-xl bg-warning-50 p-3 ring-1 ring-warning-200">
                <p className="text-sm font-bold text-warning-800">"{s.text}"</p>
                <p className="mt-1 text-xs text-warning-700">{s.feedback}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* teacher tip */}
      {activity.teacherTip && (
        <div className="card flex items-start gap-3 p-4">
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-warning-600" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-warning-700">Dica do professor</p>
            <p className="mt-1 text-sm text-ink-600">{activity.teacherTip}</p>
          </div>
        </div>
      )}

      {/* motivational */}
      <p className="text-center text-sm font-semibold text-ink-500">
        {correct ? 'Você está evoluindo!' : 'Vamos tentar novamente? Você está cada vez mais perto de dominar esse conteúdo.'}
      </p>

      {/* actions */}
      <div className="flex gap-3">
        {!correct && <button onClick={onReset} className="btn-secondary flex-1 py-3.5"><RotateCcw className="h-5 w-5" /> Tentar de novo</button>}
        {correct ? (
          <button onClick={goCompletion} className="btn-primary flex-1 py-3.5">Avançar <ArrowRight className="h-5 w-5" /></button>
        ) : (
          <button onClick={() => navigate({ name: 'level', levelId: activity.levelId })} className="btn-secondary flex-1 py-3.5">Voltar ao nível</button>
        )}
      </div>
    </div>
  );
}
