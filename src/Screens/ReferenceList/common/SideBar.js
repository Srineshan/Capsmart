import React, { useState } from "react";
import style from "./../index.module.scss";

const ApplicantSideBar = ({ sites, siteTitle, onSelectSite, siteDropdown }) => {
  console.log(sites);

  const [activeIndex, setActiveIndex] = useState(0);

  const handleSiteClick = (index, site) => {
    console.log(site);

    setActiveIndex(index);
    onSelectSite(site);
  };

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
      {sites.map((site, index) => (
        <div
          key={index}
          className={`${style.sidebarContent} ${
            index === activeIndex
              ? style.sideActiveBackground
              : style.sideNonActiveBackground
          }`}
          onClick={() => {
            console.log(site?.length);
            handleSiteClick(index, site.siteName?.siteName);
          }}
        >
          <div className={style.siteDetails}>
            <p className={style.siteName}>
              {"{"}
              {site.siteName?.siteName}
              {"}"}
            </p>
            <div className={style.siteCount}>{site?.length}</div>
          </div>
          <p className={style.siteType}>
            {"{"}
            {site.siteType.type}
            {"}"}
          </p>
          {site.description && (
            <p className={style.siteDescription}>{site.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ApplicantSideBar;
