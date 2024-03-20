// Daniella Boaz (209371913), Gal Kalev (318657632)
// components/ShowMealsOfToday.js
//show a list of meals added today

import React from 'react';
import '../App.css';
import EnhancedTable from './MUI_EnhancedTable';

const ShowMealsOfToday = ({ meals, deleteMeal }) => {
  return (
    <div>
      <div className='app_meals_container_wrapper'>
        <h1>Your meals today:</h1>
      </div>
      {/* display the meals */}
      <EnhancedTable rows = {meals} deleteMeal={deleteMeal}/>
    </div>
  );
};

export default ShowMealsOfToday;