import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../api';
import type { VibeCreate } from '../api/types';
import { ComposeSheet } from '../components/ComposeSheet';
import { ConfettiBurst, type ConfettiTrigger } from '../components/ConfettiBurst';
import { PulseView } from '../components/PulseView';
import { RoomEnergyHeader } from '../components/RoomEnergyHeader';
import { Tabs, type TabKey } from '../components/Tabs';
import { Ticker } from '../components/Ticker';
import { WallGrid } from '../components/WallGrid';
import { useComposeOptions } from '../hooks/useComposeOptions';
import { usePulse } from '../hooks/usePulse';
import { useVibes } from '../hooks/useVibes';
import { colors, FONTS } from '../theme/tokens';

const NOW_TICK_MS = 5000;
const TICKER_HEIGHT = 34;
const CTA_BLOCK_HEIGHT = 84;

export function VibeCheckScreen() {
  const { vibes, addLocal } = useVibes();
  const pulse = usePulse();
  const composeOptions = useComposeOptions();
  const insets = useSafeAreaInsets();

  const [tab, setTab] = useState<TabKey>('wall');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiTrigger | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), NOW_TICK_MS);
    return () => clearInterval(id);
  }, []);

  async function handleSubmit(input: VibeCreate) {
    try {
      const vibe = await api.postVibe(input);
      addLocal(vibe);
      setConfetti({ key: Date.now(), hex: vibe.color });
      setSheetOpen(false);
      setTab('wall');
    } catch {
      // Hackathon demo: swallow a failed post rather than blocking the UI —
      // the vibe just doesn't appear, no error dialog to build/wire up.
    }
  }

  const bottomInset = insets.bottom + TICKER_HEIGHT + CTA_BLOCK_HEIGHT;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.bgGradientTop, colors.bg]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <RoomEnergyHeader
          peopleOnline={pulse?.peopleOnline ?? 0}
          teamEnergy={pulse?.teamEnergy ?? 0}
          mood={pulse?.mood ?? 'cruising'}
          loudestColor={pulse?.loudestColor ?? null}
        />
        <Tabs active={tab} onChange={setTab} />

        <View style={styles.content}>
          {tab === 'wall' ? (
            <WallGrid vibes={vibes} now={now} bottomInset={bottomInset} />
          ) : (
            <PulseView
              colorBoard={pulse?.colorBoard ?? []}
              hypeLeaders={pulse?.hypeLeaders ?? []}
              bottomInset={bottomInset}
            />
          )}
        </View>
      </SafeAreaView>

      <View style={styles.bottomOverlay} pointerEvents="box-none">
        <Ticker vibes={vibes} />
        <LinearGradient
          colors={['transparent', colors.bg]}
          style={[styles.ctaGradient, { paddingBottom: insets.bottom + 12 }]}
        >
          <Pressable style={styles.cta} onPress={() => setSheetOpen(true)}>
            <Text style={styles.ctaEmoji}>🔥</Text>
            <Text style={styles.ctaText}>drop your vibe</Text>
          </Pressable>
        </LinearGradient>
      </View>

      <ComposeSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSubmit={handleSubmit}
        options={composeOptions}
      />
      <ConfettiBurst trigger={confetti} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  bottomOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  ctaGradient: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  cta: {
    borderRadius: 999,
    backgroundColor: colors.cta,
    paddingVertical: 17,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.cta,
    shadowOpacity: 0.35,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  ctaEmoji: {
    fontSize: 19,
  },
  ctaText: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    letterSpacing: -0.2,
    color: colors.ctaInk,
  },
});
