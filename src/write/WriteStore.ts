import { action, observable } from 'mobx';

import { Types }  from '../common';

class WriteStore {
  @observable public content?: string;
  @observable public feeling?: Types.FeelingTypes;
  @observable public writing: boolean = false;

  @action reset = () => {
    this.content = undefined;
    this.feeling = undefined;
  }

  @action setContent = (content: string) => {
    this.content = content;
  }

  @action setSelectedFeeling = (selectedFeeling: Types.FeelingTypes) => {
    this.feeling = selectedFeeling;
  }

  @action setWriting = (writing: boolean) => {
    this.writing = writing;
  }
}

export default WriteStore;
