import idb from './idb';

async function Test() {
  try {
    const db = await idb.openCaloriesDB("caloriesdb", 1);
    const result1 = await db.addCalories({ calorie: 200, category: "LUNCH", description: "glass of milk" });
    const result2 = await db.addCalories({ calorie: 300, category: "LUNCH", description: "pizza slice" });

    if (db) {
      console.log("creating db succeeded");
    }
    if (result1) {
      console.log("adding 1st calories consumption succeeded");
    }
    if (result2) {
      console.log("adding 2nd calories consumption succeeded");
    }

    return { db, result1, result2 };
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow the error to handle it in App_test.js
  }
}

export default Test;
