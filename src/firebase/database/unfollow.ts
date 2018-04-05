import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';
import { getPath, PathTypes } from './getPath';

export const unfollow = async (uid: string, followingUID: string) => {
  const followingPath = `${getPath({ uid, path: PathTypes.followings })}/${followingUID}`;
  const isUserFollowing = !!(await firebase.database().ref(followingPath).once('value')).val();

  if (!isUserFollowing) {
    return;
  }

  const updates = {
    [`${getPath({ path: PathTypes.followers, uid: followingUID })}/${uid}`]: null,
    [followingPath]: null,
  };

  await firebase.database().ref().update(updates);

  const updateFollowerCountPromise = firebase
    .database()
    .ref(`${getPath({ path: PathTypes.users, uid: followingUID })}/followerCount`)
    .transaction((count = 1) => count - 1);
  const updateFollowingCountPromise = firebase
    .database()
    .ref(`${getPath({ uid, path: PathTypes.users })}/followingCount`)
    .transaction((count = 1) => count - 1);

  return Promise.all([
    updateFollowerCountPromise,
    updateFollowingCountPromise,
  ]);
};
