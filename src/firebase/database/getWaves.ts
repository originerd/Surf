import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';
import { getEndAtKey } from './keys';

export const getWaves = async (uid: string, endAt?: string, limit: number = 20): Promise<Types.Wave[]> => {
  let wavesRef = firebase.database().ref(`waves/${uid}`).orderByKey();

  if (endAt) {
    wavesRef = wavesRef.endAt(getEndAtKey(endAt));
  }

  const data = (await wavesRef.limitToLast(limit).once('value')).val() || {};

  return Object.keys(data).map((key) => data[key]);
};
