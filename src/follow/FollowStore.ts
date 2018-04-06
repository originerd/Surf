import { action, observable } from 'mobx';

import { Types }  from '../common';

class FollowStore {
  @observable public loadedAllFollows: boolean;
  @observable public loadingFollows: boolean;
  @observable public follows: Types.Follow[] = [];

  @action public appendFollows = (follows: Types.Follow[]) => {
    this.follows.push(...follows);
  }

  @action public setLoadedAllFollows = () => {
    this.loadedAllFollows = true;
  }

  @action public setLoadingFollows = (loadingFollows: boolean) => {
    this.loadingFollows = loadingFollows;
  }
}

export default FollowStore;
