// Content Draft Generator Job
// Run weekly to generate draft posts for admin review
// Uses internal site data only, does NOT copy external text

import fs from 'fs/promises';
import path from 'path';
import { sampleMonsters, sampleWorks, sampleBattles } from '@/lib/seed-data';

interface DraftResult {
  success: boolean;
  draftsCreated: number;
  errors: string[];
}

interface DraftPost {
  title: string;
  slug: string;
  postType: 'article' | 'story' | 'guide' | 'explainer';
  excerpt: string;
  content: string;
  tags: string[];
  storyPerspective?: string;
}

// Generate draft article ideas based on internal data
function generateArticleIdeas(): DraftPost[] {
  const ideas: DraftPost[] = [];

  // Era comparison articles
  const eras = ['Showa', 'Heisei', 'Millennium', 'MonsterVerse'];
  for (let i = 0; i < eras.length - 1; i++) {
    ideas.push({
      title: `${eras[i]} vs ${eras[i + 1]}: How Godzilla Changed`,
      slug: `${eras[i].toLowerCase()}-vs-${eras[i + 1].toLowerCase()}-godzilla-evolution`,
      postType: 'article',
      excerpt: `A comparison of Godzilla's portrayal between the ${eras[i]} and ${eras[i + 1]} eras, examining changes in design, abilities, and thematic focus.`,
      content: generateEraComparisonContent(eras[i], eras[i + 1]),
      tags: ['comparison', 'eras', eras[i].toLowerCase(), eras[i + 1].toLowerCase()],
    });
  }

  // Monster spotlight articles
  for (const monster of sampleMonsters.slice(0, 3)) {
    ideas.push({
      title: `${monster.name}: Complete Character Guide`,
      slug: `${monster.slug}-complete-guide`,
      postType: 'guide',
      excerpt: `Everything you need to know about ${monster.name}, from first appearance to latest incarnation.`,
      content: generateMonsterGuideContent(monster),
      tags: ['guide', monster.slug, 'character analysis'],
    });
  }

  // Battle analysis
  for (const battle of sampleBattles.slice(0, 2)) {
    ideas.push({
      title: `Battle Analysis: ${battle.title}`,
      slug: `battle-analysis-${battle.slug}`,
      postType: 'article',
      excerpt: `A tactical breakdown of ${battle.title}, examining combatant strengths, strategies, and the decisive moments.`,
      content: generateBattleAnalysisContent(battle),
      tags: ['battle analysis', 'fights'],
    });
  }

  return ideas;
}

// Generate story idea outlines
function generateStoryIdeas(): DraftPost[] {
  const perspectives = ['human', 'godzilla', 'other_monster', 'battle_royale'];
  const ideas: DraftPost[] = [];

  // Human perspective story
  ideas.push({
    title: 'The Last Lighthouse Keeper',
    slug: 'the-last-lighthouse-keeper',
    postType: 'story',
    storyPerspective: 'human',
    excerpt: 'Matsuo had manned the lighthouse on Odo Island for forty years. He thought he had seen everything the sea could offer. He was wrong.',
    content: generateStoryOutline('human', 'A lighthouse keeper witnesses Godzilla emerging from the sea'),
    tags: ['short story', 'human perspective', 'odo island'],
  });

  // Godzilla perspective
  ideas.push({
    title: 'The Weight of Crowns',
    slug: 'the-weight-of-crowns',
    postType: 'story',
    storyPerspective: 'godzilla',
    excerpt: 'He was ancient before the small ones built their first stone shelters. Now they called him King, though he had never asked for subjects.',
    content: generateStoryOutline('godzilla', 'Godzilla reflects on his role as alpha titan'),
    tags: ['short story', 'godzilla perspective', 'introspective'],
  });

  return ideas;
}

function generateEraComparisonContent(era1: string, era2: string): string {
  return `---
title: "${era1} vs ${era2}: How Godzilla Changed"
status: draft
---

# ${era1} vs ${era2}: How Godzilla Changed

[DRAFT - NEEDS EDITORIAL REVIEW]

## Introduction

This article compares Godzilla's portrayal between the ${era1} and ${era2} eras.

## Visual Design Changes

[Compare the physical designs, suit/CGI differences, size changes]

## Thematic Shifts

[Discuss how the character's role and meaning evolved]

## Combat Abilities

[Compare power sets, new abilities introduced]

## Cultural Context

[How real-world events influenced each era's interpretation]

## Conclusion

[Summary of key differences and their significance]

---
Note: This is a machine-generated draft outline. All content must be original and verified before publication.
`;
}

function generateMonsterGuideContent(monster: typeof sampleMonsters[0]): string {
  return `---
title: "${monster.name}: Complete Character Guide"
status: draft
---

# ${monster.name}: Complete Character Guide

[DRAFT - NEEDS EDITORIAL REVIEW]

## Overview

${monster.name} is a ${monster.speciesType} that first appeared in ${monster.firstAppearanceDate?.getFullYear() || 'unknown'}.

**Alignment:** ${monster.alignment}
**Eras:** ${monster.eraTags.join(', ')}

## Origin Story

${monster.originSummary || '[Research and write original origin summary]'}

## Physical Characteristics

- **Height:** ${monster.heightMeters || 'Unknown'}m
- **Weight:** ${monster.weightTons || 'Unknown'} tons
- **Species Type:** ${monster.speciesType}

## Abilities and Powers

${monster.abilities.map(a => `- ${a}`).join('\n') || '[List and describe abilities]'}

## Notable Battles

[Research and document significant fights]

## Cultural Impact

[Discuss the character's significance to the franchise]

---
Note: This is a machine-generated draft outline. All content must be original and verified before publication.
`;
}

function generateBattleAnalysisContent(battle: typeof sampleBattles[0]): string {
  return `---
title: "Battle Analysis: ${battle.title}"
status: draft
---

# Battle Analysis: ${battle.title}

[DRAFT - NEEDS EDITORIAL REVIEW]

## Setting

**Location:** ${battle.location || 'Unknown'}
**Date/Film:** [Add source]

## Combatants

[List all participants with brief capability summaries]

## The Battle

### Phase 1: Opening Moves

[Describe initial engagement]

### Phase 2: Escalation

[Describe the main conflict]

### Phase 3: Resolution

[Describe the conclusion]

## Tactical Analysis

[Break down key decisions and turning points]

## Outcome

${battle.summary || '[Document outcome]'}

## Significance

[Explain why this battle matters to the franchise]

---
Note: This is a machine-generated draft outline. All content must be original and verified before publication.
`;
}

function generateStoryOutline(perspective: string, premise: string): string {
  return `---
title: "Story Draft"
status: draft
perspective: ${perspective}
---

# Story Outline

[DRAFT - CREATIVE OUTLINE ONLY]

## Premise

${premise}

## Setting

[Describe time and place]

## Characters

[List main characters]

## Plot Points

1. Opening hook
2. Inciting incident
3. Rising action
4. Climax
5. Resolution

## Themes to Explore

[List thematic elements]

## Notes

- Keep under 5,000 words
- Original content only
- No copying canonical dialogue
- Must include fan fiction disclaimer

---
Note: This is a machine-generated story outline. The actual story must be written originally.
`;
}

export async function runContentDraftGenerator(): Promise<DraftResult> {
  console.log('[ContentDraft] Starting weekly content draft generation...');

  const result: DraftResult = {
    success: true,
    draftsCreated: 0,
    errors: [],
  };

  try {
    const contentDir = path.join(process.cwd(), 'content', 'drafts');
    await fs.mkdir(contentDir, { recursive: true });

    // Generate article drafts
    const articleIdeas = generateArticleIdeas();
    const storyIdeas = generateStoryIdeas();

    // Select 3 articles and 1 story as requested
    const selectedArticles = articleIdeas.slice(0, 3);
    const selectedStory = storyIdeas[0];

    // Write drafts to files
    for (const draft of [...selectedArticles, selectedStory]) {
      const filename = `${draft.slug}.mdx`;
      const filepath = path.join(contentDir, filename);

      await fs.writeFile(filepath, draft.content, 'utf-8');
      result.draftsCreated++;
      console.log(`[ContentDraft] Created: ${filename}`);
    }

    console.log(`[ContentDraft] Completed. Created ${result.draftsCreated} drafts.`);
  } catch (error) {
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : 'Unknown error');
    console.error('[ContentDraft] Error:', error);
  }

  return result;
}

// Allow running directly from command line
if (require.main === module) {
  runContentDraftGenerator()
    .then((result) => {
      console.log('[ContentDraft] Result:', JSON.stringify(result, null, 2));
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('[ContentDraft] Fatal error:', error);
      process.exit(1);
    });
}
