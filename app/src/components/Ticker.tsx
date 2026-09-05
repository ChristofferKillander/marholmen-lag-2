import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import type { Vibe } from '../api/types';
import { colors, FONTS } from '../theme/tokens';

interface TickerProps {
  vibes: Vibe[];
}

const SPEED_PX_PER_SEC = 70;

/**
 * Bottom marquee. RN transforms need pixel values (no CSS `%`), so instead
 * of the design's `translateX(-50%)` trick we measure one copy of the
 * (duplicated) content and animate by exactly that many pixels, looping.
 */
export function Ticker({ vibes }: TickerProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const [copyWidth, setCopyWidth] = useState(0);
  const measuredForKey = useRef<string | null>(null);

  const items = vibes.slice(0, 8).map((v) => `${v.emoji}  ${v.name.toUpperCase()} — ${v.status}`);
  const key = items.join('|');

  useEffect(() => {
    if (measuredForKey.current !== key) {
      measuredForKey.current = null;
      setCopyWidth(0);
      translateX.setValue(0);
    }
  }, [key, translateX]);

  useEffect(() => {
    if (!copyWidth) return undefined;
    let cancelled = false;
    function run() {
      translateX.setValue(0);
      Animated.timing(translateX, {
        toValue: -copyWidth,
        duration: (copyWidth / SPEED_PX_PER_SEC) * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && !cancelled) run();
      });
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [copyWidth, translateX]);

  if (!items.length) return <View style={styles.bar} />;

  return (
    <View style={styles.bar}>
      <Animated.View style={[styles.track, { transform: [{ translateX }] }]}>
        <View
          style={styles.copy}
          onLayout={(e) => {
            if (measuredForKey.current !== key) {
              measuredForKey.current = key;
              setCopyWidth(e.nativeEvent.layout.width);
            }
          }}
        >
          {items.map((t, i) => (
            <Text key={`a-${i}`} style={styles.item}>
              {t}
            </Text>
          ))}
        </View>
        <View style={styles.copy}>
          {items.map((t, i) => (
            <Text key={`b-${i}`} style={styles.item}>
              {t}
            </Text>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 34,
    backgroundColor: colors.tickerBg,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  track: {
    flexDirection: 'row',
  },
  copy: {
    flexDirection: 'row',
  },
  item: {
    fontFamily: FONTS.heading,
    fontSize: 11,
    letterSpacing: 0.9,
    color: colors.tickerInk,
    paddingHorizontal: 16,
  },
});
