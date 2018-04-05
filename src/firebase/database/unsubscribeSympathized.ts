import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';
import { getPath, PathTypes } from './getPath';

export const unsubscribeSympathized = (
  waveID: string,
  uid: string,
  handler: (snapshot: RNFirebase.database.DataSnapshot) => void,
) => {
  firebase
    .database()
    .ref(`${getPath({ waveID, path: PathTypes.sympathies })}/${uid}`)
    .on('value', handler);
};
