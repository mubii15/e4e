import { openDB } from 'idb';

const dbPromise = openDB('vue-app-db', 1, {
  upgrade(db) {
    db.createObjectStore('people', { keyPath: 'id' });
  },
});

export const addPeopleToDB = async (people) => {
  const db = await dbPromise;
  const tx = db.transaction('people', 'readwrite');
  const store = tx.store;

  people.forEach(person => {
    // Ensure person has an 'id' field; otherwise, you can't store it correctly
    if (person.id) {
      store.put(person); // Use put() to update or add data with the keyPath 'id'
    } else {
      console.error('Person object missing ID:', person);
    }
  });

  await tx.done;
};

export const getPeopleFromDB = async () => {
  const db = await dbPromise;
  return db.getAll('people');
};
