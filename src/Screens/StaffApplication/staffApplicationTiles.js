import React, { useState, useEffect } from 'react';
import TileApplication from '../../Components/TileApplication';
import style from './index.module.scss';
import { GET } from './../../Screens/dataSaver';

const StaffApplicationTiles = ({ getSelectedTab, selectedTab }) => {
  const [counts, setCounts] = useState({
    approved: 0,
    applicationsUnderReview: 0,
    applicantsToProcess: 0,
    rejected: 0,
    clarificationsRequired: 0
  });

  const getTitleCounts = async () => {
    await GET('application-management-service/application/workflowUser/meta')
      .then(response => {
        setCounts(response?.data);
      })
      .catch(error => {
        console.log('error', error);
      })
  };

  useEffect(() => {
    getTitleCounts();
  }, []);

  return (
    <div className={`${style.tabs}`}>
      <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="Completed Applications" tileCount={counts.applicantsToProcess} currentTile="applicantsToProcess" />
      <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="Applications Under Review" tileCount={counts.applicationsUnderReview} currentTile="applicationsUnderReview" />
      <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="Clarifications Required" tileCount={counts.clarificationsRequired} currentTile="clarificationsRequired" />
      <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="Approved Applicants" tileCount={counts.approved} currentTile="approved" />
      {/* <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="Staff Reappointment" tileCount={0} currentTile="staffReappointment" /> */}

    </div>
  )
}

export default StaffApplicationTiles;
