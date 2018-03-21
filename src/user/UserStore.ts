import { action, observable } from 'mobx';

import { Types }  from '../common';

class UserStore {
  @observable public users: { [uid in string]: Types.User } = {};

  @action public setUser = (user: Types.User) => {
    this.users[user.uid] = user;
  }
}

export default UserStore;
