import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import type { ColorBoardEntry } from '../api/types';
import { colors, energyCardGradient, energyCardInk, FONTS } from '../theme/tokens';
import { ink } from '../utils/ink';

interface RoomEnergyHeaderProps {
  peopleOnline: number;
  teamEnergy: number;
  mood: string;
  loudestColor: ColorBoardEntry | null;
}

const METER_SEGMENTS = 16;

export function RoomEnergyHeader({ peopleOnline, teamEnergy, mood, loudestColor }: RoomEnergyHeaderProps) {
  const blink = useRef(new Animated.Value(1)).current;
  const breathe = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(blink, { toValue: 0.25, duration: 550, useNativeDriver: true }),
        Animated.timing(blink, { toValue: 1, duration: 550, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [blink]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1.06,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [breathe]);

  const lit = Math.round((teamEnergy / 5) * METER_SEGMENTS);

  return (
    <View>
      <View style={styles.topRow}>
        <Text style={styles.title}>
          vibe{'\n'}check
        </Text>
        <View style={styles.onlinePill}>
          <Animated.View style={[styles.onlineDot, { opacity: blink }]} />
          <Text style={styles.onlineText}>{peopleOnline} ONLINE</Text>
        </View>
      </View>

      <View style={styles.energyRow}>
        <LinearGradient
          colors={energyCardGradient}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={styles.energyCard}
        >
          <Text style={styles.energyKicker}>ROOM ENERGY</Text>
          <View style={styles.energyValueRow}>
            <Text style={styles.energyValue}>{teamEnergy.toFixed(1)}</Text>
            <Text style={styles.energyMood}>/5 · {mood}</Text>
          </View>
          <View style={styles.meterRow}>
            {Array.from({ length: METER_SEGMENTS }).map((_, i) => (
              <View
                key={i}
                style={[styles.meterSegment, { backgroundColor: i < lit ? colors.meterOn : colors.meterOff }]}
              />
            ))}
          </View>
        </LinearGradient>

        {loudestColor ? (
          <Animated.View
            style={[
              styles.loudestBadge,
              { backgroundColor: loudestColor.hex, transform: [{ scale: breathe }] },
            ]}
          >
            <Text style={styles.loudestEmoji}>{loudestColor.emoji}</Text>
            <Text style={[styles.loudestName, { color: ink(loudestColor.hex) }]}>{loudestColor.name}</Text>
          </Animated.View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    fontFamily: FONTS.heading,
    fontSize: 30,
    letterSpacing: -1,
    lineHeight: 29,
    color: colors.text,
  },
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.pillInactiveBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 13,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.onlineDot,
  },
  onlineText: {
    fontFamily: FONTS.heading,
    fontSize: 11,
    letterSpacing: 1.1,
    color: colors.text,
  },
  energyRow: {
    paddingTop: 4,
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'stretch',
  },
  energyCard: {
    flex: 1,
    borderRadius: 26,
    padding: 14,
    paddingHorizontal: 16,
    gap: 8,
  },
  energyKicker: {
    fontFamily: FONTS.heading,
    fontSize: 10,
    letterSpacing: 1.4,
    opacity: 0.75,
    color: energyCardInk,
  },
  energyValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  energyValue: {
    fontFamily: FONTS.heading,
    fontSize: 34,
    lineHeight: 34,
    letterSpacing: -1,
    color: energyCardInk,
  },
  energyMood: {
    fontFamily: FONTS.body,
    fontSize: 12,
    opacity: 0.7,
    color: energyCardInk,
  },
  meterRow: {
    flexDirection: 'row',
    gap: 3,
    height: 8,
  },
  meterSegment: {
    flex: 1,
    borderRadius: 999,
  },
  loudestBadge: {
    width: 104,
    borderRadius: 26,
    padding: 14,
    justifyContent: 'space-between',
    gap: 8,
  },
  loudestEmoji: {
    fontSize: 26,
    lineHeight: 26,
  },
  loudestName: {
    fontFamily: FONTS.heading,
    fontSize: 10,
    letterSpacing: 1,
    lineHeight: 12,
  },
});
