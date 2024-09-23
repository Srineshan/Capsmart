import React from "react";
import style from "./../index.module.scss";

const ApplicantTable = ({ tableHeaderValues, tableData, gridStyle }) => {
  return (
    <table style={gridStyle}>
      <thead>
        <tr>
          {tableHeaderValues.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {tableHeaderValues.map((header, colIndex) => (
              <td key={colIndex}>
                {header === "CHECKBOX" ? (
                  <input type="checkbox" />
                ) : (
                  row[header.toLowerCase()] || "-"
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ApplicantTable;
