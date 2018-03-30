import { action, observable } from 'mobx';

import { Types }  from '../common';

class UserStore {
  @observable public referenceCountsByUId: Map<string, number> = new Map();
  @observable public users: Map<string, Types.User> = new Map();

  @action public decreseReferenceCount = (uid: string) => {
    const count = this.referenceCountsByUId.get(uid) || 0;

    this.referenceCountsByUId.set(uid, count - 1);
  }

  @action public increaseReferenceCount = (uid: string) => {
    const count = this.referenceCountsByUId.get(uid) || 0;

    this.referenceCountsByUId.set(uid, count + 1);
  }

  @action public setUser = (user: Types.User) => {
    this.users.set(user.uid, user);
  }
}

export default UserStore;
