import { useState, useEffect } from 'react';
import { TestContext } from './TestContext.js';


const TestContext = createContext();
export const useTestContext = () => useContext(TestContext);

export const TestProvider = ({childeren}) => {
    const { isUpdating} = useSocketContext(); 
    const [isTesting, setIsTesting] = useState(false);
    const [altitude, setAltitude] = useState(0);
    const [pressure, setPressure] = useState(0);
    const [temperature, setTemperature] = useState(0);
    const [quaternion, setQuaternion] = useState({qw: 1, qx: 0, qy: 0, qz: 0});
    const quaternionStep = useRef(0);
    const [testData, setTestData] = useState([]);
    
 

    const createTestData = useCallback((testData) => {

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
        const currentData =
         {altitude: altitude,
             pressure: pressure,
              temperature: temperature
            };
        const newDataPoint = {x: timeString, ...currentData}
        setTestData((testData)=> [...testData, currentData]);

    }, []);

    useEffect (() => {
        let interval;
        if (!isTesting) {
            interval = setInterval(() => {
     
                createTestData(testData);
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isTesting]);

    useEffect (() => {
        if (isTesting) {
            cureatTestData();
        }
    }, [createTestData]);

   const value = {
      isTesting,
   };

   return (
      <TestContext.Provider value={value}>
         {children}
      </TestContext.Provider>
   );
};