import React, { useState, useCallback, useMemo, useRef } from 'react';
import Chart from './Chart.js';
import { Canvas } from '@react-three/fiber';
import Box from '../Box.js';
import  '../css/ChartOverview.css';
import { useSocketContext } from '../SocketContext.js';




export default function ChartOverview({
  keys = [],
  data = [],
  quaternion = { qr: 1, qi: 1, qj: 1, qk: 1 }
}) {
  const [highlightedKey, setHighlightedKey] = useState(null);
  const chartRefs = useRef({});
  const {
    isConnected,
    isUpdating,
    toggleUpdate
  } = useSocketContext();

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
      style={{ marginBottom: '20px', marginRight: '10%', marginLeft: '10%', width: '100%', position: 'relative', zIndex: 1 }}
    >
      <Chart data={data} dataKey={key} readDates = {false} />
    </div>
  )), [keys, data, handleChartClick, highlightedKey]);

  return (
    <div onClick={handleContainerClick}>
      <h1>Real-time Data Chart</h1>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <div>
        {isConnected && (
          <button className="update-button" onClick={toggleUpdate}>
            {isUpdating ? 'Stop Updates' : 'Start Updates'}
          </button>
        )}
      </div>
      <div className="chart-links">
        {keys.map((key) => (
          <button key={key} onClick={() => scrollToChart(key)}>
            {key}
          </button>
        ))}
      </div>
      <div className="chart-container" style={{ position: 'relative', width: '100%' }}>
        {renderedKeys}
        {keys.length > 0 && (
          <div style={{ height: '400px', position: 'relative', marginTop: '20px' }}>
            <Canvas style={{ position: 'relative', width: '100%', height: '100%', zIndex: 0 }}>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <pointLight position={[-10, -10, -10]} />
              <Box quaternionData={quaternion} position={[0, 0, 0]} />
            </Canvas>
          </div>
        )}
      </div>
    </div>
  );
}
