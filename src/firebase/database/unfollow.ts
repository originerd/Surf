import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';
import { getPath, PathTypes } from './getPath';

export const unfollow = async (uid: string, followingUID: string) => {
  const isUserFollowing = !!(await firebase.database().ref(`${getPath({ path: PathTypes.followings, uid })}/${followingUID}`).once('value')).val();

  if (!isUserFollowing) {
    return;
  }

  const updates = {
    [`${getPath({ path: PathTypes.followers, uid: followingUID })}/${uid}`]: null,
    [`${getPath({ path: PathTypes.followings, uid })}/${followingUID}`]: null,
  };

  await firebase.database().ref().update(updates);

  const updateFollowerCountPromise = firebase.database().ref(`${getPath({ path: PathTypes.users, uid: followingUID })}/followerCount`).transaction((count = 1) => count - 1);
  const updateFollowingCountPromise = firebase.database().ref(`${getPath({ path: PathTypes.users, uid })}/followingCount`).transaction((count = 1) => count - 1);

  return Promise.all([
    updateFollowerCountPromise,
    updateFollowingCountPromise,
  ])
};
