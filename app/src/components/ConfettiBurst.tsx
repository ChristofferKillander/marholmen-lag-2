import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { PALETTE } from '../theme/tokens';

/** Pass a new object (unique `key`, e.g. `Date.now()`) each time to fire a burst. */
export interface ConfettiTrigger {
  key: number;
  hex: string;
}

interface Piece {
  id: string;
  hex: string;
  left: number;
  round: boolean;
  size: number;
  progress: Animated.Value;
}

interface ConfettiBurstProps {
  trigger: ConfettiTrigger | null;
}

const PIECES_PER_BURST = 40;
const CLEAR_AFTER_MS = 3000;

/** Falling confetti burst, ported from the design's `burst(hex)` + `vc-fall` keyframe. */
export function ConfettiBurst({ trigger }: ConfettiBurstProps) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!trigger) return undefined;

    const next: Piece[] = Array.from({ length: PIECES_PER_BURST }, (_, i) => {
      const hex = i % 3 === 0 ? trigger.hex : PALETTE[(i * 5) % PALETTE.length].hex;
      const dur = 1.4 + Math.random() * 1.1;
      const delay = Math.random() * 0.45;
      const progress = new Animated.Value(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: dur * 1000,
        delay: delay * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
      return {
        id: `${trigger.key}-${i}`,
        hex,
        left: Math.random() * 100,
        size: 7 + Math.random() * 10,
        round: i % 2 === 0,
        progress,
      };
    });

    setPieces((prev) => [...prev, ...next]);
    const ids = new Set(next.map((p) => p.id));
    const timeout = setTimeout(() => {
      setPieces((prev) => prev.filter((p) => !ids.has(p.id)));
    }, CLEAR_AFTER_MS);
    return () => clearTimeout(timeout);
  }, [trigger]);

  if (!pieces.length) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((p) => (
        <Animated.View
          key={p.id}
          style={[
            styles.piece,
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 1.4,
              borderRadius: p.round ? 999 : 3,
              backgroundColor: p.hex,
              opacity: p.progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0.8] }),
              transform: [
                { translateY: p.progress.interpolate({ inputRange: [0, 1], outputRange: [0, 900] }) },
                { rotate: p.progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '760deg'] }) },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    top: -30,
  },
});
