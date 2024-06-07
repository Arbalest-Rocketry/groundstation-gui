import React, { useState, useEffect, useCallback, useRef } from 'react';
import Stack from "react-bootstrap/Stack";
import {BMP} from './Cards/TelemetryCards.js'
import { useSocketContext } from '../SocketContext.js';
import ChartOverview from './ChartOverview.js';

export default function RealTimeChart() {
    const [data, setData] = useState([]);
    const [keys, setKeys] = useState([]);
    const [quaternion, setQuaternion] = useState({ q_r: 1, q_i: 1, q_j: 1, q_k: 1 });
    const {
        socket,
    } = useSocketContext();

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

            <BMP latestData={latestData} />
                            <div style={{ display: "flex", width: "80%", flexDirection: "column" }}>
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
