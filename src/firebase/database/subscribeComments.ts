import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';
import { getStartAtKey } from './keys';
import { getPath, GetPathParams, PathTypes } from './getPath';

export const subscribeComments = async (
  waveID: string,
  startAt: string | undefined,
  handler: (snapshot: RNFirebase.database.DataSnapshot) => void,
) => {
  let timelineRef =
    firebase
      .database()
      .ref(getPath({ waveID, path: PathTypes.comments }))
      .orderByKey();

  if (startAt) {
    timelineRef = timelineRef.startAt(getStartAtKey(startAt));
  }

  timelineRef.on('child_added', handler);
};
