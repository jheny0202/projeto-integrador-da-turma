import { Flame, Zap, Trophy, Medal, Target, Activity as ActIcon, TrendingUp, Calendar, Award, BookOpen } from 'lucide-react';
import { useApp, levelProgress } from '@/store';
import { BADGES, LEVELS, RANKING } from '@/data';
import { ProgressBar, StatCard, accentGrad, SectionHeader } from '@/components/ui';
import * as Lucide from 'lucide-react';

export function ProfilePage() {
  const { user, navigate } = useApp();
  if (!user) return null;

  const { pct, next } = levelProgress(user.xp, user.level);
  const myPos = RANKING.findIndex((r) => r.isMe) + 1;
  const lvl = LEVELS.find((l) => l.id === user.level)!;

  return (
    <div className="space-y-5">
      {/* profile header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 to-ink-800 p-6 text-white">
        <div className="absolute inset-0 bg-dots opacity-15" />
        <div className="relative flex items-center gap-4">
          <div className={`flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${user.avatarColor} font-display text-3xl font-extrabold text-white ring-4 ring-white/10`}>
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-bold">{user.name}</h1>
            <p className="text-sm text-ink-300">@{user.username.replace('@', '')}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="chip bg-white/10 text-white"><Calendar className="h-3 w-3" /> {user.turma}</span>
              <span className="chip bg-primary-500/20 text-primary-300">Nível {user.level}</span>
            </div>
          </div>
        </div>

        {/* XP bar */}
        <div className="relative mt-5">
          <div className="flex items-center justify-between text-xs font-semibold text-ink-300">
            <span>{lvl.title}</span>
            <span>{user.xp} / {next} XP</span>
          </div>
          <div className="mt-1.5">
            <ProgressBar value={pct} barClassName="bg-gradient-to-r from-primary-400 to-accent-400" className="bg-white/10" showGlow />
          </div>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard icon={<Zap className="h-5 w-5" />} label="XP total" value={user.xp} accent="accent" />
        <StatCard icon={<Flame className="h-5 w-5" />} label="Sequência" value={`${user.streak} dias`} accent="error" />
        <StatCard icon={<ActIcon className="h-5 w-5" />} label="Atividades" value={user.activitiesCompleted} accent="ocean" />
        <StatCard icon={<Trophy className="h-5 w-5" />} label="Ranking" value={`#${myPos}`} accent="warning" />
        <StatCard icon={<Medal className="h-5 w-5" />} label="Medalhas" value={`${user.badgeIds.length}/${BADGES.length}`} accent="success" />
        <StatCard icon={<Target className="h-5 w-5" />} label="Nível" value={user.level} accent="primary" />
      </div>

      {/* badges */}
      <div>
        <SectionHeader title="Conquistas" subtitle={`${user.badgeIds.length} de ${BADGES.length} medalhas desbloqueadas`} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {BADGES.map((b) => {
            const owned = user.badgeIds.includes(b.id);
            const Icon = (Lucide as any)[b.icon] ?? Award;
            return (
              <div key={b.id} className={`card p-4 text-center transition ${owned ? '' : 'opacity-60'}`}>
                <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${owned ? `bg-gradient-to-br ${accentGrad[b.color]} text-white shadow-soft` : 'bg-ink-100 text-ink-400'}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <p className="mt-2 text-sm font-bold text-ink-900">{b.name}</p>
                <p className="mt-0.5 text-xs text-ink-500">{b.description}</p>
                {!owned && <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wide text-ink-400">Bloqueada</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* level progress summary */}
      <div className="card p-5">
        <SectionHeader title="Progresso nos níveis" />
        <div className="space-y-2">
          {LEVELS.slice(0, 5).map((l) => {
            const done = l.id < user.level;
            const current = l.id === user.level;
            const unlocked = user.xp >= l.unlockXp;
            return (
              <div key={l.id} className="flex items-center gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white ${done ? 'bg-success-600' : current ? `bg-gradient-to-br ${accentGrad[l.accent]}` : 'bg-ink-300'}`}>
                  <span className="font-display text-sm font-bold">{l.id}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-800">{l.title}</p>
                  <ProgressBar value={done ? 100 : current ? pct : 0} className="mt-1 h-1.5" />
                </div>
                {done && <span className="chip bg-success-100 text-success-700 text-[10px]">Concluído</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* best performance */}
      <div className="card flex items-center gap-3 p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-100 text-accent-700">
          <TrendingUp className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Melhor desempenho</p>
          <p className="font-display font-bold text-ink-900">Nível 3 — Terminologia na Prática</p>
          <p className="text-xs text-ink-500">90% de acerto · 350 XP</p>
        </div>
      </div>

      <button onClick={() => navigate({ name: 'flashcards' })} className="btn-secondary mx-auto block">
        <BookOpen className="h-5 w-5" /> Estudar flashcards
      </button>
    </div>
  );
}
