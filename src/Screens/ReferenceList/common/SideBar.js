import React, { useState } from "react";
import style from "./../index.module.scss";

const ApplicantSideBar = ({
  applicantType,
  siteTitle,
  onSelectSite,
  siteDropdown,
  tileType,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSiteClick = (index, site) => {
    console.log(site);

    setActiveIndex(index);
    onSelectSite(site);
  };
  console.log(applicantType);

  return (
    <div className={style.sideBar}>
      <div>
        {siteDropdown ? (
          <select
            className={style.dropdown}
            onChange={(e) => onSelectSite(e.target.value)}
          >
            <option value={siteTitle}>{siteTitle}</option>
          </select>
        ) : (
          <p className={style.siteTitle}>{siteTitle}</p>
        )}
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
          }}
        >
          <div className={style.siteDetails}>
            <p className={style.siteName}>
              {"{"}
              {site}
              {"}"}
            </p>
            {/* <div className={style.siteCount}>{site?.length}</div> */}
          </div>
          {/* <p className={style.siteType}>
            {"{"}
            {site.siteType.type}
          </p>
          {site.description && (
            <p className={style.siteDescription}>{site.description}</p>
          )} */}
        </div>
      ))}
    </div>
  );
};

export default ApplicantSideBar;
