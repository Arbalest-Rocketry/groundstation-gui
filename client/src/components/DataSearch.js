import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'dayjs/locale/de';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { useSocketContext } from '../SocketContext';
import Button from '@mui/material/Button';
import Chart from './Chart';
import TextField from '@mui/material/TextField';
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import '../css/DataSearch.css';

const DataSearch = () => {
    const { socket } = useSocketContext();
    const [charts, setCharts] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [startTime, setStartTime] = useState(dayjs().startOf('day'));
    const [endTime, setEndTime] = useState(dayjs().endOf('day'));
    const [attribute, setAttribute] = useState('');

    useEffect(() => {
        if (socket) {
            socket.on('data_in_range', (message) => {
                console.log("Received data_in_range:", message);
                const { chartId, data } = message;
                setCharts(prevCharts => prevCharts.map(chart => {
                    if (chart.id === chartId) {
                        return { ...chart, data };
                    }
                    return chart;
                }));
            });

            return () => {
                socket.off('data_in_range');
            };
        }
    }, [socket]);

    const handleDateChange = (newValue) => setSelectedDate(newValue);
    const handleStartTimeChange = (newValue) => setStartTime(newValue);
    const handleEndTimeChange = (newValue) => setEndTime(newValue);
    const handleAttributeChange = (event) => setAttribute(event.target.value);

    const handleAddChart = () => {
        if (!socket) {
            console.error("Socket is not initialized");
            return;
        }

        const newChartId = charts.length ? charts[charts.length - 1].id + 1 : 0;

        const newChart = {
            id: newChartId,
            date: selectedDate,
            startTime,
            endTime,
            attribute,
            dataKey: attribute,
            data: [] // add data
        };
        setCharts([...charts, newChart]);
        socket.emit('request_data_by_range', {
            chartId: newChartId,
            start: selectedDate.startOf('day').add(startTime.hour(), 'hour').add(startTime.minute(), 'minute').toISOString(),
            end: selectedDate.startOf('day').add(endTime.hour(), 'hour').add(endTime.minute(), 'minute').toISOString(),
            attribute
        });
    };

    const handleDeleteChart = (id) => {
        setCharts(charts.filter(chart => chart.id !== id));
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={2} direction="column" sx={{ width: '100%' }}>
                <Stack spacing={2} direction="row" sx={{ width: '100%' }}>
                    <DatePicker label="Date" value={selectedDate} onChange={handleDateChange} sx={{ flexGrow: 1 }} />
                    <TimePicker label="Start Time" value={startTime} onChange={handleStartTimeChange} ampm={false} sx={{ flexGrow: 1 }} />
                    <TimePicker label="End Time" value={endTime} onChange={handleEndTimeChange} ampm={false} sx={{ flexGrow: 1 }} />
                    <TextField label="Attribute" value={attribute} onChange={handleAttributeChange} sx={{ flexGrow: 1 }} />
                    <Button variant="contained" onClick={handleAddChart} sx={{ flexGrow: 1 }}>Add Chart</Button>
                </Stack>
                
                
        <div className='chart-container'>
                    {charts.map((chart) => (
    <div className="container-fluid" style={{ position: 'relative', width: '100%' }}>
    <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleDeleteChart(chart.id)}
                                style={{ width: "10%", position: 'absolute', top: 10, left: 10, zIndex: 1 }}
                            >
                                Delete Chart
                            </Button>
                            <Chart data={chart.data} dataKey={chart.dataKey} date={chart.date} attribute={chart.attribute} readDates = {true}/>
                        </div>
                    ))}
                    </div>
            </Stack>
        </LocalizationProvider>
    );
};

export default DataSearch;
