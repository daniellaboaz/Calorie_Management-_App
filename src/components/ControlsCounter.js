// Daniella Boaz (209371913), Gal Kalev (318657632)
// src/components/ControlsCounter.js
//display total calories of today
import React from 'react';
import '../App.css';

const ControlsCounter = ({ totalCalories }) => {
  return (
    <div className='app_controls_counter'>
      <h2>Total calories for today: <span>{totalCalories}</span></h2>{/*show total calories of today*/}
      {/*show image to design the page*/}
      <img src={`${process.env.PUBLIC_URL}/images/pic.png`}
        alt='pic'
        style={{ width: '40%', height: 'auto' }}
      />
    </div>
  );
};

export default ControlsCounter;