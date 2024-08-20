import React, { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import Stack from "react-bootstrap/Stack";
import { useSocketContext } from '../SocketContext.js';
import { BMP } from './Cards/TelemetryCards.js';
import ChartOverview from './ChartOverview.js';
import GLTFModelViewer from './GLTFModelViewer';  
import Maps from './Maps.js';

export default function RealTimeChart({ isActive }) {
    const [data, setData] = useState([]);
    const [keys, setKeys] = useState([]);
    const [quaternion, setQuaternion] = useState({ qw: 1, qx: 0, qy: 0, qz: 0 });
    const { socket, isConnected, toggleUpdate, isUpdating } = useSocketContext(); 
    const quaternionStep = useRef(0);

    useEffect(() => {
        let interval;   
        if (!isConnected) {
            interval = setInterval(() => {
                quaternionStep.current += 1;
                const angle = (Math.PI / 2) * (quaternionStep.current / 10);
                const newQuaternion = {
                    qw: Math.cos(angle / 2),
                    qx: Math.sin(angle / 2),
                    qy: 0,
                    qz: 0
                };
                setQuaternion(newQuaternion);
                if (quaternionStep.current >= 10) {
                    quaternionStep.current = 0;
                }
            }, 100);
        }

        return () => clearInterval(interval);
    }, [isConnected]); 

    const handleGraphUpdate = useCallback(debounce((message) => {
        const timestamp = new Date(message.timestamp);
        const hours = timestamp.getHours();
        const minutes = timestamp.getMinutes();
        const timeString = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;

        const newDataPoint = { x: timeString, ...message };
        setData((prevData) => [...prevData, newDataPoint]);

        const messageKeys = Object.keys(message).filter(key => key !== 'timestamp');
        setKeys((prevKeys) => {
            const newKeys = new Set([...prevKeys, ...messageKeys]);
            return Array.from(newKeys);
        });

        if (message.qw !== undefined
            && message.qx !== undefined
            && message.qy !== undefined
            && message.qz !== undefined) {
            setQuaternion({
                qw: message.qw,
                qx: message.qx,
                qy: message.qy,
                qz: message.qz
            });
        }
    }, 100), []);

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
     <Stack direction='vertical' gap={3}>
  <h1>Real-time Data Chart</h1>
  <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
  <div>
    {isConnected && (
      <button className="update-button" onClick={toggleUpdate}>
        {isUpdating ? 'Stop Updates' : 'Start Updates'}
      </button>
    )}
  </div>
  
    <div style={{ width: "100%", height: "100%", justifyContent: "space-between" }}>
      <BMP latestData={latestData} quaternion={quaternion} />
      
  <Stack direction='horizontal' gap={3}>
      <div style={{ width: "100%", display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, marginRight: '20px' }}>
          <GLTFModelViewer modelPath="/Repaired_Stage_3.gltf" quaternion={quaternion} />
        </div>
        <div style={{ flex: 1 }}>
          <ChartOverview
            keys={keys}
            data={data}
          />
        </div>
      </div>
  </Stack>
    </div>
</Stack>

    );
}
