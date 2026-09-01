import { Lock, ChevronRight, Check, Zap, Target } from 'lucide-react';
import { useApp } from '@/store';
import { LEVELS } from '@/data';
import { accentGrad, ProgressBar } from '@/components/ui';

export function LevelsPage() {
  const { user, navigate } = useApp();
  if (!user) return null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Trilha de níveis</h1>
        <p className="mt-1 text-sm text-ink-500">Conclua atividades para acumular XP e desbloquear novos níveis.</p>
      </div>

      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-ink-200" />

        <div className="space-y-3">
          {LEVELS.map((lvl) => {
            const isUnlocked = user.xp >= lvl.unlockXp;
            const isCurrent = lvl.id === user.level;
            const isDone = lvl.id < user.level;
            const progressPct = isDone ? 100 : isCurrent ? 50 : isUnlocked ? 0 : 0;

            return (
              <div key={lvl.id} className="relative pl-16">
                {/* node */}
                <div className={`absolute left-0 top-3 flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-soft ring-4 ring-ink-50 ${
                  isDone ? 'bg-success-600' : isUnlocked ? `bg-gradient-to-br ${accentGrad[lvl.accent]}` : 'bg-ink-300'
                }`}>
                  {isDone ? <Check className="h-6 w-6" /> : isUnlocked ? <span className="font-display text-lg font-extrabold">{lvl.id}</span> : <Lock className="h-5 w-5" />}
                  {isCurrent && <span className="absolute -inset-1 rounded-2xl ring-2 ring-primary-400 animate-pulse-ring" />}
                </div>

                <button
                  disabled={!isUnlocked}
                  onClick={() => navigate({ name: 'level', levelId: lvl.id })}
                  className={`block w-full rounded-3xl bg-white p-4 text-left ring-1 ring-ink-100 transition ${isUnlocked ? 'hover:shadow-card' : 'opacity-70'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="chip bg-ink-100 text-ink-600">Nível {lvl.id}</span>
                        {isUnlocked && <span className="chip bg-accent-100 text-accent-700"><Zap className="h-3 w-3" /> {lvl.rewardXp}</span>}
                      </div>
                      <h3 className="mt-1.5 font-display text-base font-bold text-ink-900">{lvl.title}</h3>
                      <p className="text-sm text-ink-500">{lvl.subtitle}</p>
                    </div>
                    {isUnlocked ? <ChevronRight className="h-5 w-5 shrink-0 text-ink-300" /> : <Lock className="h-4 w-4 shrink-0 text-ink-400" />}
                  </div>

                  {isUnlocked && (
                    <div className="mt-3">
                      <ProgressBar value={progressPct} barClassName={`bg-gradient-to-r ${accentGrad[lvl.accent]}`} />
                    </div>
                  )}
                  {!isUnlocked && (
                    <p className="mt-3 text-xs font-semibold text-ink-400">
                      Desbloqueia com {lvl.unlockXp} XP — faltam {lvl.unlockXp - user.xp}
                    </p>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
