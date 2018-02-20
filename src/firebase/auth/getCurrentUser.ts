import firebase from 'react-native-firebase';

export const getCurrentUser = () => firebase.auth().currentUser;
