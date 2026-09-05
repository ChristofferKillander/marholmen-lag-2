import { FlatList, StyleSheet } from 'react-native';
import type { Vibe } from '../api/types';
import { VibeCard } from './VibeCard';

interface WallGridProps {
  vibes: Vibe[];
  now: number;
  bottomInset: number;
}

export function WallGrid({ vibes, now, bottomInset }: WallGridProps) {
  return (
    <FlatList
      data={vibes}
      keyExtractor={(v) => v.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[styles.content, { paddingBottom: bottomInset }]}
      renderItem={({ item, index }) => (
        <VibeCard vibe={item} index={index} now={now} />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 2,
    gap: 12,
  },
  row: {
    gap: 12,
  },
});
