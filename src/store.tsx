import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User } from '@/types';
import { supabase } from '@/lib/supabase';
import { fetchProfile, addXpToProfile, unlockBadgeInProfile, fetchActiveClasses, signIn, signUp as apiSignUp } from '@/lib/api';
import type { ClassRow } from '@/lib/api';

export type Route =
  | { name: 'landing' }
  | { name: 'login' }
  | { name: 'dashboard' }
  | { name: 'levels' }
  | { name: 'level'; levelId: number }
  | { name: 'flashcards' }
  | { name: 'challenges' }
  | { name: 'activity'; activityId: string }
  | { name: 'mission'; caseId?: string }
  | { name: 'mission-feedback'; missionId: string; answers: Record<string, string>; caseId?: string }
  | { name: 'completion'; xp: number; badgeId?: string; title: string; nextRoute?: Route }
  | { name: 'ranking' }
  | { name: 'profile' }
  | { name: 'content' }
  | { name: 'teacher' }
  | { name: 'teacher-classes' }
  | { name: 'teacher-content' }
  | { name: 'teacher-reports' }
  | { name: 'teacher-report-class'; classId: string }
  | { name: 'teacher-report-student'; studentId: string }
  | { name: 'teacher-create-activity' }
  | { name: 'teacher-create-question' }
  | { name: 'teacher-create-flashcard' }
  | { name: 'teacher-create-case' }
  | { name: 'dev' }
  | { name: 'dev-students' }
  | { name: 'dev-teachers' }
  | { name: 'dev-users' }
  | { name: 'feedback' };

type AppState = {
  user: User | null;
  route: Route;
  xpAnimKey: number;
  classes: ClassRow[];
  loading: boolean;
  devMode: 'student' | 'teacher' | null;
  exitDevMode: () => void;
  enterDevMode: (mode: 'student' | 'teacher') => void;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, username: string, role: 'student' | 'teacher', classId: string | null) => Promise<void>;
  logout: () => void;
  navigate: (route: Route) => void;
  addXp: (amount: number) => void;
  unlockBadge: (badgeId: string) => void;
  refreshUser: () => Promise<void>;
  refreshClasses: () => Promise<void>;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [route, setRoute] = useState<Route>({ name: 'landing' });
  const [xpAnimKey, setXpAnimKey] = useState(0);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [devMode, setDevMode] = useState<'student' | 'teacher' | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user && mounted) {
        const profile = await fetchProfile(session.user.id);
        if (profile && mounted) {
          setUser(profile);
          setRoute(profile.role === 'teacher' ? { name: 'teacher' } : { name: 'dashboard' });
        }
      }
      if (mounted) setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          if (profile) {
            setUser(profile);
            if (route.name === 'landing' || route.name === 'login') {
              setRoute(profile.role === 'teacher' ? { name: 'teacher' } : { name: 'dashboard' });
            }
          }
        } else {
          setUser(null);
        }
      })();
    });

    return () => { subscription.unsubscribe(); mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshClasses = useCallback(async () => {
    try {
      const active = await fetchActiveClasses();
      setClasses(active);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { refreshClasses(); }, [refreshClasses]);

  const login = useCallback(async (email: string, password: string) => {
    const authUser = await signIn(email, password);

  const signUp = useCallback(async (email: string, password: string, name: string, username: string, role: 'student' | 'teacher', classId: string | null) => {
    await apiSignUp(email, password, name, username, role, classId);
    const authUser = await signIn(email, password);
    const profile = await fetchProfile(authUser.id);
    if (profile) {
      setUser(profile);
      setRoute(profile.role === 'teacher' ? { name: 'teacher' } : { name: 'dashboard' });
    }
  }, []);

  const enterDevMode = useCallback((mode: 'student' | 'teacher') => {
    setDevMode(mode);
    setUser(mode === 'teacher' ? {
      id: 'dev-teacher',
      name: 'Prof. Dra. Helena Castro',
      username: '@profhelena',
      email: 'dev-teacher@preview.local',
      role: 'teacher',
      avatarColor: 'from-accent-400 to-accent-600',
      xp: 0, level: 0, streak: 0, activitiesCompleted: 0, badgeIds: [], joinedAt: '2026-07-01',
    } : {
      id: 'dev-student',
      name: 'Aluno(a) Visualização',
      username: '@devstudent',
      email: 'dev-student@preview.local',
      role: 'student',
      turma: 'Turma de Visualização',
      avatarColor: 'from-primary-400 to-accent-500',
      xp: 420, level: 2, streak: 3, activitiesCompleted: 4, badgeIds: ['first-record'], joinedAt: '2026-08-20',
    });
    setRoute(mode === 'teacher' ? { name: 'teacher' } : { name: 'dashboard' });
  }, []);

  const logout = useCallback(async () => {
    try { await supabase.auth.signOut(); } catch { /* ignore */ }
    setUser(null);
    setRoute({ name: 'landing' });
  }, []);

  const exitDevMode = useCallback(() => {
    setDevMode(null);
    setUser(null);
    setRoute({ name: 'landing' });
  }, []);

  const navigate = useCallback((r: Route) => {
    setRoute(r);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user) return;
    const profile = await fetchProfile(user.id);
    if (profile) setUser(profile);
  }, [user]);

  const addXp = useCallback((amount: number) => {
    setUser((prev) => {
      if (!prev) return prev;
      const newXp = prev.xp + amount;
      const newLevel = computeLevel(newXp);
      return { ...prev, xp: newXp, level: newLevel, activitiesCompleted: prev.activitiesCompleted + 1 };
    });
    setXpAnimKey((k) => k + 1);
    if (user) addXpToProfile(user.id, amount).catch(() => {});
  }, [user]);

  const unlockBadge = useCallback((badgeId: string) => {
    setUser((prev) => {
      if (!prev || prev.badgeIds.includes(badgeId)) return prev;
      return { ...prev, badgeIds: [...prev.badgeIds, badgeId] };
    });
    if (user) unlockBadgeInProfile(user.id, badgeId).catch(() => {});
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ user, route, xpAnimKey, classes, loading, devMode, exitDevMode, enterDevMode, login, signUp, logout, navigate, addXp, unlockBadge, refreshUser, refreshClasses }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function xpForLevel(level: number): number {
  const thresholds = [0, 250, 550, 900, 1300, 1750, 2250, 2850, 3500, 4300, 5300];
  return thresholds[Math.min(level, thresholds.length - 1)];
}

export function computeLevel(xp: number): number {
  const thresholds = [0, 250, 550, 900, 1300, 1750, 2250, 2850, 3500, 4300, 5300];
  let level = 1;
  for (let i = 1; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) level = i + 1;
    else break;
  }
  return level;
}

export function levelProgress(xp: number, level: number) {
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const span = next - base;
  const into = xp - base;
  return { base, next, pct: Math.max(0, Math.min(100, Math.round((into / span) * 100))) };
}
