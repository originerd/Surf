import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Types } from '../common';
import { colors, feelingColors, typography } from '../styles';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSizeLarge,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

const getTitle = (type: Types.FollowTypes) => {
  if (type === Types.FollowTypes.followers) {
    return '팔로워가 없어요.';
  }

  return '팔로잉 중인 사람이 없어요.';
};

const EmptyWaves = ({ type }: { type: Types.FollowTypes }) => (
  <View style={styles.container}>
    <Text style={styles.title}>
      {getTitle(type)}
    </Text>
  </View>
);

export default EmptyWaves;
