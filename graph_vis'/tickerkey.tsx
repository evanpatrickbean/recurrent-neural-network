import React from 'react';
import './tickerkey.css';

interface TickerKeyProps {
  direction: 'up' | 'down';
  onClick: () => void;
  limit: boolean;
  darkMode:boolean;
}

const TickerKey: React.FC<TickerKeyProps> = ({ direction, onClick,limit,darkMode }) => {
  return (
    <button className={`ticker-btn ${limit?"off":"on"}  ${darkMode?"dark":"light"}`} onClick={onClick}>
      {direction === 'up' ? '++' : '--'}
    </button>
  );
};

export default TickerKey;
