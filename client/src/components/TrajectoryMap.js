import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import 'dayjs/locale/de';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import Button from '@mui/material/Button';
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import Map from './Maps.js';
import '../css/DataSearch.css';
import { useSocketContext } from '../SocketContext';

const TrajectoryMap = ({ isActive }) => {
    const { socket } = useSocketContext();
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [startTime, setStartTime] = useState(dayjs().startOf('day'));
    const [endTime, setEndTime] = useState(dayjs().endOf('day'));
    const [trajData, setTrajData] = useState(null);

    useEffect(() => {
        if (socket && isActive) {
            socket.on('data_in_range', (message) => {
                console.log("Received data_in_range:", message);
                const { data } = message;

                // Store the received trajectory data
                setTrajData(data);
            });

            return () => {
                socket.off('data_in_range');
            };
        }
    }, [socket, isActive]);

    const handleDateChange = (newValue) => setSelectedDate(newValue);

    const handleTrajectory = () => {
        if (!socket) {
            console.error("Socket is not initialized");
            return;
        }

        socket.emit('request_data_by_range', {
            start: selectedDate.startOf('day').add(startTime.hour(), 'hour').add(startTime.minute(), 'minute').toISOString(),
            end: selectedDate.startOf('day').add(endTime.hour(), 'hour').add(endTime.minute(), 'minute').toISOString(),
            attribute: ['longitude', 'latitude']
        });
    };

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={2} direction="column" sx={{ width: '100%' }}>
                    <Stack spacing={2} direction="row" sx={{ width: '100%' }}>
                        <DatePicker label="Date" value={selectedDate} onChange={handleDateChange} sx={{ flexGrow: 1 }} />
                        <Button variant="contained" onClick={handleTrajectory} sx={{ flexGrow: 1 }}>Show Trajectory</Button>
                    </Stack>
                </Stack>
            </LocalizationProvider>

            {isActive ? (
                <Map isActive={isActive} trajData={trajData} />
            ) : (
                <p>The map is inactive</p>
            )}
        </>
    );
};

export default TrajectoryMap;
