import React from "react";
import style from "./index.module.scss";

const Tile = ({
  selectedContract,
  getSelectedContract,
  tileLabel,
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
}) => {
  return (
    <div
      className={`${style.cardStyle} ${
        selectedContract === currentTile && style.selectedContractBackground
      }`}
      onClick={() => getSelectedContract(currentTile)}
    >
      {topText !== "" && <p className={style.next30Style}>{topText}</p>}
      <div className={style.spaceBetweenColumn}>
        <div>
          <div className={`${style.headingForContracts}`}>{tileLabel}</div>
          {bottomText !== "" && (
            <div className={style.bottomTextStyle}>{bottomText}</div>
          )}
        </div>

        <div className={`${style.spaceBetween} ${style.marginBottom5} `}>
          <div className={`${style.displayInColRev}  ${style.reduceTop10}  `}>
            {bigText2 !== "" && (
              <div className={` ${style.displayInGrid}  `}>
                <div
                  className={`${style.headingCountForContracts}  ${
                    style.verticalAlignCenter
                  } ${
                    // selectedContract === currentTile && bigNumberColor
                    bigNumber2 !== "-" ? bigNumber1Color : ""
                  } ${style.alignLeft}`}
                >
                  {bigNumber2}
                </div>
                <div
                  className={`${style.descriptionText} ${style.verticalAlignCenter} ${style.marginLeft10}`}
                >
                  {bigText2}
                </div>
              </div>
            )}
            <div
              className={`${style.displayInGrid} ${style.counterHeight} ${style.alignRight}`}
            >
              <div
                className={`${style.headingCountForContracts} ${
                  bigNumber !== "-" ? bigNumberColor : ""
                } ${style.alignLeft} ${style.verticalAlignCenter}`}
              >
                {bigNumber}
              </div>
              <div
                className={`${style.descriptionText} ${style.verticalAlignCenter} ${style.marginLeft10}`}
              >
                {bigText}
              </div>
            </div>
          </div>
          <div
            className={`${style.optionsStyle} ${style.displayInCol} ${style.reduceTop10} ${style.alignRight}`}
          >
            {smallNum3 !== "" && (
              <span
                className={`${style.verticalAlignCenter}  ${style.alignRight}`}
              >
                {smallText3}
                <span
                  className={`${
                    smallNum3 !== "-"
                      ? selectedContract === currentTile
                        ? smallNum3SelectedColor
                        : smallNum3Color
                      : style.defaultSmallNumber
                  } ${style.countDesign}`}
                >
                  {smallNum3}
                </span>
              </span>
            )}
            {smallNum1 !== "" && (
              <span
                className={`${style.verticalAlignCenter} ${style.marginTop5} ${style.alignRight}`}
              >
                {smallText1}
                <span
                  className={`${
                    smallNum1 !== "-"
                      ? selectedContract === currentTile
                        ? smallNum1SelectedColor
                        : smallNum1Color
                      : style.defaultSmallNumber
                  } ${style.countDesign}`}
                >
                  {smallNum1}
                </span>
              </span>
            )}
            {smallNum2 !== "" && (
              <span
                className={`${style.verticalAlignCenter} ${style.marginTop5} ${style.alignRight}`}
              >
                {smallText2}
                <span
                  className={`${
                    smallNum2 !== "-"
                      ? selectedContract === currentTile
                        ? smallNum2SelectedColor
                        : smallNum2Color
                      : style.defaultSmallNumber
                  } ${style.countDesign}`}
                >
                  {smallNum2}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tile;
