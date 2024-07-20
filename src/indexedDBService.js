import { openDB } from "idb";

const dbPromise = openDB("vue-app-db", 1, {
  upgrade(db) {
    db.createObjectStore("people", { keyPath: "id" });
  },
});

export const addPeopleToDB = async (people) => {
  const db = await dbPromise;
  const tx = db.transaction("people", "readwrite");
  const store = tx.store;

  people.forEach((person) => {
    if (person.id) {
      store.put(person);
    } else {
      console.error("Person object missing ID:", person);
    }
  });

  await tx.done;
};

export const getPeopleFromDB = async () => {
  const db = await dbPromise;
  return db.getAll("people");
};
