import React, { useState, useEffect, useCallback, useRef } from "react";
import { GET, POST } from "../../Screens/dataSaver";
import { Dialog } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import style from "./index.module.scss";
import LoadingScreen from "../LoadingScreen";
import { add, format, isValid, parse, sub, differenceInDays } from 'date-fns';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';

const EmailTemplateDialog = ({ getIsOpen }) => {
  const [applicationId, setApplicationId] = useState(
    sessionStorage.getItem("applicationId")
  );
  const [form, setForm] = useState();
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  useEffect(() => {
    getPreApplication();
  }, [])

  const getPreApplication = async () => {
    setIsLoadingImage(true);
    const { data: basicForm } = await GET(
      `application-management-service/application/${applicationId}`
    );
    setForm(basicForm);
    setIsLoadingImage(false);
  }

  let paymentmentDate = form?.payment?.paidDateTime;
  const paymentmentPaidDate = paymentmentDate ? format(new Date(paymentmentDate), "MMM dd, yyyy 'at' h:mm a") : "-";

  return (
    <>
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
            <div className={style.padding10}>
              <div className={style.HeaderGrid}>
                <div className={style.Headertext}>
                  Application Payment Status
                </div>
                <img
                  src={CrossPink}
                  alt="cross"
                  className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft}`}
                  onClick={() => getIsOpen(false)}
                />
              </div>
            </div>
          </div>
          <div className={style.padding10}>
            <div className={`${style.cardTitle} ${style.advanceBoxStyle}  ${style.marginTop10}`}>
              Application Payment Status
              <span className={`${style.marginLeft30}  ${form?.payment?.paymentCompleted ? style.paidTextStyle : style.unpaidTextStyle}`}>
                {form?.payment?.paymentCompleted ? 'Paid' : 'Unpaid'}
              </span>
            </div>
            {/* <div className={`${style.threeColumnGrid}`}>
              <div className={`${style.alignStart} ${style.marginTop10}`}>
                <div>Amount</div>
                <div className={`${style.borderStyleTiles}`}></div>
                <div className={`${style.marginLeft30} ${style.marginTop10}`}>{form?.payment?.currency || ""} {form?.payment?.fee || "-"}</div>
              </div>
              <div className={`${style.alignStart} ${style.marginTop10}`}>
                <div>Transaction ID / Confirmation Number</div>
                <div className={`${style.borderStyleTiles}`}></div>
                <div className={`${style.marginLeft30} ${style.marginTop10}`}>{form?.payment?.receiptId || "-"}</div>
              </div>
              <div className={`${style.alignStart} ${style.marginTop10}`}>
                <div>Payment Date & Time</div>
                <div className={`${style.borderStyleTiles}`}></div>
                <div className={`${style.marginLeft30} ${style.marginTop10}`}>{paymentmentPaidDate || ""}</div>
              </div>
            </div> */}
            {form?.payment?.invoice?.fileURL !== undefined && (
              <div className={style.marginTop10}>
                <iframe
                  src={
                    form?.payment?.invoice?.fileURL
                  }
                  width="100%"
                  height="600px"
                ></iframe>
              </div>
            )}
          </div>
        </Dialog>
      )}
    </>
  );
};

export default EmailTemplateDialog;
