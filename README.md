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
