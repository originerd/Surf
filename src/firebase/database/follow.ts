import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';
import { getPath, PathTypes } from './getPath';

export const follow = async (uid: string, followingUID: string) => {
  const isUserFollowing = !!(await firebase.database().ref(`${getPath({ path: PathTypes.followings, uid })}/${followingUID}`).once('value')).val();

  if (isUserFollowing) {
    return;
  }

  const now = Date.now();

  const updates = {
    [`${getPath({ path: PathTypes.followers, uid: followingUID })}/${uid}`]: now,
    [`${getPath({ path: PathTypes.followings, uid })}/${followingUID}`]: now,
  };

  await firebase.database().ref().update(updates);

  const updateFollowerCountPromise = firebase.database().ref(`${getPath({ path: PathTypes.users, uid: followingUID })}/followerCount`).transaction((count = 0) => count + 1);
  const updateFollowingCountPromise = firebase.database().ref(`${getPath({ path: PathTypes.users, uid })}/followingCount`).transaction((count = 0) => count + 1);

  return Promise.all([
    updateFollowerCountPromise,
    updateFollowingCountPromise,
  ])
};
