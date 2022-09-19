import React, { useEffect } from "react";
import * as d3 from "d3";
// import "./styles.css";
import { curveCardinal } from "d3";

const LineChart = ({data}) => {
  const createGraph = async () => {
    console.log('line data',data);
    // let data = [
    //   { date: "2022-09-02", value: "1" },
    //   { date: "2022-09-05", value: "1" },
    //   { date: "2022-09-01", value: "1" },
    //   { date: "2022-09-07", value: "2" }
    // ];
    // let data =
    //   "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv";
    var parseTime = d3.timeParse("%Y-%m-%d");

    data.forEach((d) => {
      d.date = parseTime(d.date);
      d.value = +d.value;
    });


    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 20, bottom: 50, left: 70 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
      .select("#line-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    var padding = 0;
    // var xScale = d3
    //   .scaleLinear()
    //   .domain([
    //     d3.min(data, function (d) {
    //       return d[0];
    //     }),
    //     d3.max(data, function (d) {
    //       return d[0];
    //     })
    //   ])
    //   .range([padding, width - padding * 2]);

    // var xAxis = d3.axisBottom(xScale).ticks(10).tickSize(-height, 10, 10);

    // add X axis and Y axis
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    x.domain(
      d3.extent(data, (d) => {
        return d.date;
      })
    );
    y.domain([
      0,
      d3.max(data, (d) => {
        return d.value;
      })
    ]);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // svg.append("g").call(d3.axisLeft(y));

    // svg
    //   .append("g")
    //   .attr("class", "axis") //assign "axis" class
    //   .attr("transform", "translate(0," + (height - padding) + ")")
    //   .call(xAxis);

    const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]).domain([0, 100]);
    // add the Line
    var valueLine = d3
      .line()
      .x((d) => {
        return x(d.date);
      })
      .y((d) => {
        return y(d.value);
      })
      .curve(curveCardinal);

    svg
      .append("path")
      .data([data])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 2)
      .attr("d", valueLine);

    // svg
    //   .append("g")
    //   .attr("class", "grid")
    //   .attr("transform", `translate(0,${height})`)
    //   .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(""));

    svg
      .append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(""));

    svg
      .selectAll("myCircles")
      .data(data)
      .enter()
      .append("circle")
      .attr("fill", "green")
      .attr("stroke", "none")
      .attr("cx", function (d) {
        return x(d.date);
      })
      .attr("cy", function (d) {
        return y(d.value);
      })
      .attr("r", 5);
  };

  useEffect(() => {
    createGraph();
  }, []);

  return <div id="line-chart" />;
};

export default LineChart;
