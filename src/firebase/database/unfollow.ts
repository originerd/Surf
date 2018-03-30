import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';

export const unfollow = async (uid: string, followingUID: string) => {
  const isUserFollowing = !!(await firebase.database().ref(`followings/${uid}/${followingUID}`).once('value')).val();

  if (!isUserFollowing) {
    return;
  }

  const updates = {
    [`followers/${followingUID}/${uid}`]: null,
    [`followings/${uid}/${followingUID}`]: null,
  };

  await firebase.database().ref().update(updates);

  const updateFollowerCountPromise = firebase.database().ref(`users/${followingUID}/followerCount`).transaction((count = 1) => count - 1);
  const updateFollowingCountPromise = firebase.database().ref(`users/${uid}/followingCount`).transaction((count = 1) => count - 1);

  return Promise.all([
    updateFollowerCountPromise,
    updateFollowingCountPromise,
  ])
};
