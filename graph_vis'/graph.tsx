import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import './graph.css';
import TableWithTicker from './tickertable';
import Slider from './slider'
import Button from './control_buttons/control_button';
import Readout from './readout/readout';

interface NeuralNetworkVisualizationProps {
  darkMode: boolean;
}

interface Node {
  id: string;
  value: number;
  activation: number;
}

interface Link {
  source: string;
  target: string;
}

interface Data {
  layers: {
    nodes: Node[];
    links: Link[];
  }[];
}

const generateRandomValues = (length: number) => {
  return Array.from({ length }, () => Math.random());
};

// Type guard function to check if the received data matches the Data interface
function isValidData(data: any): data is Data {
  if (!data || !Array.isArray(data.layers)) {
    return false;
  }
  for (const layer of data.layers) {
    if (!layer || !Array.isArray(layer.nodes) || !Array.isArray(layer.links)) {
      return false;
    }
    for (const node of layer.nodes) {
      if (!node || typeof node.id !== 'string' || typeof node.value !== 'number' || typeof node.value !== 'number') {
        return false;
      }
    }
    for (const link of layer.links) {
      if (!link || typeof link.source !== 'string' || typeof link.target !== 'string') {
        return false;
      }
    }
  }
  return true;
}

const NeuralNetworkVisualization: React.FC<NeuralNetworkVisualizationProps> = ({ darkMode }) => {
  const [output, setOutput] = useState<Data>({ layers: [] });
  const graphRef = useRef<SVGSVGElement | null>(null);
  const radius = 20;
  const width = 300;
  const height = 300;

  const [LRsliderValue, setLRSliderValue] = useState<number>(0);
  const [enablers, setEnablers] = useState<boolean[]>([true,true,true,true]);
  const [INsliderValue, setINSliderValue] = useState<number>(1);
  const [ONsliderValue, setONSliderValue] = useState<number>(1);
  const [EPsliderValue, setEPSliderValue] = useState<number>(1);
  const [HLsliderValue, setHLSliderValue] = useState<number>(0);

  useEffect(() => {
    const executeCppProgram = async () => {
      try {
        const inputData = {
          topology: '3 2 1',
          in: generateRandomValues(3).join(' '),
          out: "0.1"
        };
        const response = await fetch('http://localhost:3001/graph', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputData }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        };
        const result = await response.json();
        // Check if the received data matches the expected structure
        if (isValidData(JSON.parse(result.result))) {
          setOutput(JSON.parse(result.result));
        } else {
          console.error('Invalid data format received from the server');
        }
      } catch (error) {
        console.error('Error executing C++ program:', error);
        // Handle error: Show error message to the user or retry fetching
      }
    };
    const intervalTime = 1E3 ; // 1 second
    const intervalId = setInterval(executeCppProgram, intervalTime); // Call fetchData every 5 seconds
    return () => clearInterval(intervalId);
  }, []); // Run once on component mount

  useEffect(() => {

    if (graphRef.current && output && output.layers) {
      const layerWidth = width / output.layers.length;

      const svg = d3.select(graphRef.current);

      // Remove existing nodes and links
      svg.selectAll('.node, .link').remove();

      const maxNodes = d3.max(output.layers, (layer) => layer.nodes.length) || 0;

      // Draw links
      output.layers.forEach((layer, layerIndex) => {
        if (layerIndex < output.layers.length - 1) {
          const targetLayer = output.layers[layerIndex + 1];
          const numNodesInLayer = layer.nodes.length;
          const numNodesInNextLayer = targetLayer.nodes.length;
          const thisVerticalOffset = (maxNodes - numNodesInLayer) / 2;
          const nextVerticalOffset = (maxNodes - numNodesInNextLayer) / 2;
          layer.nodes.forEach((sourceNode) => {
            targetLayer.nodes.forEach((targetNode) => {
              svg
                .append('line')
                .attr('class', 'link')
                .attr('x1', 1.5 * radius + (layerWidth * layerIndex) + (layerWidth - radius) / 2)
                .attr('y1', radius + (height / maxNodes / 2 - radius) + (parseInt(sourceNode.id) + thisVerticalOffset) * height / maxNodes)
                .attr('x2', layerWidth - radius / 2 + (layerWidth * layerIndex) + (layerWidth - radius) / 2)
                .attr('y2', radius + (height / maxNodes / 2 - radius) + (parseInt(targetNode.id) + nextVerticalOffset) * height / maxNodes);
            });
          });
        }
      });

      // Draw nodes
      output.layers.forEach((layer, layerIndex) => {
        const nodes = svg
          .selectAll(`.node-layer-${layerIndex}`)
          .data(layer.nodes)
          .enter()
          .append('g')
          .attr('class', `node node-layer-${layerIndex}`)
          .attr('transform', (d) => {
            const verticalOffset = (maxNodes - layer.nodes.length) / 2;
            return `translate(${radius / 2 + (layerWidth * layerIndex) + (layerWidth - radius) / 2},${radius + (height / maxNodes / 2 - radius) + (parseInt(d.id) + verticalOffset) * height / maxNodes})`;
          });

        nodes
          .append('circle')
          .attr('r', radius)
          .style('fill', (d) => (darkMode ? `rgba(0, 255, 0, ${d.activation**2})` : `rgba(0, 0, 255, ${d.activation**2})`));

        // Display node values
        nodes
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'middle')
          .text((d) => d.value.toFixed(2))
          .style('fill', (d) => {
            const bw = Math.round(255 * ( (d.activation) > 0.75?Number(!darkMode):Number(darkMode)));
            return `rgba(${bw},${bw},${bw},1)`;
          })
          .attr('transform', (d) => {
            const verticalOffset = (maxNodes - layer.nodes.length) / 2;
            return `translate(0,4)`;
          });
        
 
      });
    }
  }, [output, darkMode]);

  return (
    <div className={`content-object ${darkMode?"dark":"light"}`}>
      <div className={`user-interface ${darkMode?"dark":"light"}`}>
        <div className="top-row">
        <div className="sliders">
        <div className="ui-row">
        <div className ="sliders-section">
        <Slider   min={0}
                  max={1}
                  steps={10}
                  title={"Learn Rate"}
                  darkMode={darkMode}
                  value={LRsliderValue}
                  onChange={setLRSliderValue}
                  enablers={enablers}
                  setEnablers={setEnablers}
                  negatedEnablers={[]}
                  lockable={true}
                />
        <Slider   min={1}
                  max={5}
                  steps={4}
                  title={"Input Nodes"}
                  darkMode={darkMode}
                  value={INsliderValue}
                  onChange={setINSliderValue}
                  enablers={enablers}
                  setEnablers={setEnablers}
                  negatedEnablers={[1,3]}
                  lockable={false}
                />
        <Slider   min={1}
                  max={5}
                  steps={4}
                  title={"Output Nodes"}
                  darkMode={darkMode}
                  value={ONsliderValue}
                  onChange={setONSliderValue}
                  enablers={enablers}
                  setEnablers={setEnablers}
                  negatedEnablers={[1,3]}
                  lockable={false}
                />
        <Slider   min={1}
                  max={100}
                  steps={99}
                  title={"Epoch"}
                  darkMode={darkMode}
                  value={EPsliderValue}
                  onChange={setEPSliderValue}
                  enablers={enablers}
                  setEnablers={setEnablers}
                  negatedEnablers={[]}
                  lockable={false}
                />
        <Slider   min={0}
                  max={5}
                  steps={5}
                  title={"Hidden Layers"}
                  darkMode={darkMode}
                  value={HLsliderValue}
                  onChange={setHLSliderValue}
                  enablers={enablers}
                  setEnablers={setEnablers}
                  negatedEnablers={[1,3]}
                  lockable={true}
                />  
        <Readout/>
        </div>
        <div className='action-buttons'>
          <Button
          onClick={null}
          header="Train"
          subtext="Backprop"
          darkMode={darkMode}
          enabled={enablers[0]}
          />
          <Button
          onClick={null}
          header="Regularize"
          subtext="Lasso / Ridge / Elastic Net"
          darkMode={darkMode}
          enabled={enablers[1]}
          />
          <Button
          onClick={null}
          header="Tune"
          subtext="Hyperparameters"
          darkMode={darkMode}
          enabled={enablers[2]}
          />  
          <Button
          onClick={null}
          header="Predict"
          subtext="Feed Forward"
          darkMode={darkMode}
          enabled={enablers[3]}
          />
          </div>
        </div>   
          <TableWithTicker
                  title={"Nodes/Layer"}
                  n={HLsliderValue}
                  darkMode={darkMode}
                  enablers={enablers}
                  setEnablers={setEnablers}
          />
        </div>
        </div>
      </div>
      <div className={`neural-network-frame ${darkMode?"dark":"light"}`}>  
        <div className="middle-maker"></div>    
        <svg ref={graphRef} 
             className={`neural-network-visualization ${darkMode ? 'dark-mode' : 'light-mode'}`} 
             width={width} 
             height={height}
             style={{
              scale:'100%'
             }} />
        <div className="middle-maker"></div>
      </div>
    </div>
  );
};

export default NeuralNetworkVisualization;
