import { ArrowLeft, Zap, Target, BookOpen, Gamepad2, Lock, Check, ChevronRight, Star, Lightbulb } from 'lucide-react';
import { useApp } from '@/store';
import { LEVELS, ACTIVITIES, MISSIONS } from '@/data';
import { accentGrad, accentSoft, Badge, XpPill } from '@/components/ui';
import * as Lucide from 'lucide-react';

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  'multiple-choice': 'Múltipla escolha',
  'true-false': 'Verdadeiro ou falso',
  'association': 'Associação',
  'fill-blank': 'Complete a frase',
  'order-info': 'Organize as informações',
  'find-error': 'Encontre o erro',
  'best-note': 'Escolha a melhor anotação',
  'build-note': 'Monte a anotação',
  'mission': 'Missão clínica',
};

export function LevelDetailPage({ levelId }: { levelId: number }) {
  const { user, navigate } = useApp();
  if (!user) return null;
  const lvl = LEVELS.find((l) => l.id === levelId);
  if (!lvl) return null;

  const isUnlocked = user.xp >= lvl.unlockXp;
  const activities = ACTIVITIES.filter((a) => a.levelId === levelId);
  const missions = MISSIONS.filter((m) => m.levelId === levelId);
  const Icon = (Lucide as any)[lvl.icon] ?? Target;
  const SoftIcon = (Lucide as any)[lvl.icon] ?? Target;

  return (
    <div className="space-y-5">
      <button onClick={() => navigate({ name: 'levels' })} className="flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> Trilha de níveis
      </button>

      {/* Level header */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${accentGrad[lvl.accent]} p-6 text-white shadow-card`}>
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="chip bg-white/15 text-white ring-1 ring-white/20">Nível {lvl.id}</span>
            {!isUnlocked && <span className="chip bg-white/15 text-white ring-1 ring-white/20"><Lock className="h-3 w-3" /> Bloqueado</span>}
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">{lvl.title}</h1>
              <p className="text-white/85">{lvl.subtitle}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="chip bg-white/15 text-white"><Zap className="h-3 w-3" /> Recompensa {lvl.rewardXp} XP</span>
            <span className="chip bg-white/15 text-white"><Target className="h-3 w-3" /> {activities.length} atividades</span>
            {missions.length > 0 && <span className="chip bg-white/15 text-white"><Star className="h-3 w-3" /> {missions.length} missão</span>}
          </div>
        </div>
      </div>

      {!isUnlocked ? (
        <div className="card p-8 text-center">
          <Lock className="mx-auto h-10 w-10 text-ink-300" />
          <h3 className="mt-3 font-display text-lg font-bold text-ink-900">Nível bloqueado</h3>
          <p className="mt-1 text-sm text-ink-500">Acumule {lvl.unlockXp} XP para desbloquear este nível. Faltam {lvl.unlockXp - user.xp} XP.</p>
        </div>
      ) : (
        <>
          {/* Objective + content */}
          <div className="card p-5">
            <div className={`flex items-start gap-3 rounded-2xl p-4 ring-1 ${accentSoft[lvl.accent]}`}>
              <Target className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide opacity-70">Objetivo</p>
                <p className="text-sm font-semibold">{lvl.objective}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-ink-400" />
              <p className="text-sm text-ink-700">{lvl.content}</p>
            </div>
          </div>

          {/* Activities */}
          <div>
            <h2 className="section-title mb-3">Atividades</h2>
            <div className="space-y-2.5">
              {activities.map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => navigate({ name: 'activity', activityId: a.id })}
                  className="group flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left ring-1 ring-ink-100 transition hover:shadow-card"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-100 font-display font-bold text-ink-600">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink-900">{a.title}</p>
                    <p className="truncate text-xs text-ink-500">{ACTIVITY_TYPE_LABELS[a.type]}</p>
                  </div>
                  <XpPill xp={a.xp} />
                  <ChevronRight className="h-5 w-5 text-ink-300 transition group-hover:translate-x-1" />
                </button>
              ))}

              {missions.map((m) => (
                <button
                  key={m.id}
                  onClick={() => navigate({ name: 'mission' })}
                  className="group flex w-full items-center gap-3 rounded-2xl bg-gradient-to-br from-accent-50 to-white p-4 text-left ring-1 ring-accent-200 transition hover:shadow-card"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-600 text-white">
                    <Star className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink-900">{m.title}</p>
                    <p className="truncate text-xs text-accent-600">Missão clínica</p>
                  </div>
                  <XpPill xp={m.rewardXp} />
                  <ChevronRight className="h-5 w-5 text-accent-400 transition group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div className="card flex items-start gap-3 p-4">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-warning-600" />
            <p className="text-sm text-ink-600">
              Dica: conclua todas as atividades para dominar o nível e ganhar o XP máximo. Cada resposta certa contribui para sua evolução.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
