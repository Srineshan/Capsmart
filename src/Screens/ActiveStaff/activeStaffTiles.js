import React, { useState, useEffect } from 'react';
import TileApplication from '../../Components/TileApplication';
import style from './index.module.scss';
import { GET,POST } from './../../Screens/dataSaver';

const ActiveStaffTiles = ({ getSelectedTab, selectedTab, reFetchMetaData, setReFetchMetaData }) => {
  const [counts, setCounts] = useState({
    LOCUM_STAFF: 0,
    PERMANENT_STAFF: 0,
    PROVISIONAL: 0,
  });

  useEffect(() => {
    getTitleCounts();
  }, []);

  useEffect(() => {
    if (reFetchMetaData === true) {
      getTitleCounts();
    }
  }, [reFetchMetaData])

  const getTitleCounts = async () => {
    await POST('application-management-service/staff/meta')
      .then(response => {
        setCounts(response?.data);
        var str = JSON.stringify(response?.data);
        console.log("titlesssss" + str)
        setReFetchMetaData(false)
      })
      .catch(error => {
        console.log('errorrrrrrrrrrrrrrrr', error);
      })
  };


  return (
    <div className={`${style.tabs}`}>
      <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="Full Time" tileCount={counts?.PERMANENT_STAFF} currentTile="PERMANENT" />
      <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="Locum Tennens" tileCount={counts?.LOCUM_STAFF} currentTile="LOCUM" />
      {/* <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="Temporary" tileCount={counts?.PROVISIONAL} currentTile="PROVISIONAL" /> */}
    </div>
  )
}

export default ActiveStaffTiles;
