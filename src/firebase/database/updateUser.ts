import firebase from 'react-native-firebase';

import { Types } from '../../common';
import { getPath, PathTypes } from './getPath';

export const updateUser = async (uid: string, user: Types.UserSpecification) => {
  const now = Date.now();
  const path = getPath({ path: PathTypes.users, uid });

  const storedUser: Types.User | {} = (await firebase.database().ref(path).once('value')).val() || {};

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
    .ref(path)
    .update(updatedUser);
};
