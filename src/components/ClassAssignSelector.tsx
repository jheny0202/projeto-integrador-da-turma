import { Check } from 'lucide-react';
import type { ClassRow } from '@/lib/api';

export function ClassAssignSelector({ classes, selected, onChange }: { classes: ClassRow[]; selected: string[]; onChange: (ids: string[]) => void }) {
  const toggle = (id: string) => {
    if (selected.includes(id)) onChange(selected.filter((x) => x !== id));
    else onChange([...selected, id]);
  };

  if (classes.length === 0) {
    return <p className="text-xs text-warning-600">Nenhuma turma disponível. Crie uma turma primeiro.</p>;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-ink-500">Atribuir às turmas:</p>
      <div className="grid grid-cols-2 gap-2">
        {classes.map((c) => {
          const checked = selected.includes(c.id);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => toggle(c.id)}
              className={`flex items-center gap-2 rounded-xl p-3 text-left text-sm font-semibold ring-1 transition ${
                checked ? 'bg-primary-50 text-primary-800 ring-2 ring-primary-500' : 'bg-white text-ink-600 ring-ink-200 hover:bg-ink-50'
              } ${!c.is_active ? 'opacity-50' : ''}`}
            >
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${checked ? 'bg-primary-600 text-white' : 'bg-ink-200'}`}>
                {checked && <Check className="h-3.5 w-3.5" />}
              </span>
              <span className="truncate">{c.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
