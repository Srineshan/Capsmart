import React, { useState, useEffect } from "react";
import style from "./../index.module.scss";

const ApplicantSideBar = ({
  applicantType,   // array of site/applicant type name strings
  siteType,        // array of site type subtext strings e.g. "Hospital / Acute Care Facility"
  siteTitle,
  onSelectSite,
  siteDropdown,
  selectedTile,
  tileType,
  sideBarList,     // full raw objects — used for id lookup and count badge
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (sideBarList && sideBarList.length > 0) {
      selectedTile(sideBarList[activeIndex]?.id);
    }
  }, [activeIndex, sideBarList]);

  const handleSiteClick = (index, site) => {
    setActiveIndex(index);
    onSelectSite(site);
    if (sideBarList) {
      selectedTile(sideBarList[index]?.id);
    }
  };

  const sideBarClass =
    tileType === "PrivilegeListManager"
      ? `${style.sideBar} ${style.privilegeManagerHeight}`
      : style.sideBar;

  return (
    <div className={sideBarClass}>

      {/* "All Sites" header label — XD image 2 & 3 */}
      <p className={style.sideBarHeaderLabel}>All Sites</p>

      {applicantType.map((site, index) => {
        // Count: number of applicantType rows belonging to this sidebar tile
        // sideBarList[index].count if API provides it, otherwise 0
        const count =
          sideBarList?.[index]?.count ??
          sideBarList?.[index]?.applicantTypeCount ??
          sideBarList?.[index]?.total ??
          0;

        // Site type subtext e.g. "Hospital / Acute Care Facility (ACP) site type"
        const subText = siteType?.[index] || "";

        return (
          <div
            key={index}
            className={`${style.sidebarContent} ${
              index === activeIndex
                ? style.sideActiveBackground
                : style.sideNonActiveBackground
            }`}
            onClick={() => handleSiteClick(index, site)}
          >
            <div className={style.siteDetails}>
              {/* Site name */}
              <p className={style.siteName}>{site}</p>
              {/* Count badge — XD image 2 & 3 (shows 0 or actual count) */}
              <div className={style.siteCount}>{count}</div>
            </div>
            {/* Site type subtext — XD image 2 */}
            {subText && (
              <p className={style.siteType}>{subText}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ApplicantSideBar;