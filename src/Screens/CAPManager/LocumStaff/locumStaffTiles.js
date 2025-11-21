import React, { useState, useEffect } from 'react';
import TileApplication from '../../../Components/TileApplication';
import style from './index.module.scss';
import { GET } from '../../dataSaver';

const LocumStaffTiles = ({ getSelectedTab, selectedTab, reFetchMetaData, setReFetchMetaData, locumCount, locumexpireCount, locumTempPrivilegeCount, totalRequestCount, allCount }) => {
  const [counts, setCounts] = useState({
    LOCUM: 0,
    PERMANENT: 0,
    PROVISIONAL: 0,
  });
  const workModeType = sessionStorage.getItem('workModeType')

  useEffect(() => {
    getTitleCounts();
  }, []);

  useEffect(() => {
    if (reFetchMetaData === true) {
      getTitleCounts();
    }
  }, [reFetchMetaData])

  const getTitleCounts = async () => {
    await GET('application-management-service/staff/meta?status=ACTIVE&type=LOCUM&noOfDays=30&isExpired=true')
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
      <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="ACTIVE LOCUMS" tileCount={locumCount} currentTile="ACTIVELOCUM" />
      <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="PENDING LOCUMS" tileCount={locumexpireCount} currentTile="EXPIREDLOCUM" />
      <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="ALL LOCUMS" tileCount={allCount} currentTile="ALLLOCUMS" />
      {/* <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="LOCUMS WITH TEMPORARY PRIVILEGES" tileCount={locumTempPrivilegeCount} currentTile="TEMPORARYPRIVILEGEDLOCUM" /> */}
      {/* {(workModeType === "Chief Of Staff") && <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="REQUEST" tileCount={totalRequestCount} currentTile="REQUEST" />} */}
    </div>
  )
}

export default LocumStaffTiles;
