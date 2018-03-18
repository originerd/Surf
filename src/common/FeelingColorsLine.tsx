import * as React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import { feelingColors } from '../styles/colors';
import * as Types from './types';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: 1,
    overflow: 'hidden',
  },
  column: {
    flex: 1,
  },
});

const renderColumns = () =>
  Types.FeelingTypes.map((feeling, index) =>
    <View key={index} style={[styles.column, { backgroundColor: feelingColors[feeling] }]} />
  );

const ColorsLine = () => (
  <View style={styles.container}>
    {renderColumns()}
  </View>
);

export default ColorsLine;
