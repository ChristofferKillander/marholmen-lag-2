import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { PALETTE } from '../theme/tokens';

/**
 * Soft, slowly-drifting colour blobs behind the app content — a "plasma
 * lava lamp" ambient background using the design's own PALETTE hexes.
 * Pure transform animations (translate/scale, useNativeDriver) driving
 * static SVG radial gradients, so it's cheap and identical on native + web.
 */

type Percent = `${number}%`;

interface BlobSpec {
  hex: string;
  size: number;
  /** Anchor position as % of the container, blob roams around this point. */
  top: Percent;
  left: Percent;
  /** Roam radius in px — how far the blob wanders from its anchor. */
  rangeX: number;
  rangeY: number;
  /** X and Y are driven by independently-timed loops so the path curves
   * around rather than sliding back and forth on a straight line. */
  driftMsX: number;
  driftMsY: number;
  breatheMs: number;
  delayMs: number;
}

const BLOBS: BlobSpec[] = [
  { hex: PALETTE[0].hex, size: 340, top: '10%', left: '18%', rangeX: 110, rangeY: 90, driftMsX: 12000, driftMsY: 9000, breatheMs: 7000, delayMs: 0 },
  { hex: PALETTE[1].hex, size: 300, top: '22%', left: '78%', rangeX: 90, rangeY: 120, driftMsX: 10500, driftMsY: 13500, breatheMs: 8200, delayMs: 600 },
  { hex: PALETTE[2].hex, size: 280, top: '48%', left: '10%', rangeX: 120, rangeY: 85, driftMsX: 14000, driftMsY: 10000, breatheMs: 6400, delayMs: 1200 },
  { hex: PALETTE[3].hex, size: 320, top: '55%', left: '68%', rangeX: 95, rangeY: 110, driftMsX: 9000, driftMsY: 12500, breatheMs: 9000, delayMs: 300 },
  { hex: PALETTE[4].hex, size: 260, top: '78%', left: '28%', rangeX: 100, rangeY: 95, driftMsX: 13000, driftMsY: 8500, breatheMs: 7600, delayMs: 900 },
  { hex: PALETTE[6].hex, size: 300, top: '82%', left: '85%', rangeX: 85, rangeY: 100, driftMsX: 11500, driftMsY: 14500, breatheMs: 8800, delayMs: 1500 },
];

function Blob({ spec }: { spec: BlobSpec }) {
  const driftX = useRef(new Animated.Value(0)).current;
  const driftY = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(driftX, {
          toValue: 1,
          duration: spec.driftMsX,
          delay: spec.delayMs,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(driftX, {
          toValue: 0,
          duration: spec.driftMsX,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [driftX, spec.driftMsX, spec.delayMs]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(driftY, {
          toValue: 1,
          duration: spec.driftMsY,
          delay: spec.delayMs + spec.driftMsY / 3,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(driftY, {
          toValue: 0,
          duration: spec.driftMsY,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [driftY, spec.driftMsY, spec.delayMs]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration: spec.breatheMs,
          delay: spec.delayMs,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 0,
          duration: spec.breatheMs,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [breathe, spec.breatheMs, spec.delayMs]);

  const gradId = `plasma-${spec.hex.replace('#', '')}`;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: spec.top,
        left: spec.left,
        width: spec.size,
        height: spec.size,
        marginTop: -spec.size / 2,
        marginLeft: -spec.size / 2,
        transform: [
          { translateX: driftX.interpolate({ inputRange: [0, 1], outputRange: [-spec.rangeX, spec.rangeX] }) },
          { translateY: driftY.interpolate({ inputRange: [0, 1], outputRange: [-spec.rangeY, spec.rangeY] }) },
          { scale: breathe.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1.18] }) },
        ],
      }}
    >
      <Svg width={spec.size} height={spec.size} viewBox="0 0 100 100">
        <Defs>
          <RadialGradient id={gradId} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={spec.hex} stopOpacity={0.55} />
            <Stop offset="65%" stopColor={spec.hex} stopOpacity={0.28} />
            <Stop offset="100%" stopColor={spec.hex} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx="50" cy="50" r="50" fill={`url(#${gradId})`} />
      </Svg>
    </Animated.View>
  );
}

export function PlasmaBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {BLOBS.map((spec) => (
        <Blob key={spec.hex} spec={spec} />
      ))}
    </View>
  );
}
