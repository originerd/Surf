import firebase from 'react-native-firebase';

import { Types } from '../../common';
import { getPath, PathTypes } from './getPath';

export const getUser = async (uid: string): Promise<Types.User> =>
  (await firebase.database().ref(getPath({ uid, path: PathTypes.users })).once('value')).val();
