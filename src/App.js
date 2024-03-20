// Daniella Boaz (209371913), Gal Kalev (318657632)
//src/App.js
// External libraries
import React, { useState, useEffect } from 'react';
import idb from './idb';
import 'react-calendar/dist/Calendar.css';
import Button from '@mui/material/Button';
//import components:
import CalendarShow from './components/CalendarShow';
import OldMealsReport from './components/OldMealsReport';
import Navbar from './components/Navbar';
import ShowMealsOfToday from './components/ShowMealsOfToday';
import fetchAttributesForDate from './components/DataService';
import ErrorHandling from './components/ErrorClass';
//display total calories of today:
import ControlsCounter from './components/ControlsCounter';
// Controls for adding new meals:
import ControlsInput from './components/ControlsInput';
import './App.css';

// In this component we fetch the data from idb
const App = () => {

  const [meals, setMeals] = useState([]);
  const [calories, setMealCalories] = useState(0);
  const [mealType, setMealType] = useState(null);
  const [mealDescripton, setMealDescripton] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);
  const [showMealsReport, setShowMealsReport] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState(null);


  // Fetch meals of today from the database and display them
  const fetchMeals = async () => {
    try {
      console.log('Fetching meals for today...');
      await idb.openCaloriesDB('caloriesdb', 1);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const mealsToday = await fetchAttributesForDate(today, setSelectedAttributes, 'today');
      console.log('Meals fetched for today:', mealsToday);

      if (mealsToday && mealsToday.length > 0) {
        const sumCalories = mealsToday.reduce((total, meal) =>
          total + (parseInt(meal.calorie, 10) || 0), 0);
        setMeals(mealsToday);
        setTotalCalories(sumCalories);
      } else {
        console.log('No meals recorded for today.');
        setMeals([]);
        setTotalCalories(0);
      }
    } catch (error) {
      console.error('Error fetching meals for today:', error);
      throw new ErrorHandling('fetch');
    }
  };

  //upload the data after refreshing the page
  useEffect(() => {
    fetchMeals(); // Fetch meals when the component mounts
  }, []);

  //add a new meal today and display
  const onAddMealsClick = async () => {
    if (calories <= 0 || mealType === null || mealDescripton === '') {
      alert('Input must not be empty or is illegal');
      return;
    } try {
      await idb.openCaloriesDB('caloriesdb', 1);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const formattedDate = today.toISOString().split('T')[0];

      await idb.addCalories({
        calorie: calories,
        category: mealType,
        description: mealDescripton,
        date: formattedDate,
      });
      // Call the fetchMeals directly after adding a new meal to display it
      await fetchMeals();
    } catch (error) {
      console.error(error);
      throw ErrorHandling('addMeal');
    }
    // setting the controls to default
    setMealCalories(0);
    setMealDescripton('');
    setMealType('');
  };

  //delete a meal from the list and the database
  const deleteMeal = async (mealId) => {
    try {
      await idb.openCaloriesDB('caloriesdb', 1);
      await idb.deleteCalorie(mealId);
      setShowMealsReport(false);
      // Fetch meals again after deletion
      await fetchMeals();
    } catch (error) {
      console.error(error);
      throw ErrorHandling('delete');
    }
  };

  //Show/hide calendar on button click
  const clickToShowCalendar = () => {
    const calendarContainer = document.getElementsByClassName('calendar-container')[0];
    if (calendarContainer) {
      if (calendarContainer.style.display === 'none') {
        calendarContainer.style.display = 'block';
        setShowMealsReport(false); // Hide meals report when showing calendar
      } else {
        calendarContainer.style.display = 'none';
      };
    };
  };

  return (
    <div className='App_home'>
      <Navbar />
      <table className='app_table'>{/*divide the page to 3 equal sections*/}
        <tbody>
          <tr>
            <td className='app_table_cell'>{/*display total calories of today*/}
              <ControlsCounter totalCalories={totalCalories} />
            </td>
            <td className='app_table_cell'>{/* Controls for adding new meals*/}
              <ControlsInput
                calories={calories}
                mealDescripton={mealDescripton}
                mealType={mealType}
                setMealCalories={setMealCalories}
                setMealDescripton={setMealDescripton}
                setMealType={setMealType}
                onAddMealsClick={onAddMealsClick}
              />
            </td>
            <td className='app_table_cell'>{/* calander for old meald report*/}
              <div className='app_constrols_report'>
                <Button className='btn' onClick={clickToShowCalendar} variant='contained'
                  color='primary' sx={{ marginTop: '10px', marginBottom: '10px' }}>
                  Old reports:
                </Button>
                <CalendarShow
                  setShowMealsReport={setShowMealsReport}
                  setSelectedAttributes={setSelectedAttributes}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      {/* a list of today meals*/}
      <ShowMealsOfToday meals={meals} deleteMeal={deleteMeal} />
      {/* a list of previos meals from selected date*/}
      {showMealsReport ? (
        <OldMealsReport
          selectedAttributes={selectedAttributes}
          deleteMeal={deleteMeal}
        />
      ) : null}
    </div>
  );
};
export default App;




