import { useEffect, useState } from 'react';
import { ArrowRight, Home, Trophy, Zap, Medal, Sparkles } from 'lucide-react';
import { useApp } from '@/store';
import { BADGES } from '@/data';
import { ProgressBar } from '@/components/ui';

export function CompletionPage({ xp, badgeId, title, nextRoute }: { xp: number; badgeId?: string; title: string; nextRoute?: any }) {
  const { navigate, user } = useApp();
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 100); return () => clearTimeout(t); }, []);

  const badge = badgeId ? BADGES.find((b) => b.id === badgeId) : null;
  const pct = user ? Math.min(100, Math.round((user.xp / 5300) * 100)) : 0;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary-600 to-ocean-800 px-5 py-10 text-white">
      <div className="absolute inset-0 bg-dots opacity-20" />

      {/* confetti */}
      {show && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-2 w-2 rounded-sm animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                backgroundColor: ['#10b981', '#fbbf24', '#3b82f6', '#ef4444', '#06b6d4'][i % 5],
                animationDelay: `${Math.random() * 0.8}s`,
                animationDuration: `${2 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative w-full max-w-md text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/15 ring-4 ring-white/20 animate-pop">
          <Trophy className="h-12 w-12 text-warning-300" />
        </div>

        <h1 className="mt-6 font-display text-3xl font-extrabold animate-slide-up">{title}</h1>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2.5 font-display text-xl font-bold animate-scale-in">
          <Zap className="h-6 w-6 text-warning-300" /> +{xp} XP
        </div>

        {badge && (
          <div className="mt-6 rounded-3xl bg-white/10 p-5 ring-1 ring-white/20 animate-scale-in">
            <div className="flex items-center justify-center gap-2 text-warning-300">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Nova conquista</span>
            </div>
            <div className="mt-3 flex items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-warning-400 to-warning-600 text-white">
                <Medal className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="font-display font-bold">{badge.name}</p>
                <p className="text-xs text-white/80">{badge.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* progress */}
        <div className="mt-6 rounded-2xl bg-white/10 p-4 text-left">
          <div className="flex items-center justify-between text-xs font-semibold text-white/80">
            <span>Progresso geral</span>
            <span>{pct}%</span>
          </div>
          <div className="mt-1.5">
            <ProgressBar value={pct} barClassName="bg-gradient-to-r from-warning-300 to-warning-500" className="bg-white/15" showGlow />
          </div>
        </div>

        {/* buttons */}
        <div className="mt-8 flex flex-col gap-3">
          {nextRoute && (
            <button onClick={() => navigate(nextRoute)} className="btn bg-white px-6 py-4 text-base text-primary-700 shadow-float hover:bg-primary-50 active:scale-95">
              PRÓXIMO DESAFIO <ArrowRight className="h-5 w-5" />
            </button>
          )}
          <button onClick={() => navigate({ name: 'dashboard' })} className="btn bg-white/10 px-6 py-4 text-base text-white ring-1 ring-white/30 hover:bg-white/20">
            <Home className="h-5 w-5" /> VOLTAR PARA O INÍCIO
          </button>
        </div>
      </div>
    </div>
  );
}
