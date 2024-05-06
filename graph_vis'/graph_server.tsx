import React, { useState } from 'react';

const YourComponent: React.FC = () => {
    const [inputData, setInputData] = useState<string>('');
    const [outputData, setOutputData] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputData(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:3001/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputData }),
            });
            const data = await response.json();
            setOutputData(data.result);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <textarea
                value={inputData}
                onChange={handleInputChange}
                placeholder="Enter input data"
            />
            <button onClick={handleSubmit}>Submit</button>
            <div>
                <h2>Output Data:</h2>
                <p>{outputData}</p>
            </div>
        </div>
    );
};

export default YourComponent;
