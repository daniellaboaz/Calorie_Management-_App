// Daniella Boaz (209371913), Gal Kalev (318657632)
// src/idb.js
const idb = {
  db: null,

  // Open or create the IndexedDB database for the calories database.
  openCaloriesDB: async (dbName, version) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, version);
      request.onerror = (event) => {
        reject(`Error opening database: ${event.target.error}`);
      };
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        // Create an object store if it doesn't already exist
        if (!db.objectStoreNames.contains('caloriesdb')) {
          db.createObjectStore('caloriesdb', { keyPath: 'id', autoIncrement: true });
        }
      };
      request.onsuccess = (event) => {
        idb.db = event.target.result;
        resolve(idb); 
      };
    });
  },

  // Add calories data to the IndexedDB.
  addCalories: async (caloriesData) => {
    return new Promise((resolve, reject) => {
      if (!idb.db) {
        reject('Database is not initialized');
        return;
      }
      const transaction = idb.db.transaction(['caloriesdb'], 'readwrite');
      const store = transaction.objectStore('caloriesdb');
      // Add the current date to the caloriesData object
      const currentDate = new Date().toISOString();
      caloriesData.date = currentDate;
      const request = store.add(caloriesData);
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
      request.onerror = (event) => {
        reject(`Error adding calories: ${event.target.error}`);
      };
    });
  },

  // Retrieve all calories data from data base.
  async getAllCalories() {
    return new Promise((resolve, reject) => {
      if (!idb.db) {
        reject('Database is not initialized');
        return;
      }
      const transaction = idb.db.transaction(['caloriesdb'], 'readonly');
      const store = transaction.objectStore('caloriesdb');
      const request = store.getAll();
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
      request.onerror = (event) => {
        reject(`Error getting calories: ${event.target.error}`);
      };
    });
  },

  // Delete a specific calorie entry from the data base.
  async deleteCalorie(calorieId) {
    return new Promise((resolve, reject) => {
      if (!idb.db) {
        reject('Database is not initialized');
        return;
      }
      const transaction = idb.db.transaction(['caloriesdb'], 'readwrite');
      const store = transaction.objectStore('caloriesdb');
      const request = store.delete(calorieId);
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
      request.onerror = (event) => {
        reject(`Error deleting calorie: ${event.target.error}`);
      };
    });
  }
};

export default idb;
