import { action, observable } from 'mobx';

import { Types }  from '../common';

class WriteStore {
  @observable public content?: string;
  @observable public feeling?: Types.FeelingTypes;

  @action setContent = (content: string) => {
    this.content = content;
  }

  @action setSelectedFeeling = (selectedFeeling: Types.FeelingTypes) => {
    this.feeling = selectedFeeling;
  }

  @action reset = () => {
    this.content = undefined;
    this.feeling = undefined;
  }
}

export default WriteStore;
