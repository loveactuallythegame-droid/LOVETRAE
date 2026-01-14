import { GameSession } from './supabase';

export type Badge = {
    id: string;
    name: string;
    icon: string;
    description: string;
    condition: (history: GameSession[]) => boolean;
};

export const BADGES: Badge[] = [
    {
        id: 'truth_teller',
        name: 'Truth Teller',
        icon: 'flash',
        description: 'Played 5 Conflict Games',
        condition: (h) => h.filter(g => g.game_id === 'TruthOrTrust').length >= 5 // Simplified check
    },
    {
        id: 'streak_master',
        name: 'Streak Master',
        icon: 'flame',
        description: 'Played 3 days in a row',
        condition: (h) => calculateStreak(h) >= 3
    },
    {
        id: 'vulnerability_hero',
        name: 'Vulnerability Hero',
        icon: 'heart',
        description: 'Scored high in Vulnerability',
        condition: (h) => h.some(s => {
            try {
                const state = JSON.parse(s.state || '{}');
                return state.playerData?.vulnerabilityScore > 80;
            } catch { return false; }
        })
    }
];

export function calculateStreak(history: GameSession[]): number {
    const finished = history.filter(h => h.finished_at);
    if (!finished.length) return 0;
    const sorted = [...finished].sort((a, b) => new Date(b.finished_at!).getTime() - new Date(a.finished_at!).getTime());
    const uniqueDates = [...new Set(sorted.map(s => new Date(s.finished_at!).toDateString()))];

    let streak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    // If played today, start count. If not, only continue if played yesterday.
    if (uniqueDates[0] === today) {
        streak = 1;
    } else if (uniqueDates[0] === yesterday) {
        streak = 1; // Played yesterday, so streak is active but hasn't incremented for today yet? 
        // Actually usually streak includes today if done.
        // Let's just count consecutive days backwards.
    } else {
        return 0;
    }

    for (let i = 0; i < uniqueDates.length - 1; i++) {
        const d1 = new Date(uniqueDates[i]);
        const d2 = new Date(uniqueDates[i + 1]);
        const diff = (d1.getTime() - d2.getTime()) / (1000 * 3600 * 24);
        if (Math.round(diff) === 1) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
}

export function calculateStats(history: GameSession[]) {
    let totalScore = 0;
    let categoryScores: Record<string, number> = {
        emotional: 0,
        conflict: 0,
        romance: 0,
        creative: 0,
        arcade: 0
    };

    history.forEach(s => {
        const score = s.score || 0;
        totalScore += score;
        // In a real app, join with Game definition to get category.
        // For now, we assume we might store category in metadata or fetch in bulk.
        // Mock category distribution based on score
        categoryScores.emotional += Math.floor(score * 0.3);
        categoryScores.conflict += Math.floor(score * 0.2);
        categoryScores.romance += Math.floor(score * 0.4);
        categoryScores.arcade += Math.floor(score * 0.1);
    });

    return { totalScore, categoryScores, streak: calculateStreak(history) };
}

export function getUnlockedBadges(history: GameSession[]) {
    return BADGES.filter(b => b.condition(history));
}

export function calculateLevel(score: number): number {
    return Math.floor(Math.sqrt(score / 100)) + 1;
}
