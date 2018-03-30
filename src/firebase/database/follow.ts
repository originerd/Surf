import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';

export const follow = async (uid: string, followingUID: string) => {
  const isUserFollowing = !!(await firebase.database().ref(`followings/${uid}/${followingUID}`).once('value')).val();

  if (isUserFollowing) {
    return;
  }

  const now = Date.now();

  const updates = {
    [`followers/${followingUID}/${uid}`]: now,
    [`followings/${uid}/${followingUID}`]: now,
  };

  await firebase.database().ref().update(updates);

  const updateFollowerCountPromise = firebase.database().ref(`users/${followingUID}/followerCount`).transaction((count = 0) => count + 1);
  const updateFollowingCountPromise = firebase.database().ref(`users/${uid}/followingCount`).transaction((count = 0) => count + 1);

  return Promise.all([
    updateFollowerCountPromise,
    updateFollowingCountPromise,
  ])
};
