import React from "react";
import style from "./index.module.scss";
import { Link } from "react-router-dom";

const TileTwo = ({
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
  smallNum1Color,
  smallNum2Color,
  smallNum1SelectedColor,
  smallNum2SelectedColor,
}) => {
  return (
    <>
      <Link to={"/activeCustomers"} className={style.linkStyle}>
        <div
          className={`${style.cardStyle} ${style.selectedContractBackground}`}
        >
          <h5 className={`${style.headingForContracts}`}>
            CUSTOMERS & PROSPECTS
          </h5>
          <div
            className={`${style.spaceBetween} ${style.marginTop20} ${style.marginRight}`}
          >
            <div className={`${style.optionsStyle} ${style.displayInCol}`}>
              <span className={style.displayInRow}>
                <p className={style.headingCountForContracts}>110 </p> ACTIVE
                CUSTOMERS
              </span>
              <span className={style.displayInRow}>
                <p
                  className={`${style.yellow} ${style.headingCountForContracts}`}
                >
                  12{" "}
                </p>{" "}
                ON GOING TRIALS
              </span>
            </div>
            <div className={`${style.optionsStyle} ${style.displayInColRev}`}>
              <span>
                <span className={style.red}>1 </span> TRIAL EXPIRING
              </span>
              <span>
                <span className={style.red}>1 </span> UPCOMING RENEWAL
              </span>
              <span>
                <span className={style.green}>1 </span> AUTO RENEWED
              </span>
            </div>
          </div>
        </div>
      </Link>
      <Link to={"/user"} className={style.linkStyle}>
        <div className={style.cardStyle}>
          <h5 className={`${style.headingForContracts}`}>REGISTERED USERS</h5>
          <div
            className={`${style.spaceBetween} ${style.marginTop20} ${style.marginRight}`}
          >
            <div className={`${style.optionsStyle} ${style.displayInCol}`}>
              <span className={style.displayInRow}>
                <p className={style.headingCountForContracts}>22376 </p>{" "}
                REGISTERED USERS
              </span>
              <span className={style.displayInRow}>
                <p
                  className={`${style.yellow} ${style.headingCountForContracts}`}
                >
                  14{" "}
                </p>{" "}
                TRIAL USERS
              </span>
            </div>
            <div className={`${style.optionsStyle} ${style.displayInColRev}`}>
              <span className={style.displayInRow}>
                <span className={`${style.red} ${style.marginRight}`}>1 </span>{" "}
                BLOCKED
              </span>
            </div>
          </div>
        </div>
      </Link>
      <div className={style.cardStyle}>
        <h5 className={style.headingForContracts}>AT RISK SUBSCRIPTIONS</h5>
        <div
          className={`${style.spaceBetween} ${style.marginTop20} ${style.marginRight}`}
        >
          <div className={`${style.optionsStyle} ${style.displayInCol}`}>
            <span className={style.displayInRow}>
              <p className={`${style.headingCountForContracts} ${style.red}`}>
                5{" "}
              </p>{" "}
              EXPIRED
            </span>
            <span className={style.displayInRow}>
              <p
                className={`${style.yellow} ${style.headingCountForContracts}`}
              >
                14{" "}
              </p>
              NO ACTIVITY IN LAST 30 DAYS
            </span>
          </div>
          <div className={`${style.optionsStyle} ${style.displayInColRev}`}>
            <span>AT RISK</span>
            <span className={`${style.red} ${style.displayInRow}`}>
              <span className={style.marginRight}>$ </span>30,050
            </span>
          </div>
        </div>
      </div>
      <div className={style.cardStyle}>
        <h5 className={`${style.headingForContracts}`}>
          PRIORITY FEEDBACK TICKETS
        </h5>
        <div className={`${style.spaceBetween} ${style.marginTop30}`}>
          <div className={`${style.optionsStyle} ${style.displayInColRev}`}>
            <span className={style.displayInRow}>
              <p className={style.headingCountForContracts}>25 </p> TOTAL
              TICKETS
            </span>
          </div>
          <div
            className={`${style.optionsStyle} ${style.displayInColRev} ${style.marginLeft30}`}
          >
            <span>
              <span className={style.red}>8 </span> PAST DUE
            </span>
            <span>
              <span className={style.red}>9 </span> HIGH PRIORITY
            </span>
            <span>
              <span className={style.red}>13 </span> EXCEPTION ERRORS
            </span>
          </div>
        </div>
      </div>

      {/* <div
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
                <div className={style.displayInRow}>
                  <span
                    className={`${style.headingCountForContracts} ${
                      selectedContract === currentTile && bigNumberColor
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
      </div> */}
    </>
  );
};

export default TileTwo;
