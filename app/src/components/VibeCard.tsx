import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import type { Vibe } from '../api/types';
import { colors, FONTS } from '../theme/tokens';
import { ago, secondsSince } from '../utils/ago';
import { ink } from '../utils/ink';

interface VibeCardProps {
  vibe: Vibe;
  index: number;
  now: number;
}

export function VibeCard({ vibe, index, now }: VibeCardProps) {
  const mount = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(mount, {
      toValue: 1,
      duration: 450,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [mount]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [float]);

  const tiltDeg = index % 2 ? '0.9deg' : '-1.1deg';
  const textColor = ink(vibe.color);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: vibe.color,
          transform: [
            { rotate: tiltDeg },
            { scale: mount.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1] }) },
            {
              translateY: mount.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }),
            },
          ],
          opacity: mount,
        },
      ]}
    >
      <View style={styles.topRow}>
        <Animated.Text
          style={[
            styles.emoji,
            {
              transform: [
                { translateY: float.interpolate({ inputRange: [0, 1], outputRange: [0, -7] }) },
                { rotate: float.interpolate({ inputRange: [0, 1], outputRange: ['-4deg', '5deg'] }) },
              ],
            },
          ]}
        >
          {vibe.emoji}
        </Animated.Text>
        <View style={styles.chip}>
          <Text style={[styles.chipText, { color: textColor }]}>{'•'.repeat(vibe.energy)}</Text>
        </View>
      </View>

      <Text style={[styles.status, { color: textColor }]} numberOfLines={3}>
        {vibe.status}
      </Text>

      <View style={styles.metaRow}>
        <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
          {vibe.name.toUpperCase()}
        </Text>
        <Text style={[styles.ago, { color: textColor }]}>{ago(secondsSince(vibe.createdAt, now))}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 24,
    padding: 14,
    minHeight: 152,
    gap: 10,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 13,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 6,
  },
  emoji: {
    fontSize: 34,
    lineHeight: 34,
  },
  chip: {
    backgroundColor: colors.chipBg,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  chipText: {
    fontFamily: FONTS.heading,
    fontSize: 11,
    letterSpacing: 0.9,
  },
  status: {
    fontFamily: FONTS.heading,
    fontSize: 15,
    lineHeight: 17,
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 6,
  },
  name: {
    flexShrink: 1,
    fontFamily: FONTS.heading,
    fontSize: 10,
    letterSpacing: 1,
  },
  ago: {
    fontFamily: FONTS.body,
    fontSize: 10,
    opacity: 0.65,
  },
});
