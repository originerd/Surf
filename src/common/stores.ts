import NavigationStore from '../navigation/NavigationStore';
import OceanStore from '../ocean/OceanStore';
import ProfileStore from '../profile/ProfileStore';
import SessionStore from '../session/SessonStore';
import SympathyStore from '../sympathy/SympathyStore';
import TimelineStore from '../timeline/TimelineStore';
import UserStore from '../user/UserStore';
import WriteStore from '../write/WriteStore';

const navigationStore = new NavigationStore;
const oceanStore = new OceanStore();
const profileStore = new ProfileStore();
const sessionStore = new SessionStore();
const sympathyStore = new SympathyStore();
const timelineStore = new TimelineStore();
const userStore = new UserStore();
const writeStore = new WriteStore();

interface Stores {
  navigationStore: NavigationStore;
  oceanStore: OceanStore;
  profileStore: ProfileStore;
  sessionStore: SessionStore;
  sympathyStore: SympathyStore;
  timelineStore: TimelineStore;
  userStore: UserStore;
  writeStore: WriteStore;
}

const stores: Stores = {
  navigationStore,
  oceanStore,
  profileStore,
  sessionStore,
  sympathyStore,
  timelineStore,
  userStore,
  writeStore,
};

export {
  stores,
  Stores,
};
