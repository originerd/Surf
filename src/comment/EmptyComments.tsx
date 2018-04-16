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
    textAlign: 'center',
  },
});

const EmptyComments = () => (
  <View style={styles.container}>
    <Text style={styles.description}>
      아직 댓글이 없네요.
    </Text>
  </View>
);

export default EmptyComments;
