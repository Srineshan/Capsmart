import React, { useState, useEffect } from "react";
import style from "./../index.module.scss";

const ApplicantSideBar = ({
  applicantType,
  siteType,
  siteTitle,
  onSelectSite,
  siteDropdown,
  selectedTile,
  tileType,
  sideBarList,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (sideBarList) {
      selectedTile(sideBarList[activeIndex]?.id);
    }
  }, [activeIndex, sideBarList]);

  const handleSiteClick = (index, site) => {
    console.log(site);

    setActiveIndex(index);
    onSelectSite(site);
  };
  console.log(applicantType);

  return (
    <div className={style.sideBar}>
      <div>
        {/* {siteDropdown ? (
          <select
            className={style.dropdown}
            onChange={(e) => onSelectSite(e.target.value)}
          >
            <option value={siteTitle}>{siteTitle}</option>
          </select>
        ) : (
          <p className={style.siteTitle}>{siteTitle}</p>
        )} */}
      </div>
      {applicantType.map((site, index) => (
        <div
          key={index}
          className={`${style.sidebarContent} ${index === activeIndex
            ? style.sideActiveBackground
            : style.sideNonActiveBackground
            }`}
          onClick={() => {
            handleSiteClick(index, site);
            if (sideBarList) {
              selectedTile(sideBarList[index]?.id);
            }
          }}
        >
          <div className={style.siteDetails}>
            <p className={style.siteName}>{site}</p>
            {/* <div className={style.siteCount}>{site?.length}</div> */}
          </div>
          {siteType && <p className={style.siteType}>{siteType[index]}</p>}
          {/* {site.description && (
            <p className={style.siteDescription}>{site.description}</p>
          )} */}
        </div>
      ))}
    </div>
  );
};

export default ApplicantSideBar;
