// Gojipedia Type Definitions
// These types mirror the Prisma schema for use throughout the application

export type Era = 'Showa' | 'Heisei' | 'Millennium' | 'Reiwa' | 'Legendary' | 'MonsterVerse' | 'Other';
export type Alignment = 'protagonist' | 'antagonist' | 'neutral' | 'evolves';
export type SpeciesType = 'kaiju' | 'mech' | 'alien' | 'human_organization' | 'titan';
export type WorkType = 'movie' | 'series' | 'comic' | 'game';
export type RoleTag = 'protagonist' | 'antagonist' | 'cameo' | 'featured' | 'mentioned';
export type Outcome = 'win' | 'loss' | 'draw' | 'unknown';
export type RelationType = 'ally' | 'enemy' | 'rival' | 'creator' | 'createdBy' | 'variant' | 'other';
export type ProductCategory = 'figures' | 'model_kits' | 'posters' | 'shirts' | 'bluray' | 'books' | 'art' | 'general';
export type PostType = 'article' | 'story' | 'guide' | 'explainer';
export type PostStatus = 'draft' | 'published' | 'archived';
export type StoryPerspective = 'human' | 'godzilla' | 'other_monster' | 'battle_royale';
export type CollectionScopeType = 'monster' | 'movie' | 'era' | 'category' | 'featured';

export interface Monster {
  id: string;
  name: string;
  slug: string;
  aliases: string[];
  eraTags: Era[];
  alignment: Alignment;
  speciesType: SpeciesType;
  firstAppearanceDate: Date | null;
  firstAppearanceWorkId: string | null;
  heightMeters: number | null;
  weightTons: number | null;
  originSummary: string;
  lastKnownWhereabouts: string;
  descriptionLong: string;
  abilities: string[];
  attacks: string[];
  weaknesses: string[];
  fanPowerIndex: number;
  durabilityScore: number;
  attackPowerScore: number;
  mobilityScore: number;
  intelligenceScore: number;
  specialAbilitiesScore: number;
  eraScalingFactor: number;
  primaryImageUrl: string | null;
  galleryImages: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Work {
  id: string;
  title: string;
  slug: string;
  workType: WorkType;
  releaseDate: Date | null;
  eraTags: Era[];
  continuityTag: string | null;
  synopsisLong: string;
  studio: string | null;
  director: string | null;
  runtimeMinutes: number | null;
  posterImageUrl: string | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appearance {
  id: string;
  monsterId: string;
  workId: string;
  roleTag: RoleTag;
  notesShort: string;
  createdAt: Date;
  monster?: Monster;
  work?: Work;
}

export interface Battle {
  id: string;
  title: string;
  slug: string;
  workId: string | null;
  location: string | null;
  summary: string;
  battleDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  work?: Work;
  participants?: BattleParticipant[];
}

export interface BattleParticipant {
  id: string;
  battleId: string;
  monsterId: string;
  outcome: Outcome;
  notesShort: string;
  monster?: Monster;
  battle?: Battle;
}

export interface Relationship {
  id: string;
  fromMonsterId: string;
  toMonsterId: string;
  relationType: RelationType;
  notesShort: string;
  createdAt: Date;
  fromMonster?: Monster;
  toMonster?: Monster;
}

export interface Product {
  id: string;
  asin: string;
  title: string;
  imageUrl: string | null;
  price: string | null;
  primeEligible: boolean;
  category: ProductCategory;
  brand: string | null;
  amazonUrlWithTag: string | null;
  searchKeywords: string[];
  isActive: boolean;
  isSuggested: boolean;
  lastFetchedAt: Date | null;
  fetchFailCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCollection {
  id: string;
  title: string;
  slug: string;
  description: string;
  scopeType: CollectionScopeType;
  monsterId: string | null;
  workId: string | null;
  scopeValue: string | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  items?: ProductCollectionItem[];
}

export interface ProductCollectionItem {
  id: string;
  collectionId: string;
  productId: string;
  rank: number;
  reasonLine: string;
  createdAt: Date;
  product?: Product;
  collection?: ProductCollection;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  postType: PostType;
  status: PostStatus;
  storyPerspective: StoryPerspective | null;
  excerpt: string;
  mdxPath: string | null;
  tags: string[];
  categories: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  featuredImageUrl: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AffiliateClick {
  id: string;
  productId: string;
  pagePath: string;
  clickedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  passwordHash: string;
  role: 'admin' | 'editor';
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
}

export interface JobRun {
  id: string;
  jobType: string;
  status: 'running' | 'completed' | 'failed';
  startedAt: Date;
  completedAt: Date | null;
  resultData: Record<string, unknown>;
  errorMessage: string | null;
}

export interface EmailSubscriber {
  id: string;
  email: string;
  isConfirmed: boolean;
  subscribedAt: Date;
}

// Extended types with relations
export interface MonsterWithRelations extends Monster {
  firstAppearanceWork?: Work | null;
  appearances?: Appearance[];
  battleParticipations?: BattleParticipant[];
  relationshipsFrom?: Relationship[];
  relationshipsTo?: Relationship[];
}

export interface WorkWithRelations extends Work {
  appearances?: Appearance[];
  battles?: Battle[];
}

export interface BattleWithParticipants extends Battle {
  participants: BattleParticipant[];
  work?: Work | null;
}

// Fight record summary
export interface FightRecord {
  wins: number;
  losses: number;
  draws: number;
  unknown: number;
  battles: {
    battle: Battle;
    outcome: Outcome;
    opponents: Monster[];
  }[];
}

// Fan Power Index breakdown
export interface FanPowerBreakdown {
  total: number;
  durability: number;
  attackPower: number;
  mobility: number;
  intelligence: number;
  specialAbilities: number;
  eraScaling: number;
}

// Filter types for UI
export interface MonsterFilters {
  era?: Era | null;
  alignment?: Alignment | null;
  speciesType?: SpeciesType | null;
  search?: string;
  sortBy?: 'fanPowerIndex' | 'firstAppearanceDate' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface WorkFilters {
  era?: Era | null;
  workType?: WorkType | null;
  year?: number | null;
  search?: string;
}

export interface ProductFilters {
  category?: ProductCategory | null;
  monsterId?: string | null;
  workId?: string | null;
  era?: Era | null;
  search?: string;
}
