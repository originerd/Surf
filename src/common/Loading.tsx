import * as React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';

import { colors } from '../styles';

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
    <ActivityIndicator color={colors.lightBlue} />
  </View>
);

export default Loading;
