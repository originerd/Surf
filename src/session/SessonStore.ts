import { action, observable } from 'mobx';

import { Types }  from '../common';

class SessionStore {
  public followerUIDs = observable<string>([]);
  @observable public hasAuthChecked: boolean = false;
  @observable public hasFollowerUIDsLoaded: boolean = false;
  @observable public user?: Types.User;

  @action replaceFollowerUIDs = (followerUIDs: string[]) => {
    this.followerUIDs.replace(followerUIDs);
    this.hasFollowerUIDsLoaded = true;
  }

  @action setHasAuthChecked = (hasAuthChecked: boolean) => {
    this.hasAuthChecked = hasAuthChecked;
  }

  @action setUser = (user?: Types.User) => {
    this.setHasAuthChecked(true);

    this.user = user;
  }
}

export default SessionStore;
