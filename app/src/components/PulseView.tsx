import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ColorBoardEntry, Vibe } from '../api/types';
import { colors, FONTS } from '../theme/tokens';
import { ink } from '../utils/ink';

interface PulseViewProps {
  colorBoard: ColorBoardEntry[];
  hypeLeaders: Vibe[];
  bottomInset: number;
}

export function PulseView({ colorBoard, hypeLeaders, bottomInset }: PulseViewProps) {
  const maxCount = Math.max(1, ...colorBoard.map((c) => c.count));

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingBottom: bottomInset }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.kicker}>LOUDEST COLOURS</Text>
      {colorBoard.map((c) => (
        <View key={c.hex} style={styles.boardRow}>
          <View style={[styles.dot, { backgroundColor: c.hex }]} />
          <View style={styles.boardMain}>
            <Text style={styles.boardName}>{c.name}</Text>
            <View style={styles.track}>
              <View
                style={[
                  styles.trackFill,
                  { width: `${(c.count / maxCount) * 100}%`, backgroundColor: c.hex },
                ]}
              />
            </View>
          </View>
          <Text style={styles.boardCount}>{c.count}</Text>
        </View>
      ))}

      <View style={styles.divider} />

      <Text style={styles.kicker}>HYPE LEADERS</Text>
      {hypeLeaders.map((v) => (
        <View key={v.id} style={styles.leaderRow}>
          <Text style={styles.leaderEmoji}>{v.emoji}</Text>
          <View style={styles.leaderMain}>
            <Text style={styles.leaderName} numberOfLines={1}>
              {v.name}
            </Text>
            <Text style={styles.leaderStatus} numberOfLines={1}>
              {v.status}
            </Text>
          </View>
          <View style={[styles.scorePill, { backgroundColor: v.color }]}>
            <Text style={[styles.scoreText, { color: ink(v.color) }]}>{v.energy}/5</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 2,
    gap: 14,
  },
  kicker: {
    fontFamily: FONTS.heading,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.text,
    opacity: 0.55,
  },
  boardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 999,
  },
  boardMain: {
    flex: 1,
    minWidth: 0,
  },
  boardName: {
    fontFamily: FONTS.heading,
    fontSize: 12,
    letterSpacing: 0.6,
    color: colors.text,
  },
  track: {
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.trackBg,
    marginTop: 6,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 999,
  },
  boardCount: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 6,
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.cardOverlay,
    borderRadius: 20,
    padding: 12,
    paddingHorizontal: 14,
  },
  leaderEmoji: {
    fontSize: 24,
    lineHeight: 24,
  },
  leaderMain: {
    flex: 1,
    minWidth: 0,
  },
  leaderName: {
    fontFamily: FONTS.heading,
    fontSize: 13,
    letterSpacing: 0.4,
    color: colors.text,
  },
  leaderStatus: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: colors.text,
    opacity: 0.6,
  },
  scorePill: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  scoreText: {
    fontFamily: FONTS.heading,
    fontSize: 11,
  },
});
