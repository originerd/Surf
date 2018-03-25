import OceanStore from '../ocean/OceanStore';
import ProfileStore from "../profile/ProfileStore";
import SessionStore from '../session/SessonStore';
import TimelineStore from "../timeline/TimelineStore";
import UserStore from "../user/UserStore";
import WriteStore from '../write/WriteStore';

const oceanStore = new OceanStore();
const profileStore = new ProfileStore();
const sessionStore = new SessionStore();
const timelineStore = new TimelineStore();
const userStore = new UserStore();
const writeStore = new WriteStore();

interface Stores {
  oceanStore: OceanStore;
  profileStore: ProfileStore
  sessionStore: SessionStore;
  timelineStore: TimelineStore;
  userStore: UserStore;
  writeStore: WriteStore;
}

const stores: Stores = {
  oceanStore,
  profileStore,
  sessionStore,
  timelineStore,
  userStore,
  writeStore,
};

export {
  stores,
  Stores,
};
