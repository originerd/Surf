import SessionStore from '../session/SessonStore';
import WriteStore from '../write/WriteStore';

const sessionStore = new SessionStore();
const writeStore = new WriteStore();

interface Stores {
  sessionStore: SessionStore;
  writeStore: WriteStore;
}

const stores: Stores = {
  sessionStore,
  writeStore,
};

export {
  stores,
  Stores,
};
