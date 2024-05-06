import React, { useState } from 'react';
import { Dispatch, SetStateAction } from 'react';
import './slider.css'
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import InfoIcon from '@mui/icons-material/Info';

interface SliderProps {
  min: number;
  max: number;
  steps: number;
  title: string;
  darkMode: boolean;
  value: number; // Value of the slider
  onChange: (newValue: number) => void;
  lockable: boolean;
  enablers: boolean[];
  setEnablers:Dispatch<SetStateAction<boolean[]>>;
  negatedEnablers: number[];
}

const Slider: React.FC<SliderProps> = ({ min, max,
                                         title, darkMode,
                                         steps, value, onChange,enablers,
                                         setEnablers,negatedEnablers,
                                        lockable}) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(event.target.value);
        onChange(newValue); // Call the onChange callback with the new value

        const updatedEnablers = [...enablers]; // Create a copy of the original enablers array
        negatedEnablers.forEach(index => {
          if (index >= 0 && index < updatedEnablers.length) {
            updatedEnablers[index] = false; // Set the enabler at the specified index to false
          }
        });
        setEnablers(updatedEnablers); // Update the enablers state with the modified array
      };
    const [lockStatus, setLockStatus] = useState<boolean>(false);

  return (
    <div className={`slider-container ${darkMode?"dark":"light"}`}>
        <div className="title">{title.toUpperCase()}</div>
        <div className="slider-box">
        <input
            title={title}
            type="range"
            min={min}
            max={max}
            step={(max-min)/steps}
            value={value}
            onChange={handleChange}
            className={`slider ${darkMode?"dark":"light"}`}
        />
        </div>
        <div className="value">{value}</div>
        <div className="status-icon">
          {lockable?lockStatus?
          <LockIcon
          onClick={() => setLockStatus(!lockStatus)}/>
          :
          <LockOpenIcon
          onClick={() => setLockStatus(!lockStatus)}/>
          :
          <InfoIcon/>}
        </div>
    </div>
  );
};

export default Slider;

