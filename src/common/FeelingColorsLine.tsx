import * as React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import colors from '../styles/colors';

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

const feelingColors = [
  colors.angry,
  colors.excited,
  colors.happy,
  colors.tender,
  colors.sad,
  colors.scared,
];

const renderColumns = () =>
  feelingColors.map((backgroundColor, index) =>
    <View key={index} style={[styles.column, { backgroundColor }]} />
  );

const ColorsLine = () => (
  <View style={styles.container}>
    {renderColumns()}
  </View>
);

export default ColorsLine;
