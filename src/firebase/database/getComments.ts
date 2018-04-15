import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';
import { getEndAtKey } from './keys';
import { getPath, GetPathParams, PathTypes } from './getPath';

export const getComments = async (
  waveID: string,
  endAt?: string,
  limit: number = 20,
): Promise<Types.Comment[]> => {
  let commentsRef =
    firebase
      .database()
      .ref(getPath({ waveID, path: PathTypes.comments }))
      .orderByKey();

  if (endAt) {
    commentsRef = commentsRef.endAt(getEndAtKey(endAt));
  }

  const data = (await commentsRef.limitToLast(limit).once('value')).val() || {};

  // need to sort keys to make sure data is ordered by key
  // there was a bug on iOS
  return Object.keys(data).sort().reverse().map(key => data[key]);
};
