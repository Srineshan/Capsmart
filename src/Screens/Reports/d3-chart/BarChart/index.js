import React, { useState } from "react";
import { GroupedBarChart } from "./groupedBarChart";

const data1 = [
  {
    name: "Medical/ surgical Care",
    type: 1,
    Done: 10,
  },
  {
    name: "Medical/ surgical Care",
    type: 2,
    ToDo: 20,
  },
  {
    name: "Medical/ surgical Care",
    type: 3,
    NotDone: 30,
  },
  {
    name: "Administrative",
    type: 1,
    Done: 20,
  },
  {
    name: "Administrative",
    type: 2,
    ToDo: 10,
  },
  {
    name: "Administrative",
    type: 3,
    NotDone: 30,
  },
  {
    name: "Supplemental",
    type: 1,
    Done: 30,
  },
  {
    name: "Supplemental",
    type: 2,
    ToDo: 5,
  },
  {
    name: "Supplemental",
    type: 3,
    NotDone: 20,
  },
];

const allKeys = ["Done", "ToDo", "NotDone"];

const colors = {
  Done: "#1DD174",
  ToDo: "#FFD950",
  NotDone: "#F46044"
};

const BarChart = ({data}) => {
  const [keys, setKeys] = useState(allKeys);
  console.log('Bar Data',data,data1);

  return (
    <div>
      <GroupedBarChart datasets={data} colors={colors} keys={keys} />
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

export default BarChart;
