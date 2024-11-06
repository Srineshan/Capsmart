import React, { useEffect, useState } from "react";
import style from "./index.module.scss";
import { extractNumbersFromString } from "../../utils/formatting";
import { Tooltip } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const TileApplication = ({
  selectedTab,
  getSelectedTab,
  tileLabel,
  tileCount,
  bigNumber,
  bigText,
  bigNumber2,
  bigText2,
  smallNum1,
  smallNum2,
  smallNum3,
  smallText1,
  smallText2,
  smallText3,
  currentTile,
  topText,
  bottomText,
  bigNumberColor,
  bigNumber1Color,
  smallNum1Color,
  smallNum2Color,
  smallNum3Color,
  smallNum1SelectedColor,
  smallNum2SelectedColor,
  smallNum3SelectedColor,
  isDisabled,
  getTabFilter
}) => {
  const isSelected = selectedTab === currentTile;
  const handleClick = () => {
    if (!isDisabled) {
      getSelectedTab(currentTile);
    }
  };
  console.log(selectedTab, currentTile)

  return (
    <div
      className={`${style.applicationCardStyle} ${style.alignCenter}  ${isSelected ? style.selectedApplicantBackground : ''} ${isDisabled ? style.disabled : ''}`}
      onClick={handleClick}
    >
      {topText !== "" && <p className={style.next30Style}>{topText}</p>}
      <div className={`${style.spaceBetweenColumn} ${style.padding5}`}>
        <div>
          <div className={`${style.spaceBetween}  ${selectedTab === currentTile ? style.selectedApplicationText : style.headingForContracts}`}>{tileLabel}
            <span className={`${style.countDesign}`}>{tileCount}</span>
            <Tooltip className={` ${style.center}`} title={`${currentTile} ${tileCount}`}>
              <InfoOutlinedIcon fontSize="small" className={style.center} />
            </Tooltip>
          </div>
          {/* <div>
          <Tooltip className={` ${style.center}`} title={`${currentTile} ${tileCount}`}>
              <InfoOutlinedIcon fontSize="small" className={style.center} />
            </Tooltip>
          </div> */}
        </div>
      </div>
    </div >
  );
};

export default TileApplication;
