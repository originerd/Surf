import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';
import { getStartAtKey } from './keys';

export const subscribeWaves = async (path: string, startAt: string | undefined, handler: (snapshot: RNFirebase.database.DataSnapshot) => void) => {
  let timelineRef = firebase.database().ref(path).orderByKey();

  if (startAt) {
    timelineRef = timelineRef.startAt(getStartAtKey(startAt));
  }

  timelineRef.on('child_added', handler);
};
