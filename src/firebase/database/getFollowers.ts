import firebase from 'react-native-firebase';

import { Types } from '../../common';
import { getPath, PathTypes } from './getPath';
import { getEndAtKey } from './keys';

export const getFollowers = async (
  uid: string,
  endAt?: number,
  limit: number = 20,
): Promise<Types.Follow[]> => {
  let followersRef = firebase
    .database()
    .ref(getPath({ uid, path: PathTypes.followers }))
    .orderByValue();

  if (endAt) {
    followersRef = followersRef.endAt(getEndAtKey(endAt));
  }

  const data = (await followersRef.limitToLast(limit).once('value')).val() || {};

  // need to sort keys to make sure data is ordered by key
  // there was a bug on iOS
  return Object.keys(data).sort().reverse().map(key => ({
    createdAt: data[key],
    uid: key,
  }));
};
