import React, { useState, useEffect } from "react";
import style from "./../index.module.scss";

const PrivilegeSideBar = ({
  privilegeCategories,
  onSelectSite,
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
    setActiveIndex(index);
    onSelectSite(site.category); 
  };

  const sideBarClass =
    tileType === "PrivilegeListManager"
      ? `${style.sideBar} ${style.privilegeManagerHeight}`
      : style.sideBar;

  return (
    <div className={sideBarClass}>
      {privilegeCategories.map((site, index) => (
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
            <p className={style.siteName}>{site.category}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrivilegeSideBar;
