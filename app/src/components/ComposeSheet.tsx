import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { ComposeOptions, Energy, VibeCreate } from '../api/types';
import { colors, emojiPickerActiveBg, emojiPickerActiveBorder, ENERGY_LEVELS, EMOJI, FONTS, PALETTE } from '../theme/tokens';
import { ink } from '../utils/ink';

interface ComposeSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (input: VibeCreate) => void;
  options: ComposeOptions | null;
}

const GAP = 9;
const COLOR_COLS = 4;
const EMOJI_COLS = 6;

export function ComposeSheet({ visible, onClose, onSubmit, options }: ComposeSheetProps) {
  const colorOpts = options?.colors ?? PALETTE;
  const emojiOpts = options?.emojis ?? EMOJI;
  const energyOpts = options?.energyLevels ?? ENERGY_LEVELS;

  const [color, setColor] = useState(colorOpts[0]?.hex ?? '#c4ff3d');
  const [emoji, setEmoji] = useState(emojiOpts[0] ?? '🔥');
  const [energy, setEnergy] = useState<Energy>(4);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [bodyWidth, setBodyWidth] = useState(0);

  // Drag-to-dismiss: translateY follows the finger while dragging the
  // handle/title area, snaps back if released above the threshold, or
  // slides the rest of the way off-screen and calls onClose if released
  // past it (or flicked with enough downward velocity).
  const translateY = useRef(new Animated.Value(0)).current;
  const dragStart = useRef(0);
  const DISMISS_DISTANCE = 120;
  const DISMISS_VELOCITY = 0.6;

  useEffect(() => {
    if (!visible) return;
    setColor((c) => c || colorOpts[0]?.hex || '#c4ff3d');
    setEmoji((e) => e || emojiOpts[0] || '🔥');
    translateY.setValue(0);
  }, [visible, colorOpts, emojiOpts, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_evt, gesture) => Math.abs(gesture.dy) > 4 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
      onPanResponderGrant: () => {
        translateY.stopAnimation((value) => {
          dragStart.current = value;
        });
      },
      onPanResponderMove: (_evt, gesture) => {
        translateY.setValue(Math.max(0, dragStart.current + gesture.dy));
      },
      onPanResponderRelease: (_evt, gesture) => {
        const shouldDismiss = gesture.dy > DISMISS_DISTANCE || gesture.vy > DISMISS_VELOCITY;
        if (shouldDismiss) {
          Animated.timing(translateY, {
            toValue: 900,
            duration: 220,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }).start(() => onClose());
        } else {
          Animated.spring(translateY, { toValue: 0, friction: 8, tension: 120, useNativeDriver: true }).start();
        }
      },
    }),
  ).current;

  const trimmedStatus = status.trim();
  const canSend = trimmedStatus.length > 0;

  function reset() {
    setStatus('');
  }

  function submit() {
    if (!canSend) return;
    onSubmit({ name: name.trim() || undefined, emoji, status: trimmedStatus, color, energy });
    reset();
  }

  const colorCell = bodyWidth ? (bodyWidth - GAP * (COLOR_COLS - 1)) / COLOR_COLS : 52;
  const emojiCell = bodyWidth ? (bodyWidth - GAP * (EMOJI_COLS - 1)) / EMOJI_COLS : 44;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <View {...panResponder.panHandlers}>
            <View style={styles.handle} />
            <Text style={styles.title}>how are you, really?</Text>
          </View>

          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            onLayout={(e) => setBodyWidth(e.nativeEvent.layout.width)}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.label}>YOUR COLOUR</Text>
              <View style={styles.wrapRow}>
                {colorOpts.map((opt) => {
                  const selected = opt.hex === color;
                  return (
                    <View key={opt.hex} style={{ width: colorCell }}>
                      <Pressable
                        onPress={() => setColor(opt.hex)}
                        style={[
                          styles.swatch,
                          {
                            backgroundColor: opt.hex,
                            borderColor: selected ? '#fdfbff' : 'transparent',
                          },
                          selected && styles.swatchSelected,
                        ]}
                      />
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>YOUR FACE</Text>
              <View style={styles.wrapRow}>
                {emojiOpts.map((char) => {
                  const selected = char === emoji;
                  return (
                    <View key={char} style={{ width: emojiCell }}>
                      <Pressable
                        onPress={() => setEmoji(char)}
                        style={[
                          styles.emojiOpt,
                          {
                            borderColor: selected ? emojiPickerActiveBorder : colors.border,
                            backgroundColor: selected ? emojiPickerActiveBg : colors.inputBg,
                          },
                        ]}
                      >
                        <Text style={styles.emojiOptText}>{char}</Text>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>ENERGY</Text>
              <View style={styles.energyRow}>
                {energyOpts.map((n) => {
                  const selected = n === energy;
                  return (
                    <Pressable
                      key={n}
                      onPress={() => setEnergy(n as Energy)}
                      style={[
                        styles.energyPill,
                        { backgroundColor: selected ? emojiPickerActiveBorder : colors.pillInactiveBg },
                      ]}
                    >
                      <Text
                        style={[
                          styles.energyPillText,
                          { color: selected ? ink(emojiPickerActiveBorder) : colors.pillInactiveText },
                        ]}
                      >
                        {n}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.inputRow}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="name"
                placeholderTextColor="rgba(246,242,255,0.45)"
                style={[styles.input, styles.nameInput]}
              />
              <TextInput
                value={status}
                onChangeText={setStatus}
                onSubmitEditing={submit}
                placeholder="one line…"
                placeholderTextColor="rgba(246,242,255,0.45)"
                style={[styles.input, styles.statusInput]}
              />
            </View>

            <Pressable
              onPress={submit}
              disabled={!canSend}
              style={[
                styles.sendButton,
                { backgroundColor: canSend ? emojiPickerActiveBorder : colors.pillInactiveBg },
              ]}
            >
              <Text style={[styles.sendText, { color: canSend ? ink(emojiPickerActiveBorder) : colors.text }]}>
                send it ✦
              </Text>
            </Pressable>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.sheetBackdrop,
  },
  sheet: {
    // Capped so, however tall its content gets (keyboard up + all
    // sections), the sheet itself scrolls internally instead of the
    // whole page growing past the screen — see `body`/`bodyContent`.
    maxHeight: '86%',
    backgroundColor: colors.sheetBg,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingTop: 14,
    paddingHorizontal: 20,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.28)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: FONTS.heading,
    fontSize: 22,
    letterSpacing: -0.6,
    color: colors.text,
    marginBottom: 14,
  },
  body: {
    flexShrink: 1,
  },
  bodyContent: {
    gap: 16,
    paddingBottom: 44,
  },
  section: {
    gap: 0,
  },
  label: {
    fontFamily: FONTS.heading,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.text,
    opacity: 0.55,
    marginBottom: 8,
  },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: GAP,
  },
  swatch: {
    width: 42,
    height: 42,
    borderRadius: 999,
    borderWidth: 3,
  },
  swatchSelected: {
    shadowColor: '#fdfbff',
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 0 },
  },
  emojiOpt: {
    height: 44,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiOptText: {
    fontSize: 20,
    lineHeight: 24,
  },
  energyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  energyPill: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 11,
    alignItems: 'center',
  },
  energyPillText: {
    fontFamily: FONTS.heading,
    fontSize: 13,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.inputBg,
    color: colors.text,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: FONTS.body,
  },
  nameInput: {
    width: 110,
  },
  statusInput: {
    flex: 1,
    minWidth: 0,
  },
  sendButton: {
    borderRadius: 999,
    paddingVertical: 17,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  sendText: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    letterSpacing: -0.2,
  },
});
