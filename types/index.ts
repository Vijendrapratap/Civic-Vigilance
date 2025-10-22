// Issue Categories as per PDF spec
export type IssueCategory =
  | 'pothole'
  | 'garbage'
  | 'streetlight'
  | 'drainage'
  | 'water_supply'
  | 'sewage'
  | 'traffic_signal'
  | 'encroachment'
  | 'stray_animals'
  | 'parks'
  | 'other';

// Twitter posting methods - core feature per PDF
export type TwitterPostingMethod = 'civic_vigilance' | 'personal' | 'none';

// Report status types
export type ReportStatus = 'reported' | 'acknowledged' | 'in_progress' | 'resolved' | 'failed';

// Authority types
export type AuthorityJurisdictionType = 'national' | 'state' | 'city' | 'ward' | 'department';

// User type with complete profile
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  city?: string;
  state?: string;
  homeLocation?: { lat: number; lng: number };

  // Connected accounts
  googleConnected: boolean;
  twitterConnected: boolean;
  twitterHandle?: string;
  twitterUserId?: string;

  // Twitter posting preferences
  defaultTwitterMethod: TwitterPostingMethod;
  alwaysAskTwitterMethod: boolean;

  // Statistics
  totalReports: number;
  reportsResolved: number;
  upvotesReceived: number;
  commentsReceived: number;

  // Settings
  notificationPreferences: {
    pushEnabled: boolean;
    statusUpdates: boolean;
    comments: boolean;
    upvoteMilestones: boolean;
    nearbyTrending: boolean;
    weeklyDigest: boolean;
    quietHours?: { start: string; end: string };
  };

  privacySettings: {
    profileVisibility: 'public' | 'private';
    showLocation: boolean;
  };

  createdAt: Date;
  lastLoginAt: Date;
}

// Report/Issue type (aligned with PDF spec)
export interface Report {
  id: string;
  userId: string;

  // Content
  title: string;
  description?: string;
  category: IssueCategory;
  imageUrl: string;

  // Location
  lat: number;
  lng: number;
  address: string;
  accuracy: number; // GPS accuracy in meters
  ward?: string;
  zone?: string;
  city?: string;
  state?: string;
  geohash: string;

  // Twitter posting - CRITICAL FEATURE
  twitterMethod: TwitterPostingMethod;
  twitterPostId?: string;
  twitterUrl?: string;
  twitterPostedAt?: Date;
  twitterPostedFrom?: string; // @handle that posted

  // Tagged authorities
  authorities: Authority[];

  // Status
  status: ReportStatus;
  statusHistory: StatusHistoryEntry[];

  // Engagement
  upvotes: number;
  downvotes: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  followersCount: number;

  // Twitter engagement (if posted)
  twitterLikes?: number;
  twitterRetweets?: number;
  twitterReplies?: number;
  twitterViews?: number;
  lastTwitterSyncAt?: Date;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  offline: boolean; // was created offline
  syncedAt?: Date;
}

// Authority database structure
export interface Authority {
  id: string;
  name: string;
  nameLocal?: string;

  // Twitter
  twitter: {
    handle: string;
    verified: boolean;
    active: boolean;
    lastChecked: Date;
  };

  // Jurisdiction
  jurisdiction: {
    type: AuthorityJurisdictionType;
    level: number; // 1=national, 2=state, 3=city, 4=ward
    country: string;
    state?: string;
    city?: string;
    ward?: number;
    zone?: string;
    geohashes: string[]; // for efficient queries
  };

  // Issue categories this authority handles
  issueCategories: IssueCategory[];

  // Priority (1=primary, 2=secondary, 3=fallback)
  priority: number;

  // Contact info
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };

  // Performance metrics
  metrics: {
    totalReportsTagged: number;
    responseRate: number; // 0-1
    avgResponseTime: number; // seconds
    resolutionRate: number; // 0-1
    avgResolutionTime: number; // seconds
  };

  // Community validation
  community: {
    upvotes: number;
    downvotes: number;
    reportsHandled: number;
  };

  status: 'active' | 'inactive';
  verifiedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StatusHistoryEntry {
  status: ReportStatus;
  timestamp: Date;
  updatedBy?: string;
}

export interface Comment {
  id: string;
  reportId: string;
  userId: string;
  text: string;
  likes: number;
  parentId?: string;
  createdAt: Date;
  updatedAt?: Date;
  edited: boolean;
}

export interface Vote {
  id: string;
  reportId: string;
  userId: string;
  type: 'upvote' | 'downvote';
  createdAt: Date;
}

export interface Follower {
  id: string;
  reportId: string;
  userId: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type:
    | 'report_submitted'
    | 'twitter_post_success'
    | 'status_update'
    | 'authority_response'
    | 'comment'
    | 'upvote_milestone'
    | 'resolution_claim';
  title: string;
  body: string;
  data: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

// Pending Twitter post queue
export interface PendingTwitterPost {
  id: string;
  reportId: string;
  userId: string;
  method: 'civic_vigilance' | 'personal';
  tweetText: string;
  imageUrl: string;
  authorities: string[]; // handles to tag
  attempts: number;
  lastAttemptAt?: Date;
  error?: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  createdAt: Date;
}

// Legacy type alias for backwards compatibility
export type Issue = Report;
export type IssueStatus = ReportStatus;
