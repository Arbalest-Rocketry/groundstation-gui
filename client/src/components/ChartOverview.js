import React, { useState, useCallback, useMemo, useRef } from 'react';
import Chart from './Chart.js';
import { Canvas } from '@react-three/fiber';
import Rocket from './Rocket.js';
import '../css/ChartOverview.css';
import { useSocketContext } from '../SocketContext.js';

export default function ChartOverview({
  keys = [],
  data = [],  
}) {
  const [highlightedKey, setHighlightedKey] = useState(null);
  const chartRefs = useRef({});
  const { isConnected, isUpdating, toggleUpdate } = useSocketContext();

  const handleChartClick = useCallback((key) => {
    setHighlightedKey(key);
  }, []);

  const scrollToChart = useCallback((key) => {
    if (chartRefs.current[key]) {
      chartRefs.current[key].scrollIntoView({ behavior: 'smooth' });
    }
    handleChartClick(key);
  }, [handleChartClick]);

  const handleContainerClick = useCallback((e) => {
    if (e.target.className === 'chart-container') {
      setHighlightedKey(null);
    }
  }, []);

  const renderedKeys = useMemo(() => keys.map((key, index) => (
    <div
      key={index}
      ref={(el) => (chartRefs.current[key] = el)}
      onClick={() => handleChartClick(key)}
      className={`${highlightedKey === key ? 'highlighted' : ''} container-fluid`}
      style={{ marginBottom: '20px', marginRight: '10%', marginLeft: '0%', width: '100%', position: 'relative', zIndex: 1 }}
    >
      <Chart data={data} dataKey={key} readDates={false} />
    </div>
  )), [keys, data, handleChartClick, highlightedKey]);

  const linearChartData = useMemo(() => {
    const dataPoints = [];
    for (let x = 0; x <= 10; x++) {
      dataPoints.push({ x, y: 2 * x + 1 });
    }
    return dataPoints;
  }, []);

  return (
    <div onClick={handleContainerClick} style={{ width: '100%', }}>

      <div className="chart-links">
        {keys.map((key) => (
          <button key={key} onClick={() => scrollToChart(key)}>
            {key}
          </button>
        ))}
      </div>
      <div className="chart-container" style={{ position: 'relative', width: '100%' }}>
        {renderedKeys}


      </div>
    </div>
  );
}
