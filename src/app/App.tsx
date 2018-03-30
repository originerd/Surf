import * as moment from 'moment';
import 'moment/locale/ko';
import * as React from 'react';
import { RNFirebase } from 'react-native-firebase';
import { observer, Provider } from 'mobx-react';

import { stores, Types } from '../common';
import firebase from '../firebase';
import AppNavigation from '../navigation/AppNavigation';

@observer
class App extends React.Component {
  private replaceFollowerUIDs = (snapshot: RNFirebase.database.DataSnapshot) => {
    const followerUIDs: { [uid in string]: string } = snapshot.val() || {};

    stores.sessionStore.replaceFollowerUIDs(Object.keys(followerUIDs));
  }

  private replaceFollowingUIDs = (snapshot: RNFirebase.database.DataSnapshot) => {
    const followingUIDs: { [uid in string]: string } = snapshot.val() || {};

    stores.sessionStore.replaceFollowingUIDs(Object.keys(followingUIDs));
  }

  private handleAuthStateChanged = async (user: RNFirebase.User) => {
    if (!user) {
      const sessionUser = stores.sessionStore.user;

      if (sessionUser) {
        firebase.database.unsubscribeFollowers(sessionUser.uid, this.replaceFollowerUIDs);
        firebase.database.unsubscribeFollowings(sessionUser.uid, this.replaceFollowingUIDs);
        firebase.database.unsubscribeUser(sessionUser.uid, this.setUser);
        stores.sessionStore.setUser(undefined);
      }

      return;
    }

    firebase.database.subscribeFollowers(user.uid, this.replaceFollowerUIDs);
    firebase.database.subscribeFollowings(user.uid, this.replaceFollowingUIDs);
    firebase.database.subscribeUser(user.uid, this.setUser);
  }

  private setUser = (snapshot: RNFirebase.database.DataSnapshot) => {
    const user: Types.User = snapshot.val();

    stores.sessionStore.setUser(user);
  }

  public componentDidMount() {
    firebase.auth.onAuthStateChanged(this.handleAuthStateChanged);

    moment.locale('ko');
  }

  public render() {
    return (
      <Provider {...stores}>
        <AppNavigation />
      </Provider>
    );
  }
}

export default App;
