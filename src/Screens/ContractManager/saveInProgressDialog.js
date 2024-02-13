import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  Classes,
  Icon,
  Intent,
  TextArea,
  RadioGroup,
  Radio,
} from "@blueprintjs/core";
import { GET } from "../dataSaver";
import style from "./index.module.scss";

const SaveInProgressDialog = ({
  getSaveInProgressDialog,
  header,
  redirectTo,
  contractType,
  contractId,
}) => {
  const navigate = useNavigate();
  const submit = () => {
    getSaveInProgressDialog(false, "ok");
    navigate(`/${redirectTo}`);
  };

  const [contractData, setContractData] = useState([]);

  useEffect(() => {
    if (contractId !== "" || contractId === undefined) {
      getContractDetail();
    }
  }, [contractId]);

  const getContractDetail = async () => {
    const { data: contractData } = await GET(
      `contract-managment-service/contracts/${contractId}/contractDetail`
    );

    setContractData(contractData);
  };

  return (
    <Dialog
      isOpen={getSaveInProgressDialog}
      onClose={() => getSaveInProgressDialog(false)}
      className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div className={style.spaceBetween}>
          <p className={`${style.popUpHeading}`}>{header}</p>
          <Icon
            icon="cross"
            size={20}
            intent={Intent.DANGER}
            className={style.crossStyle}
            onClick={() => getSaveInProgressDialog(false)}
          />
        </div>
        <div className={style.extensionBorder}></div>
        <div className={`${style.popUpHeaderBlock} ${style.marginTop}`}>
          <div>
            <p className={style.extentionLableStyle}>{contractType?.value}</p>
            <p className={style.extentionLableStyle}>
              PAMF CONTRACT (
              {`${contractData?.contractDetail?.contractId?.id
                ? contractData?.contractDetail?.contractId?.id
                : " - "
                }`}
              )
            </p>
            <p className={style.extentionLableStyle}>
              {contractData?.contractName?.contractName}
            </p>
          </div>
          <div>
            <p className={style.extentionLableStyle}>
              {`${contractData?.contractDetail?.contractManager?.name
                ?.firstName || ""
                } ${contractData?.contractDetail?.contractManager?.name?.lastName ||
                ""
                }  `}
              (Contract Manager)
            </p>
            <p className={style.extentionLableStyle}>
              ({" "}
              {contractData?.contractType === "MULTIPLE"
                ? contractData?.contractDetail?.site?.sites.length
                : " - "}
              {"  "}){`${" "}`} SITE NAME ONLY IF MULTISITE
            </p>
            <p className={style.extentionLableStyle}>
              LAST UPDATED ON 09-23-2022
            </p>
          </div>
        </div>
        <div className={`${style.marginTop}`}></div>
        <div className={style.extensionBorder}></div>
        <div>
          <p
            className={`${style.cloneContent} ${style.marginTop20} ${style.contentTextAlign}`}
          >
            The contract that you are entering will be saved as a ”
            <span className={`${style.blueColor}`}>DRAFT</span> ” mode. You can
            access this contract to continue working on it from your list of
            draft contracts
          </p>
        </div>
        <div>
          <div className={`${style.positionCenter} ${style.marginTop20}`}>
            <button
              className={style.outlinedButton}
              onClick={() => getSaveInProgressDialog(false)}
            >
              CANCEL
            </button>
            <button
              className={`${style.buttonStyle} ${style.marginLeft20}`}
              onClick={submit}
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default SaveInProgressDialog;
