export type View = 'Dashboard' | 'Study' | 'Writing' | 'Books' | 'Learn' | 'Pomodoro' | 'Journal' | 'Me' | 'Music';
export type Theme = 'dark-academia' | 'light-academia' | 'midnight-dusk' | 'evergreen' | 'custom';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
}

export interface Exam {
  id: string;
  subject: string;
  date: string;
}

export interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly';
  completedDates: string[]; // Store ISO date strings 'YYYY-MM-DD'
}

export interface Writing {
  id: string;
  title: string;
  content: string;
  lastModified: number;
}

export interface Book {
  id:string;
  title: string;
  author: string;
  totalPages: number;
  pagesRead: number;
  notes: string;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO date string
  content: string;
}

export interface MeData {
  values: string;
  vision: string;
  strengths: string;
  achievements: string;
}

export interface CustomThemeColors {
  '--bg-primary': string;
  '--bg-secondary': string;
  '--bg-interactive': string;
  '--border-primary': string;
  '--border-secondary': string;
  '--text-primary': string;
  '--text-secondary': string;
  '--text-muted': string;
  '--text-header': string;
  '--accent-primary': string;
  '--accent-primary-hover': string;
  '--accent-secondary': string;
}

export interface EditableContent {
  appTitle: string;
  sidebarSubtitle: string;
  dashboardGreeting: string;
  dashboardQuickActionsTitle: string;
  dashboardDeadlinesTitle: string;
  dashboardFocusTitle: string;
  dashboardGoalsTitle: string;
  studyHubTitle: string;
  writingTitle: string;
  booksTitle: string;
  learnTitle: string;
  journalTitle: string;
  meTitle: string;
  meSubtitle: string;
  meValuesTitle: string;
  meVisionTitle: string;
  meStrengthsTitle: string;
  meAchievementsTitle: string;
  musicTitle: string;
  musicSubtitle: string;
}