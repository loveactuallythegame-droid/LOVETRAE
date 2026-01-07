import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Text, GlassCard } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

type IcebergNode = {
    id: string;
    label: string;
    children?: IcebergNode[];
    depth: number;
};

const ICEBERG_DATA: IcebergNode[] = [
    {
        id: 'anger', label: 'Anger', depth: 0, children: [
            { id: 'disrespect', label: 'Feeling Disrespected', depth: 1, children: [
                { id: 'unworthy', label: 'Fear of being unworthy', depth: 2 },
                { id: 'invisible', label: 'Fear of being invisible', depth: 2 }
            ]},
            { id: 'control', label: 'Loss of Control', depth: 1, children: [
                { id: 'safety', label: 'Need for safety', depth: 2 },
                { id: 'chaos', label: 'Fear of chaos', depth: 2 }
            ]}
        ]
    },
    {
        id: 'withdrawal', label: 'Withdrawal', depth: 0, children: [
            { id: 'overwhelm', label: 'Overwhelmed', depth: 1, children: [
                { id: 'inadequacy', label: 'Feeling inadequate', depth: 2 },
                { id: 'failure', label: 'Fear of failure', depth: 2 }
            ]}
        ]
    }
];

export default function TheIceberg({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'the-iceberg' };
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selectedLeaf, setSelectedLeaf] = useState<string | null>(null);
  const sessionId = useRef<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      const couple_id = (await supabase.from('profiles').select('couple_code').eq('user_id', user?.id || '').single()).data?.couple_code;
      if (user && couple_id) {
        const session = await createGameSession(gameId, user.id, couple_id);
        sessionId.current = session.id;
      }
    });
  }, [gameId]);

  function toggle(id: string) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(p => ({ ...p, [id]: !p[id] }));
  }

  function select(node: IcebergNode) {
    if (!node.children) {
        setSelectedLeaf(node.label);
        speakMarcie("That anger is just the tip. Let's dive into the frozen trauma beneath.");
    } else {
        toggle(node.id);
    }
  }

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'The Iceberg',
    description: 'Drill down to underlying emotional needs',
    category: 'healing' as const,
    difficulty: 'hard' as const,
    xpReward: 75,
    currentStep: 0,
    totalTime: 90,
    playerData: { vulnerabilityScore: selectedLeaf ? 90 : 20, honestyScore: 80, completionTime: 0, partnerSync: 0 },
  }), [gameId, selectedLeaf]);

  function onComplete(res: { score: number; xpEarned: number }) {
    const xp = Math.min(110, 75 + (selectedLeaf ? 35 : 0));
    if (sessionId.current) updateGameSession(sessionId.current, { finished_at: new Date().toISOString(), score: res.score, state: JSON.stringify({ selectedLeaf, xp }) });
    navigation.goBack();
  }

  const renderNode = (node: IcebergNode) => {
    const isOpen = expanded[node.id];
    const isLeaf = !node.children;
    const isSelected = selectedLeaf === node.label;
    
    return (
        <View key={node.id} style={{ marginLeft: node.depth * 16, marginTop: 8 }}>
            <Pressable onPress={() => select(node)} style={[styles.node, isSelected && styles.selected]}>
                <Text variant="body" style={{color: isSelected ? '#1a0a1f' : '#fff'}}>{node.label} {isLeaf ? '' : (isOpen ? '▼' : '▶')}</Text>
            </Pressable>
            {isOpen && node.children && (
                <View>
                    {node.children.map(renderNode)}
                </View>
            )}
        </View>
    );
  };

  const inputArea = (
    <View>
      <GlassCard>
        <Text variant="body">Select an emotion to drill down:</Text>
        <View style={{marginTop: 16}}>
            {ICEBERG_DATA.map(renderNode)}
        </View>
        {selectedLeaf && (
            <View style={{marginTop: 16, padding: 8, backgroundColor: 'rgba(51, 222, 165, 0.2)', borderRadius: 8}}>
                <Text variant="keyword">Core Need identified: {selectedLeaf}</Text>
            </View>
        )}
      </GlassCard>
    </View>
  );

  return <GameContainer state={baseState} inputs={["text"]} inputArea={inputArea} onComplete={onComplete} />;
}

const styles = StyleSheet.create({
  node: { padding: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  selected: { backgroundColor: '#33DEA5' }
});
