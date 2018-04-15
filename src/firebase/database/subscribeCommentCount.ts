import firebase, { RNFirebase } from 'react-native-firebase';

import { Types } from '../../common';
import { getPath, PathTypes } from './getPath';

export const subscribeCommentCount = (
  waveID: string,
  handler: (snapshot: RNFirebase.database.DataSnapshot) => void,
) => {
  firebase
    .database()
    .ref(getPath({ waveID, path: PathTypes.commentCounts  }))
    .on('value', handler);
};
