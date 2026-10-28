export type Role = "CREATOR" | "BRAND";
export type Plan = "FREE" | "BASIC" | "PREMIUM";
export type Platform = "INSTAGRAM" | "TIKTOK";
export type ConnectionStatus = "ACTIVE" | "EXPIRED";

export interface PostData {
  externalId: string;
  platform: Platform;
  publishedAt: Date;
  caption: string | null;
  thumbnailUrl: string | null;
  permalink: string | null;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  /** null pour TikTok */
  saves: number | null;
  /** null pour TikTok */
  reach: number | null;
}

export interface FollowerSnapshot {
  date: Date;
  followers: number;
}

export interface Breakdown {
  label: string;
  count: number;
}

export interface AudienceData {
  ages: Breakdown[];
  genders: Breakdown[];
  countries: Breakdown[];
}

export interface NetworkData {
  platform: Platform;
  username: string;
  avatarUrl: string | null;
  status: ConnectionStatus;
  lastSyncedAt: Date;
  /** Triés par date croissante */
  snapshots: FollowerSnapshot[];
  posts: PostData[];
  audience: AudienceData | null;
}

export interface CreatorSource {
  creatorId: string;
  displayName: string;
  networks: NetworkData[];
}

export interface CreatorKpis {
  views30d: number;
  followers: number;
  avgViewsPerPost: number | null;
  engagementRate: number | null;
  posts30d: number;
  followerGrowth30d: number | null;
}
