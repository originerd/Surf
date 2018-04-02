import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';
import { getEndAtKey } from './keys';
import { getPath, GetWavePathParams } from './getPath';

export const getWaves = async (pathParams: GetWavePathParams, endAt?: string, limit: number = 20): Promise<Types.Wave[]> => {
  let wavesRef = firebase.database().ref(getPath(pathParams)).orderByKey();

  if (endAt) {
    wavesRef = wavesRef.endAt(getEndAtKey(endAt));
  }

  const data = (await wavesRef.limitToLast(limit).once('value')).val() || {};

  return Object.keys(data).map((key) => data[key]);
};
