import React, { useState, useEffect } from "react";
import TileApplication from "../../../Components/TileApplication";
import style from "./index.module.scss";

const DepartmentServiesAreaTab = ({ getSelectedTab, selectedTab }) => {
  return (
    <div className={`${style.tabs}`}>
      <TileApplication
        selectedTab={selectedTab}
        getSelectedTab={getSelectedTab}
        tileLabel="Department/Services Area Specific Priviliges"
        tileCount={1}
        currentTile="permanentStaff"
      />
    </div>
  );
};

export default DepartmentServiesAreaTab;
