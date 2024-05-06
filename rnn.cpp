#include <iostream>
#include <vector>
#include <sstream>
#include <string>
#include <stdexcept>
#include <ctime>
#include <cstdlib>
#include <cmath>

using namespace std;

// Define the activation function (sigmoid)
double sigmoid(double x) {
    return 1 / (1 + exp(-x));
}

// Define the derivative of the activation function
double sigmoidDerivative(double x) {
    double s = sigmoid(x);
    return s * (1 - s);
}

// Define the data structures for neural network layers and activations
struct NeuronData {
    string id;
    double value;
    double activation;
};

struct LayerData {
    vector<NeuronData> nodes;
    vector<pair<string, string>> links;
};

struct ActivationData {
    vector<LayerData> layers;
};

// Define the feedforward neural network function
void feedforward(ActivationData& activationData, const vector<double>& inputVals, const vector<vector<double>>& weights, const vector<double>& biases) {
    // Set input values
    for (size_t i = 0; i < inputVals.size(); ++i) {
        activationData.layers[0].nodes[i].value = inputVals[i];
    }

    size_t numLayers = activationData.layers.size(); // Including input layer

    for (size_t i = 1; i < numLayers; ++i) {
        size_t numNodesInLayer = activationData.layers[i].nodes.size();
        size_t numNodesInPrevLayer = activationData.layers[i - 1].nodes.size();

        for (size_t j = 0; j < numNodesInLayer; ++j) {
            double sum = 0.0; // Initialize sum to zero

            // Calculate weighted sum of inputs
            for (size_t k = 0; k < numNodesInPrevLayer; ++k) {
                sum += weights[i - 1][j * numNodesInPrevLayer + k] * activationData.layers[i - 1].nodes[k].activation;
            }

            // Add bias
            sum += biases[i - 1];
            
            // Update neuron's value
            activationData.layers[i].nodes[j].activation = sigmoid(sum); // Update neuron's value
            activationData.layers[i].nodes[j].value = sum;
        }
    }
}

// Define the backpropagation neural network function
void backpropagation(const ActivationData& activationData, const vector<double>& target, vector<vector<double>>& weights, vector<double>& biases, double learningRate) {
    size_t numLayers = activationData.layers.size();
    size_t outputLayerIndex = numLayers - 1;

    // Compute output layer delta
    const LayerData& outputLayer = activationData.layers[outputLayerIndex];
    for (size_t i = 1; i < outputLayer.nodes.size(); ++i) {
        double output = outputLayer.nodes[i].activation;
        double error = (target[i] - output) * sigmoidDerivative(output);
        bool weightDeltasDefined = false;
        for (size_t j = 0; j < weights[outputLayerIndex].size(); ++j) {
            if (!weightDeltasDefined) {
                weights[outputLayerIndex][j] = learningRate * error * activationData.layers[i - 1].nodes[j % outputLayer.nodes.size()].activation; // Initialize weight deltas for output layer
                weightDeltasDefined = true; // Set the flag to true
            } else {
                weights[outputLayerIndex][j] += learningRate * error * activationData.layers[i - 1].nodes[j % outputLayer.nodes.size()].activation; // Update weight deltas for output layer
            }
        }
        // Update bias deltas for output layer
        biases[outputLayerIndex] += learningRate * error;
    }
    // Backpropagate the error for hidden layers
    for (int i = outputLayerIndex - 1; i > 0; --i) {
        const LayerData& layer = activationData.layers[i];
        const LayerData& nextLayer = activationData.layers[i + 1];
        for (size_t j = 0; j < layer.nodes.size(); ++j) {
            double errorSum = 0.0;
            for (size_t k = 0; k < nextLayer.nodes.size(); ++k) {
                errorSum += weights[i][k * layer.nodes.size() + j] * sigmoidDerivative(layer.nodes[j].activation) * nextLayer.nodes[k].activation;
            }
            for (size_t k = 0; k < layer.nodes.size(); ++k) {
                // Update weight deltas for hidden layers
                weights[i][j * layer.nodes.size() + k] += learningRate * errorSum * layer.nodes[k].activation;
            }
            // Update bias deltas for hidden layers
            biases[i] += learningRate * errorSum;
        }
    }
}

// Function to initialize weights and biases randomly
void initializeWeightsAndBiases(const vector<int>& topology, vector<vector<double>>& weights, vector<double>& biases) {
    weights.clear();
    biases.clear();

    for (size_t i = 1; i < topology.size(); ++i) {
        vector<double> layerWeights;
        for (size_t j = 0; j < topology[i] * topology[i - 1]; ++j) {
            // Initialize weights randomly between -1 and 1
            double weight = (double)rand() / RAND_MAX * 2 - 1;
            layerWeights.push_back(weight);
        }
        weights.push_back(layerWeights);

        // Initialize biases randomly between -1 and 1
        double bias = (double)rand() / RAND_MAX * 2 - 1;
        biases.push_back(bias);
    }
}

// Main function to run the neural network
ActivationData runNeuralNetwork(const vector<vector<double>>& inputSequences, const vector<double>& target, const vector<int>& topology, int epochs, double learningRate) {
    ActivationData activationData;

    // Define weights and biases
    vector<vector<double>> weights;
    vector<double> biases;

    initializeWeightsAndBiases(topology, weights, biases);

    // Process input sequences
    for (size_t i = 0; i < inputSequences.size(); ++i) {
        feedforward(activationData, inputSequences[i], weights, biases); // Feedforward pass
        backpropagation(activationData, target, weights, biases, learningRate); // Backpropagation
    }

    return activationData;
}

int main(int argc, char* argv[]) {
    // Define topology, input sequences, target output, and hyperparameters
    vector<int> topology = {3, 2, 1}; // Example topology for an RNN
    vector<vector<double>> inputSequences = {{0.1, 0.2, 0.3}, {0.4, 0.5, 0.6}, {0.7, 0.8, 0.9}}; // Example input sequences
    vector<double> target = {0.5}; // Example target output
    int epochs = 1000; // Number of epochs for training
    double learningRate = 0.1; // Learning rate

    // Run the neural network
    ActivationData activationData = runNeuralNetwork(inputSequences, target, topology, epochs, learningRate);

    // Print activation data
    printActivationData(activationData);

    return 0;
}
