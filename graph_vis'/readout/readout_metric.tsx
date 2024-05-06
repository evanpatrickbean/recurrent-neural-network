import './readout.css'

interface readoutMetricProps {
    title: string;
    value: string;
}

export default function ReadoutMetric(
    {title,value}:readoutMetricProps
) {

    return (

        <div className="readout-metric">
        <h1>MSE</h1>
        <a>{"value"}</a>
    </div>
    )
}
