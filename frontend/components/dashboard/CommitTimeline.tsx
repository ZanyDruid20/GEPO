'use client';
import { useCommits } from '@/hooks/user';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card';

export default function CommitTimeline() {
    const { commits, loading, error } = useCommits();

    if (loading) {
        return <div className="h-55 rounded-xl bg-muted animate-pulse" />;
    }
    if (error) {
        return <div className="text-sm text-destructive">Error: {error}</div>;
    }
    if (!commits) {
        return <div className="text-sm text-muted-foreground">No commit data</div>;
    }

    const items = [
        { label: 'Total Commits', value: commits.totalCommits.toLocaleString() },
        { label: 'Repositories', value: commits.repoCount.toLocaleString() },
    ];

    return (
        <Card className="backdrop-blur bg-card/80">
            <CardHeader className="pb-2">
                <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Activity Snapshot</p>
                <CardTitle className="text-lg">Commit Summary</CardTitle>
                <CardDescription>
                    Recent high-level numbers across your repositories
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {items.map((item) => (
                        <div
                            key={item.label}
                            className="rounded-lg border border-border/70 bg-white/5 px-4 py-3 text-center backdrop-blur"
                        >
                            <p className="text-xs font-medium tracking-wide text-muted-foreground mb-2">
                                {item.label}
                            </p>
                            <p className="text-3xl font-semibold leading-tight text-foreground">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}