import React, { Suspense, lazy, useState, useEffect } from 'react';
import '../css/Telemetry.css';
import Dropdown from '../components/DropDownMenu.js';
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

const RealTimeChart = lazy(() => import('../components/RealTimeChart.js'));
const Maps = lazy(() => import('../components/Maps.js'));
const DataSearch = lazy(() => import('../components/DataSearch.js'));
const GeoMap = lazy(() => import('../components/GeoMap.js'));
const TrajectoryMap = lazy(() => import('../components/TrajectoryMap.js'));
export default function Telemetry() {
  const [quaternionData, setQuaternionData] = useState(null);
  const [activeKey, setActiveKey] = useState('controls');

  useEffect(() => {
    const exampleData = { qi: 0, qj: 0, qk: 0, qr: 1 };
    setQuaternionData(exampleData);

    const interval = setInterval(() => {
      setQuaternionData({
        qi: Math.random(),
        qj: Math.random(),
        qk: Math.random(),
        qr: Math.random()
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Dropdown />
      <Tabs 
        activeKey={activeKey} 
        onSelect={(k) => setActiveKey(k)} 
        defaultActiveKey="controls" 
        className="mb-3"
      >
        <Tab tabClassName="tab" eventKey="RealTime" title="Telemetry">
          <div className="wrapper" style={{height  : '100vh'}}>
            <Suspense fallback={<div>Loading...</div>}>
              <RealTimeChart isActive={activeKey === 'RealTime'}/>
            </Suspense>
          </div>
        </Tab>

        <Tab tabClassName="tab" eventKey="DataSearch" title="dataSearch">
          <div className="wrapper">
            <Suspense fallback={<div>Loading...</div>}>
              <DataSearch />
            </Suspense>
          </div>
        </Tab>
        

{/*         
        <Tab tabClassName="tab" eventKey="GPS" title="TrajectoryMap">
          <div className="wrapper">
            <Suspense fallback={<div>Loading...</div>}>
            <div  style={{ position: 'relative', width: '100vw', height: '100vh' }}>
              <TrajectoryMap isActive={activeKey === 'GPS'}/>
            </div>
            </Suspense>
          </div>
        </Tab> */}

        {/* <Tab tabClassName="tab" eventKey="GPS3D" title="GPS3D">
          <div className="wrapper" style={{ position: 'relative', height: '100vh', width: '100vw' }}>
            <Suspense fallback={<div>Loading...</div>}>
              <GeoMap isActive={activeKey === 'GPS3D'}/>
            </Suspense>
          </div>
        </Tab> */}
      </Tabs>
    </>
  );
}
