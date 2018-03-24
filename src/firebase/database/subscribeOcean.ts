import firebase, { RNFirebase } from 'react-native-firebase';

export const subscribeOcean = async (handler: (snapshot: RNFirebase.database.DataSnapshot) => void) => {
  firebase.database().ref("ocean").orderByChild('createdAt').on('child_added', handler);
};
