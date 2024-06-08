import React from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Box from '@mui/material/Box';
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from '@mui/x-charts/Gauge';
function GaugePointer() {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();

  if (valueAngle === null) {
      // No value to display
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

function BMP({ latestData }) {
  return (
    <div style={{ width: "20%", alignSelf: "flex-start", paddingRight: 10, marginRight: 10 }}>
    <Card style={{ width: "100%" }}>
        <Card.Header>BMP</Card.Header>
        <ListGroup>
            <ListGroup.Item>Temperature: {latestData.temperature || 'N/A'}</ListGroup.Item>
            <ListGroup.Item>Pressure: {latestData.pressure || 'N/A'}</ListGroup.Item>
        </ListGroup>
    </Card>
    <Card style={{ width: "100%" }}>
        <Card.Header>BNO</Card.Header>
        <ListGroup>
            <ListGroup.Item>q_r: {latestData.qr || 'N/A'}</ListGroup.Item>
            <ListGroup.Item>q_i: {latestData.qi || 'N/A'}</ListGroup.Item>
            <ListGroup.Item>q_j: {latestData.qj || 'N/A'}</ListGroup.Item>
            <ListGroup.Item>q_k: {latestData.qk || 'N/A'}</ListGroup.Item>
        </ListGroup>
    </Card>
    <Card style={{ width: "100%" }}>
        <Card.Header>Altitude</Card.Header>
        <ListGroup>
        <ListGroup.Item>Altitude: {latestData.altitude || 'N/A'} / 1220</ListGroup.Item>
        </ListGroup>
        <Box display="flex" justifyContent="center" alignItems="center">
            <GaugeContainer
                width={300}
                height={300}
                startAngle={-110}
                endAngle={110}
                value={latestData.altitude}
                valueMax={1220}
                aria-labelledby="battery_level_label"
                aria-valuetext="50% (6 hours) remaining"
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
/**
 * 
 * To displaylatest Data, initialize latestData from the caller component like below.
 *const latestData = data.length > 0 ? data[data.length - 1] : {}; 
 * to display the data, put line below inside the Car component
 * <ListGroup.Item> {latestData.dataKey || N/A} </ListGroup.Item>
 */
function Example ({latestData /*add any props should be used*/}) {

  return (
    /*set width to the percentage of the width of the wrapper will be occupied.*/
    <div style={{ width: "20%", alignSelf: "flex-start", paddingRight: 10, marginRight: 10 }}>
      {/* example of common card */}
    <Card style={{ width: "100%" }}>
        <Card.Header>Header of the card</Card.Header>
        <ListGroup>
            <ListGroup.Item> </ListGroup.Item>
            <ListGroup.Item> </ListGroup.Item>
        </ListGroup>
    </Card>
    {/*example of guage*/}
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
                valueMax={1220}
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