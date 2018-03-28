import firebase from 'react-native-firebase';

import { Types } from '../../common';

export const updateUser = async (uid: string, user: Types.UserSpecification) => {
  const now = Date.now();

  const storedUser: Types.User | {} = (await firebase.database().ref(`users/${uid}`).once('value')).val() || {};

  const updatedUser: Types.User = {
    // the order is important
    ...user,
    createdAt: now,
    followerCount: 0,
    followingCount: 0,
    waveCount: 0,
    ...storedUser,
    updatedAt: now,
  };

  return firebase
    .database()
    .ref(`users/${uid}`)
    .update(updatedUser);
};
