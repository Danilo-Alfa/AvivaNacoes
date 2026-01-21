export interface UserProfile {
  id: string;
  email: string;
  nome: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface CourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  course_title: string;
  lessons_completed: number;
  total_lessons: number;
  progress_percentage: number;
  last_accessed: string;
  completed_at?: string;
}

export interface UserWithProgress extends UserProfile {
  courses_progress: CourseProgress[];
  total_courses_enrolled: number;
  total_courses_completed: number;
}
