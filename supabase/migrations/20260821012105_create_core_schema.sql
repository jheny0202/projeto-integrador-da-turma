/*
# Core schema for Enfermagem em Registro platform

Creates the full data model: profiles, classes, content (activities,
questions, flashcards, clinical cases), class assignments, and student
progress tracking. RLS on every table with role-based policies.
*/

-- ============ ALL TABLES FIRST ============

CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  semester text,
  is_active boolean NOT NULL DEFAULT true,
  teacher_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  username text NOT NULL,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student','teacher')),
  class_id uuid REFERENCES classes(id) ON DELETE SET NULL,
  avatar_color text NOT NULL DEFAULT 'from-primary-400 to-accent-500',
  xp integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  streak integer NOT NULL DEFAULT 0,
  activities_completed integer NOT NULL DEFAULT 0,
  badge_ids text[] NOT NULL DEFAULT '{}',
  joined_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS teacher_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  subject text,
  difficulty text DEFAULT 'medium' CHECK (difficulty IN ('easy','medium','hard')),
  points integer NOT NULL DEFAULT 50,
  estimated_minutes integer,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  activity_type text NOT NULL DEFAULT 'multiple-choice' CHECK (activity_type IN ('multiple-choice','true-false','association','fill-blank','order-info','find-error','best-note','build-note','mission')),
  level_id integer NOT NULL DEFAULT 1,
  teacher_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS teacher_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid NOT NULL REFERENCES teacher_activities(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  question_type text NOT NULL DEFAULT 'multiple-choice',
  options jsonb,
  correct_answer text,
  explanation text,
  difficulty text DEFAULT 'medium',
  topic text,
  points integer NOT NULL DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS teacher_flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  front text NOT NULL,
  back text NOT NULL,
  category text NOT NULL DEFAULT 'Terminologias',
  difficulty text DEFAULT 'medium',
  explanation text,
  teacher_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS teacher_clinical_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  scenario text NOT NULL,
  patient_name text,
  patient_age integer,
  patient_info text,
  symptoms text,
  vitals jsonb,
  relevant_info text,
  questions jsonb NOT NULL DEFAULT '[]',
  correct_answers jsonb,
  explanations jsonb,
  rubric jsonb NOT NULL DEFAULT '[]',
  model_answer text,
  difficulty text DEFAULT 'medium',
  topic text,
  points integer NOT NULL DEFAULT 200,
  level_id integer NOT NULL DEFAULT 9,
  teacher_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS class_activities (
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  activity_id uuid NOT NULL REFERENCES teacher_activities(id) ON DELETE CASCADE,
  PRIMARY KEY (class_id, activity_id)
);

CREATE TABLE IF NOT EXISTS class_flashcards (
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  flashcard_id uuid NOT NULL REFERENCES teacher_flashcards(id) ON DELETE CASCADE,
  PRIMARY KEY (class_id, flashcard_id)
);

CREATE TABLE IF NOT EXISTS class_clinical_cases (
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  case_id uuid NOT NULL REFERENCES teacher_clinical_cases(id) ON DELETE CASCADE,
  PRIMARY KEY (class_id, case_id)
);

CREATE TABLE IF NOT EXISTS activity_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id uuid NOT NULL REFERENCES teacher_activities(id) ON DELETE CASCADE,
  correct boolean NOT NULL,
  xp_earned integer NOT NULL DEFAULT 0,
  completed_at timestamptz DEFAULT now(),
  UNIQUE (student_id, activity_id)
);

CREATE TABLE IF NOT EXISTS flashcard_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flashcard_id uuid NOT NULL REFERENCES teacher_flashcards(id) ON DELETE CASCADE,
  known boolean NOT NULL DEFAULT false,
  reviewed_at timestamptz DEFAULT now(),
  UNIQUE (student_id, flashcard_id)
);

CREATE TABLE IF NOT EXISTS clinical_case_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_id uuid NOT NULL REFERENCES teacher_clinical_cases(id) ON DELETE CASCADE,
  answers jsonb NOT NULL DEFAULT '{}',
  score integer NOT NULL DEFAULT 0,
  xp_earned integer NOT NULL DEFAULT 0,
  completed_at timestamptz DEFAULT now(),
  UNIQUE (student_id, case_id)
);

-- ============ ENABLE RLS ============
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_clinical_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_clinical_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_case_results ENABLE ROW LEVEL SECURITY;

-- ============ PROFILES POLICIES ============
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "select_all_profiles_teacher" ON profiles;
CREATE POLICY "select_all_profiles_teacher" ON profiles FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'teacher')
  );

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============ CLASSES POLICIES ============
DROP POLICY IF EXISTS "select_classes" ON classes;
CREATE POLICY "select_classes" ON classes FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_classes_teacher" ON classes;
CREATE POLICY "insert_classes_teacher" ON classes FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'teacher')
  );

DROP POLICY IF EXISTS "update_classes_teacher" ON classes;
CREATE POLICY "update_classes_teacher" ON classes FOR UPDATE
  TO authenticated USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

DROP POLICY IF EXISTS "delete_classes_teacher" ON classes;
CREATE POLICY "delete_classes_teacher" ON classes FOR DELETE
  TO authenticated USING (teacher_id = auth.uid());

-- ============ ACTIVITIES POLICIES ============
DROP POLICY IF EXISTS "select_activities_assigned" ON teacher_activities;
CREATE POLICY "select_activities_assigned" ON teacher_activities FOR SELECT
  TO authenticated USING (
    teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM class_activities ca
      JOIN profiles p ON p.id = auth.uid()
      WHERE ca.activity_id = teacher_activities.id AND ca.class_id = p.class_id
    )
  );

DROP POLICY IF EXISTS "insert_activities_teacher" ON teacher_activities;
CREATE POLICY "insert_activities_teacher" ON teacher_activities FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = teacher_id);

DROP POLICY IF EXISTS "update_activities_teacher" ON teacher_activities;
CREATE POLICY "update_activities_teacher" ON teacher_activities FOR UPDATE
  TO authenticated USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

DROP POLICY IF EXISTS "delete_activities_teacher" ON teacher_activities;
CREATE POLICY "delete_activities_teacher" ON teacher_activities FOR DELETE
  TO authenticated USING (teacher_id = auth.uid());

-- ============ QUESTIONS POLICIES ============
DROP POLICY IF EXISTS "select_questions" ON teacher_questions;
CREATE POLICY "select_questions" ON teacher_questions FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM teacher_activities a WHERE a.id = teacher_questions.activity_id AND a.teacher_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM class_activities ca
      JOIN profiles p ON p.id = auth.uid()
      WHERE ca.activity_id = teacher_questions.activity_id AND ca.class_id = p.class_id
    )
  );

DROP POLICY IF EXISTS "insert_questions_teacher" ON teacher_questions;
CREATE POLICY "insert_questions_teacher" ON teacher_questions FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM teacher_activities a WHERE a.id = teacher_questions.activity_id AND a.teacher_id = auth.uid())
  );

DROP POLICY IF EXISTS "update_questions_teacher" ON teacher_questions;
CREATE POLICY "update_questions_teacher" ON teacher_questions FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM teacher_activities a WHERE a.id = teacher_questions.activity_id AND a.teacher_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM teacher_activities a WHERE a.id = teacher_questions.activity_id AND a.teacher_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_questions_teacher" ON teacher_questions;
CREATE POLICY "delete_questions_teacher" ON teacher_questions FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM teacher_activities a WHERE a.id = teacher_questions.activity_id AND a.teacher_id = auth.uid())
  );

-- ============ FLASHCARDS POLICIES ============
DROP POLICY IF EXISTS "select_flashcards_assigned" ON teacher_flashcards;
CREATE POLICY "select_flashcards_assigned" ON teacher_flashcards FOR SELECT
  TO authenticated USING (
    teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM class_flashcards cf
      JOIN profiles p ON p.id = auth.uid()
      WHERE cf.flashcard_id = teacher_flashcards.id AND cf.class_id = p.class_id
    )
  );

DROP POLICY IF EXISTS "insert_flashcards_teacher" ON teacher_flashcards;
CREATE POLICY "insert_flashcards_teacher" ON teacher_flashcards FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = teacher_id);

DROP POLICY IF EXISTS "update_flashcards_teacher" ON teacher_flashcards;
CREATE POLICY "update_flashcards_teacher" ON teacher_flashcards FOR UPDATE
  TO authenticated USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

DROP POLICY IF EXISTS "delete_flashcards_teacher" ON teacher_flashcards;
CREATE POLICY "delete_flashcards_teacher" ON teacher_flashcards FOR DELETE
  TO authenticated USING (teacher_id = auth.uid());

-- ============ CLINICAL CASES POLICIES ============
DROP POLICY IF EXISTS "select_clinical_cases_assigned" ON teacher_clinical_cases;
CREATE POLICY "select_clinical_cases_assigned" ON teacher_clinical_cases FOR SELECT
  TO authenticated USING (
    teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM class_clinical_cases cc
      JOIN profiles p ON p.id = auth.uid()
      WHERE cc.case_id = teacher_clinical_cases.id AND cc.class_id = p.class_id
    )
  );

DROP POLICY IF EXISTS "insert_clinical_cases_teacher" ON teacher_clinical_cases;
CREATE POLICY "insert_clinical_cases_teacher" ON teacher_clinical_cases FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = teacher_id);

DROP POLICY IF EXISTS "update_clinical_cases_teacher" ON teacher_clinical_cases;
CREATE POLICY "update_clinical_cases_teacher" ON teacher_clinical_cases FOR UPDATE
  TO authenticated USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

DROP POLICY IF EXISTS "delete_clinical_cases_teacher" ON teacher_clinical_cases;
CREATE POLICY "delete_clinical_cases_teacher" ON teacher_clinical_cases FOR DELETE
  TO authenticated USING (teacher_id = auth.uid());

-- ============ JUNCTION POLICIES ============
DROP POLICY IF EXISTS "select_class_activities" ON class_activities;
CREATE POLICY "select_class_activities" ON class_activities FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_class_activities_teacher" ON class_activities;
CREATE POLICY "insert_class_activities_teacher" ON class_activities FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'teacher')
  );

DROP POLICY IF EXISTS "delete_class_activities_teacher" ON class_activities;
CREATE POLICY "delete_class_activities_teacher" ON class_activities FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'teacher')
  );

DROP POLICY IF EXISTS "select_class_flashcards" ON class_flashcards;
CREATE POLICY "select_class_flashcards" ON class_flashcards FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_class_flashcards_teacher" ON class_flashcards;
CREATE POLICY "insert_class_flashcards_teacher" ON class_flashcards FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'teacher')
  );

DROP POLICY IF EXISTS "delete_class_flashcards_teacher" ON class_flashcards;
CREATE POLICY "delete_class_flashcards_teacher" ON class_flashcards FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'teacher')
  );

DROP POLICY IF EXISTS "select_class_clinical_cases" ON class_clinical_cases;
CREATE POLICY "select_class_clinical_cases" ON class_clinical_cases FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_class_clinical_cases_teacher" ON class_clinical_cases;
CREATE POLICY "insert_class_clinical_cases_teacher" ON class_clinical_cases FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'teacher')
  );

DROP POLICY IF EXISTS "delete_class_clinical_cases_teacher" ON class_clinical_cases;
CREATE POLICY "delete_class_clinical_cases_teacher" ON class_clinical_cases FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'teacher')
  );

-- ============ PROGRESS POLICIES ============
DROP POLICY IF EXISTS "select_own_activity_results" ON activity_results;
CREATE POLICY "select_own_activity_results" ON activity_results FOR SELECT
  TO authenticated USING (
    student_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'teacher')
  );

DROP POLICY IF EXISTS "insert_own_activity_results" ON activity_results;
CREATE POLICY "insert_own_activity_results" ON activity_results FOR INSERT
  TO authenticated WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "update_own_activity_results" ON activity_results;
CREATE POLICY "update_own_activity_results" ON activity_results FOR UPDATE
  TO authenticated USING (student_id = auth.uid()) WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "select_own_flashcard_progress" ON flashcard_progress;
CREATE POLICY "select_own_flashcard_progress" ON flashcard_progress FOR SELECT
  TO authenticated USING (
    student_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'teacher')
  );

DROP POLICY IF EXISTS "upsert_own_flashcard_progress" ON flashcard_progress;
CREATE POLICY "upsert_own_flashcard_progress" ON flashcard_progress FOR INSERT
  TO authenticated WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "update_own_flashcard_progress" ON flashcard_progress;
CREATE POLICY "update_own_flashcard_progress" ON flashcard_progress FOR UPDATE
  TO authenticated USING (student_id = auth.uid()) WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "select_own_clinical_case_results" ON clinical_case_results;
CREATE POLICY "select_own_clinical_case_results" ON clinical_case_results FOR SELECT
  TO authenticated USING (
    student_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'teacher')
  );

DROP POLICY IF EXISTS "insert_own_clinical_case_results" ON clinical_case_results;
CREATE POLICY "insert_own_clinical_case_results" ON clinical_case_results FOR INSERT
  TO authenticated WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "update_own_clinical_case_results" ON clinical_case_results;
CREATE POLICY "update_own_clinical_case_results" ON clinical_case_results FOR UPDATE
  TO authenticated USING (student_id = auth.uid()) WITH CHECK (student_id = auth.uid());

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_profiles_class_id ON profiles(class_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_activities_teacher_id ON teacher_activities(teacher_id);
CREATE INDEX IF NOT EXISTS idx_questions_activity_id ON teacher_questions(activity_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_teacher_id ON teacher_flashcards(teacher_id);
CREATE INDEX IF NOT EXISTS idx_clinical_cases_teacher_id ON teacher_clinical_cases(teacher_id);
CREATE INDEX IF NOT EXISTS idx_activity_results_student ON activity_results(student_id);
CREATE INDEX IF NOT EXISTS idx_flashcard_progress_student ON flashcard_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_clinical_case_results_student ON clinical_case_results(student_id);
