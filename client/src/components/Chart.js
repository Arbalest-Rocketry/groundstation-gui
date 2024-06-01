import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush } from 'recharts';

const Chart = ({ data, dataKey, readDates }) => {
    console.log("Data: ", data);

    const getYDomain = (data) => {
        if (data.length === 0) {
            return [0, 1]; // default (with no value)
        }
        const yValues = data.map(point => {
            const value = parseFloat(point[dataKey]);
            if (isNaN(value)) {
                console.error(`Invalid value for dataKey "${dataKey}":`, point[dataKey]);
                return 0; // or handle as needed
            }
            return value;
        }).filter(value => !isNaN(value)); // filter out non-numeric values

        const minY = Math.min(...yValues);
        const maxY = Math.max(...yValues);
        const buffer = (maxY - minY) * 0.1; // add buffer

        return [minY - buffer, maxY + buffer];
    };

    const yDomain = getYDomain(data);

    const formatYAxis = (tickItem) => {
        return tickItem.toFixed(2); // format Y-axis labels to 2 decimal places
    };

    return (
        <LineChart

            width= {700}
            height={450} // height of chart
            data={data} // data to be passed to the chart
            position={'relative'}
            margin={{ top: 30, right: 20, left: 20, bottom: 80 }} // increased bottom margin
        >
            <CartesianGrid strokeDasharray="3 3" /> {/* set the grid style */}
            <XAxis dataKey={readDates ? "timestamp": "x"} label={{ value: 'Time', position: 'insideBottomLeft', offset: -15 }} /> {/* x-axis setup with offset */}
            <YAxis
                domain={yDomain} // set the y domain
                label={{ value: 'Value', angle: -90, position: 'insideLeft', offset: -10 }}
                tickFormatter={formatYAxis} // format Y-axis labels
            /> {/* y-axis setup */}
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line type="monotone" dataKey={dataKey} stroke="#8884d8" strokeWidth={2} /> {/* dynamically add lines */}
            <Brush dataKey="timestamp" height={30} stroke="#8884d8" y={370} /> {/* Brush component for zooming */}
        </LineChart>
    );
};

export default Chart;
