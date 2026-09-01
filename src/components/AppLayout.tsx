import type { ReactNode } from 'react';
import { Home, Gamepad2, BookOpen, Trophy, User, LogOut, Stethoscope } from 'lucide-react';
import { useApp, type Route } from '@/store';

const navItems: { label: string; icon: typeof Home; route: Route }[] = [
  { label: 'Início', icon: Home, route: { name: 'dashboard' } },
  { label: 'Desafios', icon: Gamepad2, route: { name: 'challenges' } },
  { label: 'Aprender', icon: BookOpen, route: { name: 'content' } },
  { label: 'Ranking', icon: Trophy, route: { name: 'ranking' } },
  { label: 'Perfil', icon: User, route: { name: 'profile' } },
];

function isActive(current: Route, item: Route): boolean {
  if (current.name === item.name) return true;
  if (item.name === 'challenges' && (current.name === 'activity' || current.name === 'mission' || current.name === 'mission-feedback' || current.name === 'completion')) return true;
  if (item.name === 'dashboard' && (current.name === 'levels' || current.name === 'level')) return true;
  return false;
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, route, navigate, logout } = useApp();

  const Sidebar = (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-ink-100 bg-white">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-glow">
          <Stethoscope className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <p className="font-display text-sm font-bold text-ink-900">Enfermagem</p>
          <p className="text-xs font-semibold text-primary-600">em Registro</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        {navItems.map((item) => {
          const active = isActive(route, item.route);
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.route)}
              className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition ${
                active ? 'bg-primary-50 text-primary-700' : 'text-ink-500 hover:bg-ink-50 hover:text-ink-900'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-ink-100 p-3">
        <button onClick={() => navigate({ name: 'profile' })} className="mb-2 flex w-full items-center gap-3 rounded-2xl px-3 py-2 hover:bg-ink-50">
          <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${user?.avatarColor} text-sm font-bold text-white`}>
            {user?.name.charAt(0)}
          </div>
          <div className="min-w-0 text-left">
            <p className="truncate text-sm font-semibold text-ink-900">{user?.name}</p>
            <p className="truncate text-xs text-ink-400">{user?.turma}</p>
          </div>
        </button>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-ink-500 hover:bg-error-50 hover:text-error-600">
          <LogOut className="h-5 w-5" /> Sair
        </button>
      </div>
    </aside>
  );

  const BottomNav = (
    <nav className="fixed inset-x-0 bottom-0 z-40 lg:hidden border-t border-ink-100 bg-white/95 backdrop-blur-lg safe-pb">
      <div className="mx-auto flex max-w-md items-stretch justify-between px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        {navItems.map((item) => {
          const active = isActive(route, item.route);
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.route)}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 transition ${active ? 'text-primary-600' : 'text-ink-400'}`}
            >
              <item.icon className={`h-5 w-5 ${active ? 'scale-110' : ''} transition`} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-ink-50">
      {Sidebar}
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-24 pt-5 sm:px-6 lg:max-w-5xl lg:pb-10 lg:pt-8">
          {children}
        </main>
      </div>
      {BottomNav}
    </div>
  );
}
