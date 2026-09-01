import { AppProvider, useApp } from '@/store';
import { AppLayout } from '@/components/AppLayout';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { LevelsPage } from '@/pages/LevelsPage';
import { LevelDetailPage } from '@/pages/LevelDetailPage';
import { FlashcardsPage } from '@/pages/FlashcardsPage';
import { ChallengesPage } from '@/pages/ChallengesPage';
import { ActivityPage } from '@/pages/ActivityPage';
import { MissionPage } from '@/pages/MissionPage';
import { MissionFeedbackPage } from '@/pages/MissionFeedbackPage';
import { RankingPage } from '@/pages/RankingPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { ContentPage } from '@/pages/ContentPage';
import { TeacherPage } from '@/pages/TeacherPage';
import { CompletionPage } from '@/pages/CompletionPage';

function Router() {
  const { route, user } = useApp();

  // Public routes (no layout)
  if (route.name === 'landing') return <LandingPage />;
  if (route.name === 'login') return <LoginPage />;
  if (route.name === 'completion') {
    if (route.name !== 'completion') return null;
    return <CompletionPage xp={route.xp} badgeId={route.badgeId} title={route.title} nextRoute={route.nextRoute} />;
  }

  // Teacher route (own layout)
  if (route.name === 'teacher' || (user?.role === 'teacher' && route.name === 'dashboard')) {
    return <TeacherPage />;
  }

  // Protected: require user
  if (!user) return <LoginPage />;

  const page = (() => {
    switch (route.name) {
      case 'dashboard': return <DashboardPage />;
      case 'levels': return <LevelsPage />;
      case 'level': return <LevelDetailPage levelId={route.levelId} />;
      case 'flashcards': return <FlashcardsPage />;
      case 'challenges': return <ChallengesPage />;
      case 'activity': return <ActivityPage activityId={route.activityId} />;
      case 'mission': return <MissionPage />;
      case 'mission-feedback': return <MissionFeedbackPage missionId={route.missionId} answers={route.answers} />;
      case 'ranking': return <RankingPage />;
      case 'profile': return <ProfilePage />;
      case 'content': return <ContentPage />;
      default: return <DashboardPage />;
    }
  })();

  return <AppLayout>{page}</AppLayout>;
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
