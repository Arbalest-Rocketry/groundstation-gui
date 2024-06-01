import React, { useState, useEffect, useCallback, useRef } from 'react';
import ChartOverview from './ChartOverview.js';
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Stack from "react-bootstrap/Stack";
import { useSocketContext } from '../SocketContext.js';
import {
    GaugeContainer,
    GaugeValueArc,
    GaugeReferenceArc,
    useGaugeState,
} from '@mui/x-charts/Gauge';
import Box from '@mui/material/Box';

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

export default function RealTimeChart() {
    const [data, setData] = useState([]);
    const [keys, setKeys] = useState([]);
    const [quaternion, setQuaternion] = useState({ q_r: 1, q_i: 1, q_j: 1, q_k: 1 });
    const {
        socket,
        isConnected,
        toggleUpdate,
        handleIpChange,
        toggleConnection,
        isUpdating
    } = useSocketContext();
    const chartRefs = useRef({});

    const handleGraphUpdate = useCallback((message) => {
        const timestamp = new Date(message.timestamp);
        const hours = timestamp.getHours();
        const minutes = timestamp.getMinutes();
        const timeString = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;

        const newDataPoint = { x: timeString, ...message };
        setData((prevData) => [...prevData, newDataPoint]);
        const messageKeys = Object.keys(message).filter(key => key !== 'timestamp' && !key.includes('q_'));

        setKeys((prevKeys) => {
            const newKeys = new Set([...prevKeys, ...messageKeys]);
            return Array.from(newKeys);
        });

        if (message.q_r !== undefined
            && message.q_i !== undefined
            && message.q_j !== undefined
            && message.q_k !== undefined) {
            setQuaternion({
                q_r: message.q_r,
                q_i: message.q_i,
                q_j: message.q_j,
                q_k: message.q_k
            });
        }
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('graph_update', handleGraphUpdate);

            return () => {
                socket.off('graph_update', handleGraphUpdate);
            };
        }
    }, [socket, handleGraphUpdate]);

    const latestData = data.length > 0 ? data[data.length - 1] : {};

    return (
        <Stack direction="horizontal" gap={3}>
            <div style={{ display: "flex", flexDirection: "row", width: "100%", height: "100%", justifyContent: "space-between" }}>
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
                            <ListGroup.Item>q_r: {latestData.q_r || 'N/A'}</ListGroup.Item>
                            <ListGroup.Item>q_i: {latestData.q_i || 'N/A'}</ListGroup.Item>
                            <ListGroup.Item>q_j: {latestData.q_j || 'N/A'}</ListGroup.Item>
                            <ListGroup.Item>q_k: {latestData.q_k || 'N/A'}</ListGroup.Item>
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

                <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
                    <div className="mt-20" style={{ width: "100%", display: "flex", flexDirection: "row" }}>
                        <ChartOverview
                            keys={keys}
                            data={data}
                            quaternion={quaternion}
                        />
                    </div>
                </div>
            </div>
        </Stack>
    );
}
