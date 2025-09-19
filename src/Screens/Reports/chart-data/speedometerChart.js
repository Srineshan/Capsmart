import ReactSpeedometer from "react-d3-speedometer"


const SpeedometerChart = ({ value, minValue, maxValue, width, height, ringWidth, needleColor, textColor, startColor, endColor, labelFontSize, segments, valueTextFontSize }) => {
    return (
        <ReactSpeedometer width={width} height={height || 'auto'} value={value} minValue={minValue} maxValue={maxValue} forceRender={true} needleHeightRatio={0.5} ringWidth={ringWidth} needleColor={needleColor} textColor={textColor} startColor={startColor} endColor={endColor} segments={segments} labelFontSize={labelFontSize} valueTextFontSize={valueTextFontSize} />
    )
}

export default SpeedometerChart;