import React from "react";
import Tile from "../../Components/Tile";
import style from "./index.module.scss";
import { Link } from "react-router-dom";

const PartnerPortalTiles = ({
  metadata,
  getSelectedContract,
  selectedContract,
  activeContractsLength,
  draftContractsLength,
  upcomingContractsLength,
  expiredContractsLength,
}) => {
  return (
    <div className={style.grid4}>
      <Tile
        selectedContract={selectedContract}
        getSelectedContract={getSelectedContract}
        tileLabel="CUSTOMERS & PROSPECTS"
        bigNumber={110}
        bigText="ACTIVE CUSTOMERS"
        bigNumber2={12}
        bigText2="ON GOING TRIALS"
        smallNum1={"-"}
        smallNum2={"-"}
        smallNum3={"-"}
        smallText1="AUTO RENEWED"
        smallText2="UPCOMING RENEWAL"
        smallText3="TRIAL EXPIRING"
        currentTile="expired/terminated"
        topText=""
        bigNumber1Color={style.yellowBigNumber}
        smallNum1Color={style.redSmallNumber}
        smallNum2Color={style.redSmallNumber}
        smallNum1SelectedColor={style.redSmallNumberSelected}
        smallNum2SelectedColor={style.redSmallNumberSelected}
        smallNum3Color={style.redSmallNumber}
        smallNum3SelectedColor={style.redSmallNumberSelected}
      />
      <Tile
        selectedContract={selectedContract}
        getSelectedContract={getSelectedContract}
        tileLabel="CUSTOMER USERS"
        bigNumber={22376}
        bigText="APP USERS"
        bigNumber2={14}
        bigText2="TRIAL USERS"
        // smallNum1={1}
        smallNum3={"-"}
        // smallText1="AUTO RENEWED"
        smallText3="BLOCKED"
        currentTile="REFERENCE LISTS"
        topText=""
        bigNumber1Color={style.yellowBigNumber}
        // smallNum1Color={style.redSmallNumber}
        smallNum3Color={style.redSmallNumber}
        // smallNum1SelectedColor={style.redSmallNumberSelected}
        smallNum3SelectedColor={style.redSmallNumberSelected}
      />
      <Tile
        selectedContract={selectedContract}
        getSelectedContract={getSelectedContract}
        tileLabel="AT RISK SUBSCRIPTIONS"
        bigNumber={5}
        bigText="EXPIRED"
        bigNumber2={14}
        bigText2="NO ACTIVITY IN LAST 30 DAYS"
        // smallNum1={1}
        smallNum3={"-"}
        // smallText1="AUTO RENEWED"
        smallText3="AT RISK"
        currentTile="REFERENCE LISTS"
        topText=""
        bigNumberColor={style.redBigNumber}
        bigNumber1Color={style.yellowBigNumber}
        // smallNum1Color={style.redSmallNumber}
        smallNum3Color={style.redSmallNumber}
        // smallNum1SelectedColor={style.redSmallNumberSelected}
        smallNum3SelectedColor={style.redSmallNumberSelected}
      />
      <Tile
        tileLabel="FEEDBACK TICKETS"
        selectedContract={selectedContract}
        getSelectedContract={getSelectedContract}
        bigNumber={
          metadata?.expiredOrTerminatedContract
            ?.expiredOrTerminatedContractCount || "25"
        }
        bigText="TOTAL TICKETS"
        smallNum1={"-"}
        smallNum2={"-"}
        smallNum3={"-"}
        smallText1="EXCEPTION ERRORS"
        smallText2="HIGH PRIORITY"
        smallText3="PAST DUE"
        currentTile=""
        topText=""
        smallNum1Color={style.redSmallNumber}
        smallNum2Color={style.redSmallNumber}
        smallNum3Color={style.redSmallNumber}
        smallNum1SelectedColor={style.redSmallNumberSelected}
        smallNum2SelectedColor={style.redSmallNumberSelected}
        smallNum3SelectedColor={style.redSmallNumberSelected}
      />
      <Tile
        tileLabel="PARTNERS"
        selectedContract={selectedContract}
        getSelectedContract={getSelectedContract}
        bigNumber={metadata?.activeContract?.activeContractCount || "3"}
        smallNum1={"-"}
        smallNum2={"-"}
        smallNum3={"-"}
        smallText1="REFERRAL"
        smallText2="AFFILIATE"
        smallText3="RESELLER"
        currentTile=""
        topText=""
        // smallNum1Color={style.redSmallNumber}
        // smallNum2Color={style.redSmallNumber}
        // smallNum1SelectedColor={style.redSmallNumberSelected}
        // smallNum2SelectedColor={style.redSmallNumberSelected}
      />
      <Tile
        tileLabel="TSAI / PARTNER USERS"
        selectedContract={selectedContract}
        getSelectedContract={getSelectedContract}
        bigNumber={20}
        bigText="TSAI USERS"
        bigNumber2={120}
        bigText2="PARTNER USERS"
        // smallNum1={"-"}
        smallNum3={"-"}
        // smallText1=""
        smallText3="BLOCKED"
        currentTile="draft"
        topText=""
        bigNumber1Color={style.yellowBigNumber}
        // smallNum1Color={style.yellowSmallNumber}
        smallNum3Color={style.redSmallNumber}
        // smallNum1SelectedColor={style.yellowSmallNumberSelected}
        smallNum3SelectedColor={style.redSmallNumberSelected}
      />
      <Tile
        tileLabel="REFERENCE LISTS"
        selectedContract={selectedContract}
        getSelectedContract={getSelectedContract}
        bigNumber={6}
        bigText="CUSTOM"
        bigNumber2={5}
        bigText2="DEFAULT IN USE"
        smallNum2={"-"}
        smallNum3={"-"}
        smallText2="REVIEW FOR USE"
        smallText3="SETUP REQUIRED"
        currentTile=""
        topText=""
        smallNum2Color={style.redSmallNumber}
        smallNum3Color={style.redSmallNumber}
        smallNum2SelectedColor={style.redSmallNumberSelected}
        smallNum3SelectedColor={style.redSmallNumberSelected}
      />
      <Tile
        tileLabel="DATA UPLOADS"
        selectedContract={selectedContract}
        getSelectedContract={getSelectedContract}
        bigNumber2={2}
        bigText2="FILES TYPES"
        smallNum2={"-"}
        smallNum3={"-"}
        smallText2="FAILED TO PROCESS"
        smallText3="FAILED RECORDS"
        currentTile="expired/terminated"
        topText=""
        smallNum2Color={style.redSmallNumber}
        smallNum3Color={style.redSmallNumber}
        smallNum2SelectedColor={style.redSmallNumberSelected}
        smallNum3SelectedColor={style.redSmallNumberSelected}
      />
    </div>
  );
};

export default PartnerPortalTiles;
