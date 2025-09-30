import AsyncStorage from '@react-native-async-storage/async-storage';

export type DemoIssue = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: 'pothole' | 'garbage' | 'streetlight' | 'water' | 'other';
  image_url?: string;
  lat?: number;
  lng?: number;
  address?: string;
  upvotes: number;
  downvotes: number;
  comments_count: number;
  created_at: string;
};

export type DemoComment = {
  id: string;
  issue_id: string;
  user_id: string;
  parent_id?: string | null;
  content: string;
  created_at: string;
};

const ISSUES_KEY = 'demo_issues';
const COMMENTS_KEY = 'demo_comments';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

async function ensureSeed() {
  const existing = await AsyncStorage.getItem(ISSUES_KEY);
  if (existing) return;
  const now = new Date().toISOString();
  const issues: DemoIssue[] = [
    {
      id: uid(),
      user_id: 'demo-user',
      title: 'Pothole near Maple St.',
      description: 'Large pothole causing traffic to swerve.',
      category: 'pothole',
      image_url: 'https://picsum.photos/seed/pothole/800/500',
      lat: 37.7749,
      lng: -122.4194,
      address: '1200 Maple St, Springfield',
      upvotes: 12,
      downvotes: 1,
      comments_count: 2,
      created_at: now
    },
    {
      id: uid(),
      user_id: 'demo-user',
      title: 'Overflowing garbage bin',
      description: 'Bin hasn\'t been cleared in 3 days.',
      category: 'garbage',
      image_url: 'https://picsum.photos/seed/garbage/800/500',
      lat: 37.7799,
      lng: -122.4312,
      address: '5th Ave & Pine St',
      upvotes: 7,
      downvotes: 0,
      comments_count: 1,
      created_at: now
    }
  ];
  const c1 = { id: uid(), issue_id: issues[0].id, user_id: 'demo-user', content: 'Sharing with local RWA.', created_at: now } as DemoComment;
  const c2 = { id: uid(), issue_id: issues[0].id, user_id: 'demo-user', content: 'Dangerous at night, please fix.', created_at: now } as DemoComment;
  const comments: DemoComment[] = [
    c1,
    c2,
    { id: uid(), issue_id: issues[0].id, user_id: 'demo-user', parent_id: c1.id, content: 'Thanks! Please tag @cityroads too.', created_at: now },
  ];
  await AsyncStorage.setItem(ISSUES_KEY, JSON.stringify(issues));
  await AsyncStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
}

export async function getIssues(): Promise<DemoIssue[]> {
  await ensureSeed();
  const v = await AsyncStorage.getItem(ISSUES_KEY);
  return v ? (JSON.parse(v) as DemoIssue[]) : [];
}

export async function addIssue(issue: Omit<DemoIssue, 'id' | 'created_at' | 'upvotes' | 'downvotes' | 'comments_count'>) {
  const items = await getIssues();
  const full: DemoIssue = { ...issue, id: uid(), created_at: new Date().toISOString(), upvotes: 0, downvotes: 0, comments_count: 0 };
  items.unshift(full);
  await AsyncStorage.setItem(ISSUES_KEY, JSON.stringify(items));
  return full;
}

export async function getIssueById(id: string) {
  const items = await getIssues();
  return items.find(i => i.id === id) || null;
}

export async function getComments(issue_id: string): Promise<DemoComment[]> {
  await ensureSeed();
  const v = await AsyncStorage.getItem(COMMENTS_KEY);
  const all: DemoComment[] = v ? JSON.parse(v) : [];
  return all.filter(c => c.issue_id === issue_id);
}

export async function addComment(issue_id: string, content: string, parent_id?: string | null) {
  const v = await AsyncStorage.getItem(COMMENTS_KEY);
  const all: DemoComment[] = v ? JSON.parse(v) : [];
  const c: DemoComment = { id: uid(), issue_id, content, parent_id: parent_id ?? null, user_id: 'demo-user', created_at: new Date().toISOString() };
  all.push(c);
  await AsyncStorage.setItem(COMMENTS_KEY, JSON.stringify(all));
  // bump comments_count on issue
  const issues = await getIssues();
  const idx = issues.findIndex(i => i.id === issue_id);
  if (idx >= 0) { issues[idx].comments_count += 1; await AsyncStorage.setItem(ISSUES_KEY, JSON.stringify(issues)); }
  return c;
}
