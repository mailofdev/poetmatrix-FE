export type Role = "reader" | "writer" | "superAdmin";

export type SessionUser = {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
};

export type ContentItem = {
  id: string;
  title: string;
  genre: string;
  saveAs: string;
  writings: string;
  authorId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ContentPage = {
  data: ContentItem[];
  meta: { page: number; limit: number; total: number };
};

export type IssuedSession = {
  accessToken: string;
  refreshToken: string;
  accessExpiresIn: number;
  refreshExpiresIn: number;
  user: SessionUser;
};
