import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Swords, Shield, Zap, Brain, Star, Clock } from 'lucide-react';
import { getMonsterBySlug, getMonsterFightRecord, getRelatedMonsters, getProductsByMonster } from '@/lib/db';
import { EraTags } from '@/components/ui/EraBadge';
import { FanPowerIndex, StatBar } from '@/components/ui/FanPowerIndex';
import { MonsterCardCompact } from '@/components/monsters/MonsterCard';
import { ProductCardHorizontal, AffiliateDisclosure } from '@/components/products/ProductCard';
import { AdSlot } from '@/components/ui/AdSlot';
import { cn, formatDate, formatHeight, formatWeight, getAlignmentClassName, getAlignmentLabel, calculateFanPowerIndex } from '@/lib/utils';
import type { Outcome } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const monster = await getMonsterBySlug(slug);

  if (!monster) {
    return { title: 'Monster Not Found' };
  }

  return {
    title: `${monster.name}`,
    description: monster.originSummary || `Learn about ${monster.name}, a ${monster.speciesType} from the Godzilla universe.`,
    openGraph: {
      title: `${monster.name} | Gojipedia`,
      description: monster.originSummary || `Explore ${monster.name}'s history, abilities, and battles.`,
      images: monster.primaryImageUrl ? [{ url: monster.primaryImageUrl }] : undefined,
    },
  };
}

export default async function MonsterProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const monster = await getMonsterBySlug(slug);

  if (!monster) {
    notFound();
  }

  const [fightRecord, relatedMonsters, products] = await Promise.all([
    getMonsterFightRecord(monster.id),
    getRelatedMonsters(monster.id, 6),
    getProductsByMonster(monster.id, 4),
  ]);

  const fpiBreakdown = calculateFanPowerIndex(monster);

  // Combine relationships
  const allies = [
    ...(monster.relationshipsFrom?.filter(r => r.relationType === 'ally') || []),
    ...(monster.relationshipsTo?.filter(r => r.relationType === 'ally') || []),
  ];
  const enemies = [
    ...(monster.relationshipsFrom?.filter(r => r.relationType === 'enemy' || r.relationType === 'rival') || []),
    ...(monster.relationshipsTo?.filter(r => r.relationType === 'enemy' || r.relationType === 'rival') || []),
  ];

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#1a1a25] to-[#0a0a0f] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Link
            href="/monsters"
            className="inline-flex items-center gap-2 text-[#9090a0] hover:text-[#f0f0f5] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Monster Directory
          </Link>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-[#12121a]">
              {monster.primaryImageUrl ? (
                <Image
                  src={monster.primaryImageUrl}
                  alt={monster.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-9xl opacity-20">
                    {monster.speciesType === 'mech' ? '🤖' : '🦖'}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="md:col-span-2">
              <EraTags eras={monster.eraTags} size="md" className="mb-4" />

              <h1 className="text-4xl md:text-5xl font-bold text-[#f0f0f5]">{monster.name}</h1>

              {monster.aliases.length > 0 && (
                <p className="mt-2 text-[#9090a0]">
                  Also known as: {monster.aliases.join(', ')}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 mt-4">
                <span className={cn('text-lg font-medium', getAlignmentClassName(monster.alignment))}>
                  {getAlignmentLabel(monster.alignment)}
                </span>
                <span className="text-[#2a2a3a]">•</span>
                <span className="text-[#9090a0] capitalize">{monster.speciesType.replace('_', ' ')}</span>
                {monster.firstAppearanceDate && (
                  <>
                    <span className="text-[#2a2a3a]">•</span>
                    <span className="text-[#9090a0]">
                      First seen: {formatDate(monster.firstAppearanceDate, 'year')}
                    </span>
                  </>
                )}
              </div>

              {/* Fan Power Index */}
              <div className="mt-6 p-4 bg-[#12121a] border border-[#2a2a3a] rounded-xl">
                <FanPowerIndex score={monster.fanPowerIndex} breakdown={fpiBreakdown} showBreakdown size="lg" />
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <QuickStat icon={<Swords className="w-4 h-4" />} label="Wins" value={fightRecord.wins} color="text-green-500" />
                <QuickStat icon={<Shield className="w-4 h-4" />} label="Losses" value={fightRecord.losses} color="text-red-500" />
                <QuickStat icon={<Zap className="w-4 h-4" />} label="Draws" value={fightRecord.draws} color="text-yellow-500" />
                <QuickStat icon={<Star className="w-4 h-4" />} label="FPI Rank" value={`#${monster.fanPowerIndex}`} color="text-[#00d4aa]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Vitals Panel */}
            <section className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-6">
              <h2 className="text-xl font-bold text-[#f0f0f5] mb-4">Vitals</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <VitalItem label="Height" value={formatHeight(monster.heightMeters)} />
                <VitalItem label="Weight" value={formatWeight(monster.weightTons)} />
                <VitalItem label="Species" value={monster.speciesType.replace('_', ' ')} />
                <VitalItem label="Origin" value={monster.originSummary || 'Unknown'} isLong />
              </div>
              {monster.lastKnownWhereabouts && (
                <div className="mt-4 pt-4 border-t border-[#2a2a3a]">
                  <span className="text-sm text-[#606070]">Last Known Whereabouts:</span>
                  <p className="text-[#9090a0] mt-1">{monster.lastKnownWhereabouts}</p>
                </div>
              )}
            </section>

            {/* Description */}
            {monster.descriptionLong && (
              <section className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-6">
                <h2 className="text-xl font-bold text-[#f0f0f5] mb-4">Overview</h2>
                <p className="text-[#9090a0] whitespace-pre-line">{monster.descriptionLong}</p>
              </section>
            )}

            {/* Abilities & Attacks */}
            <section className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-6">
              <h2 className="text-xl font-bold text-[#f0f0f5] mb-4">Powers & Abilities</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {monster.abilities.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-[#9090a0] mb-2">Abilities</h3>
                    <ul className="space-y-1">
                      {monster.abilities.map((ability) => (
                        <li key={ability} className="flex items-center gap-2 text-[#f0f0f5]">
                          <Zap className="w-3 h-3 text-[#00d4aa]" />
                          {ability}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {monster.attacks.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-[#9090a0] mb-2">Signature Attacks</h3>
                    <ul className="space-y-1">
                      {monster.attacks.map((attack) => (
                        <li key={attack} className="flex items-center gap-2 text-[#f0f0f5]">
                          <Swords className="w-3 h-3 text-red-500" />
                          {attack}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {monster.weaknesses.length > 0 && (
                <div className="mt-6 pt-4 border-t border-[#2a2a3a]">
                  <h3 className="text-sm font-medium text-[#9090a0] mb-2">Known Weaknesses</h3>
                  <ul className="flex flex-wrap gap-2">
                    {monster.weaknesses.map((weakness) => (
                      <li
                        key={weakness}
                        className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-sm"
                      >
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Ad Slot */}
            <AdSlot variant="article" />

            {/* Fight Record */}
            {fightRecord.battles.length > 0 && (
              <section className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-6">
                <h2 className="text-xl font-bold text-[#f0f0f5] mb-4">Fight Record</h2>
                <div className="flex gap-4 mb-6">
                  <FightRecordStat label="Wins" value={fightRecord.wins} color="text-green-500" />
                  <FightRecordStat label="Losses" value={fightRecord.losses} color="text-red-500" />
                  <FightRecordStat label="Draws" value={fightRecord.draws} color="text-yellow-500" />
                  <FightRecordStat label="Unknown" value={fightRecord.unknown} color="text-gray-500" />
                </div>
                <div className="space-y-3">
                  {fightRecord.battles.map(({ battle, outcome, opponents }) => (
                    <div
                      key={battle.id}
                      className="flex items-center gap-4 p-3 bg-[#0a0a0f] rounded-lg"
                    >
                      <OutcomeBadge outcome={outcome} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#f0f0f5] truncate">{battle.title}</p>
                        <p className="text-sm text-[#606070]">
                          vs. {opponents.map((o) => o.name).join(', ') || 'Unknown'}
                        </p>
                      </div>
                      {battle.location && (
                        <span className="text-xs text-[#606070] hidden sm:block">{battle.location}</span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Appearances */}
            {monster.appearances && monster.appearances.length > 0 && (
              <section className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-6">
                <h2 className="text-xl font-bold text-[#f0f0f5] mb-4">Appearances</h2>
                <div className="space-y-3">
                  {monster.appearances.map((appearance) => (
                    <Link
                      key={appearance.id}
                      href={`/movies/${appearance.work?.slug}`}
                      className="flex items-center gap-4 p-3 bg-[#0a0a0f] rounded-lg hover:bg-[#1a1a25] transition-colors"
                    >
                      <div className="w-10 h-14 bg-[#1a1a25] rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xl opacity-30">🎬</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#f0f0f5] truncate">
                          {appearance.work?.title || 'Unknown'}
                        </p>
                        <p className="text-sm text-[#606070] capitalize">
                          {appearance.roleTag} • {formatDate(appearance.work?.releaseDate ?? null, 'year')}
                        </p>
                      </div>
                      {appearance.notesShort && (
                        <p className="text-xs text-[#9090a0] hidden md:block max-w-xs truncate">
                          {appearance.notesShort}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Relationships */}
            {(allies.length > 0 || enemies.length > 0) && (
              <section className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-6">
                <h2 className="text-xl font-bold text-[#f0f0f5] mb-4">Allies & Enemies</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {allies.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-green-500 mb-3">Allies</h3>
                      <div className="space-y-2">
                        {allies.slice(0, 4).map((rel) => {
                          const relatedMonster = rel.fromMonsterId === monster.id ? rel.toMonster : rel.fromMonster;
                          if (!relatedMonster) return null;
                          return (
                            <Link
                              key={rel.id}
                              href={`/monsters/${relatedMonster.slug}`}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#1a1a25] transition-colors"
                            >
                              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                <span className="text-sm">🤝</span>
                              </div>
                              <span className="text-[#f0f0f5]">{relatedMonster.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {enemies.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-red-500 mb-3">Enemies</h3>
                      <div className="space-y-2">
                        {enemies.slice(0, 4).map((rel) => {
                          const relatedMonster = rel.fromMonsterId === monster.id ? rel.toMonster : rel.fromMonster;
                          if (!relatedMonster) return null;
                          return (
                            <Link
                              key={rel.id}
                              href={`/monsters/${relatedMonster.slug}`}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#1a1a25] transition-colors"
                            >
                              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                <span className="text-sm">⚔️</span>
                              </div>
                              <span className="text-[#f0f0f5]">{relatedMonster.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shop This Monster */}
            {products.length > 0 && (
              <section className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#f0f0f5]">Shop {monster.name}</h2>
                  <Link
                    href={`/shop?monster=${monster.slug}`}
                    className="text-sm text-[#00d4aa] hover:text-[#00f0c0] transition-colors"
                  >
                    View all
                  </Link>
                </div>
                <div className="space-y-3">
                  {products.map((product) => (
                    <ProductCardHorizontal key={product.id} product={product} />
                  ))}
                </div>
                <AffiliateDisclosure className="mt-4" />
              </section>
            )}

            {/* Ad Slot */}
            <AdSlot variant="sidebar" className="hidden lg:block" />

            {/* Related Monsters */}
            {relatedMonsters.length > 0 && (
              <section className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-4">
                <h2 className="text-lg font-bold text-[#f0f0f5] mb-4">Related Monsters</h2>
                <div className="space-y-3">
                  {relatedMonsters.map((m) => (
                    <MonsterCardCompact key={m.id} monster={m} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function QuickStat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color: string }) {
  return (
    <div className="bg-[#12121a] border border-[#2a2a3a] rounded-lg p-3 text-center">
      <div className={cn('flex items-center justify-center gap-1 mb-1', color)}>
        {icon}
        <span className="text-xl font-bold">{value}</span>
      </div>
      <span className="text-xs text-[#606070]">{label}</span>
    </div>
  );
}

function VitalItem({ label, value, isLong = false }: { label: string; value: string; isLong?: boolean }) {
  return (
    <div className={isLong ? 'sm:col-span-2' : ''}>
      <span className="text-sm text-[#606070]">{label}</span>
      <p className={cn('text-[#f0f0f5] capitalize', isLong ? 'line-clamp-2' : '')}>{value}</p>
    </div>
  );
}

function FightRecordStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="text-center">
      <div className={cn('text-2xl font-bold', color)}>{value}</div>
      <div className="text-xs text-[#606070]">{label}</div>
    </div>
  );
}

function OutcomeBadge({ outcome }: { outcome: Outcome }) {
  const styles: Record<Outcome, string> = {
    win: 'bg-green-500/20 text-green-500',
    loss: 'bg-red-500/20 text-red-500',
    draw: 'bg-yellow-500/20 text-yellow-500',
    unknown: 'bg-gray-500/20 text-gray-500',
  };

  const labels: Record<Outcome, string> = {
    win: 'W',
    loss: 'L',
    draw: 'D',
    unknown: '?',
  };

  return (
    <span className={cn('w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm', styles[outcome])}>
      {labels[outcome]}
    </span>
  );
}
