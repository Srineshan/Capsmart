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
        smallNum1={1}
        smallNum2={0}
        smallText1="AUTO RENEWED"
        smallText2="UPCOMING RENEWAL"
        currentTile="REFERENCE LISTS"
        topText=""
        smallNum1Color={style.greenSmallNumber}
        smallNum2Color={style.redSmallNumber}
        smallNum1SelectedColor={style.greenSmallNumberSelected}
        smallNum2SelectedColor={style.redSmallNumberSelected}
      />
      <Tile
        selectedContract={selectedContract}
        getSelectedContract={getSelectedContract}
        tileLabel="CUSTOMER USERS"
        bigNumber={22376}
        bigText="ACTIVE CUSTOMERS"
        bigNumber2={14}
        bigText2="ON GOING TRIALS"
        // smallNum1={1}
        smallNum2={1}
        // smallText1="AUTO RENEWED"
        smallText2="BLOCKED"
        currentTile="REFERENCE LISTS"
        topText=""
        // smallNum1Color={style.redSmallNumber}
        smallNum2Color={style.redSmallNumber}
        smallNum1SelectedColor={style.redSmallNumberSelected}
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
        // smallNum1={1}
        smallNum2={"$ 30,050"}
        // smallText1="AUTO RENEWED"
        smallText2="AT RISK"
        currentTile="REFERENCE LISTS"
        topText=""
        // smallNum1Color={style.redSmallNumber}
        smallNum2Color={style.redSmallNumber}
        smallNum1SelectedColor={style.redSmallNumberSelected}
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
        smallNum1={"13"}
        smallNum2={"9"}
        smallText1="EXCEPTION ERRORS"
        smallText2="HIGH PRIORITY"
        currentTile=""
        topText=""
        bigNumberColor={style.redBigNumber}
        smallNum1Color={style.redSmallNumber}
        smallNum2Color={style.redSmallNumber}
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
        smallText1="REFERRAL"
        smallText2="AFFILIATE"
        currentTile=""
        topText=""
        bigNumberColor={style.redBigNumber}
        smallNum1Color={style.redSmallNumber}
        smallNum2Color={style.redSmallNumber}
        smallNum1SelectedColor={style.redSmallNumberSelected}
        smallNum2SelectedColor={style.redSmallNumberSelected}
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
        smallNum2={"1"}
        // smallText1=""
        smallText2="BLOCKED"
        currentTile="draft"
        topText=""
        // smallNum1Color={style.yellowSmallNumber}
        smallNum2Color={style.redSmallNumber}
        // smallNum1SelectedColor={style.yellowSmallNumberSelected}
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
        bigNumberColor={style.redBigNumber}
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
        bigNumberColor={style.redBigNumber}
        smallNum1Color={style.redSmallNumber}
        smallNum2Color={style.redSmallNumber}
        smallNum1SelectedColor={style.redSmallNumberSelected}
        smallNum2SelectedColor={style.redSmallNumberSelected}
      />
    </div>
  );
};

export default PartnerPortalTiles;
