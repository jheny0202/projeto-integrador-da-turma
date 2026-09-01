import { supabase } from '@/lib/supabase';
import type { User, Flashcard, Activity, Mission } from '@/types';

// ============ TYPES ============
export type ClassRow = {
  id: string;
  name: string;
  description: string | null;
  semester: string | null;
  is_active: boolean;
  teacher_id: string;
  created_at: string;
};

export type ActivityRow = {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  difficulty: string;
  points: number;
  estimated_minutes: number | null;
  status: string;
  activity_type: string;
  level_id: number;
  teacher_id: string;
  created_at: string;
};

export type QuestionRow = {
  id: string;
  activity_id: string;
  question_text: string;
  question_type: string;
  options: any[] | null;
  correct_answer: string | null;
  explanation: string | null;
  difficulty: string;
  topic: string | null;
  points: number;
};

export type FlashcardRow = {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: string;
  explanation: string | null;
  teacher_id: string;
};

export type ClinicalCaseRow = {
  id: string;
  title: string;
  scenario: string;
  patient_name: string | null;
  patient_age: number | null;
  patient_info: string | null;
  symptoms: string | null;
  vitals: any | null;
  relevant_info: string | null;
  questions: any[];
  correct_answers: any | null;
  explanations: any | null;
  rubric: any[];
  model_answer: string | null;
  difficulty: string;
  topic: string | null;
  points: number;
  level_id: number;
  teacher_id: string;
};

export type ProfileRow = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  class_id: string | null;
  avatar_color: string;
  xp: number;
  level: number;
  streak: number;
  activities_completed: number;
  badge_ids: string[];
  joined_at: string;
};

const AVATAR_COLORS = [
  'from-primary-400 to-primary-600',
  'from-accent-400 to-accent-600',
  'from-ocean-400 to-ocean-600',
  'from-warning-400 to-warning-600',
  'from-error-400 to-error-600',
  'from-success-400 to-success-600',
];

export function randomAvatarColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

// ============ AUTH ============
export async function signUp(email: string, password: string, name: string, username: string, role: 'student' | 'teacher', classId: string | null) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, username, role } },
  });
  if (error) throw error;
  if (!data.user) throw new Error('Falha ao criar conta');

  // Create profile
  const { error: profileErr } = await supabase.from('profiles').insert({
    id: data.user.id,
    name,
    username,
    email,
    role,
    class_id: role === 'student' ? classId : null,
    avatar_color: randomAvatarColor(),
  });
  if (profileErr) throw profileErr;
  return data.user;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ============ PROFILE ============
export async function fetchProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const p = data as ProfileRow;
  return {
    id: p.id,
    name: p.name,
    username: p.username,
    email: p.email,
    role: p.role as 'student' | 'teacher',
    turma: p.class_id ?? undefined,
    avatarColor: p.avatar_color,
    xp: p.xp,
    level: p.level,
    streak: p.streak,
    activitiesCompleted: p.activities_completed,
    badgeIds: p.badge_ids ?? [],
    joinedAt: p.joined_at,
  };
}

export async function updateProfile(userId: string, updates: Partial<ProfileRow>) {
  const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
  if (error) throw error;
}

export async function addXpToProfile(userId: string, amount: number) {
  const { data: p, error } = await supabase.from('profiles').select('xp, level, activities_completed, badge_ids').eq('id', userId).maybeSingle();
  if (error) throw error;
  if (!p) return;
  const newXp = p.xp + amount;
  const newLevel = computeLevelLocal(newXp);
  await supabase.from('profiles').update({
    xp: newXp,
    level: newLevel,
    activities_completed: (p.activities_completed ?? 0) + 1,
  }).eq('id', userId);
}

export async function unlockBadgeInProfile(userId: string, badgeId: string) {
  const { data: p, error } = await supabase.from('profiles').select('badge_ids').eq('id', userId).maybeSingle();
  if (error) throw error;
  if (!p) return;
  if ((p.badge_ids ?? []).includes(badgeId)) return;
  await supabase.from('profiles').update({
    badge_ids: [...(p.badge_ids ?? []), badgeId],
  }).eq('id', userId);
}

function computeLevelLocal(xp: number): number {
  const thresholds = [0, 250, 550, 900, 1300, 1750, 2250, 2850, 3500, 4300, 5300];
  let level = 1;
  for (let i = 1; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) level = i + 1; else break;
  }
  return level;
}

// ============ CLASSES ============
export async function fetchClasses(): Promise<ClassRow[]> {
  const { data, error } = await supabase.from('classes').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as ClassRow[];
}

export async function fetchActiveClasses(): Promise<ClassRow[]> {
  const { data, error } = await supabase.from('classes').select('*').eq('is_active', true).order('name', { ascending: true });
  if (error) throw error;
  return (data ?? []) as ClassRow[];
}

export async function createClass(name: string, description: string, semester: string, teacherId: string): Promise<ClassRow> {
  const { data, error } = await supabase.from('classes').insert({
    name, description: description || null, semester: semester || null, is_active: true, teacher_id: teacherId,
  }).select().single();
  if (error) throw error;
  return data as ClassRow;
}

export async function updateClass(id: string, updates: Partial<ClassRow>) {
  const { error } = await supabase.from('classes').update({
    name: updates.name,
    description: updates.description,
    semester: updates.semester,
    is_active: updates.is_active,
  }).eq('id', id);
  if (error) throw error;
}

export async function deleteClass(id: string) {
  const { error } = await supabase.from('classes').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchStudentsInClass(classId: string): Promise<ProfileRow[]> {
  const { data, error } = await supabase.from('profiles').select('*').eq('class_id', classId).eq('role', 'student').order('xp', { ascending: false });
  if (error) throw error;
  return (data ?? []) as ProfileRow[];
}

// ============ ACTIVITIES ============
export async function fetchTeacherActivities(teacherId: string): Promise<ActivityRow[]> {
  const { data, error } = await supabase.from('teacher_activities').select('*').eq('teacher_id', teacherId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as ActivityRow[];
}

export async function fetchActivitiesForClass(classId: string): Promise<ActivityRow[]> {
  const { data, error } = await supabase
    .from('class_activities')
    .select('activity_id, teacher_activities(*)')
    .eq('class_id', classId);
  if (error) throw error;
  return (data ?? []).map((r: any) => r.teacher_activities).filter(Boolean) as ActivityRow[];
}

export async function createActivity(activity: Partial<ActivityRow> & { teacher_id: string }): Promise<ActivityRow> {
  const { data, error } = await supabase.from('teacher_activities').insert(activity).select().single();
  if (error) throw error;
  return data as ActivityRow;
}

export async function updateActivity(id: string, updates: Partial<ActivityRow>) {
  const { error } = await supabase.from('teacher_activities').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteActivity(id: string) {
  const { error } = await supabase.from('teacher_activities').delete().eq('id', id);
  if (error) throw error;
}

// ============ QUESTIONS ============
export async function fetchQuestionsForActivity(activityId: string): Promise<QuestionRow[]> {
  const { data, error } = await supabase.from('teacher_questions').select('*').eq('activity_id', activityId).order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as QuestionRow[];
}

export async function createQuestion(question: Partial<QuestionRow> & { activity_id: string }): Promise<QuestionRow> {
  const { data, error } = await supabase.from('teacher_questions').insert(question).select().single();
  if (error) throw error;
  return data as QuestionRow;
}

export async function deleteQuestion(id: string) {
  const { error } = await supabase.from('teacher_questions').delete().eq('id', id);
  if (error) throw error;
}

// ============ FLASHCARDS ============
export async function fetchTeacherFlashcards(teacherId: string): Promise<FlashcardRow[]> {
  const { data, error } = await supabase.from('teacher_flashcards').select('*').eq('teacher_id', teacherId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as FlashcardRow[];
}

export async function fetchFlashcardsForClass(classId: string): Promise<Flashcard[]> {
  const { data, error } = await supabase
    .from('class_flashcards')
    .select('flashcard_id, teacher_flashcards(*)')
    .eq('class_id', classId);
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: r.teacher_flashcards.id,
    category: r.teacher_flashcards.category,
    front: r.teacher_flashcards.front,
    back: r.teacher_flashcards.back,
  })).filter(Boolean);
}

export async function createFlashcard(fc: Partial<FlashcardRow> & { teacher_id: string }): Promise<FlashcardRow> {
  const { data, error } = await supabase.from('teacher_flashcards').insert(fc).select().single();
  if (error) throw error;
  return data as FlashcardRow;
}

export async function deleteFlashcard(id: string) {
  const { error } = await supabase.from('teacher_flashcards').delete().eq('id', id);
  if (error) throw error;
}

// ============ CLINICAL CASES ============
export async function fetchTeacherClinicalCases(teacherId: string): Promise<ClinicalCaseRow[]> {
  const { data, error } = await supabase.from('teacher_clinical_cases').select('*').eq('teacher_id', teacherId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as ClinicalCaseRow[];
}

export async function fetchClinicalCasesForClass(classId: string): Promise<ClinicalCaseRow[]> {
  const { data, error } = await supabase
    .from('class_clinical_cases')
    .select('case_id, teacher_clinical_cases(*)')
    .eq('class_id', classId);
  if (error) throw error;
  return (data ?? []).map((r: any) => r.teacher_clinical_cases).filter(Boolean) as ClinicalCaseRow[];
}

export async function createClinicalCase(cc: Partial<ClinicalCaseRow> & { teacher_id: string }): Promise<ClinicalCaseRow> {
  const { data, error } = await supabase.from('teacher_clinical_cases').insert(cc).select().single();
  if (error) throw error;
  return data as ClinicalCaseRow;
}

export async function deleteClinicalCase(id: string) {
  const { error } = await supabase.from('teacher_clinical_cases').delete().eq('id', id);
  if (error) throw error;
}

// ============ ASSIGNMENTS ============
export async function assignActivityToClasses(activityId: string, classIds: string[]) {
  const { error: delErr } = await supabase.from('class_activities').delete().eq('activity_id', activityId);
  if (delErr) throw delErr;
  if (classIds.length === 0) return;
  const rows = classIds.map((cid) => ({ class_id: cid, activity_id: activityId }));
  const { error } = await supabase.from('class_activities').insert(rows);
  if (error) throw error;
}

export async function assignFlashcardToClasses(flashcardId: string, classIds: string[]) {
  const { error: delErr } = await supabase.from('class_flashcards').delete().eq('flashcard_id', flashcardId);
  if (delErr) throw delErr;
  if (classIds.length === 0) return;
  const rows = classIds.map((cid) => ({ class_id: cid, flashcard_id: flashcardId }));
  const { error } = await supabase.from('class_flashcards').insert(rows);
  if (error) throw error;
}

export async function assignClinicalCaseToClasses(caseId: string, classIds: string[]) {
  const { error: delErr } = await supabase.from('class_clinical_cases').delete().eq('case_id', caseId);
  if (delErr) throw delErr;
  if (classIds.length === 0) return;
  const rows = classIds.map((cid) => ({ class_id: cid, case_id: caseId }));
  const { error } = await supabase.from('class_clinical_cases').insert(rows);
  if (error) throw error;
}

export async function fetchAssignedClassIdsForActivity(activityId: string): Promise<string[]> {
  const { data, error } = await supabase.from('class_activities').select('class_id').eq('activity_id', activityId);
  if (error) throw error;
  return (data ?? []).map((r: any) => r.class_id);
}

export async function fetchAssignedClassIdsForFlashcard(flashcardId: string): Promise<string[]> {
  const { data, error } = await supabase.from('class_flashcards').select('class_id').eq('flashcard_id', flashcardId);
  if (error) throw error;
  return (data ?? []).map((r: any) => r.class_id);
}

export async function fetchAssignedClassIdsForCase(caseId: string): Promise<string[]> {
  const { data, error } = await supabase.from('class_clinical_cases').select('class_id').eq('case_id', caseId);
  if (error) throw error;
  return (data ?? []).map((r: any) => r.class_id);
}

// ============ STUDENT PROGRESS ============
export async function recordActivityResult(studentId: string, activityId: string, correct: boolean, xpEarned: number) {
  const { error } = await supabase.from('activity_results').upsert({
    student_id: studentId,
    activity_id: activityId,
    correct,
    xp_earned: xpEarned,
    completed_at: new Date().toISOString(),
  }, { onConflict: 'student_id,activity_id' });
  if (error) throw error;
}

export async function fetchStudentActivityResults(studentId: string) {
  const { data, error } = await supabase.from('activity_results').select('*').eq('student_id', studentId);
  if (error) throw error;
  return data ?? [];
}

export async function recordFlashcardProgress(studentId: string, flashcardId: string, known: boolean) {
  const { error } = await supabase.from('flashcard_progress').upsert({
    student_id: studentId,
    flashcard_id: flashcardId,
    known,
    reviewed_at: new Date().toISOString(),
  }, { onConflict: 'student_id,flashcard_id' });
  if (error) throw error;
}

export async function fetchStudentFlashcardProgress(studentId: string) {
  const { data, error } = await supabase.from('flashcard_progress').select('*').eq('student_id', studentId);
  if (error) throw error;
  return data ?? [];
}

export async function recordClinicalCaseResult(studentId: string, caseId: string, answers: Record<string, string>, score: number, xpEarned: number) {
  const { error } = await supabase.from('clinical_case_results').upsert({
    student_id: studentId,
    case_id: caseId,
    answers,
    score,
    xp_earned: xpEarned,
    completed_at: new Date().toISOString(),
  }, { onConflict: 'student_id,case_id' });
  if (error) throw error;
}

export async function fetchStudentClinicalCaseResults(studentId: string) {
  const { data, error } = await supabase.from('clinical_case_results').select('*').eq('student_id', studentId);
  if (error) throw error;
  return data ?? [];
}

// ============ RANKING ============
export async function fetchRankingForClass(classId: string): Promise<ProfileRow[]> {
  const { data, error } = await supabase.from('profiles').select('*').eq('class_id', classId).eq('role', 'student').order('xp', { ascending: false });
  if (error) throw error;
  return (data ?? []) as ProfileRow[];
}

// ============ CLASS REPORTS ============
export async function fetchClassReportData(classId: string) {
  const [students, activities, flashcards, cases] = await Promise.all([
    fetchStudentsInClass(classId),
    fetchActivitiesForClass(classId),
    fetchFlashcardsForClass(classId),
    fetchClinicalCasesForClass(classId),
  ]);

  const studentIds = students.map((s) => s.id);

  let allActivityResults: any[] = [];
  let allFlashcardProgress: any[] = [];
  let allCaseResults: any[] = [];

  if (studentIds.length > 0) {
    const [ar, fp, cr] = await Promise.all([
      supabase.from('activity_results').select('*').in('student_id', studentIds),
      supabase.from('flashcard_progress').select('*').in('student_id', studentIds),
      supabase.from('clinical_case_results').select('*').in('student_id', studentIds),
    ]);
    allActivityResults = ar.data ?? [];
    allFlashcardProgress = fp.data ?? [];
    allCaseResults = cr.data ?? [];
  }

  return { students, activities, flashcards, cases, allActivityResults, allFlashcardProgress, allCaseResults };
}
