# Civic Vigilance Firestore Database Schema

## Collections Structure

### users
```
users/{userId}
{
  uid: string,
  email: string,
  displayName: string,
  photoURL?: string,
  bio?: string,
  city?: string,
  state?: string,
  homeLocation?: { lat: number, lng: number },

  // Connected accounts
  googleConnected: boolean,
  twitterConnected: boolean,
  twitterHandle?: string,
  twitterUserId?: string,
  twitterAccessToken?: string, // encrypted
  twitterRefreshToken?: string, // encrypted

  // Twitter posting preferences
  defaultTwitterMethod: 'civic_vigilance' | 'personal' | 'none',
  alwaysAskTwitterMethod: boolean,

  // Statistics
  totalReports: number,
  reportsResolved: number,
  upvotesReceived: number,
  commentsReceived: number,

  // Settings
  notificationPreferences: {
    pushEnabled: boolean,
    statusUpdates: boolean,
    comments: boolean,
    upvoteMilestones: boolean,
    nearbyTrending: boolean,
    weeklyDigest: boolean,
    quietHours?: { start: string, end: string }
  },

  privacySettings: {
    profileVisibility: 'public' | 'private',
    showLocation: boolean
  },

  createdAt: timestamp,
  lastLoginAt: timestamp
}
```

### reports
```
reports/{reportId}
{
  id: string,
  userId: string,

  // Content
  title: string,
  description?: string,
  category: 'pothole' | 'garbage' | 'streetlight' | 'drainage' | 'water_supply' | 'sewage' | 'traffic_signal' | 'encroachment' | 'stray_animals' | 'parks' | 'other',
  imageUrl: string,

  // Location
  location: geopoint, // for Firestore geoqueries
  lat: number,
  lng: number,
  address: string,
  accuracy: number, // GPS accuracy in meters
  ward?: string,
  zone?: string,
  city?: string,
  state?: string,
  geohash: string, // for efficient spatial queries

  // Twitter posting
  twitterMethod: 'civic_vigilance' | 'personal' | 'none',
  twitterPostId?: string,
  twitterUrl?: string,
  twitterPostedAt?: timestamp,
  twitterPostedFrom?: string, // @handle that posted

  // Tagged authorities
  authorities: Array<{
    authorityId: string,
    handle: string,
    name: string,
    priority: number,
    responded: boolean,
    responseType?: 'reply' | 'like' | 'retweet',
    responseAt?: timestamp
  }>,

  // Status
  status: 'reported' | 'acknowledged' | 'in_progress' | 'resolved' | 'failed',
  statusHistory: Array<{
    status: string,
    timestamp: timestamp,
    updatedBy?: string
  }>,

  // Engagement
  upvotes: number,
  downvotes: number,
  commentsCount: number,
  sharesCount: number,
  viewsCount: number,
  followersCount: number,

  // Twitter engagement (if posted)
  twitterLikes?: number,
  twitterRetweets?: number,
  twitterReplies?: number,
  twitterViews?: number,
  lastTwitterSyncAt?: timestamp,

  // Metadata
  createdAt: timestamp,
  updatedAt: timestamp,
  resolvedAt?: timestamp,
  offline: boolean, // was created offline
  syncedAt?: timestamp
}
```

### authorities
```
authorities/{authorityId}
{
  id: string,
  name: string,
  nameLocal?: string,

  // Twitter
  twitter: {
    handle: string,
    verified: boolean,
    active: boolean,
    lastChecked: timestamp
  },

  // Jurisdiction
  jurisdiction: {
    type: 'national' | 'state' | 'city' | 'ward' | 'department',
    level: number, // 1=national, 2=state, 3=city, 4=ward
    country: string,
    state?: string,
    city?: string,
    ward?: number,
    zone?: string,

    // Geographic boundary as GeoJSON polygon
    geoBoundary?: object,
    geohashes: string[] // for efficient queries
  },

  // Issue categories this authority handles
  issueCategories: string[],

  // Priority (1=primary, 2=secondary, 3=fallback)
  priority: number,

  // Contact info
  contactInfo?: {
    email?: string,
    phone?: string,
    website?: string
  },

  // Performance metrics
  metrics: {
    totalReportsTagged: number,
    responseRate: number, // 0-1
    avgResponseTime: number, // seconds
    resolutionRate: number, // 0-1
    avgResolutionTime: number // seconds
  },

  // Community validation
  community: {
    upvotes: number,
    downvotes: number,
    reportsHandled: number
  },

  status: 'active' | 'inactive',
  verifiedBy?: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### comments
```
comments/{commentId}
{
  id: string,
  reportId: string,
  userId: string,
  text: string,
  likes: number,
  createdAt: timestamp,
  updatedAt?: timestamp,
  edited: boolean
}
```

### votes
```
votes/{voteId}
{
  id: string,
  reportId: string,
  userId: string,
  type: 'upvote' | 'downvote',
  createdAt: timestamp
}
```

### followers
```
followers/{followerId}
{
  id: string,
  reportId: string,
  userId: string,
  createdAt: timestamp
}
```

### notifications
```
notifications/{notificationId}
{
  id: string,
  userId: string,
  type: 'report_submitted' | 'twitter_post_success' | 'status_update' | 'authority_response' | 'comment' | 'upvote_milestone' | 'resolution_claim',
  title: string,
  body: string,
  data: object, // type-specific data
  read: boolean,
  createdAt: timestamp
}
```

### pendingTwitterPosts
```
pendingTwitterPosts/{postId}
{
  id: string,
  reportId: string,
  userId: string,
  method: 'civic_vigilance' | 'personal',
  tweetText: string,
  imageUrl: string,
  authorities: string[], // handles to tag
  attempts: number,
  lastAttemptAt?: timestamp,
  error?: string,
  status: 'pending' | 'processing' | 'success' | 'failed',
  createdAt: timestamp
}
```

## Indexes

### reports collection
- composite: (city, status, createdAt DESC)
- composite: (city, category, createdAt DESC)
- composite: (userId, createdAt DESC)
- composite: (status, createdAt DESC)
- composite: (geohash, createdAt DESC)
- single: upvotes DESC
- single: trendingScore DESC (calculated field)

### authorities collection
- array-contains: geohashes
- composite: (jurisdiction.city, jurisdiction.type, priority)
- array-contains: issueCategories

### comments collection
- composite: (reportId, createdAt DESC)

### votes collection
- composite: (reportId, userId)
- composite: (userId, createdAt DESC)

### notifications collection
- composite: (userId, read, createdAt DESC)
