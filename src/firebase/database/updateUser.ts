import firebase from 'react-native-firebase';

import { Types } from '../../common';

export const updateUser = async (uid: string, user: Types.User) => {
  const now = Date.now();

  const storedUser: Types.User = (await firebase.database().ref(`users/${uid}`).once('value')).val() || {};

  const updatedUser = {
    ...storedUser,
    ...user,
    createdAt: storedUser.createdAt || now,
    updatedAt: now,
  };

  return firebase
    .database()
    .ref(`users/${uid}`)
    .update(updatedUser);
};
