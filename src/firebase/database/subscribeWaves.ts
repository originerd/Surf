import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';
import { getStartAtKey } from './keys';

export const subscribeWaves = async (uid: string, startAt: string | undefined, handler: (snapshot: RNFirebase.database.DataSnapshot) => void) => {
  let wavesRef = firebase.database().ref(`waves/${uid}`).orderByKey();

  if (startAt) {
    wavesRef = wavesRef.startAt(getStartAtKey(startAt));
  }

  wavesRef.on('child_added', handler);
};
