import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';
import { getPath, PathTypes } from './getPath';

export const sympathize = async (waveID: string, uid: string) => {
  const sympathizedPath = `${getPath({ waveID, path: PathTypes.sympathies })}/${uid}`;
  const sympathized = !!(await firebase.database().ref(sympathizedPath).once('value')).val();

  if (sympathized) {
    return;
  }

  const now = Date.now();

  const updates = {
    [sympathizedPath]: now,
  };

  await firebase.database().ref().update(updates);

  return firebase
    .database()
    .ref(getPath({ waveID, path: PathTypes.sympathyCounts }))
    .transaction((count = 0) => count + 1);
};
