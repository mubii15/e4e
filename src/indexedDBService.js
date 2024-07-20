import { openDB } from 'idb';

const dbPromise = openDB('vue-app-db', 1, {
  upgrade(db) {
    db.createObjectStore('people', { keyPath: 'id' }); // Use the correct keyPath
  },
});

export const addPeopleToDB = async (people) => {
  const db = await dbPromise;
  const tx = db.transaction('people', 'readwrite');
  people.forEach(person => {
    tx.store.put(person); // Use put instead of add to update existing entries
  });
  await tx.done;
};

export const getPeopleFromDB = async () => {
  const db = await dbPromise;
  return db.getAll('people'); // Ensure store name matches
};
