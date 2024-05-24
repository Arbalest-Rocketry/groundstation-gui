import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush } from 'recharts';

const Chart = ({ data, dataKey }) => {
    console.log(data[dataKey]);

    const getYDomain = (data) => {
        if (data.length === 0) {
            return [0, 1]; // default (with no value)
        }
        const yValues = data.map(point => parseFloat(point[dataKey].toFixed(2))); // round to 2 decimal points
        const minY = Math.min(...yValues);
        const maxY = Math.max(...yValues);
        const buffer = (maxY - minY) * 0.1; // add buffer

        return [parseFloat((minY - buffer).toFixed(2)), parseFloat((maxY + buffer).toFixed(2))];
    };

    const yDomain = getYDomain(data);

    const formatYAxis = (tickItem) => {
        return tickItem.toFixed(4); // format Y-axis labels to 2 decimal places
    };

    return (
        <LineChart
            width={600} // width of chart
            height={400} // height of chart
            data={data} // data to be passed to the chart
            margin={{ top: 10, right: 30, left: 20, bottom: 5 }} // inner margin of the chart
        >
            <CartesianGrid strokeDasharray="3 3" /> {/* set the grid style */}
            <XAxis dataKey="x" label={{ value: 'Time', position: 'insideBottomRight', offset: -5 }} /> {/* x-axis setup */}
            <YAxis
                domain={yDomain} // set the y domain
                label={{ value: 'Value', angle: -90, position: 'insideLeft', offset: -5}}
                tickFormatter={formatYAxis} // format Y-axis labels
            /> {/* y-axis setup */}
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line type="monotone" dataKey={dataKey} stroke="#8884d8" strokeWidth={2} /> {/* dynamically add lines */}
            <Brush dataKey="x" height={30} stroke="#8884d8" /> {/* Brush component for zooming */}
        </LineChart>
    );
};

export default Chart;
