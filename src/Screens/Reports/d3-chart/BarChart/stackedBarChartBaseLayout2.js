import React, { useState } from "react";
import StackedBarChart from "./stackedBarChart";

const data = [
  {
    name: "Medical Services",
    type: 1,
    Actual: 30,
    ToComplete: 45,
  },
  {
    name: "Administrative Services",
    type: 1,
    Actual: 20,
    ToComplete: 45,
  },
  {
    name: "Supplemental Services",
    type: 1,
    Actual: 40,
    ToComplete: 45,
  },
];

const allKeys = ["Actual", "ToComplete"];

const colors = {
  Actual: "#1DD174",
  ToComplete: "#E0E3E7",
};

const StackedBarChartBaseLayout2 = () => {
  const [keys, setKeys] = useState(allKeys);

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

export default StackedBarChartBaseLayout2;  