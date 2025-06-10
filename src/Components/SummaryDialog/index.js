import React, { useState, useEffect } from "react";
import { GET, PUT, POST, TenantID } from "../../Screens/dataSaver";
import { Dialog } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import style from "./index.module.scss";
import { fileLoadingURL } from "../../utils/formatting";
import LoadingScreen from "../LoadingScreen";
import { Tooltip } from "@mui/material";

const SummaryDialog = ({ getIsOpen }) => {
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isLoadingImageDocs, setIsLoadingImageDocs] = useState(false);
  const workModeType = sessionStorage.getItem('workModeType')
  const applicationType = sessionStorage.getItem('applicationCreationType') ?? 'REAPPOINTMENT';


  return (
    <>
      {isLoadingImageDocs && (
        <div
          className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}
        >
          <img src={fileLoadingURL} alt="" className={style.fileLoadingStyle} />
        </div>
      )}
      {isLoadingImage && (
        <div className={style.loadingOverlay}>
          <LoadingScreen />
        </div>
      )}
      {!isLoadingImage && (
        <Dialog
          isOpen={getIsOpen}
          onClose={() => getIsOpen(false)}
          className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
          canOutsideClickClose={false}
          canEscapeKeyClose={false}
        >
          <div>
            <div className={style.templateHeader}>
              <div className={style.templateHeadertext}>
                Privileged Locum Summary
              </div>
              <Tooltip title="Click to Close" arrow>
                <img src={CrossPink} alt="close" className={`${style.crossStyle} ${style.cursorPointer}`} onClick={() => getIsOpen(false)} /></Tooltip>
            </div>
            <div className={style.verticalAlignCenter}>
                <div className={style.summaryCountStyle}>1</div>
                <div className={`${style.summaryFontStyle} ${style.marginLeft20}`}>Locum Staff Period ending in less than 7 days</div>
            </div>
            <div className={style.verticalAlignCenter}>
                <div className={style.summaryCountStyle}>2</div>
                <div className={`${style.summaryFontStyle} ${style.marginLeft20}`}>Locum Staff Periods ending in less than 14 days</div>
            </div>
            <div className={style.verticalAlignCenter}>
                <div className={style.summaryCountStyle}>3</div>
                <div className={`${style.summaryFontStyle} ${style.marginLeft20}`}>Locum Staff Term Expired (Moved to Expired Locum)</div>
            </div>
            <div className={`${style.actionButtons} ${style.marginTop}`}>
              <div className={`${style.reviewButtonStyle} ${style.cursorPointer}`}
                style={{
                  pointerEvents:'auto',
                  opacity:1
                }}
                onClick={() => getIsOpen(false)}
              >
                <Tooltip title={ "Click to Close"} arrow>
                  <div className={style.reviewButton}>Okay</div></Tooltip>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default SummaryDialog;
