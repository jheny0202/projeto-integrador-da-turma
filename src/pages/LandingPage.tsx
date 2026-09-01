import { Stethoscope, Sparkles, BookOpen, Gamepad2, Trophy, Medal, ArrowRight, Brain, PenLine, Shield, ChevronRight } from 'lucide-react';
import { useApp } from '@/store';

const steps = [
  { icon: BookOpen, label: 'Aprenda', color: 'bg-primary-100 text-primary-700' },
  { icon: Gamepad2, label: 'Pratique', color: 'bg-accent-100 text-accent-700' },
  { icon: Brain, label: 'Resolva desafios', color: 'bg-ocean-100 text-ocean-700' },
  { icon: Sparkles, label: 'Ganhe XP', color: 'bg-warning-100 text-warning-700' },
  { icon: Trophy, label: 'Desbloqueie níveis', color: 'bg-success-100 text-success-700' },
  { icon: Medal, label: 'Evolua no ranking', color: 'bg-error-100 text-error-700' },
];

export function LandingPage() {
  const { navigate } = useApp();

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-ocean-800" />
        <div className="absolute inset-0 bg-dots opacity-40" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-400/30 blur-3xl" />
        <div className="absolute -left-20 top-40 h-64 w-64 rounded-full bg-ocean-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-5 pb-16 pt-6 sm:pb-24 sm:pt-10">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <div className="leading-tight">
                <p className="font-display text-sm font-bold text-white">Enfermagem</p>
                <p className="text-xs font-semibold text-primary-200">em Registro</p>
              </div>
            </div>
            <button onClick={() => navigate({ name: 'login' })} className="btn-ghost text-white hover:bg-white/10">
              Entrar
            </button>
          </div>

          {/* Hero content */}
          <div className="mt-14 max-w-2xl sm:mt-20">
            <span className="chip bg-white/15 text-white ring-1 ring-white/20 backdrop-blur animate-fade-in">
              <Sparkles className="h-3.5 w-3.5" /> Plataforma gamificada
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl animate-slide-up">
              ENFERMAGEM<br />EM REGISTRO
            </h1>
            <p className="mt-3 font-display text-xl font-bold text-primary-200 sm:text-2xl animate-slide-up">
              Desafio da Anotação
            </p>
            <p className="mt-5 text-lg font-semibold text-white/90 sm:text-xl animate-fade-in">
              "Aprenda. Pratique. Registre. Evolua."
            </p>
            <p className="mt-3 max-w-xl text-sm text-white/80 sm:text-base">
              Uma jornada gamificada para desenvolver seus conhecimentos e habilidades em anotação de enfermagem.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button onClick={() => navigate({ name: 'login' })} className="btn bg-white px-6 py-4 text-base text-primary-700 shadow-float hover:bg-primary-50 active:scale-95">
                COMEÇAR MINHA JORNADA <ArrowRight className="h-5 w-5" />
              </button>
              <a href="#como-funciona" className="btn bg-white/10 px-6 py-4 text-base text-white ring-1 ring-white/30 backdrop-blur hover:bg-white/20">
                COMO FUNCIONA
              </a>
            </div>
          </div>
        </div>
        {/* wave divider */}
        <svg className="relative block w-full text-ink-50" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </header>

      {/* Como funciona */}
      <section id="como-funciona" className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
        <div className="text-center">
          <span className="chip bg-primary-100 text-primary-700">Como funciona</span>
          <h2 className="mt-3 font-display text-2xl font-bold text-ink-900 sm:text-3xl">Sua jornada em 6 passos</h2>
          <p className="mt-2 text-ink-500">Do primeiro registro ao topo do ranking — sempre aprendendo enfermagem.</p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {steps.map((s, i) => (
            <div key={s.label} className="card p-5 text-center animate-scale-in" style={{ animationDelay: `${i * 60}ms` }}>
              <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-ink-400">Passo {i + 1}</p>
              <p className="mt-1 font-display font-bold text-ink-900">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-5xl px-5 pb-16 sm:pb-24">
        <div className="grid gap-4 sm:grid-cols-2">
          <FeatureCard
            icon={Gamepad2} color="bg-accent-100 text-accent-700"
            title="Desafios interativos"
            text="Múltipla escolha, caçador de erros, montagem de registros e missões clínicas — não só questões."
          />
          <FeatureCard
            icon={Medal} color="bg-warning-100 text-warning-700"
            title="XP, níveis e medalhas"
            text="Ganhe experiência, suba de nível e desbloqueie conquistas enquanto aprende."
          />
          <FeatureCard
            icon={Brain} color="bg-ocean-100 text-ocean-700"
            title="Pensamento crítico"
            text="Casos clínicos fictícios que treinam raciocínio e tomada de decisão."
          />
          <FeatureCard
            icon={Shield} color="bg-success-100 text-success-700"
            title="Conteúdo seguro"
            text="Casos fictícios, revisáveis pelo professor. Não substitui protocolos institucionais."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-5 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 to-ink-800 p-8 text-center sm:p-12">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="relative">
            <PenLine className="mx-auto h-10 w-10 text-primary-400" />
            <h2 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">Pronto para o primeiro registro?</h2>
            <p className="mt-2 text-ink-300">Comece no Nível 1 e evolua até se tornar Mestre do Registro.</p>
            <button onClick={() => navigate({ name: 'login' })} className="btn-primary mt-6 mx-auto px-6 py-4 text-base">
              COMEÇAR AGORA <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-ink-400">
          Plataforma educacional. Casos clínicos fictícios. Não substitui protocolos, professores ou referências oficiais.
        </p>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, color, title, text }: { icon: typeof BookOpen; color: string; title: string; text: string }) {
  return (
    <div className="card p-6 transition hover:shadow-float">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-ink-900">{title}</h3>
      <p className="mt-1.5 text-sm text-ink-500">{text}</p>
    </div>
  );
}
