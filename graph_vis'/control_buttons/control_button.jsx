import React from 'react';
import './control_button.css'
const Button = ({ onClick, header,subtext,darkMode,enabled}) => {
  return (
    <button onClick={enabled?onClick:null} className={`control-button ${enabled?"enabled":"disabled"} ${darkMode?"dark":"light"}`}>
      <h1>{header}</h1>
      <a>{subtext.toUpperCase()}</a>
    </button>
  );
};

export default Button;