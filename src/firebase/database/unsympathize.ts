import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';
import { getPath, PathTypes } from './getPath';

export const unsympathize = async (waveID: string, uid: string) => {
  const sympathized = !!(await firebase.database().ref(getPath({ path: PathTypes.sympathies, uid, waveID })).once('value')).val();

  if (!sympathized) {
    return;
  }

  const updates = {
    [getPath({ path: PathTypes.sympathies, uid, waveID })]: null,
  };

  await firebase.database().ref().update(updates);

  return firebase.database().ref(getPath({ path: PathTypes.sympathyCounts,  waveID })).transaction((count = 1) => count - 1);
};
