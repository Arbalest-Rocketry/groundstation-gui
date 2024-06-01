import React from 'react';
import '../css/Telemetry.css';
import Dropdown from '../components/DropDownMenu.js';
import RealTimeChart from  '../components/RealTimeChart.js'
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import DataSearch from '../components/DataSearch.js';


export default function Telemetry(){

  return (
    <>
      <Dropdown/>
      <Tabs defaultActiveKey="controls" className="mb-3">
            <Tab tabClassName="tab" eventKey="controls" title="Telemetry">
              <div className="wrapper">
    <RealTimeChart/>
              </div>
            </Tab>

            <Tab tabClassName="tab" eventKey="DataSearch" title="dataSearch">
              <div className="wrapper">
    <DataSearch/>
              </div>
            </Tab>
            <Tab tabClassName="tab" eventKey="BNO" title="BNO">
              <div className="wrapper">
    <RealTimeChart/>
              </div>
            </Tab>
      </Tabs>
    </>
  );
};