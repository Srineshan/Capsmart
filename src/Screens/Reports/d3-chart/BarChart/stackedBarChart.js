import React, { useState, useEffect, useRef } from "react";
import {
  select,
  scaleBand,
  axisBottom,
  axisLeft,
  scaleLinear,
  stack,
  max
} from "d3";

const StackedBarChart = ({ datasets, keys, colors }) => {
  const [data, setData] = useState(datasets);
  const svgRef = useRef();
  const wrapperRef = useRef();

  useEffect(()=>{
    setData(datasets);
  },[datasets])

  useEffect(() => {
    const svg = select(svgRef.current);
    const { width, height } = wrapperRef.current.getBoundingClientRect();
    const stackGenerator = stack().keys(keys);
    const layers = stackGenerator(data);
    const extent = [
      0,
      max(layers, (layer) => max(layer, (sequence) => sequence[1]))
    ];
    const yScale = scaleLinear().domain(extent).range([height, 0]);

    const x0Scale = scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, width])
      .padding(0.46);

    const x1Scale = scaleBand()
      .domain(data.map((d) => d.type))
      .rangeRound([0, x0Scale.bandwidth()])
      .padding(0.12);

    const xAix = axisBottom(x0Scale);
    const yAix = axisLeft(yScale);

    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAix);
    svg
      .select(".y-axis")
      .attr("transform", `translate(${0 + 25}, 0 )`)
      .call(yAix);

    svg
      .selectAll(".layer")
      .data(layers)
      .join("g")
      .attr("class", "layer")
      .attr("fill", (layer) => colors[layer.key])
      .selectAll("rect")
      .data((layer) => layer)
      .join("rect")
      .attr(
        "x",
        (sequence) => x0Scale(sequence.data.name) + x1Scale(sequence.data.type)
      )
      .attr("width", x1Scale.bandwidth())
      .attr("y", (sequence) => yScale(sequence[1]))
      .attr("height", (sequence) => yScale(sequence[0]) - yScale(sequence[1]));

    // svg
    //   .select(".x-axis")
    //   .selectAll(".tick")
    //   .on("click", (e) => {
    //     const filteredD = data.map((d) => {
    //       return {
    //         name: d.name,
    //         Done: d.name === e ? 0 : d.Done,
    //         ToDo: d.name === e ? 0 : d.ToDo,
    //         NotDone: d.name === e ? 0 : d.NotDone
    //       };
    //     });
    //     setData(filteredD);
    //   });
  }, [data, keys, colors]);

  return (
    <>
      <div
        ref={wrapperRef}
        style={{ width: "100%", height: "200px", marginBottom: "2rem" }}
      >
        <svg ref={svgRef} style={{ width: "100%", height: "110%" }}>
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      </div>
    </>
  );
};

export default StackedBarChart;
