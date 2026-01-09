'use client';

import { useCommits, useLanguages, useScores } from '@/hooks/user';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';

const skeletonClasses =
  'h-[140px] rounded-xl bg-muted animate-pulse shadow-sm border border-border/60';

export default function Stats() {
  const { commits, loading: commitsLoading } = useCommits();
  const { languages, loading: languagesLoading } = useLanguages();
  const { scores, loading: scoresLoading } = useScores();

  const isLoading = commitsLoading || languagesLoading || scoresLoading;

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className={skeletonClasses} />
        <div className={skeletonClasses} />
        <div className={skeletonClasses} />
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Commits',
      value: commits?.totalCommits?.toLocaleString() ?? '0',
      description: `Across ${commits?.repoCount ?? 0} repositories`,
    },
    {
      title: 'Top Language',
      value: languages?.languages?.[0]?.language ?? 'N/A',
      description: `${languages?.languages?.length ?? 0} languages used`,
    },
    {
      title: 'Overall Score',
      value: scores?.score ?? 0,
      description: `From ${scores?.totalRepos ?? 0} public repos`,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title} className="backdrop-blur bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">
              {card.title}
            </CardTitle>
            <CardDescription className="text-3xl font-semibold text-foreground">
              {card.value}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-muted-foreground">
            {card.description}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}