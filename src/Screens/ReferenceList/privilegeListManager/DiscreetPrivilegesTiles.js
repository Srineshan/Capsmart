import React, { useState, useEffect } from "react";
import TileApplication from "../../../Components/TileApplication";
import style from "./index.module.scss";

const DiscreetPrivilegesTiles = ({ getSelectedTab, selectedTab }) => {
  return (
    <div className={`${style.tabs}`}>
      <TileApplication
        selectedTab={selectedTab}
        getSelectedTab={getSelectedTab}
        tileLabel="Discreet Privilege Type"
        tileCount={1}
        currentTile="permanentStaff"
      />
      <TileApplication
        selectedTab={selectedTab}
        getSelectedTab={getSelectedTab}
        tileLabel="Desecripition Privileges Type"
        tileCount={1}
        currentTile="provisionalStaff"
      />
    </div>
  );
};

export default DiscreetPrivilegesTiles;
