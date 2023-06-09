import React from "react";
import Tile from "../../Components/Tile";
import style from "./index.module.scss";
import { Link } from "react-router-dom";
import TileTwo from "../../Components/TileTwo";

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
        tileLabel="CUSTOMERS & PROSPECTS"
        selectedContract={selectedContract}
        getSelectedContract={getSelectedContract}
        bigNumber={"110"}
        // smallNum1={"-"}
        // smallNum2={"-"}
        smallText1="AUTO RENEWED"
        smallText2="UPCOMING RENEWAL"
        currentTile=""
        topText=""
        bigNumberColor={style.greenBigNumber}
        smallNum1Color={style.greenSmallNumber}
        smallNum2Color={style.yellowSmallNumber}
        smallNum1SelectedColor={style.greenSmallNumberSelected}
        smallNum2SelectedColor={style.yellowSmallNumberSelected}
      />
      <Tile
        tileLabel="CUSTOMER USERS"
        selectedContract={selectedContract}
        getSelectedContract={getSelectedContract}
        bigNumber={metadata?.draft?.draftCount || "22376"}
        // smallNum1={"-"}
        // smallNum2={"-"}
        // smallText1="ACTIVATION READY"
        smallText2="BLOCKED"
        currentTile=""
        topText=""
        smallNum1Color={style.yellowSmallNumber}
        smallNum2Color={style.redSmallNumber}
        smallNum1SelectedColor={style.yellowSmallNumberSelected}
        smallNum2SelectedColor={style.redSmallNumberSelected}
      />
      <Tile
        tileLabel="AT RISK SUBSCRIPTIONS"
        selectedContract={selectedContract}
        getSelectedContract={getSelectedContract}
        bigNumber={"5"}
        // smallNum1={"-"}
        // smallNum2={"-"}
        smallText1="$ 30,050"
        smallText2="AT RISK"
        currentTile=""
        topText=""
        bigNumberColor={style.redBigNumber}
        smallNum1Color={style.yellowSmallNumber}
        smallNum2Color={style.redSmallNumber}
        smallNum1SelectedColor={style.yellowSmallNumberSelected}
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
        // smallNum1={"-"}
        // smallNum2={"-"}
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
        // smallNum1={"-"}
        // smallNum2={metadata?.activeContract?.expiredIn30DaysCount}
        smallText1="REFERRAL"
        smallText2="AFFILIATE"
        currentTile=""
        topText=""
        bigNumberColor={style.greenBigNumber}
        smallNum1Color={style.greenSmallNumber}
        smallNum2Color={style.yellowSmallNumber}
        smallNum1SelectedColor={style.greenSmallNumberSelected}
        smallNum2SelectedColor={style.yellowSmallNumberSelected}
      />
      <Tile
        tileLabel="TSAI / PARTNER USERS"
        selectedContract={selectedContract}
        getSelectedContract={getSelectedContract}
        bigNumber={metadata?.draft?.draftCount || "20"}
        // smallNum1={"-"}
        // smallNum2={"-"}
        // smallText1=""
        smallText2="BLOCKED"
        currentTile="draft"
        topText=""
        smallNum1Color={style.yellowSmallNumber}
        smallNum2Color={style.redSmallNumber}
        smallNum1SelectedColor={style.yellowSmallNumberSelected}
        smallNum2SelectedColor={style.redSmallNumberSelected}
      />
      <Tile
        tileLabel="REFERENCE LISTS"
        selectedContract={selectedContract}
        getSelectedContract={getSelectedContract}
        bigNumber={"6"}
        smallNum1={"5"}
        smallNum2={"-"}
        smallText1="REVIEW FOR USE"
        smallText2="SETUP REQUIRED"
        currentTile=""
        topText=""
        bigNumberColor={style.redBigNumber}
        smallNum1Color={style.yellowSmallNumber}
        smallNum2Color={style.redSmallNumber}
        smallNum1SelectedColor={style.yellowSmallNumberSelected}
        smallNum2SelectedColor={style.redSmallNumberSelected}
      />
      <Tile
        tileLabel="DATA UPLOADS"
        selectedContract={selectedContract}
        getSelectedContract={getSelectedContract}
        bigNumber={
          metadata?.expiredOrTerminatedContract
            ?.expiredOrTerminatedContractCount || "2"
        }
        smallNum1={"2"}
        smallNum2={"-"}
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
