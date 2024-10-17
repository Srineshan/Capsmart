import React, { useState, useEffect } from "react";
import TileApplication from "../../Components/TileApplication";
import style from "./index.module.scss";
import { GET } from "./../../Screens/dataSaver";

const StaffApplicationTiles = ({ getSelectedTab, selectedTab }) => {
  const [counts, setCounts] = useState({
    chiefOfStaff: 0,
    credentialingCommittee: 0,
    mac: 0,
    bod: 0,
    // "level-1": 0,
  });

  // const [selectedTab, setSelectedTab] = useState('applicantsToProcess');

  const getTitleCounts = async () => {
    await GET("application-management-service/application/workflowUser/meta")
      .then((response) => {
        setCounts(response?.data);
        var str = JSON.stringify(response?.data);
        console.log("titlesssss" + str);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    getTitleCounts();
  }, []);

  // const handleTileClick = (tile) => {
  //   setSelectedTab(tile);
  //   if (getSelectedTab) {
  //     getSelectedTab(tile);
  //   }
  // };

  return (
    <div className={`${style.tabs}`}>
      <TileApplication
        selectedTab={selectedTab}
        getSelectedTab={getSelectedTab}
        tileLabel="Applicants to Verify"
        tileCount={counts?.applicantsToProcess || 0}
        currentTile="applicantsToProcess"
      />
      <TileApplication
        selectedTab={selectedTab}
        getSelectedTab={getSelectedTab}
        tileLabel="Cred. Comm."
        // tileCount={counts["level-1"] || 0}
        currentTile="level-1"
      />
      <TileApplication
        selectedTab={selectedTab}
        getSelectedTab={getSelectedTab}
        tileLabel="MAC"
        tileCount={counts?.mac}
        currentTile="mac"
      />
      <TileApplication
        selectedTab={selectedTab}
        getSelectedTab={getSelectedTab}
        tileLabel="BOD"
        tileCount={counts?.bod}
        currentTile="bod"
      />
      <TileApplication
        selectedTab={selectedTab}
        getSelectedTab={getSelectedTab}
        tileLabel="Clarifications"
        tileCount={counts?.clarificationsRequired}
        currentTile="clarificationsRequired"
      />
      <TileApplication
        selectedTab={selectedTab}
        getSelectedTab={getSelectedTab}
        tileLabel="Rejected/Declined"
        tileCount={counts?.rejected}
        currentTile="rejected"
      />
    </div>
  );
};

export default StaffApplicationTiles;
