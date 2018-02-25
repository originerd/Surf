import SessionStore from '../session/SessonStore';

const sessionStore = new SessionStore();

interface Stores {
  sessionStore: SessionStore;
}

const stores: Stores = {
  sessionStore,
};

export {
  stores,
  Stores,
};
