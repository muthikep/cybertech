import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, FontSize, Spacing } from '@/theme';

type MissingEnvScreenProps = {
  missing: string[];
};

export function MissingEnvScreen({ missing }: MissingEnvScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Setup needed</Text>
        <Text style={styles.body}>
          This build is missing required configuration, so the app can&apos;t start safely.
        </Text>
        <View style={styles.list}>
          {missing.map((name) => (
            <Text key={name} style={styles.item}>
              • {name}
            </Text>
          ))}
        </View>
        <Text style={styles.hint}>Add these as EAS environment variables and rebuild.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  body: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },
  list: {
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  item: {
    fontSize: FontSize.md,
    color: Colors.text,
    fontWeight: '600',
  },
  hint: {
    marginTop: Spacing.md,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
});
