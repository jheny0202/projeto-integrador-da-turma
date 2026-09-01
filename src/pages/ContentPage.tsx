import { useState } from 'react';
import { ChevronRight, Check, BookOpen, ArrowRight, Lightbulb } from 'lucide-react';
import { CONTENT_CATEGORIES } from '@/data';
import { accentSoft, accentGrad } from '@/components/ui';
import * as Lucide from 'lucide-react';
import { useApp } from '@/store';

export function ContentPage() {
  const { navigate } = useApp();
  const [open, setOpen] = useState<string | null>(CONTENT_CATEGORIES[0].id);
  const [done, setDone] = useState<Set<string>>(new Set());

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Biblioteca de estudos</h1>
        <p className="mt-1 text-sm text-ink-500">Conteúdos curtos, exemplos e pequenos desafios.</p>
      </div>

      <div className="space-y-3">
        {CONTENT_CATEGORIES.map((cat) => {
          const isOpen = open === cat.id;
          const Icon = (Lucide as any)[cat.icon] ?? BookOpen;
          return (
            <div key={cat.id} className="card overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : cat.id)}
                className="flex w-full items-center gap-3 p-4 text-left"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accentGrad[cat.color]} text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display font-bold text-ink-900">{cat.title}</p>
                  <p className="text-xs text-ink-500">{cat.topics.length} tópicos</p>
                </div>
                <ChevronRight className={`h-5 w-5 text-ink-300 transition ${isOpen ? 'rotate-90' : ''}`} />
              </button>

              {isOpen && (
                <div className="border-t border-ink-100 p-4 space-y-3 animate-fade-in">
                  {cat.topics.map((t, i) => {
                    const did = done.has(`${cat.id}-${i}`);
                    return (
                      <div key={i} className={`rounded-2xl p-4 ring-1 ${accentSoft[cat.color]}`}>
                        <div className="flex items-center justify-between">
                          <p className="font-display font-bold text-ink-900">{t.title}</p>
                          {did && <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success-500 text-white"><Check className="h-3.5 w-3.5" /></span>}
                        </div>
                        <p className="mt-1 text-sm text-ink-600">{t.summary}</p>
                        <button
                          onClick={() => setDone((prev) => { const n = new Set(prev); n.add(`${cat.id}-${i}`); return n; })}
                          disabled={did}
                          className="mt-3 text-xs font-bold uppercase tracking-wide text-primary-600 disabled:text-success-600"
                        >
                          {did ? 'Concluído' : 'Marcar como lido'}
                        </button>
                      </div>
                    );
                  })}
                  <div className="flex items-start gap-2 rounded-xl bg-warning-50 p-3 ring-1 ring-warning-100">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warning-600" />
                    <p className="text-xs text-warning-800">Aprender → praticar → receber feedback → avançar. Pratique este conteúdo nos desafios.</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={() => navigate({ name: 'challenges' })} className="btn-primary w-full py-4">
        Praticar nos desafios <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
}
