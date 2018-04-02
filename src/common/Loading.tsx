import * as React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
  },
});

const Loading = () => (
  <View style={styles.container}>
    <ActivityIndicator />
  </View>
);

export default Loading;
