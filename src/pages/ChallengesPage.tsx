import { ChevronRight, Zap, Target, Star, Filter } from 'lucide-react';
import { useApp } from '@/store';
import { ACTIVITIES, MISSIONS, LEVELS } from '@/data';
import { XpPill, accentGrad } from '@/components/ui';
import * as Lucide from 'lucide-react';

const TYPE_LABELS: Record<string, string> = {
  'multiple-choice': 'Múltipla escolha',
  'true-false': 'Verdadeiro ou falso',
  'association': 'Associação',
  'fill-blank': 'Complete a frase',
  'order-info': 'Organize as informações',
  'find-error': 'Encontre o erro',
  'best-note': 'Melhor anotação',
  'build-note': 'Monte a anotação',
  'mission': 'Missão clínica',
};

export function ChallengesPage() {
  const { user, navigate } = useApp();
  if (!user) return null;

  const sorted = [...ACTIVITIES].sort((a, b) => {
    const aUnlocked = user.xp >= LEVELS.find((l) => l.id === a.levelId)!.unlockXp ? 0 : 1;
    const bUnlocked = user.xp >= LEVELS.find((l) => l.id === b.levelId)!.unlockXp ? 0 : 1;
    return aUnlocked - bUnlocked;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Desafios</h1>
          <p className="mt-1 text-sm text-ink-500">Atividades interativas para ganhar XP.</p>
        </div>
        <button className="btn-secondary px-3 py-2 text-sm"><Filter className="h-4 w-4" /> Filtrar</button>
      </div>

      {/* Missions featured */}
      <div>
        <h2 className="section-title mb-3">Missões clínicas</h2>
        <div className="space-y-2.5">
          {MISSIONS.map((m) => {
            const lvl = LEVELS.find((l) => l.id === m.levelId)!;
            const unlocked = user.xp >= lvl.unlockXp;
            return (
              <button
                key={m.id}
                onClick={() => unlocked && navigate({ name: 'mission' })}
                className={`group flex w-full items-center gap-3 rounded-3xl p-4 text-left ring-1 transition ${unlocked ? 'bg-gradient-to-br from-accent-600 to-accent-700 text-white ring-accent-700 hover:shadow-float' : 'bg-white text-ink-500 ring-ink-100 opacity-70'}`}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${unlocked ? 'bg-white/15' : 'bg-ink-100'}`}>
                  <Star className={`h-6 w-6 ${unlocked ? 'text-white' : 'text-ink-400'}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-bold">{m.title}</p>
                  <p className={`truncate text-xs ${unlocked ? 'text-white/80' : 'text-ink-500'}`}>{TYPE_LABELS.mission} · Nível {m.levelId}</p>
                </div>
                <XpPill xp={m.rewardXp} className={unlocked ? 'bg-white/20 text-white' : ''} />
                <ChevronRight className={`h-5 w-5 ${unlocked ? 'text-white/70' : 'text-ink-300'} transition group-hover:translate-x-1`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Activities */}
      <div>
        <h2 className="section-title mb-3">Todas as atividades</h2>
        <div className="space-y-2.5">
          {sorted.map((a) => {
            const lvl = LEVELS.find((l) => l.id === a.levelId)!;
            const unlocked = user.xp >= lvl.unlockXp;
            const Icon = (Lucide as any)[lvl.icon] ?? Target;
            return (
              <button
                key={a.id}
                onClick={() => unlocked && navigate({ name: 'activity', activityId: a.id })}
                className={`group flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left ring-1 ring-ink-100 transition ${unlocked ? 'hover:shadow-card' : 'opacity-60'}`}
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accentGrad[lvl.accent]} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink-900">{a.title}</p>
                  <p className="truncate text-xs text-ink-500">{TYPE_LABELS[a.type]} · Nível {a.levelId}</p>
                </div>
                <XpPill xp={a.xp} />
                <ChevronRight className="h-5 w-5 text-ink-300 transition group-hover:translate-x-1" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
