export type Paste = {
  id: string;
  content: string;
  created_at: number;
  expires_at: number | null;
  remaining_views: number | null;
};