import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, feelingColors, typography } from '../styles';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    color: 'gray',
    fontSize: typography.fontSizeMedium,
    marginTop: 4,
    textAlign: 'center',
  },
  title: {
    fontSize: typography.fontSizeLarge,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

const EmptyWaves = () => (
  <View style={styles.container}>
    <Text style={styles.title}>
      앗, 아직 파도가 없네요!
    </Text>
    <Text style={styles.description}>
      바다에서 다른 사람들의 파도를 보거나
    </Text>
    <Text style={styles.description}>
      파도로 감정을 공유해주세요.
    </Text>
  </View>
);

export default EmptyWaves;
