import React, { useState } from "react";
import {
  Dialog,
  Classes,
  Icon,
  Intent,
  TextArea,
  RadioGroup,
  Radio,
} from "@blueprintjs/core";
import style from "./index.module.scss";

const ActivationAlertDraftContract = ({ getActivationAlertDraftDialog }) => {
  const [terminationTrigger, setTerminationTrigger] = useState(
    "CONTRACT_EXPIRATION"
  );

  return (
    <Dialog
      isOpen={getActivationAlertDraftDialog}
      onClose={() => getActivationAlertDraftDialog(false)}
      className={`${style.newCloneDialog} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}  ${style.margin20}`}
      >
        {/* <div className={style.textAlignEnd}>
          <Icon
            icon="cross"
            size={20}
            intent={Intent.DANGER}
            className={style.crossStyle}
            onClick={() => getActivationAlertDraftDialog(false)}
          />
        </div> */}

        <div className={`${style.spaceBetween}`}>
          <div
            className={`${style.extensionStyle} ${style.spaceBetween} ${style.marginAuto}`}
          >
            Contract Activation Alert
          </div>
          <Icon
            icon="cross"
            size={20}
            intent={Intent.DANGER}
            className={style.crossStyle}
            onClick={() => getActivationAlertDraftDialog(false)}
          />
        </div>
        <div className={style.extensionBorder}></div>
        <div className={`${style.marginTop30} ${style.marginLeft30}`}>
          <RadioGroup
            inline={true}
            onChange={(e) => setTerminationTrigger(e.target.value)}
            selectedValue={terminationTrigger}
          >
            <Radio
              label="Activate your contract without automated review and approval workflow"
              value="CONTRACT_EXPIRATION"
              checked
            />
            <Radio
              label={
                <p className={`${style.deleteDescriptionStyle}`}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore,
                  <span className={`${style.blueColor} ${style.marginLeft20}`}>
                    quis nostrud xercitation ullamco laboris nisi ut aliquip ex
                    ea commodo consequat
                  </span>
                </p>
              }
              value="FOR_CAUSE_BY_CONTRACTOR"
            />
          </RadioGroup>

          <label className={style.container}>
            <input type="radio" checked="checked" name="sexe" />
            <span className={style.checkmark}></span>
            <p
              className={`${style.deleteDescriptionStyle} ${style.marginTop20}`}
            >
              Activate your contract without automated review and approval
              workflow
            </p>
          </label>
          <label className={style.container}>
            <input type="radio" checked="checked" name="sexe" />
            <span className={style.checkmark}></span>
            <p
              className={`${style.deleteDescriptionStyle} ${style.marginTop20}`}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore,
              <span className={`${style.blueColor} ${style.marginLeft20}`}>
                quis nostrud xercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat
              </span>
            </p>
          </label>
        </div>

        <div className={`${style.positionCenter} ${style.marginTop20}`}>
          <button
            className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`}
            onClick={() => getActivationAlertDraftDialog(true)}
          >
            RETURN
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ActivationAlertDraftContract;
