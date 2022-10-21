import React, { useState } from "react";
import StackedBarChart from "./stackedBarChart";

const data = [
  {
    name: "POD 1",
    type: 1,
    Compliant: 20,
    ComplianceInprogress: 15,
    NonCompliant: 30
  },
  {
    name: "POD 2",
    type: 1,
    Compliant: 15,
    ComplianceInprogress: 25,
    NonCompliant: 30
  },
  {
    name: "POD 3",
    type: 1,
    Compliant: 10,
    ComplianceInprogress: 25,
    NonCompliant: 20
  },
  {
    name: "POD 4",
    type: 1,
    Compliant: 20,
    ComplianceInprogress: 15,
    NonCompliant: 30
  },
  {
    name: "POD 5",
    type: 1,
    Compliant: 15,
    ComplianceInprogress: 25,
    NonCompliant: 30
  },
  {
    name: "POD 6",
    type: 1,
    Compliant: 10,
    ComplianceInprogress: 25,
    NonCompliant: 20
  },
  {
    name: "POD 7",
    type: 1,
    Compliant: 20,
    ComplianceInprogress: 15,
    NonCompliant: 30
  },
  {
    name: "POD 8",
    type: 1,
    Compliant: 15,
    ComplianceInprogress: 25,
    NonCompliant: 30
  },
  {
    name: "POD 9",
    type: 1,
    Compliant: 10,
    ComplianceInprogress: 25,
    NonCompliant: 20
  },
  {
    name: "POD 10",
    type: 1,
    Compliant: 10,
    ComplianceInprogress: 25,
    NonCompliant: 20
  },
];

const allKeys = ["Compliant", "ComplianceInprogress", "NonCompliant"];

const colors = {
    Compliant: "#1DD174",
    ComplianceInprogress: "#FFD950",
    NonCompliant: "#F46044"
};

const StackedBarChartBaseLayout3 = () => {
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

export default StackedBarChartBaseLayout3;  