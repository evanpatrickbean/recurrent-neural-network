import React, { useState, useEffect } from 'react';
import { Dispatch, SetStateAction } from 'react';
import './tickertable.css';
import TickerKey from './tickerkey';

import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

interface TableWithTickerProps {
  n: number;
  title: string;
  darkMode: boolean;
  enablers: boolean[];
  setEnablers:Dispatch<SetStateAction<boolean[]>>;
}

const TableWithTicker: React.FC<TableWithTickerProps> = ({ n, title, darkMode,enablers,setEnablers }) => {
  // Initialize an array to hold ticker values
  const [tickerValues, setTickerValues] = useState<number[]>([1]);
  // Initialize an array to hold lock status for each ticker
  const [lockStatus, setLockStatus] = useState<boolean[]>([]);

  // Update ticker values when n changes
  useEffect(() => {
    setTickerValues(Array.from({ length: n }, () => 1));
    setLockStatus(Array.from({ length: n }, () => false)); // Initialize lock status for each ticker
  }, [n]);

  // Function to update a specific ticker value
  const updateTicker = (index: number, newValue: number) => {
    setTickerValues(prevValues => {
      const updatedValues = [...prevValues];
      updatedValues[index] = newValue;
      return updatedValues;
    });
    const newEnablers=[...enablers];
    newEnablers[3]=false;
    setEnablers(newEnablers);
  };

  // Function to toggle lock status for a specific ticker
  const toggleLock = (index: number) => {
    setLockStatus(prevStatus => {
      const updatedStatus = [...prevStatus];
      updatedStatus[index] = !prevStatus[index];
      return updatedStatus;
    });
  };

  // Rendering the table
  return (
    <div className='ticker-container'>
      {n !== 0 ? (
        <div className="table-body">
          <table className={`ticker-table ${darkMode ? "dark" : "light"}`}>
            <thead>
              <tr>
                {/* First row with values from 1 to n */}
                {Array.from({ length: n }, (_, index) => (
                  <th className='columnTH' key={index}>LAYER {index + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {/* Second row with ticker values and lock icons */}
                {tickerValues.map((value, index) => (
                  <td className='columnT' key={index}>
                    <div className='ticker-column'
                      style= {{
                        fontSize:12
                      }}
                    >
                      <div className='button-row'>
                        <TickerKey direction="down" 
                                   onClick={() => value>1? updateTicker(index, value - 1):null}
                                   limit={value<=1}
                                   darkMode={darkMode} />
                        <TickerKey direction="up"
                                   onClick={() => value<10? updateTicker(index, value + 1):null}
                                   limit={value>=10}
                                   darkMode={darkMode} />
                        {/* Lock icon with toggle functionality */}
                        {lockStatus[index] ?
                          <LockIcon onClick={() => toggleLock(index)} /> :
                          <LockOpenIcon onClick={() => toggleLock(index)} />
                        }
                      </div>
                      <div className={`valueKey ${darkMode?"dark":"light"}`}>
                        {`${value} Node${value===1?"":"s"}`} 
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        null
      )}
    </div>
  );
};

export default TableWithTicker;
