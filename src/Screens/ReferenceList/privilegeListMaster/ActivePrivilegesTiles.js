import React, { useState, useEffect } from "react";
import TileApplication from "../../../Components/TileApplication";
import style from "./index.module.scss";
// import { GET } from "../dataSaver";

const ActivePrivilegesTiles = ({ getSelectedTab, selectedTab }) => {
  return (
    <div className={`${style.tabs}`}>
      <TileApplication
        selectedTab={selectedTab}
        getSelectedTab={getSelectedTab}
        tileLabel="Active Privileges"
        tileCount={1}
        currentTile="permanentStaff"
      />
      <TileApplication
        selectedTab={selectedTab}
        getSelectedTab={getSelectedTab}
        tileLabel="Retired Privileges"
        tileCount={1}
        currentTile="provisionalStaff"
      />
    </div>
  );
};

export default ActivePrivilegesTiles;
