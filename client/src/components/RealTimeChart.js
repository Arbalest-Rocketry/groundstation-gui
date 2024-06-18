import React, { useState, useEffect, useCallback, useRef } from 'react';
import ChartOverview from './ChartOverview.js';
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Stack from "react-bootstrap/Stack";
import { useSocketContext } from '../SocketContext.js';
import {BMP} from './Cards/TelemetryCards.js'
import Box from '@mui/material/Box';
import Maps from './Maps.js';



export default function RealTimeChart({ isActive }) {
    const [data, setData] = useState([]);
    const [keys, setKeys] = useState([]);
    const [quaternion, setQuaternion] = useState({ qr: 1, qi: 1, qj: 1, qk: 1 });
    const {
        socket,
        isConnected,
        toggleUpdate,
        handleIpChange,
        toggleConnection,
        setIsUpdating,
        setIsConnected,

    } = useSocketContext();
    const chartRefs = useRef({});

    const handleError = useCallback((error) => {
        console.error('error:', error);
        setIsUpdating(false);
        setIsConnected(false);
       }, []);

    const handleGraphUpdate = useCallback((message) => {
        const timestamp = new Date(message.timestamp);
        const hours = timestamp.getHours();
        const minutes = timestamp.getMinutes();
        const timeString = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;

        const newDataPoint = { x: timeString, ...message };
        setData((prevData) => [...prevData, newDataPoint]);
        const messageKeys = Object.keys(message).filter(key => key !== 'timestamp' && !key.includes('q'));

        setKeys((prevKeys) => {
            const newKeys = new Set([...prevKeys, ...messageKeys]);
            return Array.from(newKeys);
        });

        if (message.qr !== undefined
            && message.qi !== undefined
            && message.qj !== undefined
            && message.qk !== undefined) {
            setQuaternion({
                qr: message.qr,
                qi: message.qi,
                qj: message.qj,
                qk: message.qk
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
                <BMP latestData = {latestData} quaternion = {quaternion}/>

                <div style={{ display: "flex", width: "60%", flexDirection: "column" }}>
                    <div className="mt-20" style={{ width: "100%", display: "flex", flexDirection: "row" }}>
                        <ChartOverview
                            keys={keys}
                            data={data}
                        />
                    </div>
                </div>
                <div style = {{display: 'flex', width: "20%", height: "100vh", flexDirection: "column"}}>
                    <div className = "mt-20" style={{width: "100%", height: "100%", display: "flex", flexDirection: "row"}}>
                        <Maps isActive={isActive} quaternionData={quaternion}/>
                    </div>
                </div>
            </div>
        </Stack>
    );
}
