import { action, observable } from 'mobx';

import * as Types from '../types';

class SessionStore {
  @observable public hasAuthChecked: boolean = false;
  @observable public user?: Types.User;

  @action setHasAuthChecked = (hasAuthChecked: boolean) => {
    this.hasAuthChecked = hasAuthChecked;
  }

  @action setUser = (user?: Types.User) => {
    this.setHasAuthChecked(true);

    this.user = user;
  }
}

export default SessionStore;
