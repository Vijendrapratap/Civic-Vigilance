export type IssueCategory = 'pothole' | 'garbage' | 'streetlight' | 'water' | 'other';

export type Issue = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: IssueCategory;
  image_url?: string;
  lat?: number;
  lng?: number;
  address?: string;
  upvotes: number;
  downvotes: number;
  comments_count: number;
  created_at: string;
};

export type Comment = {
  id: string;
  issue_id: string;
  user_id: string;
  content: string;
  parent_id?: string | null;
  created_at: string;
};
