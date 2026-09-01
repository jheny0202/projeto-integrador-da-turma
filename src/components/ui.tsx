import type { ReactNode } from 'react';

export function ProgressBar({ value, className = '', barClassName = '', showGlow = false }: { value: number; className?: string; barClassName?: string; showGlow?: boolean }) {
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-ink-200 ${className}`}>
      <div
        className={`h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-700 ease-out ${barClassName} ${showGlow ? 'shadow-[0_0_12px_rgba(16,185,129,0.5)]' : ''}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function StatCard({ icon, label, value, accent = 'primary', sub }: { icon: ReactNode; label: string; value: ReactNode; accent?: AccentColor; sub?: string }) {
  const map: Record<AccentColor, string> = {
    primary: 'bg-primary-50 text-primary-700',
    accent: 'bg-accent-50 text-accent-700',
    ocean: 'bg-ocean-50 text-ocean-700',
    warning: 'bg-warning-50 text-warning-700',
    error: 'bg-error-50 text-error-700',
    success: 'bg-success-50 text-success-700',
  };
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${map[accent]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</p>
        <p className="font-display text-lg font-bold leading-tight text-ink-900">{value}</p>
        {sub && <p className="truncate text-xs text-ink-500">{sub}</p>}
      </div>
    </div>
  );
}

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-ink-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Badge({ children, color = 'primary', className = '' }: { children: ReactNode; color?: AccentColor; className?: string }) {
  const map: Record<AccentColor, string> = {
    primary: 'bg-primary-100 text-primary-700',
    accent: 'bg-accent-100 text-accent-700',
    ocean: 'bg-ocean-100 text-ocean-700',
    warning: 'bg-warning-100 text-warning-700',
    error: 'bg-error-100 text-error-700',
    success: 'bg-success-100 text-success-700',
  };
  return <span className={`chip ${map[color]} ${className}`}>{children}</span>;
}

export type AccentColor = 'primary' | 'accent' | 'ocean' | 'warning' | 'error' | 'success';

export const accentBg: Record<AccentColor, string> = {
  primary: 'bg-primary-600',
  accent: 'bg-accent-600',
  ocean: 'bg-ocean-600',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
  success: 'bg-success-600',
};

export const accentSoft: Record<AccentColor, string> = {
  primary: 'bg-primary-50 text-primary-700 ring-primary-200',
  accent: 'bg-accent-50 text-accent-700 ring-accent-200',
  ocean: 'bg-ocean-50 text-ocean-700 ring-ocean-200',
  warning: 'bg-warning-50 text-warning-700 ring-warning-200',
  error: 'bg-error-50 text-error-700 ring-error-200',
  success: 'bg-success-50 text-success-700 ring-success-200',
};

export const accentGrad: Record<AccentColor, string> = {
  primary: 'from-primary-400 to-primary-600',
  accent: 'from-accent-400 to-accent-600',
  ocean: 'from-ocean-400 to-ocean-600',
  warning: 'from-warning-400 to-warning-600',
  error: 'from-error-400 to-error-600',
  success: 'from-success-400 to-success-600',
};

export function XpPill({ xp, className = '' }: { xp: number; className?: string }) {
  return (
    <span className={`chip bg-accent-100 text-accent-700 ${className}`}>
      <span className="font-display font-extrabold">+{xp}</span>
      <span className="text-[10px] font-bold uppercase tracking-wider">XP</span>
    </span>
  );
}
