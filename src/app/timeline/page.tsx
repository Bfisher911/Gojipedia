import type { Metadata } from 'next';
import Link from 'next/link';
import { getTimelineData } from '@/lib/db';
import { AdSlot } from '@/components/ui/AdSlot';
import { formatDate } from '@/lib/utils';
import type { Era } from '@/types';

export const metadata: Metadata = {
  title: 'Timeline',
  description: 'Explore the complete Godzilla timeline from 1954 to present. View releases chronologically or by in-universe events.',
};

const eraInfo: Record<Era, { years: string; color: string; description: string }> = {
  Showa: {
    years: '1954-1975',
    color: 'border-yellow-400 bg-yellow-400/10',
    description: 'The original era that introduced Godzilla and established the kaiju genre. Started as nuclear horror, evolved into sci-fi adventure.',
  },
  Heisei: {
    years: '1984-1995',
    color: 'border-red-400 bg-red-400/10',
    description: 'A soft reboot returning to darker themes. Features more advanced effects and a continuous storyline.',
  },
  Millennium: {
    years: '1999-2004',
    color: 'border-teal-400 bg-teal-400/10',
    description: 'Standalone films, each treating the 1954 original as the only canon predecessor.',
  },
  Reiwa: {
    years: '2016-present',
    color: 'border-purple-400 bg-purple-400/10',
    description: 'Modern Japanese productions including Shin Godzilla and anime entries.',
  },
  Legendary: {
    years: '2014-present',
    color: 'border-blue-400 bg-blue-400/10',
    description: 'American productions creating a shared universe of titans.',
  },
  MonsterVerse: {
    years: '2014-present',
    color: 'border-blue-400 bg-blue-400/10',
    description: 'The Legendary Pictures shared universe featuring Godzilla, Kong, and other titans.',
  },
  Other: {
    years: 'Various',
    color: 'border-gray-400 bg-gray-400/10',
    description: 'Independent productions, crossovers, and miscellaneous entries.',
  },
};

export default async function TimelinePage() {
  const { works, monsters } = await getTimelineData();

  // Group by decade
  const worksByDecade = works.reduce((acc, work) => {
    if (!work.releaseDate) return acc;
    const decade = Math.floor(work.releaseDate.getFullYear() / 10) * 10;
    if (!acc[decade]) acc[decade] = [];
    acc[decade].push(work);
    return acc;
  }, {} as Record<number, typeof works>);

  const decades = Object.keys(worksByDecade)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#f0f0f5]">Timeline</h1>
          <p className="mt-2 text-[#9090a0]">
            Seven decades of kaiju cinema, from the birth of Godzilla to the modern MonsterVerse.
          </p>
        </div>

        {/* Era Overview */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-[#f0f0f5] mb-6">Eras at a Glance</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(['Showa', 'Heisei', 'Millennium', 'Reiwa', 'MonsterVerse'] as Era[]).map((era) => {
              const info = eraInfo[era];
              return (
                <Link
                  key={era}
                  href={`/movies?era=${era}`}
                  className={`p-4 rounded-xl border-l-4 ${info.color} hover:bg-[#1a1a25] transition-colors`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-[#f0f0f5]">{era}</h3>
                    <span className="text-sm text-[#606070]">{info.years}</span>
                  </div>
                  <p className="text-sm text-[#9090a0] line-clamp-2">{info.description}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Ad Slot */}
        <AdSlot variant="top" className="mb-8" />

        {/* Chronological Timeline */}
        <section>
          <h2 className="text-xl font-bold text-[#f0f0f5] mb-6">Release Chronology</h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-400 via-teal-400 to-blue-400" />

            {/* Decades */}
            <div className="space-y-12">
              {decades.map((decade, decadeIndex) => {
                const decadeWorks = worksByDecade[decade];
                return (
                  <div key={decade} className="relative">
                    {/* Decade marker */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-8 h-8 md:w-auto md:h-auto md:absolute md:left-1/2 md:-translate-x-1/2 bg-[#00d4aa] text-[#0a0a0f] font-bold px-4 py-2 rounded-full text-center z-10">
                        {decade}s
                      </div>
                    </div>

                    {/* Works in this decade */}
                    <div className="space-y-4 ml-12 md:ml-0">
                      {decadeWorks.map((work, index) => {
                        const isLeft = index % 2 === 0;
                        return (
                          <div
                            key={work.id}
                            className={`relative md:w-[45%] ${
                              isLeft ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                            }`}
                          >
                            {/* Connection dot */}
                            <div
                              className={`absolute top-3 w-3 h-3 bg-[#00d4aa] rounded-full hidden md:block ${
                                isLeft ? 'right-0 translate-x-[calc(100%+1.5rem)]' : 'left-0 -translate-x-[calc(100%+1.5rem)]'
                              }`}
                            />
                            <div className="absolute left-[-2.5rem] top-3 w-3 h-3 bg-[#00d4aa] rounded-full md:hidden" />

                            {/* Card */}
                            <Link
                              href={`/movies/${work.slug}`}
                              className="block p-4 bg-[#12121a] border border-[#2a2a3a] rounded-xl hover:border-[#00d4aa]/50 transition-colors"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-12 h-16 bg-[#1a1a25] rounded flex-shrink-0 flex items-center justify-center">
                                  <span className="text-2xl opacity-30">🎬</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-[#00d4aa]">
                                    {formatDate(work.releaseDate, 'short')}
                                  </p>
                                  <h3 className="font-semibold text-[#f0f0f5] truncate">{work.title}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getEraClass(work.eraTags[0] as Era)}`}>
                                      {work.eraTags[0] || 'Unknown'}
                                    </span>
                                    <span className="text-xs text-[#606070] capitalize">{work.workType}</span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        );
                      })}
                    </div>

                    {/* In-feed ad every 2 decades */}
                    {(decadeIndex + 1) % 2 === 0 && decadeIndex < decades.length - 1 && (
                      <div className="my-8 ml-12 md:ml-0">
                        <AdSlot variant="infeed" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Key Monster Appearances */}
        <section className="mt-16">
          <h2 className="text-xl font-bold text-[#f0f0f5] mb-6">Key Monster Debuts</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {monsters.slice(0, 8).map((monster) => (
              <Link
                key={monster.id}
                href={`/monsters/${monster.slug}`}
                className="p-4 bg-[#12121a] border border-[#2a2a3a] rounded-xl hover:border-[#00d4aa]/50 transition-colors"
              >
                <p className="text-sm text-[#00d4aa]">
                  {formatDate(monster.firstAppearanceDate, 'year')}
                </p>
                <h3 className="font-semibold text-[#f0f0f5]">{monster.name}</h3>
                <p className="text-xs text-[#606070] mt-1">First appearance</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function getEraClass(era: Era | undefined): string {
  const classes: Record<Era, string> = {
    Showa: 'bg-yellow-500/20 text-yellow-400',
    Heisei: 'bg-red-400/20 text-red-400',
    Millennium: 'bg-teal-400/20 text-teal-400',
    Reiwa: 'bg-purple-500/20 text-purple-400',
    Legendary: 'bg-blue-500/20 text-blue-400',
    MonsterVerse: 'bg-blue-500/20 text-blue-400',
    Other: 'bg-gray-500/20 text-gray-400',
  };
  return era ? classes[era] : classes.Other;
}
