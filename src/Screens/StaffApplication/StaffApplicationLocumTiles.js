import React, { useEffect, useState } from 'react';
import TileApplication from '../../Components/TileApplication';
import style from './index.module.scss';
import { GET } from './../../Screens/dataSaver';
import LoadingScreen from "../../Components/LoadingScreen";

const StaffApplicationLocumTiles = ({totalCount}) => {
  const [totalCountLocum, setTotalCountLocum] = useState(0);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [selectedTab, setSelectedTab] = useState("LocumRenewalsExpired");

  const applicationType = sessionStorage.getItem('applicationCreationType') || 'NEW';
  const workModeType = sessionStorage.getItem('workModeType');

  console.log("totalCount",totalCount?.totalCount)

  // useEffect(() => {
  //   if (applicationType === "LOCUM") {
  //     fetchLocumData();
  //   }
  // }, [applicationType]);

  // const fetchLocumData = async () => {
  //   try {
  //     setIsLoadingImage(true);
  //     const response = await GET(`application-management-service/staff`);
  //     setTotalCountLocum(response?.data?.numberOfElements || 0);
  //   } catch (error) {
  //     console.error("Error fetching locum applications:", error);
  //   } finally {
  //     setIsLoadingImage(false);
  //   }
  // };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };
  

  return (
    <div className={style.tabs}>
      {isLoadingImage && (
        <div className={style.loadingOverlay}>
          <LoadingScreen />
        </div>
      )}

      {workModeType === "Department Head" && applicationType === "LOCUM" && (
        <TileApplication 
          selectedTab={selectedTab}
          getSelectedTab={handleTabClick}
          tileLabel="Expired Renewals to Review"
          tileCount={totalCount}
          currentTile="LocumRenewalsExpired"
        />
      )}
    </div>
  );
};

export default StaffApplicationLocumTiles;
