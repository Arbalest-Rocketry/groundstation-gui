import React from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Box from '@mui/material/Box';
import { Canvas } from '@react-three/fiber';
import Scene from '../Rocket.js';
import GLTFModelViewer from '../GLTFModelViewer';  

import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from '@mui/x-charts/Gauge';

function GaugePointer() {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();

  if (valueAngle === null) {
    return null;
  }

  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="red" />
      <path
        d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
        stroke="red"
        strokeWidth={3}
      />
    </g>
  );
}

function BMP({ latestData, quaternion }) {
  return (
    <div style={{ width: "100%", alignSelf: "flex-start", paddingRight: 10, marginRight: 10 }}>
      <Card style={{ width: "100%" }}>
        <Card.Header>BMP</Card.Header>
        <ListGroup>
          <ListGroup.Item style={{ fontSize: "30px"}}>Temperature: {latestData.temperature || 'N/A'} °C</ListGroup.Item>
          <ListGroup.Item style={{ fontSize: "30px"}}> Pressure: {latestData.pressure || 'N/A'} hPa</ListGroup.Item>
        </ListGroup>
      </Card>

      <Card style={{ width: "100%" }}>
        <Card.Header>Altitude</Card.Header>
        <ListGroup>
          <ListGroup.Item style={{ fontSize: "30px"}}>Altitude: {latestData.altitude || 'N/A'} / 12,200 m</ListGroup.Item>
        </ListGroup>
        <Box display="flex" justifyContent="center" alignItems="center">
          {/* Add your gauge here */}
        </Box>
      </Card>

      {/* <div style={{ marginTop: '20px', width: "100%" }}>
        <GLTFModelViewer modelPath="/Repaired_Stage_3.gltf" quaternion={quaternion} />
      </div> */}
    </div>
  );
}

function Example({ latestData }) {
  return (
    <div style={{ width: "20%", alignSelf: "flex-start", paddingRight: 10, marginRight: 10 }}>
      <Card style={{ width: "100%" }}>
        <Card.Header>Header of the card</Card.Header>
        <ListGroup>
          <ListGroup.Item> </ListGroup.Item>
          <ListGroup.Item> </ListGroup.Item>
        </ListGroup>
      </Card>
      <Card style={{ width: "100%" }}>
        <Card.Header></Card.Header>
        <ListGroup>
          <ListGroup.Item></ListGroup.Item>
        </ListGroup>
        <Box display="flex" justifyContent="center" alignItems="center">
          <GaugeContainer
            width={300}
            height={300}
            startAngle={-110}
            endAngle={110}
            value={latestData.altitude}
            valueMax={12200}
          >
            <GaugeReferenceArc />
            <GaugeValueArc />
            <GaugePointer />
          </GaugeContainer>
        </Box>
      </Card>
    </div>
  );
}

export {
  BMP
}
