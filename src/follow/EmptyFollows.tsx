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

const getTitle = (type: Types.FollowTypes) => {
  if (type === Types.FollowTypes.followers) {
    return '팔로워가 없어요.';
  }

  return '팔로잉 중인 사람이 없어요.';
};

const getDescription = (type: Types.FollowTypes) => {
  if (type === Types.FollowTypes.followers) {
    return '먼저 팔로우 해보는 건 어떨까요?';
  }

  return '바다에서 다른 사람들을 만나보면 어때요?';
};

const EmptyWaves = ({ type }: { type: Types.FollowTypes }) => (
  <View style={styles.container}>
    <Text style={styles.title}>
      {getTitle(type)}
    </Text>
    <Text style={styles.description}>
      {getDescription(type)}
    </Text>
  </View>
);

export default EmptyWaves;
