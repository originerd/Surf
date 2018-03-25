import { action, observable } from 'mobx';
import { NavigationScreenProp } from 'react-navigation';

import { Types }  from '../common';

class NavigationStore {
  @observable public mainNavigation: NavigationScreenProp<{}, {}>;

  @action public setMainNavigation = (mainNavigation: NavigationScreenProp<{}, {}>) => {
    this.mainNavigation = mainNavigation;
  }
}

export default NavigationStore;
