import React, {useState} from "react";
import * as d3 from "d3";
import { color } from "d3";

const Arc = ({ data, index, createArc, colors, format }) => (
  <g key={index} className="arc">
    <path className="arc" d={createArc(data)} fill={colors[index]} />
    {/* <text
      transform={`translate(${createArc.centroid(data)})`}
      textAnchor="middle"
      fill="white"
      fontSize="10"
    >
      {format(data.value)}
    </text> */}
  </g>
);

const Legend = ({ index, colors, data, format }) => (
  <g key={index} className="legend">
    <circle cx={index * 80 + 10} cy="10" r="7" fill={colors[index]} />
    <text
      y="14"
      x={index * 80 + 22}
      fill="black"
      fontSize="10"
    >
      {data.data.key}
    </text>
  </g>
);

const Pie = (props) => {

  const createPie = d3
    .pie()
    .value((d) => d.value)
    .sort(null);

  const createArc = d3
    .arc()
    .innerRadius(props.innerRadius)
    .outerRadius(props.outerRadius);

  const colors = ["#1DD174", "#FFD950", "#F46044"];
  const format = d3.format(".2f");
  const data = createPie(props.data);
  console.log('data',data);

  return (
    <div >
      <svg width={props.width} height={props.height} id="outer" style={{'margin-top':'50px'}}>
        <g transform={`translate(${props.outerRadius} ${props.outerRadius})`}>
          {data.map((d, i) => (
            <>
              <Arc
                key={i}
                index={i}
                data={d}
                createArc={createArc}
                colors={colors}
                format={format}
              />
            </>
          ))}
        </g>
      </svg>
      <svg width={250} height={20} id="inner" >
       {data?.map((data, index) => (
         <Legend
           key={index}
           index={index}
           colors={colors}
           format={format}
           data={data}
         />
       ))}
     </svg>
    </div>
  );
};

export default Pie;
