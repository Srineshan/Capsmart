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
  smallText1,
  smallText2,
  currentTile,
  topText,
  bottomText,
  bigNumberColor,
  bigNumber1Color,
  smallNum1Color,
  smallNum2Color,
  smallNum1SelectedColor,
  smallNum2SelectedColor,
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

        <div className={`${style.spaceBetween}`}>
          <div className={style.displayInColRev}>
            {bigText2 !== "" && (
              <div className={`${style.displayInRow} ${style.alignLeft}`}>
                <span
                  className={`${style.headingCountForContracts} ${
                    // selectedContract === currentTile && bigNumberColor
                    bigNumber2 !== "-" ? bigNumber1Color : ""
                  }`}
                >
                  {bigNumber2}
                </span>
                <span
                  className={`${style.descriptionText} ${style.verticalAlignCenter} ${style.marginLeft10}`}
                >
                  {bigText2}
                </span>
              </div>
            )}
            <div className={style.displayInRow}>
              <p
                className={`${style.headingCountForContracts} ${
                  bigNumber !== "-" ? bigNumberColor : ""
                }`}
              >
                {bigNumber}
              </p>
              <span
                className={`${style.descriptionText} ${style.verticalAlignCenter} ${style.marginLeft10}`}
              >
                {bigText}
              </span>
            </div>
          </div>
          <div
            className={`${style.optionsStyle} ${style.displayInCol} ${style.reduceTop20} ${style.alignRight}`}
          >
            {smallNum1 !== "" && (
              <span
                className={`${style.verticalAlignCenter} ${style.alignRight}`}
              >
                {smallText1}
                <span
                  className={`${
                    smallNum2 !== "-"
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
