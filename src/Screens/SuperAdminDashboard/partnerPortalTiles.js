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
        smallNum1={"1"}
        smallNum2={"1"}
        smallNum3={"1"}
        smallText3="AUTO RENEWED"
        smallText1="UPCOMING RENEWAL"
        smallText2="TRIAL EXPIRING"
        currentTile="expired/terminated"
        topText=""
        bigNumber1Color={style.yellowBigNumber}
        smallNum3Color={style.greenSmallNumber}
        smallNum1Color={style.redSmallNumber}
        smallNum3SelectedColor={style.greenSmallNumberSelected}
        smallNum1SelectedColor={style.redSmallNumberSelected}
        smallNum2Color={style.redSmallNumber}
        smallNum2SelectedColor={style.redSmallNumberSelected}
      />
      <Tile
        selectedContract={selectedContract}
        getSelectedContract={getSelectedContract}
        tileLabel="CUSTOMER USERS"
        bigNumber={22376}
        bigText="APP USERS"
        bigNumber2={14}
        bigText2="TRIAL USERS"
        smallNum2={"1"}
        smallText2="BLOCKED"
        currentTile="REFERENCE LISTS"
        topText=""
        bigNumber1Color={style.yellowBigNumber}
        smallNum2Color={style.redSmallNumber}
        smallNum2SelectedColor={style.redSmallNumberSelected}
      />
      <Tile
        selectedContract={selectedContract}
        getSelectedContract={getSelectedContract}
        tileLabel="AT RISK SUBSCRIPTIONS"
        bigNumber={5}
        bigText="EXPIRED"
        bigNumber2={14}
        bigText2="NO ACTIVITY IN LAST 30 DAYS"
        smallNum2={"$ 30,050"}
        smallText2="AT RISK"
        currentTile="REFERENCE LISTS"
        topText=""
        bigNumberColor={style.redBigNumber}
        bigNumber1Color={style.yellowBigNumber}
        smallNum2Color={style.redSmallNumber}
        smallNum2SelectedColor={style.redSmallNumberSelected}
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
        smallNum3={"13"}
        smallNum1={"9"}
        smallNum2={"8"}
        smallText3="EXCEPTION ERRORS"
        smallText1="HIGH PRIORITY"
        smallText2="PAST DUE"
        currentTile=""
        topText=""
        smallNum3Color={style.redSmallNumber}
        smallNum1Color={style.redSmallNumber}
        smallNum2Color={style.redSmallNumber}
        smallNum3SelectedColor={style.redSmallNumberSelected}
        smallNum1SelectedColor={style.redSmallNumberSelected}
        smallNum2SelectedColor={style.redSmallNumberSelected}
      />
      <Tile
        tileLabel="PARTNERS"
        selectedContract={selectedContract}
        getSelectedContract={getSelectedContract}
        bigNumber={metadata?.activeContract?.activeContractCount || "3"}
        smallNum1={"1"}
        smallNum2={"1"}
        smallNum3={"1"}
        smallText3="REFERRAL"
        smallText1="AFFILIATE"
        smallText2="RESELLER"
        currentTile=""
        topText=""
        smallNum3Color={style.purpleSmallNumber}
        smallNum1Color={style.purpleSmallNumber}
        smallNum2Color={style.purpleSmallNumber}
        smallNum3SelectedColor={style.purpleSmallNumberSelected}
        smallNum1SelectedColor={style.purpleSmallNumberSelected}
        smallNum2SelectedColor={style.purpleSmallNumberSelected}
      />
      <Tile
        tileLabel="TSAI / PARTNER USERS"
        selectedContract={selectedContract}
        getSelectedContract={getSelectedContract}
        bigNumber={20}
        bigText="TSAI USERS"
        bigNumber2={120}
        bigText2="PARTNER USERS"
        smallNum2={"1"}
        smallText2="BLOCKED"
        currentTile="draft"
        topText=""
        bigNumber1Color={style.yellowBigNumber}
        smallNum2Color={style.redSmallNumber}
        smallNum2SelectedColor={style.redSmallNumberSelected}
      />
      <Tile
        tileLabel="REFERENCE LISTS"
        selectedContract={selectedContract}
        getSelectedContract={getSelectedContract}
        bigNumber={6}
        bigText="CUSTOM"
        bigNumber2={5}
        bigText2="DEFAULT IN USE"
        smallNum1={"5"}
        smallNum2={"5"}
        smallText1="REVIEW FOR USE"
        smallText2="SETUP REQUIRED"
        currentTile=""
        topText=""
        smallNum1Color={style.redSmallNumber}
        smallNum2Color={style.redSmallNumber}
        smallNum1SelectedColor={style.redSmallNumberSelected}
        smallNum2SelectedColor={style.redSmallNumberSelected}
      />
      <Tile
        tileLabel="DATA UPLOADS"
        selectedContract={selectedContract}
        getSelectedContract={getSelectedContract}
        bigNumber2={2}
        bigText2="FILES TYPES"
        smallNum1={"2"}
        smallNum2={"1"}
        smallText1="FAILED TO PROCESS"
        smallText2="FAILED RECORDS"
        currentTile="expired/terminated"
        topText=""
        smallNum1Color={style.redSmallNumber}
        smallNum2Color={style.redSmallNumber}
        smallNum1SelectedColor={style.redSmallNumberSelected}
        smallNum2SelectedColor={style.redSmallNumberSelected}
      />
    </div>
  );
};

export default PartnerPortalTiles;
