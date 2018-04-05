import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';
import { getStartAtKey } from './keys';
import { getPath, GetWavePathParams } from './getPath';

export const subscribeWaves = async (
  pathParams: GetWavePathParams,
  startAt: string | undefined,
  handler: (snapshot: RNFirebase.database.DataSnapshot) => void,
) => {
  let timelineRef = firebase.database().ref(getPath(pathParams)).orderByKey();

  if (startAt) {
    timelineRef = timelineRef.startAt(getStartAtKey(startAt));
  }

  timelineRef.on('child_added', handler);
};
