import { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Check, X, Shuffle } from 'lucide-react';
import { FLASHCARDS } from '@/data';
import type { FlashcardCategory } from '@/types';
import { useApp } from '@/store';

const CATEGORIES: (FlashcardCategory | 'Todos')[] = ['Todos', 'Sinais e sintomas', 'Terminologias', 'Sinais vitais', 'Procedimentos', 'Comunicação', 'Registros de enfermagem'];

const catColor: Record<string, string> = {
  'Sinais e sintomas': 'bg-error-100 text-error-700',
  'Terminologias': 'bg-ocean-100 text-ocean-700',
  'Sinais vitais': 'bg-warning-100 text-warning-700',
  'Procedimentos': 'bg-success-100 text-success-700',
  'Comunicação': 'bg-accent-100 text-accent-700',
  'Registros de enfermagem': 'bg-primary-100 text-primary-700',
};

export function FlashcardsPage() {
  const { navigate } = useApp();
  const [category, setCategory] = useState<FlashcardCategory | 'Todos'>('Todos');
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());

  const cards = category === 'Todos' ? FLASHCARDS : FLASHCARDS.filter((c) => c.category === category);
  const current = cards[index];

  const go = (dir: number) => {
    setFlipped(false);
    setTimeout(() => {
      setIndex((i) => (i + dir + cards.length) % cards.length);
    }, 120);
  };

  const markKnown = (knew: boolean) => {
    setKnown((prev) => {
      const next = new Set(prev);
      if (knew) next.add(current.id); else next.delete(current.id);
      return next;
    });
    setFlipped(false);
    setTimeout(() => setIndex((i) => (i + 1) % cards.length), 120);
  };

  const selectCategory = (c: FlashcardCategory | 'Todos') => {
    setCategory(c);
    setIndex(0);
    setFlipped(false);
  };

  const shuffle = () => {
    setFlipped(false);
    setIndex(Math.floor(Math.random() * cards.length));
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Flashcards</h1>
        <p className="mt-1 text-sm text-ink-500">Toque no card para virar e veja a resposta.</p>
      </div>

      {/* Categories */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => selectCategory(c)}
            className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
              category === c ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 ring-1 ring-ink-200 hover:bg-ink-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-ink-600">Card {index + 1} de {cards.length}</span>
        <span className="chip bg-success-100 text-success-700"><Check className="h-3.5 w-3.5" /> {known.size} dominados</span>
      </div>

      {/* Card */}
      {current && (
        <div className="flip-card" onClick={() => setFlipped((f) => !f)}>
          <div className={`flip-inner relative ${flipped ? '' : ''}`} style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)' }}>
            {/* front */}
            <div className="flip-face relative min-h-[280px] rounded-3xl bg-gradient-to-br from-white to-ink-50 p-7 shadow-card ring-1 ring-ink-100 sm:min-h-[320px]">
              <div className="flex items-center justify-between">
                <span className={`chip ${catColor[current.category]}`}>{current.category}</span>
                <RotateCw className="h-5 w-5 text-ink-300" />
              </div>
              <div className="flex h-full min-h-[180px] flex-col items-center justify-center text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Pergunta</p>
                <p className="mt-3 font-display text-xl font-bold leading-snug text-ink-900 sm:text-2xl">{current.front}</p>
              </div>
              <p className="absolute bottom-5 left-0 right-0 text-center text-xs font-semibold text-ink-400">Toque para virar</p>
            </div>
            {/* back */}
            <div className="flip-face flip-back absolute inset-0 min-h-[280px] rounded-3xl bg-gradient-to-br from-primary-600 to-ocean-700 p-7 text-white shadow-card sm:min-h-[320px]">
              <div className="flex items-center justify-between">
                <span className="chip bg-white/15 text-white ring-1 ring-white/20">Resposta</span>
                <RotateCw className="h-5 w-5 text-white/60" />
              </div>
              <div className="flex h-full min-h-[180px] flex-col items-center justify-center text-center">
                <p className="font-display text-xl font-bold leading-snug sm:text-2xl">{current.back}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => go(-1)} className="btn-secondary px-4 py-3"><ArrowLeft className="h-5 w-5" /></button>
        <button onClick={shuffle} className="btn-secondary px-4 py-3"><Shuffle className="h-5 w-5" /> Embaralhar</button>
        <button onClick={() => go(1)} className="btn-secondary px-4 py-3"><ArrowRight className="h-5 w-5" /></button>
      </div>

      {/* Mark known */}
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => markKnown(false)} className="btn flex-1 bg-error-50 px-4 py-3 text-error-700 ring-1 ring-error-200 hover:bg-error-100">
          <X className="h-5 w-5" /> Preciso revisar
        </button>
        <button onClick={() => markKnown(true)} className="btn flex-1 bg-success-50 px-4 py-3 text-success-700 ring-1 ring-success-200 hover:bg-success-100">
          <Check className="h-5 w-5" /> Já sei
        </button>
      </div>

      <button onClick={() => navigate({ name: 'dashboard' })} className="btn-ghost mx-auto block text-sm text-ink-500">
        Voltar ao início
      </button>
    </div>
  );
}
