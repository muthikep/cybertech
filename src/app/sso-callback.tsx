import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Colors } from '@/theme';

// Clerk's useSSO redirects here while the Google sign-in browser session
// closes. It renders briefly; the (auth)/(app) layouts handle navigation
// once the session is active.
export default function SsoCallbackScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={Colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
});
