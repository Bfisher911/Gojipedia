// Database client singleton for Prisma
// When Prisma binaries are available, this will use the real Prisma client
// For now, it provides a mock implementation with sample data

import type {
  Monster,
  Work,
  Appearance,
  Battle,
  BattleParticipant,
  Relationship,
  Product,
  ProductCollection,
  ProductCollectionItem,
  Post,
  User,
  MonsterWithRelations,
  BattleWithParticipants,
  FightRecord,
  MonsterFilters,
  WorkFilters,
  Era,
} from '@/types';
import { sampleMonsters, sampleWorks, sampleAppearances, sampleBattles, sampleBattleParticipants, sampleRelationships, sampleProducts, sampleCollections, sampleCollectionItems, samplePosts } from './seed-data';

// In-memory data store (replace with Prisma when binaries are available)
let monsters: Monster[] = [...sampleMonsters];
let works: Work[] = [...sampleWorks];
let appearances: Appearance[] = [...sampleAppearances];
let battles: Battle[] = [...sampleBattles];
let battleParticipants: BattleParticipant[] = [...sampleBattleParticipants];
let relationships: Relationship[] = [...sampleRelationships];
let products: Product[] = [...sampleProducts];
let collections: ProductCollection[] = [...sampleCollections];
let collectionItems: ProductCollectionItem[] = [...sampleCollectionItems];
let posts: Post[] = [...samplePosts];

// Monster queries
export async function getMonsters(filters?: MonsterFilters): Promise<Monster[]> {
  let result = monsters.filter(m => m.isActive);

  if (filters?.era) {
    result = result.filter(m => m.eraTags.includes(filters.era as Era));
  }
  if (filters?.alignment) {
    result = result.filter(m => m.alignment === filters.alignment);
  }
  if (filters?.speciesType) {
    result = result.filter(m => m.speciesType === filters.speciesType);
  }
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    result = result.filter(m =>
      m.name.toLowerCase().includes(search) ||
      m.aliases.some(a => a.toLowerCase().includes(search))
    );
  }

  // Sort
  const sortBy = filters?.sortBy || 'fanPowerIndex';
  const sortOrder = filters?.sortOrder || 'desc';
  result.sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'fanPowerIndex') {
      comparison = a.fanPowerIndex - b.fanPowerIndex;
    } else if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'firstAppearanceDate') {
      const dateA = a.firstAppearanceDate?.getTime() || 0;
      const dateB = b.firstAppearanceDate?.getTime() || 0;
      comparison = dateA - dateB;
    }
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  return result;
}

export async function getMonsterBySlug(slug: string): Promise<MonsterWithRelations | null> {
  const monster = monsters.find(m => m.slug === slug && m.isActive);
  if (!monster) return null;

  const firstAppearanceWork = monster.firstAppearanceWorkId
    ? works.find(w => w.id === monster.firstAppearanceWorkId) || null
    : null;

  const monsterAppearances = appearances
    .filter(a => a.monsterId === monster.id)
    .map(a => ({
      ...a,
      work: works.find(w => w.id === a.workId),
    }));

  const monsterBattleParticipations = battleParticipants
    .filter(bp => bp.monsterId === monster.id)
    .map(bp => ({
      ...bp,
      battle: battles.find(b => b.id === bp.battleId),
    }));

  const monsterRelationshipsFrom = relationships
    .filter(r => r.fromMonsterId === monster.id)
    .map(r => ({
      ...r,
      toMonster: monsters.find(m => m.id === r.toMonsterId),
    }));

  const monsterRelationshipsTo = relationships
    .filter(r => r.toMonsterId === monster.id)
    .map(r => ({
      ...r,
      fromMonster: monsters.find(m => m.id === r.fromMonsterId),
    }));

  return {
    ...monster,
    firstAppearanceWork,
    appearances: monsterAppearances,
    battleParticipations: monsterBattleParticipations,
    relationshipsFrom: monsterRelationshipsFrom,
    relationshipsTo: monsterRelationshipsTo,
  };
}

export async function getFeaturedMonsters(limit = 6): Promise<Monster[]> {
  return monsters
    .filter(m => m.isActive && m.isFeatured)
    .sort((a, b) => b.fanPowerIndex - a.fanPowerIndex)
    .slice(0, limit);
}

export async function getMonsterFightRecord(monsterId: string): Promise<FightRecord> {
  const participations = battleParticipants.filter(bp => bp.monsterId === monsterId);

  const record: FightRecord = {
    wins: participations.filter(p => p.outcome === 'win').length,
    losses: participations.filter(p => p.outcome === 'loss').length,
    draws: participations.filter(p => p.outcome === 'draw').length,
    unknown: participations.filter(p => p.outcome === 'unknown').length,
    battles: [],
  };

  for (const p of participations) {
    const battle = battles.find(b => b.id === p.battleId);
    if (!battle) continue;

    const opponents = battleParticipants
      .filter(bp => bp.battleId === p.battleId && bp.monsterId !== monsterId)
      .map(bp => monsters.find(m => m.id === bp.monsterId))
      .filter((m): m is Monster => m !== undefined);

    record.battles.push({
      battle,
      outcome: p.outcome,
      opponents,
    });
  }

  return record;
}

export async function getRelatedMonsters(monsterId: string, limit = 6): Promise<Monster[]> {
  const relatedIds = new Set<string>();

  // Get monsters from relationships
  relationships
    .filter(r => r.fromMonsterId === monsterId)
    .forEach(r => relatedIds.add(r.toMonsterId));
  relationships
    .filter(r => r.toMonsterId === monsterId)
    .forEach(r => relatedIds.add(r.fromMonsterId));

  // Get monsters from shared battles
  const monsterBattles = battleParticipants
    .filter(bp => bp.monsterId === monsterId)
    .map(bp => bp.battleId);
  battleParticipants
    .filter(bp => monsterBattles.includes(bp.battleId) && bp.monsterId !== monsterId)
    .forEach(bp => relatedIds.add(bp.monsterId));

  return monsters
    .filter(m => relatedIds.has(m.id) && m.isActive)
    .slice(0, limit);
}

// Work queries
export async function getWorks(filters?: WorkFilters): Promise<Work[]> {
  let result = works.filter(w => w.isActive);

  if (filters?.era) {
    result = result.filter(w => w.eraTags.includes(filters.era as Era));
  }
  if (filters?.workType) {
    result = result.filter(w => w.workType === filters.workType);
  }
  if (filters?.year && filters.year > 0) {
    result = result.filter(w =>
      w.releaseDate && w.releaseDate.getFullYear() === filters.year
    );
  }
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    result = result.filter(w => w.title.toLowerCase().includes(search));
  }

  result.sort((a, b) => {
    const dateA = a.releaseDate?.getTime() || 0;
    const dateB = b.releaseDate?.getTime() || 0;
    return dateB - dateA;
  });

  return result;
}

export async function getWorkBySlug(slug: string): Promise<Work | null> {
  return works.find(w => w.slug === slug && w.isActive) || null;
}

export async function getWorkWithMonsters(slug: string): Promise<{ work: Work; monsters: Monster[] } | null> {
  const work = works.find(w => w.slug === slug && w.isActive);
  if (!work) return null;

  const workAppearances = appearances.filter(a => a.workId === work.id);
  const workMonsters = workAppearances
    .map(a => monsters.find(m => m.id === a.monsterId))
    .filter((m): m is Monster => m !== undefined);

  return { work, monsters: workMonsters };
}

export async function getFeaturedWorks(limit = 6): Promise<Work[]> {
  return works
    .filter(w => w.isActive && w.isFeatured)
    .sort((a, b) => {
      const dateA = a.releaseDate?.getTime() || 0;
      const dateB = b.releaseDate?.getTime() || 0;
      return dateB - dateA;
    })
    .slice(0, limit);
}

// Battle queries
export async function getBattles(limit = 10): Promise<BattleWithParticipants[]> {
  return battles.slice(0, limit).map(battle => ({
    ...battle,
    participants: battleParticipants
      .filter(bp => bp.battleId === battle.id)
      .map(bp => ({
        ...bp,
        monster: monsters.find(m => m.id === bp.monsterId),
      })),
    work: battle.workId ? works.find(w => w.id === battle.workId) : undefined,
  }));
}

export async function getBattleBySlug(slug: string): Promise<BattleWithParticipants | null> {
  const battle = battles.find(b => b.slug === slug);
  if (!battle) return null;

  return {
    ...battle,
    participants: battleParticipants
      .filter(bp => bp.battleId === battle.id)
      .map(bp => ({
        ...bp,
        monster: monsters.find(m => m.id === bp.monsterId),
      })),
    work: battle.workId ? works.find(w => w.id === battle.workId) : undefined,
  };
}

// Product queries
export async function getProducts(filters?: { category?: string; search?: string; limit?: number }): Promise<Product[]> {
  let result = products.filter(p => p.isActive);

  if (filters?.category) {
    result = result.filter(p => p.category === filters.category);
  }
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    result = result.filter(p =>
      p.title.toLowerCase().includes(search) ||
      p.searchKeywords.some(k => k.toLowerCase().includes(search))
    );
  }

  return result.slice(0, filters?.limit || 100);
}

export async function getProductsByMonster(monsterId: string, limit = 8): Promise<Product[]> {
  const monster = monsters.find(m => m.id === monsterId);
  if (!monster) return [];

  const keywords = [monster.name.toLowerCase(), ...monster.aliases.map(a => a.toLowerCase())];

  return products
    .filter(p => p.isActive && p.searchKeywords.some(k =>
      keywords.some(keyword => k.toLowerCase().includes(keyword))
    ))
    .slice(0, limit);
}

export async function getProductCollection(slug: string): Promise<ProductCollection & { items: (ProductCollectionItem & { product: Product })[] } | null> {
  const collection = collections.find(c => c.slug === slug && c.isActive);
  if (!collection) return null;

  const items = collectionItems
    .filter(ci => ci.collectionId === collection.id)
    .sort((a, b) => a.rank - b.rank)
    .map(ci => ({
      ...ci,
      product: products.find(p => p.id === ci.productId)!,
    }))
    .filter(ci => ci.product);

  return { ...collection, items };
}

export async function getFeaturedCollections(limit = 4): Promise<ProductCollection[]> {
  return collections
    .filter(c => c.isActive && c.isFeatured)
    .slice(0, limit);
}

// Post queries
export async function getPosts(filters?: { type?: string; status?: string; limit?: number }): Promise<Post[]> {
  let result = posts;

  if (filters?.type) {
    result = result.filter(p => p.postType === filters.type);
  }
  if (filters?.status) {
    result = result.filter(p => p.status === filters.status);
  } else {
    result = result.filter(p => p.status === 'published');
  }

  result.sort((a, b) => {
    const dateA = a.publishedAt?.getTime() || a.createdAt.getTime();
    const dateB = b.publishedAt?.getTime() || b.createdAt.getTime();
    return dateB - dateA;
  });

  return result.slice(0, filters?.limit || 100);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return posts.find(p => p.slug === slug && p.status === 'published') || null;
}

export async function getStories(perspective?: string, limit = 10): Promise<Post[]> {
  let result = posts.filter(p => p.postType === 'story' && p.status === 'published');

  if (perspective) {
    result = result.filter(p => p.storyPerspective === perspective);
  }

  return result.slice(0, limit);
}

// Timeline data
export async function getTimelineData(): Promise<{ works: Work[]; monsters: Monster[] }> {
  const timelineWorks = works
    .filter(w => w.isActive && w.releaseDate)
    .sort((a, b) => {
      const dateA = a.releaseDate!.getTime();
      const dateB = b.releaseDate!.getTime();
      return dateA - dateB;
    });

  const timelineMonsters = monsters
    .filter(m => m.isActive && m.firstAppearanceDate)
    .sort((a, b) => {
      const dateA = a.firstAppearanceDate!.getTime();
      const dateB = b.firstAppearanceDate!.getTime();
      return dateA - dateB;
    });

  return { works: timelineWorks, monsters: timelineMonsters };
}

// Stats for home page
export async function getSiteStats(): Promise<{ monsters: number; works: number; battles: number; products: number }> {
  return {
    monsters: monsters.filter(m => m.isActive).length,
    works: works.filter(w => w.isActive).length,
    battles: battles.length,
    products: products.filter(p => p.isActive).length,
  };
}

// For admin - get all data including inactive
export async function getAllMonsters(): Promise<Monster[]> {
  return monsters;
}

export async function getAllWorks(): Promise<Work[]> {
  return works;
}

export async function getAllProducts(): Promise<Product[]> {
  return products;
}

export async function getSuggestedProducts(): Promise<Product[]> {
  return products.filter(p => p.isSuggested);
}
