import type { Metadata } from 'next';
import Link from 'next/link';
import { getStories } from '@/lib/db';
import { AdSlot } from '@/components/ui/AdSlot';
import { formatDate } from '@/lib/utils';
import { Clock, User, AlertTriangle } from 'lucide-react';
import type { StoryPerspective } from '@/types';

export const metadata: Metadata = {
  title: 'Short Stories',
  description: 'Original fan fiction set in the Godzilla universe. Stories from human, Godzilla, and kaiju perspectives.',
};

interface PageProps {
  searchParams: Promise<{
    perspective?: string;
  }>;
}

const perspectives: { value: StoryPerspective; label: string; emoji: string; description: string }[] = [
  { value: 'human', label: 'Human Perspective', emoji: '👤', description: 'Stories through human eyes' },
  { value: 'godzilla', label: 'Godzilla Perspective', emoji: '🦖', description: 'Inside the mind of the King' },
  { value: 'other_monster', label: 'Other Monster', emoji: '👹', description: 'Other kaiju viewpoints' },
  { value: 'battle_royale', label: 'Battle Royale', emoji: '⚔️', description: 'Multi-monster clashes' },
];

export default async function StoriesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const stories = await getStories(params.perspective, 20);

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#f0f0f5]">Short Stories</h1>
          <p className="mt-2 text-[#9090a0]">
            Original fan fiction set in the kaiju universe. Under 5,000 words each.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-500">Fan Fiction Disclaimer</h3>
            <p className="text-sm text-[#9090a0] mt-1">
              These stories are unofficial fan works created for entertainment purposes.
              All characters and settings are property of their respective owners (Toho, Legendary, etc.).
              No copyright infringement intended.
            </p>
          </div>
        </div>

        {/* Perspective Filters */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-[#f0f0f5] mb-4">Browse by Perspective</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {perspectives.map(({ value, label, emoji, description }) => (
              <Link
                key={value}
                href={`/stories?perspective=${value}`}
                className={`p-4 rounded-xl border transition-colors ${
                  params.perspective === value
                    ? 'bg-[#00d4aa] border-[#00d4aa] text-[#0a0a0f]'
                    : 'bg-[#12121a] border-[#2a2a3a] hover:border-[#00d4aa]/50'
                }`}
              >
                <div className="text-2xl mb-2">{emoji}</div>
                <h3 className={`font-semibold ${params.perspective === value ? 'text-[#0a0a0f]' : 'text-[#f0f0f5]'}`}>
                  {label}
                </h3>
                <p className={`text-xs mt-1 ${params.perspective === value ? 'text-[#0a0a0f]/70' : 'text-[#606070]'}`}>
                  {description}
                </p>
              </Link>
            ))}
          </div>
          {params.perspective && (
            <Link
              href="/stories"
              className="inline-block mt-4 text-sm text-[#ff4444] hover:text-[#ff6666] transition-colors"
            >
              Clear filter
            </Link>
          )}
        </section>

        {/* Ad Slot */}
        <AdSlot variant="top" className="mb-8" />

        {/* Stories Grid */}
        <section>
          <h2 className="text-xl font-bold text-[#f0f0f5] mb-6">
            {params.perspective
              ? `${perspectives.find((p) => p.value === params.perspective)?.label || 'Stories'}`
              : 'All Stories'}
          </h2>

          {stories.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {stories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-xl font-semibold text-[#f0f0f5]">No stories found</h2>
              <p className="text-[#9090a0] mt-2">Check back soon for new tales from the kaiju universe.</p>
            </div>
          )}
        </section>

        {/* Call for submissions */}
        <section className="mt-12 p-8 bg-[#12121a] border border-[#2a2a3a] rounded-xl text-center">
          <h2 className="text-xl font-bold text-[#f0f0f5]">Want to Contribute?</h2>
          <p className="mt-2 text-[#9090a0] max-w-md mx-auto">
            We welcome original fan fiction submissions. Stories should be under 5,000 words
            and set in the kaiju universe.
          </p>
          <Link
            href="/about/submissions"
            className="inline-block mt-4 px-6 py-2 bg-[#00d4aa] text-[#0a0a0f] rounded-lg font-medium hover:bg-[#00f0c0] transition-colors"
          >
            Submission Guidelines
          </Link>
        </section>
      </div>
    </div>
  );
}

function StoryCard({ story }: { story: { id: string; title: string; slug: string; excerpt: string; storyPerspective: string | null; publishedAt: Date | null } }) {
  const perspective = perspectives.find((p) => p.value === story.storyPerspective);

  return (
    <Link
      href={`/stories/${story.slug}`}
      className="group flex flex-col p-6 bg-[#12121a] border border-[#2a2a3a] rounded-xl hover:border-[#00d4aa]/50 transition-colors"
    >
      <div className="flex items-center gap-2 mb-3">
        {perspective && (
          <span className="text-lg">{perspective.emoji}</span>
        )}
        <span className="text-xs text-[#00d4aa] uppercase tracking-wider">
          {perspective?.label || 'Story'}
        </span>
      </div>
      <h3 className="text-xl font-bold text-[#f0f0f5] group-hover:text-[#00d4aa] transition-colors">
        {story.title}
      </h3>
      <p className="mt-3 text-[#9090a0] line-clamp-3 flex-1">{story.excerpt}</p>
      <div className="mt-4 flex items-center gap-4 text-sm text-[#606070]">
        {story.publishedAt && (
          <span>{formatDate(story.publishedAt, 'short')}</span>
        )}
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          ~10 min read
        </span>
      </div>
    </Link>
  );
}
