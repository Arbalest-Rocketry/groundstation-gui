import React, { useState } from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import { Calendar } from 'react-date-range';

const Analysis = () => {
  const handleSelect = (date) => {
    console.log(date); // native Date object
  };

  return (
    <Calendar
      date={new Date()}
      onChange={handleSelect}
    />
  );
};

export default Analysis;
