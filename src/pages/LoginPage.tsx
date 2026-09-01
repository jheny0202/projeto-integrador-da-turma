import { useState } from 'react';
import { Stethoscope, ArrowLeft, User, GraduationCap, Mail, Lock, AtSign, Users, AlertCircle, Loader2 } from 'lucide-react';
import { useApp } from '@/store';

export function LoginPage() {
  const { navigate, login, signUp, classes } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [classId, setClassId] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
          throw new Error('Preencha todos os campos.');
        }
        if (role === 'student' && !classId) {
          throw new Error('Selecione sua turma.');
        }
        await signUp(email, password, name.trim(), username.trim(), role, role === 'student' ? classId : null);
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-ink-50">
      {/* top */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-ocean-800 pb-20 pt-6">
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="relative mx-auto max-w-md px-5">
          <button onClick={() => navigate({ name: 'landing' })} className="flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-white">Enfermagem em Registro</p>
              <p className="text-sm text-primary-200">Desafio da Anotação</p>
            </div>
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold text-white">
            {mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </h1>
          <p className="mt-1 text-sm text-white/80">
            {mode === 'login' ? 'Entre para continuar sua jornada.' : 'Comece a aprender e ganhar XP hoje.'}
          </p>
        </div>
        <svg className="absolute bottom-0 w-full text-ink-50" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>

      {/* form */}
      <div className="mx-auto w-full max-w-md flex-1 px-5 pb-10 pt-6 sm:pt-8">
        <div className="card relative z-10 p-6">
          {/* role toggle */}
          <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-ink-100 p-1">
            <button onClick={() => setRole('student')} className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${role === 'student' ? 'bg-white text-primary-700 shadow-soft' : 'text-ink-500'}`}>
              <GraduationCap className="h-4 w-4" /> Aluno
            </button>
            <button onClick={() => setRole('teacher')} className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${role === 'teacher' ? 'bg-white text-accent-700 shadow-soft' : 'text-ink-500'}`}>
              <User className="h-4 w-4" /> Professor
            </button>
          </div>

          {/* mode toggle */}
          <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-ink-100 p-1">
            <button onClick={() => setMode('login')} className={`rounded-xl py-2.5 text-sm font-semibold transition ${mode === 'login' ? 'bg-white text-ink-900 shadow-soft' : 'text-ink-500'}`}>
              Entrar
            </button>
            <button onClick={() => setMode('signup')} className={`rounded-xl py-2.5 text-sm font-semibold transition ${mode === 'signup' ? 'bg-white text-ink-900 shadow-soft' : 'text-ink-500'}`}>
              Cadastrar
            </button>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-2xl bg-error-50 p-3 ring-1 ring-error-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-error-600" />
              <p className="text-sm font-semibold text-error-700">{error}</p>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="label">Nome completo</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                  <input className="input pl-11" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              </div>
            )}
            {mode === 'signup' && (
              <div>
                <label className="label">Nome de usuário</label>
                <div className="relative">
                  <AtSign className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                  <input className="input pl-11" placeholder="@usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
              </div>
            )}
            <div>
              <label className="label">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                <input type="email" className="input pl-11" placeholder="voce@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="label">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                <input type="password" className="input pl-11" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            {mode === 'signup' && role === 'student' && (
              <div>
                <label className="label">Selecione sua turma</label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400 pointer-events-none" />
                  <select
                    className="input pl-11 appearance-none"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                  >
                    <option value="">Selecione uma turma...</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                {classes.length === 0 && (
                  <p className="mt-1.5 text-xs text-warning-600">Nenhuma turma disponível. Peça ao professor para criar uma turma.</p>
                )}
              </div>
            )}

            <button type="submit" disabled={busy} className="btn-primary w-full py-4 text-base">
              {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : mode === 'login' ? 'ENTRAR' : 'CRIAR CONTA'}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-ink-400">
            {role === 'teacher' ? 'Acesso para professores.' : 'Acesso para alunos.'}
          </p>
        </div>
      </div>
    </div>
  );
}
