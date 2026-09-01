export type Role = 'student' | 'teacher';

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: Role;
  turma?: string;
  className?: string;
  avatarColor: string;
  xp: number;
  level: number;
  streak: number;
  activitiesCompleted: number;
  badgeIds: string[];
  joinedAt: string;
};

export type ClassEntity = {
  id: string;
  name: string;
  description?: string | null;
  semester?: string | null;
  is_active: boolean;
  teacher_id: string;
  created_at: string;
};

export type TeacherActivity = {
  id: string;
  title: string;
  description?: string | null;
  subject?: string | null;
  difficulty: string;
  points: number;
  estimated_minutes?: number | null;
  status: string;
  activity_type: string;
  level_id: number;
  teacher_id: string;
  created_at: string;
};

export type TeacherQuestion = {
  id: string;
  activity_id: string;
  question_text: string;
  question_type: string;
  options?: any[] | null;
  correct_answer?: string | null;
  explanation?: string | null;
  difficulty: string;
  topic?: string | null;
  points: number;
};

export type TeacherFlashcard = {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: string;
  explanation?: string | null;
  teacher_id: string;
};

export type TeacherClinicalCase = {
  id: string;
  title: string;
  scenario: string;
  patient_name?: string | null;
  patient_age?: number | null;
  patient_info?: string | null;
  symptoms?: string | null;
  vitals?: any | null;
  relevant_info?: string | null;
  questions: any[];
  correct_answers?: any | null;
  explanations?: any | null;
  rubric: any[];
  model_answer?: string | null;
  difficulty: string;
  topic?: string | null;
  points: number;
  level_id: number;
  teacher_id: string;
};

export type Level = {
  id: number;
  title: string;
  subtitle: string;
  objective: string;
  content: string;
  rewardXp: number;
  unlockXp: number;
  icon: string;
  accent: 'primary' | 'accent' | 'ocean' | 'warning' | 'error' | 'success';
};

export type ActivityType =
  | 'multiple-choice'
  | 'true-false'
  | 'association'
  | 'fill-blank'
  | 'order-info'
  | 'find-error'
  | 'best-note'
  | 'build-note'
  | 'mission';

export type Activity = {
  id: string;
  levelId: number;
  type: ActivityType;
  title: string;
  prompt: string;
  xp: number;
  // multiple-choice / true-false
  options?: { id: string; text: string; correct?: boolean }[];
  // association
  pairs?: { left: string; right: string }[];
  // fill-blank
  sentenceParts?: string[];
  blankOptions?: string[];
  blankAnswer?: string;
  // order-info / build-note
  fragments?: string[];
  correctOrder?: number[];
  // find-error
  errorSegments?: { id: string; text: string; isError: boolean; feedback: string }[];
  // best-note
  noteOptions?: { id: string; text: string; isBest: boolean; feedback: string }[];
  // explanation / teacher tip
  explanation?: string;
  teacherTip?: string;
};

export type Flashcard = {
  id: string;
  category: FlashcardCategory;
  front: string;
  back: string;
};

export type FlashcardCategory =
  | 'Sinais e sintomas'
  | 'Terminologias'
  | 'Sinais vitais'
  | 'Procedimentos'
  | 'Comunicação'
  | 'Registros de enfermagem';

export type Mission = {
  id: string;
  title: string;
  levelId: number;
  scenario: string;
  patient: { name: string; age: number; info: string };
  vitals: { label: string; value: string }[];
  questions: { id: string; text: string; placeholder: string }[];
  rubric: { criterion: string; description: string }[];
  rewardXp: number;
  modelAnswer: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: 'primary' | 'accent' | 'ocean' | 'warning' | 'error' | 'success';
};

export type RankingEntry = {
  id: string;
  name: string;
  username: string;
  turma: string;
  xp: number;
  level: number;
  avatarColor: string;
  isMe?: boolean;
};

export type ContentCategory = {
  id: string;
  title: string;
  icon: string;
  color: 'primary' | 'accent' | 'ocean' | 'warning' | 'error' | 'success';
  topics: { title: string; summary: string }[];
};
