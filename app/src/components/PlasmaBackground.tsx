import { BlurView } from 'expo-blur';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { PALETTE } from '../theme/tokens';

/**
 * iOS-style "plasma"/aurora background: big, richly-saturated, heavily
 * overlapping colour blobs (react-native-svg RadialGradient), roaming
 * slowly, with a strong BlurView pass on top that melts them into one
 * smooth, blended, glassy wash — rather than reading as separate circles.
 * Pure transform animations (translate/scale, useNativeDriver) drive the
 * unblurred layer; the blur is a single native/CSS pass over all of them,
 * so it's cheap and looks the same on native and web.
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

// Big + heavily overlapping (sizes well beyond the gaps between anchors) so
// the blur pass has plenty of colour to blend into a continuous wash.
const BLOBS: BlobSpec[] = [
  { hex: PALETTE[0].hex, size: 520, top: '6%', left: '22%', rangeX: 90, rangeY: 70, driftMsX: 12000, driftMsY: 9000, breatheMs: 7000, delayMs: 0 },
  { hex: PALETTE[1].hex, size: 480, top: '20%', left: '80%', rangeX: 75, rangeY: 95, driftMsX: 10500, driftMsY: 13500, breatheMs: 8200, delayMs: 600 },
  { hex: PALETTE[7].hex, size: 460, top: '45%', left: '4%', rangeX: 95, rangeY: 70, driftMsX: 14000, driftMsY: 10000, breatheMs: 6400, delayMs: 1200 },
  { hex: PALETTE[3].hex, size: 500, top: '55%', left: '65%', rangeX: 80, rangeY: 90, driftMsX: 9000, driftMsY: 12500, breatheMs: 9000, delayMs: 300 },
  { hex: PALETTE[4].hex, size: 440, top: '78%', left: '30%', rangeX: 85, rangeY: 75, driftMsX: 13000, driftMsY: 8500, breatheMs: 7600, delayMs: 900 },
  { hex: PALETTE[6].hex, size: 470, top: '85%', left: '88%', rangeX: 70, rangeY: 85, driftMsX: 11500, driftMsY: 14500, breatheMs: 8800, delayMs: 1500 },
  { hex: PALETTE[2].hex, size: 430, top: '35%', left: '48%', rangeX: 80, rangeY: 80, driftMsX: 12800, driftMsY: 11200, breatheMs: 7800, delayMs: 1800 },
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
            <Stop offset="0%" stopColor={spec.hex} stopOpacity={0.85} />
            <Stop offset="55%" stopColor={spec.hex} stopOpacity={0.5} />
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
      {BLOBS.map((spec, i) => (
        <Blob key={`${spec.hex}-${i}`} spec={spec} />
      ))}
      <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
    </View>
  );
}
