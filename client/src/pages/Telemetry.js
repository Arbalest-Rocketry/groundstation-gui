import React, { Suspense, lazy } from 'react';
import '../css/Telemetry.css';
import Dropdown from '../components/DropDownMenu.js';
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

const RealTimeChart = lazy(() => import('../components/RealTimeChart.js'));
const Maps = lazy(() => import('../components/Maps.js'));
const DataSearch = lazy(() => import('../components/DataSearch.js'));

export default function Telemetry() {
  return (
    <>
      <Dropdown />
      <Tabs defaultActiveKey="controls" className="mb-3">
        <Tab tabClassName="tab" eventKey="controls" title="Telemetry">
          <div className="wrapper">
            <Suspense fallback={<div>Loading...</div>}>
              <RealTimeChart />
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
        
        <Tab tabClassName="tab" eventKey="BNO" title="BNO">
          <div className="wrapper">
            <Suspense fallback={<div>Loading...</div>}>
              <RealTimeChart />
            </Suspense>
          </div>
        </Tab>
        
        <Tab tabClassName="tab" eventKey="GPS" title="GPS">
          <div className="wrapper">
            <Suspense fallback={<div>Loading...</div>}>
              <Maps />
            </Suspense>
          </div>
        </Tab>
      </Tabs>
    </>
  );
}
