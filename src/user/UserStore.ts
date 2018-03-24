import { action, observable } from 'mobx';

import { Types }  from '../common';

class UserStore {
  @observable public users: Map<string, Types.User> = new Map();

  @action public setUser = (user: Types.User) => {
    this.users.set(user.uid, user);
  }
}

export default UserStore;
