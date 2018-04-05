import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';
import { getEndAtKey } from './keys';
import { getPath, GetWavePathParams } from './getPath';

export const getWaves = async (
  pathParams: GetWavePathParams,
  endAt?: string,
  limit: number = 20,
): Promise<Types.Wave[]> => {
  let wavesRef = firebase.database().ref(getPath(pathParams)).orderByKey();

  if (endAt) {
    wavesRef = wavesRef.endAt(getEndAtKey(endAt));
  }

  const data = (await wavesRef.limitToLast(limit).once('value')).val() || {};

  // need to sort keys to make sure data is ordered by key
  // there was a bug on iOS
  return Object.keys(data).sort().reverse().map(key => data[key]);
};
