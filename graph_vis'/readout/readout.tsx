import './readout.css'
import ReadoutMetric from './readout_metric'

interface readoutProps {

}

export default function Readout() {
    return (
        <div className="readout">
                <ReadoutMetric
                title="MSE"
                value={"value"}
                />
                <div className="readout-metric">
                    <h1>MSE</h1>
                    <a>{"value"}</a>
                </div>
                <div className="readout-metric">
                    <h1>MSE</h1>
                    <a>{"value"}</a>
                </div>
                <div className="readout-metric">
                    <h1>MSE</h1>
                    <a>{"value"}</a>
                </div>
        </div>
    )
}