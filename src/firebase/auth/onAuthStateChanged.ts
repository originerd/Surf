import firebase from 'react-native-firebase';
import { RNFirebase } from 'react-native-firebase';

export const onAuthStateChanged = (listener: (user: RNFirebase.User) => void) => {
  firebase.auth().onAuthStateChanged(listener);
};
