import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';
import { getPath, PathTypes } from './getPath';

export const unsympathize = async (waveID: string, uid: string) => {
  const sympathizedPath = `${getPath({ waveID, path: PathTypes.sympathies })}/${uid}`;
  const sympathized = !!(
    await firebase
      .database()
      .ref(sympathizedPath)
      .once('value')
  ).val();

  if (!sympathized) {
    return;
  }

  const updates = {
    [sympathizedPath]: null,
  };

  await firebase.database().ref().update(updates);

  return firebase
    .database()
    .ref(getPath({ waveID, path: PathTypes.sympathyCounts }))
    .transaction((count = 1) => count - 1);
};
