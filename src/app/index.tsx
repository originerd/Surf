import * as React from 'react';
import { RNFirebase } from 'react-native-firebase';
import { observer, Provider } from 'mobx-react';

import { stores } from '../common';
import firebase from '../firebase';
import AppNavigation from '../navigation/AppNavigation';
import * as Types from '../types';

@observer
class App extends React.Component {
  private handleAuthStateChanged = async (user: RNFirebase.User) => {
    let storedUser: Types.User | undefined;

    if (user) {
      storedUser = await firebase.database.getUser(user.uid);
    }

    stores.sessionStore.setUser(storedUser);
  }

  public componentDidMount() {
    firebase.auth.onAuthStateChanged(this.handleAuthStateChanged);
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
