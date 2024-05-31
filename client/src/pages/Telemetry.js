import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSocketContext } from '../SocketContext.js';
import Chart from '../components/Chart.js';
import '../css/Telemetry.css';
import Dropdown from '../components/DropDownMenu.js';
import Box from '../Box.js';
import RealTimeChart from  './RealTimeChart.js'
import { Canvas } from '@react-three/fiber';
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";


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

            <Tab tabClassName="tab" eventKey="telemetry2" title="Telemetry2">
              <div className="wrapper">
    <RealTimeChart/>
              </div>
            </Tab>
      </Tabs>
    </>
  );
};