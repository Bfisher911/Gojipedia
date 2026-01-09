import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Info } from 'lucide-react';
import { StatBar } from '@/components/ui/FanPowerIndex';

export const metadata: Metadata = {
  title: 'Fan Power Index Explained',
  description: 'Learn how we calculate the Fan Power Index for every monster in our database. Our transparent methodology and formula.',
};

export default function FanPowerIndexPage() {
  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Link
          href="/monsters"
          className="inline-flex items-center gap-2 text-[#9090a0] hover:text-[#f0f0f5] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Monsters
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-[#f0f0f5]">Fan Power Index</h1>
        <p className="mt-4 text-[#9090a0]">
          The Fan Power Index (FPI) is our way of ranking kaiju based on their combat capabilities,
          special abilities, and overall threat level. It&apos;s a fun metric for comparison, not official canon.
        </p>

        {/* Important Disclaimer */}
        <div className="mt-8 p-4 bg-[#00d4aa]/10 border border-[#00d4aa]/30 rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-[#00d4aa] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-[#00d4aa]">Important Disclaimer</h3>
            <p className="text-sm text-[#9090a0] mt-1">
              The Fan Power Index is an unofficial, fan-made metric created by Gojipedia.
              It is not endorsed by Toho, Legendary, or any official Godzilla franchise holders.
              Power levels in kaiju films are inconsistent by design, so treat this as entertainment, not gospel.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-[#f0f0f5] mb-6">How It Works</h2>

          <div className="space-y-6">
            <div className="p-6 bg-[#12121a] border border-[#2a2a3a] rounded-xl">
              <h3 className="text-lg font-semibold text-[#f0f0f5] mb-4">The Five Components</h3>
              <p className="text-[#9090a0] mb-4">
                Each monster is scored from 0-100 in five categories:
              </p>

              <div className="space-y-4">
                <ComponentExplainer
                  name="Durability"
                  weight={20}
                  description="How much punishment can this kaiju take? Considers regeneration, armor, and survivability."
                  color="bg-blue-500"
                  example="Godzilla&apos;s nuclear-powered regeneration gives him top marks."
                />
                <ComponentExplainer
                  name="Attack Power"
                  weight={25}
                  description="Raw destructive capability. Physical strength, beam attacks, and area damage."
                  color="bg-red-500"
                  example="King Ghidorah&apos;s gravity beams can level cities in seconds."
                />
                <ComponentExplainer
                  name="Mobility"
                  weight={15}
                  description="Speed, agility, and ability to reposition. Includes flight and burrowing."
                  color="bg-yellow-500"
                  example="Rodan&apos;s supersonic flight gives him maximum mobility."
                />
                <ComponentExplainer
                  name="Intelligence"
                  weight={15}
                  description="Problem-solving, tactical thinking, and learning ability."
                  color="bg-purple-500"
                  example="Kong uses tools and adapts strategies mid-battle."
                />
                <ComponentExplainer
                  name="Special Abilities"
                  weight={25}
                  description="Unique powers beyond basic attacks. Versatility and game-changing abilities."
                  color="bg-[#00d4aa]"
                  example="Mothra&apos;s reincarnation and psychic connection with the Shobijin."
                />
              </div>
            </div>

            {/* Formula */}
            <div className="p-6 bg-[#12121a] border border-[#2a2a3a] rounded-xl">
              <h3 className="text-lg font-semibold text-[#f0f0f5] mb-4">The Formula</h3>
              <div className="bg-[#0a0a0f] p-4 rounded-lg font-mono text-sm text-[#00d4aa]">
                <p>Base Score = </p>
                <p className="ml-4">(Durability × 0.20) +</p>
                <p className="ml-4">(Attack Power × 0.25) +</p>
                <p className="ml-4">(Mobility × 0.15) +</p>
                <p className="ml-4">(Intelligence × 0.15) +</p>
                <p className="ml-4">(Special Abilities × 0.25)</p>
                <p className="mt-4">Final FPI = Base Score × Era Scaling Factor</p>
              </div>
              <p className="text-sm text-[#606070] mt-4">
                The Era Scaling Factor (typically 1.0-1.2) accounts for power creep across different film eras.
                MonsterVerse kaiju tend to be depicted as more powerful than their Showa counterparts.
              </p>
            </div>

            {/* Example */}
            <div className="p-6 bg-[#12121a] border border-[#2a2a3a] rounded-xl">
              <h3 className="text-lg font-semibold text-[#f0f0f5] mb-4">Example: Godzilla (MonsterVerse)</h3>
              <div className="space-y-3">
                <StatBar label="Durability" value={98} color="bg-blue-500" />
                <StatBar label="Attack Power" value={95} color="bg-red-500" />
                <StatBar label="Mobility" value={60} color="bg-yellow-500" />
                <StatBar label="Intelligence" value={85} color="bg-purple-500" />
                <StatBar label="Special" value={92} color="bg-[#00d4aa]" />
              </div>
              <div className="mt-4 p-3 bg-[#0a0a0f] rounded-lg">
                <p className="text-sm text-[#9090a0]">
                  Base: (98×0.20) + (95×0.25) + (60×0.15) + (85×0.15) + (92×0.25) = 88.05
                </p>
                <p className="text-sm text-[#9090a0] mt-1">
                  With Era Scaling (1.08): 88.05 × 1.08 = <span className="text-[#00d4aa] font-bold">95</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-[#f0f0f5] mb-6">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <FAQItem
              question="Who decides the scores?"
              answer="Our editorial team assigns scores based on feats shown in films, supplementary materials, and official stats when available. We prioritize on-screen performance over promotional materials."
            />
            <FAQItem
              question="Why does Godzilla have different scores across eras?"
              answer="Each era&apos;s Godzilla is essentially a different character with different capabilities. Showa Godzilla can fly (once), while MonsterVerse Godzilla has thermonuclear form. We rate them separately."
            />
            <FAQItem
              question="How do you handle inconsistent power levels?"
              answer="Kaiju films aren&apos;t about consistent power scaling. We average across appearances and weight more significant battles. Plot-driven power fluctuations are noted but not overweighted."
            />
            <FAQItem
              question="Can I suggest score changes?"
              answer="Absolutely. We review feedback and update scores when compelling evidence is presented. Use the contact form to submit your case."
            />
          </div>
        </section>

        {/* Back to Monsters */}
        <div className="mt-12 text-center">
          <Link
            href="/monsters"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00d4aa] text-[#0a0a0f] rounded-lg font-semibold hover:bg-[#00f0c0] transition-colors"
          >
            Explore Monster Rankings
          </Link>
        </div>
      </div>
    </div>
  );
}

function ComponentExplainer({
  name,
  weight,
  description,
  color,
  example,
}: {
  name: string;
  weight: number;
  description: string;
  color: string;
  example: string;
}) {
  return (
    <div className="flex gap-4">
      <div className={`w-1 rounded-full ${color} flex-shrink-0`} />
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-[#f0f0f5]">{name}</h4>
          <span className="text-xs text-[#606070]">({weight}% weight)</span>
        </div>
        <p className="text-sm text-[#9090a0] mt-1">{description}</p>
        <p className="text-xs text-[#606070] mt-1 italic">Example: {example}</p>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="p-4 bg-[#12121a] border border-[#2a2a3a] rounded-xl">
      <h3 className="font-semibold text-[#f0f0f5]">{question}</h3>
      <p className="text-sm text-[#9090a0] mt-2">{answer}</p>
    </div>
  );
}
