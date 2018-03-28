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
  private handleAuthStateChanged = async (user: RNFirebase.User) => {
    if (!user) {
      const sessionUser = stores.sessionStore.user;

      if (sessionUser) {
        firebase.database.unsubscribeUser(sessionUser.uid, this.setUser);
        stores.sessionStore.setUser(undefined);
      }

      return;
    }

    firebase.database.subscribeUser(user.uid, this.setUser);
  }

  private setUser = (snapshot: RNFirebase.database.DataSnapshot) => {
    const user: Types.User = snapshot.val();

    stores.sessionStore.setUser(user);
    stores.userStore.setUser(user);
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
