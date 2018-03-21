import SessionStore from '../session/SessonStore';
import UserStore from "../user/UserStore";
import WriteStore from '../write/WriteStore';

const sessionStore = new SessionStore();
const userStore = new UserStore();
const writeStore = new WriteStore();

interface Stores {
  sessionStore: SessionStore;
  userStore: UserStore;
  writeStore: WriteStore;
}

const stores: Stores = {
  sessionStore,
  userStore,
  writeStore,
};

export {
  stores,
  Stores,
};
