import idb from './idb';
import React, { useEffect, useState } from 'react';
import Test from './test/testjs';

const AppTest = () => {
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await Test();
        setTestResult(result);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Render UI based on the testResult */}
    </div>
  );
};

export default AppTest;