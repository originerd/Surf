import SessionStore from '../session/SessonStore';
import TimelineStore from "../timeline/TimelineStore";
import UserStore from "../user/UserStore";
import WriteStore from '../write/WriteStore';

const sessionStore = new SessionStore();
const timelineStore = new TimelineStore();
const userStore = new UserStore();
const writeStore = new WriteStore();

interface Stores {
  sessionStore: SessionStore;
  timelineStore: TimelineStore;
  userStore: UserStore;
  writeStore: WriteStore;
}

const stores: Stores = {
  sessionStore,
  timelineStore,
  userStore,
  writeStore,
};

export {
  stores,
  Stores,
};
