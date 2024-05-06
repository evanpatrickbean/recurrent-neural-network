const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

app.post('/graph', (req, res) => {
    try {
        const { inputData } = req.body;

        // Construct command line arguments without angle brackets
        const topologyTokens = inputData.topology.split(' ');
        const inputTokens = inputData.in.split(' ');
        const outputTokens = inputData.out.split(' ');
        let commandLineArgs = ['topology:'];
        commandLineArgs = commandLineArgs.concat(topologyTokens, 'in:', inputTokens, 'out:', outputTokens);

        // Check if the received command matches the specific format
        const receivedCommand = commandLineArgs.join(' ');
        const expectedCommand = 'rnn.exe topology: <topology_values> in: <input_values> out: <output_value>';

        // Compare without angle brackets
        if (receivedCommand === expectedCommand.replace(/<|>/g, '')) {
            // Replace values with '1' if the command matches the expected format
            commandLineArgs = ['topology: 1', 'in: 1', 'out: 1'];
        }

        const serverFolderPath = path.resolve(__dirname);
        const rnnExePath = path.join(serverFolderPath, 'rnn.exe');
        const childProcess = spawn(rnnExePath, commandLineArgs, { stdio: 'pipe' });
        let outputData = '';

        childProcess.stdout.on('data', (data) => {
            try {
                outputData += data.toString();
            } catch (error) {
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        });

        childProcess.stderr.on('data', (data) => {
            const errorMessage = data.toString();
            console.error(`Error from C++ program: ${errorMessage}`);
            if (!res.headersSent) {
                if (errorMessage.includes('what(): stoi')) {
                    res.status(400).json({ error: 'Invalid input data' });
                } else {
                    res.status(500).json({ error: errorMessage });
                }
            }
        });

        childProcess.on('exit', (code) => {
            console.log(`C++ program exited with code ${code}`);
            if (!res.headersSent) {
                res.json({ result: outputData });
            }
        });
    } catch (error) {
        console.error('Error communicating with C++ program:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
