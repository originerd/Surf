import OceanStore from '../ocean/OceanStore';
import SessionStore from '../session/SessonStore';
import TimelineStore from "../timeline/TimelineStore";
import UserStore from "../user/UserStore";
import WriteStore from '../write/WriteStore';

const oceanStore = new OceanStore();
const sessionStore = new SessionStore();
const timelineStore = new TimelineStore();
const userStore = new UserStore();
const writeStore = new WriteStore();

interface Stores {
  oceanStore: OceanStore;
  sessionStore: SessionStore;
  timelineStore: TimelineStore;
  userStore: UserStore;
  writeStore: WriteStore;
}

const stores: Stores = {
  oceanStore,
  sessionStore,
  timelineStore,
  userStore,
  writeStore,
};

export {
  stores,
  Stores,
};
