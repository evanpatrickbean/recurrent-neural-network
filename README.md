
# Recurrent Neural Network (RNN) Implementation in C++

This C++ code implements a recurrent neural network (RNN) for training and processing sequential data. The RNN architecture consists of feedforward and backpropagation algorithms for training, along with data structures to represent network layers and activations.

## Features

- Feedforward and backpropagation algorithms for training the neural network.
- Support for processing input sequences and generating target output.
- Customizable network topology and learning rate.
- Activation functions (sigmoid) for computing neuron activations and derivatives.
- Initialization of weights and biases with random values.

## Usage

1. **Define Topology**: Specify the topology of the neural network by providing the number of neurons in each layer.

2. **Provide Input Sequences**: Prepare input sequences for training the RNN. Each input sequence should be a vector of doubles.

3. **Set Target Output**: Define the target output values corresponding to the input sequences.

4. **Configure Hyperparameters**: Adjust the number of training epochs and the learning rate according to your requirements.

5. **Compile and Run**: Compile the C++ code and execute the binary with command-line arguments specifying the topology, input sequences, and target output.

## Example Command

```bash
./rnn_topology topology: 2 3 1 in: 0.1 0.2 out: 0.5
```

- `topology`: Specifies the neural network topology (e.g., 2 input neurons, 3 hidden neurons, and 1 output neuron).
- `in`: Defines the input values of the input sequence.
- `out`: Specifies the target output value.

## Server Implementation

The provided server implementation acts as an interface between a frontend application and the C++ program. It accepts HTTP POST requests with input data, communicates with the C++ program using child processes, and sends back the processed data to the client.

### Dependencies

- Express.js: For handling HTTP requests.
- Body-parser: Middleware to parse JSON request bodies.
- Child_process: Module to spawn child processes for executing the C++ program.
- Cors: Middleware for enabling Cross-Origin Resource Sharing (CORS).
- Path: Module to handle file paths.

### Example Usage

javascript
// Code snippet for setting up the server
const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

// Define route for handling POST requests
app.post('/graph', (req, res) => {
    // Implementation details...
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
```

## Frontend Visualization

The provided React component (`NeuralNetworkVisualization`) visualizes the neural network's structure using D3.js. It dynamically updates the visualization based on the output received from the server.

### Dependencies

- React: JavaScript library for building user interfaces.
- D3.js: Library for creating data visualizations in web browsers.

### Example Usage

```jsx
// Code snippet for rendering the neural network visualization component
import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';

const NeuralNetworkVisualization = () => {
    // Component implementation...
};

export default NeuralNetworkVisualization;
```

## Running the Application

- Start the backend server by running the Node.js server file (`server.js`) using `node server.js`.
- Run the React frontend application using `npm start` or `yarn start`.
- Access the application in your web browser at `http://localhost:3000`.

![image](https://github.com/evanpatrickbean/recurrent-neural-network/assets/111098769/920ad92a-0b2f-4bfc-b7e7-a1e8c6cf8ae2)
```
