export type ResumeBreakdownDetails = {
  skills?: string[];
  experience?: string[];
};

export type MatchInsights = {
  score: number;
  strengths: string[];
  gaps: string[];
  insights: string[];
  breakdown?: ResumeBreakdownDetails;
};

export type Application = {
  applicationId: string;
  jobKey: string;
  jobTitle?: string;
  candidateUserId?: string;
  createdAt?: string;
  match: MatchInsights;
};

export type ChatSource = {
  type: 'resume' | 'jd' | string;
  chunkId: string;
  excerpt: string;
};

export type ChatMessage = {
  id: string;
  applicationId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  sources?: ChatSource[];
};

export type PaginatedResponse<T> = {
  messages: T[];
  total: number;
  limit: number;
  offset: number;
};

export type ApiError = {
  message: string;
  statusCode?: number;
};

export type UploadForm = {
  jobKey: string;
  jobTitle?: string;
  candidateUserId: string;
  resumeFile: File;
  jdFile: File;
};
