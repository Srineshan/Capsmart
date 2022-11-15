import React, { useState, useEffect } from "react";
import StackedBarChart from "./stackedBarChart";

// const data = [
//   {
//     name: "Feb",
//     type: 1,
//     Done: 30,
//     ToDo: 45,
//     NotDone: 60
//   },
//   {
//     name: "March",
//     type: 1,
//     Done: 30,
//     ToDo: 45,
//     NotDone: 60
//   },
//   {
//     name: "April",
//     type: 1,
//     Done: 30,
//     ToDo: 45,
//     NotDone: 60
//   },
//   {
//     name: "May",
//     type: 1,
//     Done: 30,
//     ToDo: 45,
//     NotDone: 60
//   },
//   {
//     name: "June",
//     type: 1,
//     Done: 30,
//     ToDo: 45,
//     NotDone: 60
//   },
//   {
//     name: "July",
//     type: 1,
//     Done: 30,
//     ToDo: 45,
//     NotDone: 60
//   },
//   {
//     name: "Aug",
//     type: 1,
//     Done: 30,
//     ToDo: 45,
//     NotDone: 60
//   },
//   {
//     name: "Sep",
//     type: 1,
//     Done: 30,
//     ToDo: 45,
//     NotDone: 60
//   }
// ];

// const allKeys = ["Done", "ToDo", "NotDone"];
const allKeys = ['Medical / Surgical Care Contracted Services','Supplemental Services'];

const colors = {
  'Medical / Surgical Care Contracted Services':'#938AED',
  'Supplemental Services':"#3B30AA"
  // Done: "#938AED",
  // ToDo: "#3B30AA",
  // NotDone: "#0C0555"
};

const StackedBarChartBaseLayout = ({chartData}) => {
  const [keys, setKeys] = useState(allKeys);
  const [data,setData] = useState(chartData);

  useEffect(()=>{
    setData(chartData);
  },[])

  useEffect(()=>{
    setData(chartData);
  },[chartData])

  return (
    <div>
      <StackedBarChart datasets={data} colors={colors} keys={keys} />
      <div className="fields" style={{ display: "flex" }}>
        {allKeys.map((key) => (
          <div key={key} className="field" style={{ display: "flex" }}>
            <input
              id={key}
              type="checkbox"
              checked={keys.includes(key)}
              onChange={(e) => {
                if (e.target.checked) {
                  setKeys(Array.from(new Set([...keys, key])));
                } else {
                  setKeys(keys.filter((_key) => _key !== key));
                }
              }}
            />
            <label htmlFor={key} style={{ color: colors[key], paddingLeft: 10, paddingRight: 20}}>
              {key}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StackedBarChartBaseLayout;
