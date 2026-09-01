import { Flame, Trophy, Medal, Zap, Activity as ActIcon, ChevronRight, Target, BookOpen, Sparkles, Crown, Lock, TrendingUp } from 'lucide-react';
import { useApp, levelProgress, xpForLevel } from '@/store';
import { LEVELS, BADGES, RANKING } from '@/data';
import { ProgressBar, StatCard, SectionHeader, accentGrad } from '@/components/ui';

export function DashboardPage() {
  const { user, navigate } = useApp();
  if (!user) return null;

  const { pct, next } = levelProgress(user.xp, user.level);
  const myRank = RANKING.findIndex((r) => r.isMe) + 1;
  const unlockedBadges = BADGES.filter((b) => user.badgeIds.includes(b.id));
  const nextLevel = LEVELS.find((l) => l.id === user.level + 1);
  const currentLevel = LEVELS.find((l) => l.id === user.level)!;
  const recommendedLevel = nextLevel ?? currentLevel;

  return (
    <div className="space-y-6">
      {/* Greeting + level hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-ocean-700 p-5 text-white shadow-card sm:p-7">
        <div className="absolute inset-0 bg-dots opacity-25" />
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-sm font-semibold text-primary-200">Olá,</p>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">{user.name}!</h1>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
              <span className="font-display text-2xl font-extrabold">{user.level}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>Nível {user.level} — {currentLevel.title}</span>
                <span>{user.xp} / {next} XP</span>
              </div>
              <div className="mt-1.5">
                <ProgressBar value={pct} barClassName="bg-gradient-to-r from-white to-primary-200" className="bg-white/20" showGlow />
              </div>
              <p className="mt-1.5 text-xs text-primary-200">
                {next - user.xp} XP para o Nível {user.level + 1}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <StatCard icon={<Flame className="h-5 w-5" />} label="Sequência" value={`${user.streak} dias`} accent="error" sub="Continue estudando!" />
        <StatCard icon={<ActIcon className="h-5 w-5" />} label="Atividades" value={user.activitiesCompleted} accent="ocean" sub="Concluídas" />
        <StatCard icon={<Trophy className="h-5 w-5" />} label="Ranking" value={`#${myRank}`} accent="warning" sub="Da turma" />
        <StatCard icon={<Medal className="h-5 w-5" />} label="Medalhas" value={unlockedBadges.length} accent="accent" sub={`de ${BADGES.length}`} />
      </div>

      {/* Continue journey */}
      <div>
        <SectionHeader title="Continue sua jornada" subtitle="Sua próxima atividade recomendada" />
        <button
          onClick={() => navigate({ name: 'level', levelId: recommendedLevel.id })}
          className="group block w-full text-left"
        >
          <div className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-card ring-1 ring-ink-100 transition group-hover:shadow-float sm:p-6">
            <div className="flex items-center gap-4">
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accentGrad[recommendedLevel.accent]} text-white shadow-soft`}>
                <Sparkles className="h-7 w-7" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="chip bg-success-100 text-success-700">Desbloqueado</span>
                  <span className="chip bg-accent-100 text-accent-700"><Zap className="h-3 w-3" /> +{recommendedLevel.rewardXp} XP</span>
                </div>
                <h3 className="mt-2 font-display text-lg font-bold text-ink-900">Nível {recommendedLevel.id} — {recommendedLevel.title}</h3>
                <p className="truncate text-sm text-ink-500">{recommendedLevel.objective}</p>
              </div>
              <ChevronRight className="h-6 w-6 shrink-0 text-ink-300 transition group-hover:translate-x-1 group-hover:text-primary-600" />
            </div>
          </div>
        </button>
      </div>

      {/* Levels trail preview */}
      <div>
        <SectionHeader
          title="Trilha de níveis"
          subtitle="Sua jornada de aprendizagem"
          action={<button onClick={() => navigate({ name: 'levels' })} className="btn-ghost text-sm text-primary-600">Ver tudo</button>}
        />
        <div className="space-y-2.5">
          {LEVELS.slice(0, 4).map((lvl) => {
            const isUnlocked = user.xp >= lvl.unlockXp;
            return (
              <button
                key={lvl.id}
                onClick={() => isUnlocked && navigate({ name: 'level', levelId: lvl.id })}
                className={`flex w-full items-center gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-ink-100 transition ${isUnlocked ? 'hover:shadow-soft' : 'opacity-60'}`}
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white ${isUnlocked ? `bg-gradient-to-br ${accentGrad[lvl.accent]}` : 'bg-ink-300'}`}>
                  {isUnlocked ? <span className="font-display font-bold">{lvl.id}</span> : <Lock className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-bold text-ink-900">Nível {lvl.id} — {lvl.title}</p>
                  <p className="truncate text-xs text-ink-500">{lvl.subtitle}</p>
                </div>
                {isUnlocked ? <ChevronRight className="h-5 w-5 text-ink-300" /> : <Lock className="h-4 w-4 text-ink-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Badges + quick actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <SectionHeader title="Conquistas" />
          <div className="grid grid-cols-4 gap-2">
            {BADGES.slice(0, 8).map((b) => {
              const owned = user.badgeIds.includes(b.id);
              return (
                <div key={b.id} className={`flex aspect-square flex-col items-center justify-center rounded-2xl p-1 text-center ${owned ? `bg-gradient-to-br ${accentGrad[b.color]} text-white shadow-soft` : 'bg-ink-100 text-ink-300'}`}>
                  <Medal className="h-5 w-5" />
                  <span className="mt-0.5 text-[8px] font-bold leading-tight">{b.name.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>
          <button onClick={() => navigate({ name: 'profile' })} className="mt-3 text-sm font-semibold text-primary-600">Ver todas</button>
        </div>

        <div className="card p-5">
          <SectionHeader title="Acesso rápido" />
          <div className="space-y-2">
            <QuickLink icon={<Target className="h-5 w-5" />} color="bg-accent-100 text-accent-700" label="Missões clínicas" onClick={() => navigate({ name: 'mission' })} />
            <QuickLink icon={<BookOpen className="h-5 w-5" />} color="bg-ocean-100 text-ocean-700" label="Flashcards" onClick={() => navigate({ name: 'flashcards' })} />
            <QuickLink icon={<Trophy className="h-5 w-5" />} color="bg-warning-100 text-warning-700" label="Ranking da turma" onClick={() => navigate({ name: 'ranking' })} />
            <QuickLink icon={<Crown className="h-5 w-5" />} color="bg-error-100 text-error-700" label="Trilha completa" onClick={() => navigate({ name: 'levels' })} />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickLink({ icon, color, label, onClick }: { icon: React.ReactNode; color: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-2xl bg-ink-50 p-3 text-left transition hover:bg-ink-100">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>{icon}</div>
      <span className="flex-1 text-sm font-semibold text-ink-800">{label}</span>
      <ChevronRight className="h-4 w-4 text-ink-300" />
    </button>
  );
}
