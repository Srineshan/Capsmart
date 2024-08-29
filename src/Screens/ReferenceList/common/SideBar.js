import React from "react";
import style from "./../index.module.scss";

const ApplicantSideBar = ({ sites }) => {
  return (
    <div className={style.sideBar}>
      <p className={style.siteTitle}>All Sites</p>
      {sites.map((site, index) => (
        <div
          key={index}
          className={`${style.sidebarContent} ${
            site.id == 1
              ? style.sideActiveBackground
              : style.sideNonActiveBackground
          }`}
        >
          <div className={style.siteDetails}>
            <p className={style.siteName}>{site.name}</p>
            <div className={style.siteCount}>{site.count}</div>
          </div>
          <p className={style.siteType}>{site.type}</p>
          {site.description && (
            <p className={style.siteDescription}>{site.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ApplicantSideBar;
