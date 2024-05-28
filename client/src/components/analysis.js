import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import React, { useState } from 'react';
import { DateRangePicker } from 'react-date-range';

const Analysis = () => {
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  const handleSelect = (ranges) => {
    console.log(ranges);
    setSelectionRange(ranges.selection);
  };

  return (
    <DateRangePicker
      ranges={[selectionRange]}
      onChange={handleSelect}
    />
  );
};

export default Analysis;
