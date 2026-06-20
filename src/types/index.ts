export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
}

export interface InterviewSession {
  id?: string;
  _id?: string;
  date: string | Date;
  score: number;
  role: string;
  verdict?: string;
  transcript?: { role: string; content: string }[];
  feedback?: string;
}

export interface ResumeSession {
  id?: string;
  _id?: string;
  date: string | Date;
  score: number;
  role: string;
  fileName?: string;
  feedback?: string;
}

export interface UserProfile extends User {
  interviews: InterviewSession[];
  resumes: ResumeSession[];
}

export interface CompanyIntel {
  company: string;
  overview: string;
  role?: string;
  rounds?: { name: string; focus: string }[];
  values?: string[];
  focalPoints?: string[];
  key_technologies?: string[];
  core_competencies?: string[];
  recent_challenges?: string[];
  interview_structure?: {
    rounds: string[];
    focus_areas: string[];
  };
  sample_questions?: string[];
}
