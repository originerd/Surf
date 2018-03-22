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
      return;
    }

    const storedUser = await firebase.database.getUser(user.uid);

    stores.sessionStore.setUser(storedUser);
    stores.userStore.setUser(storedUser);
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
