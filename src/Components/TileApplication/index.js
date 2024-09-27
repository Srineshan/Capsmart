import React, { useEffect, useState } from "react";
import style from "./index.module.scss";
import { extractNumbersFromString } from "../../utils/formatting";
import { Tooltip } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

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
  getTabFilter,
}) => {
  // console.log(selectedTab, currentTile)

  return (
    <div
      className={`${style.applicationCardStyle} ${style.alignCenter} ${
        selectedTab === currentTile && style.selectedApplicantBackground
      }`}
      onClick={() => getSelectedTab(currentTile)}
    >
      {topText !== "" && <p className={style.next30Style}>{topText}</p>}
      <div className={`${style.spaceBetweenColumn} ${style.padding5}`}>
        <div>
          <div
            className={`${style.spaceBetween}  ${
              selectedTab === currentTile
                ? style.selectedApplicationText
                : style.headingForContracts
            }`}
          >
            {tileLabel}
            <span className={style.countDesign}>{tileCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TileApplication;
