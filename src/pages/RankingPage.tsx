import { useState } from 'react';
import { Crown, Medal, TrendingUp, Flame } from 'lucide-react';
import { useApp } from '@/store';
import { RANKING } from '@/data';

type Filter = 'turma' | 'semana' | 'mes' | 'geral';

const filters: { id: Filter; label: string }[] = [
  { id: 'turma', label: 'Minha turma' },
  { id: 'semana', label: 'Semana' },
  { id: 'mes', label: 'Mês' },
  { id: 'geral', label: 'Geral' },
];

export function RankingPage() {
  const { user } = useApp();
  const [filter, setFilter] = useState<Filter>('turma');
  if (!user) return null;

  const sorted = [...RANKING].sort((a, b) => b.xp - a.xp);
  const myEntry = sorted.find((r) => r.isMe);
  const myPos = sorted.findIndex((r) => r.isMe) + 1;

  const podium = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Ranking da turma</h1>
        <p className="mt-1 text-sm text-ink-500">Continue evoluindo — cada atividade te aproxima do topo.</p>
      </div>

      {/* Filters */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter === f.id ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 ring-1 ring-ink-200 hover:bg-ink-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Podium */}
      <div className="grid grid-cols-3 items-end gap-2 sm:gap-4">
        {podium.map((p, i) => {
          const place = i + 1;
          const heights = ['h-24', 'h-32', 'h-20'];
          const order = [1, 0, 2]; // visual order: 2nd, 1st, 3rd
          const visualIndex = order.indexOf(i);
          const medalColor = place === 1 ? 'from-warning-400 to-warning-600' : place === 2 ? 'from-ink-300 to-ink-400' : 'from-orange-400 to-orange-600';
          return (
            <div key={p.id} className="flex flex-col items-center" style={{ order: visualIndex }}>
              <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${p.avatarColor} text-lg font-bold text-white ring-4 ring-white shadow-card sm:h-16 sm:w-16`}>
                {p.name.charAt(0)}
              </div>
              <p className="mt-2 max-w-full truncate text-center text-xs font-bold text-ink-900 sm:text-sm">{p.name}</p>
              <p className="text-[10px] font-semibold text-ink-500 sm:text-xs">{p.xp} XP</p>
              <div className={`mt-2 flex w-full ${heights[i]} items-start justify-center rounded-t-2xl bg-gradient-to-b ${medalColor} pt-2 text-white shadow-soft`}>
                <span className="font-display text-xl font-extrabold sm:text-2xl">{place}º</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* My position */}
      {myEntry && myPos > 3 && (
        <div className="card flex items-center gap-3 border-2 border-primary-300 p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 font-display font-bold text-white">{myPos}º</span>
          <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${myEntry.avatarColor} text-sm font-bold text-white`}>
            {myEntry.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink-900">{myEntry.name} (você)</p>
            <p className="truncate text-xs text-ink-500">{myEntry.turma}</p>
          </div>
          <span className="chip bg-accent-100 text-accent-700 font-display font-bold">{myEntry.xp} XP</span>
        </div>
      )}

      {/* Rest list */}
      <div className="space-y-2">
        {rest.map((r, i) => {
          const pos = i + 4;
          return (
            <div key={r.id} className={`card flex items-center gap-3 p-3.5 ${r.isMe ? 'ring-2 ring-primary-300' : ''}`}>
              <span className="w-6 text-center font-display text-sm font-bold text-ink-400">{pos}º</span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${r.avatarColor} text-sm font-bold text-white`}>
                {r.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink-900">{r.name}{r.isMe && ' (você)'}</p>
                <p className="truncate text-xs text-ink-500">{r.turma} · Nível {r.level}</p>
              </div>
              <span className="chip bg-ink-100 text-ink-700 font-display font-bold">{r.xp} XP</span>
            </div>
          );
        })}
      </div>

      {/* Motivational */}
      <div className="card flex items-center gap-3 p-4">
        <TrendingUp className="h-5 w-5 text-primary-600" />
        <p className="text-sm font-semibold text-ink-700">Você está a {RANKING[4].xp - (myEntry?.xp ?? 0)} XP de subir uma posição. Continue praticando!</p>
      </div>
    </div>
  );
}
