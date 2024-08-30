import React, { useState } from "react";
import style from "./../index.module.scss";

const ApplicantSideBar = ({ sites, siteTitle, onSelectSite }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSiteClick = (index, site) => {
    setActiveIndex(index);
    onSelectSite(site.name);
  };

  return (
    <div className={style.sideBar}>
      <p className={style.siteTitle}>{siteTitle}</p>
      {sites.map((site, index) => (
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
            <p className={style.siteName}>
              {"{"}
              {site.name}
              {"}"}
            </p>
            <div className={style.siteCount}>{site.count}</div>
          </div>
          <p className={style.siteType}>
            {"{"}
            {site.type}
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
