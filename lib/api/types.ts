export type Role = "reader" | "writer" | "admin" | "superadmin";
export type Mode = "reader" | "writer";
export type PlanName = "free" | "basic" | "pro";

export type SessionUser = {
  id: string;
  email: string;
  role: Role;
  mode: Mode;
  plan: PlanName;
  readerSubscription: boolean;
  writerSubscription: boolean;
  displayName: string | null;
  penName: string | null;
  bio: string | null;
  phone: string | null;
  gender: string | null;
  photo: string | null;
  interests: string[];
  interestsCompleted: boolean;
  pushEnabled: boolean;
  theme: string;
  createdAt: string;
};

export type Piece = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  type: string;
  articleSubtype: string | null;
  tags: string[];
  cover: string | null;
  language: string;
  status: string;
  visibility: string;
  commentsAllowed: boolean;
  genre: string;
  seriesTitle: string | null;
  seriesChapter: number | null;
  authorId: string | null;
  authorName: string;
  preview: string;
  readingMinutes: number;
  viewCount: number;
  limitReason: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PublicProfile = {
  id: string;
  displayName: string | null;
  penName: string | null;
  bio: string | null;
  photo: string | null;
  writer: boolean;
  followerCount?: number;
  followingCount?: number;
};

export type IssuedSession = {
  accessToken: string;
  refreshToken: string;
  accessExpiresIn: number;
  refreshExpiresIn: number;
  user: SessionUser;
  created?: boolean;
};
