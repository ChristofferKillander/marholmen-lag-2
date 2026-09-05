import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, FONTS } from '../theme/tokens';
import { ink } from '../utils/ink';

export type TabKey = 'wall' | 'pulse';

const TAB_ITEMS: Array<{ key: TabKey; label: string }> = [
  { key: 'wall', label: 'the wall' },
  { key: 'pulse', label: 'pulse' },
];

interface TabsProps {
  active: TabKey;
  onChange: (key: TabKey) => void;
}

export function Tabs({ active, onChange }: TabsProps) {
  return (
    <View style={styles.row}>
      {TAB_ITEMS.map((t) => {
        const on = active === t.key;
        return (
          <Pressable
            key={t.key}
            onPress={() => onChange(t.key)}
            style={[styles.pill, { backgroundColor: on ? colors.pillActiveBg : colors.pillInactiveBg }]}
          >
            <Text style={[styles.label, { color: on ? ink(colors.pillActiveBg) : colors.pillInactiveText }]}>
              {t.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 11,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  label: {
    fontFamily: FONTS.heading,
    fontSize: 13,
    letterSpacing: 0.3,
  },
});
