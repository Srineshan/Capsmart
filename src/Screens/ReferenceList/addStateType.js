import React, { useState, useEffect } from "react";
import { Dialog, Classes, Icon, Intent, InputGroup, RadioGroup, Radio } from '@blueprintjs/core';
import ArrowDown from "./../../images/arrowDown.png";
import style from "./index.module.scss";
import { POST, PUT, TenantID } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import Select from "react-select";

const AddStateType = ({ getAddStateDialog, countryId, getStateList, isStateEdit, selectedState }) => {
  const [stateId, setStateId] = useState("");
  const [stateName, setStateName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [language, setLanguage] = useState("");

  useEffect(() => {
    if (isStateEdit) {
      setStateId(selectedState?.id)
      setStateName(selectedState?.state)
      setAbbreviation(selectedState?.abbreviation)
      setLanguage(selectedState?.language)
    }
  }, [isStateEdit, selectedState]);

  const saveSubmitHandler = async () => {
    const data = {
      "state": stateName,
      "abbreviation": abbreviation,
      "language": language
    }

    // console.log("StateData", data)
    let ApiData = !isStateEdit ? [data] : data;

    if (!isStateEdit) {
      await POST(`entity-service/stateMaster?countryId=${countryId}`, JSON.stringify(ApiData))
        .then((response) => {
          SuccessToaster("State Added Successfully");
          getStateList();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
      getAddStateDialog(false)
    } else {
      await PUT(`entity-service/stateMaster/${stateId}?id=${stateId}&countryId=${countryId}`, JSON.stringify(ApiData))
        .then((response) => {
          SuccessToaster("State Updated Successfully");
          getStateList();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
      getAddStateDialog(false)
    }
  }


  const arrowDown = () => {
    return (
      <img
        src={ArrowDown}
        className={`${style.colorFileStyle3} ${style.marginRight}`}
        alt=""
      />
    );
  };


  return (
    <Dialog
      isOpen={getAddStateDialog}
      onClose={() => getAddStateDialog(false)}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>
            Add / Edit State
          </p>
          <div className={`${style.displayInRow}`}>
            <div className={`${style.displayInRow} ${style.marginRight20}`}>
              <img
                src={
                  "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/125px-Flag_of_the_United_States.svg.png"
                }
                alt="refresh"
                className={`${style.headerFlag} ${style.marginRight15}`}
              />
              <span
                className={`${style.headerCountryName} ${style.marginLeft10}`}
              >
                USA
              </span>
              <img
                src={ArrowDown}
                className={`${style.colorFileStyle2} ${style.marginLeft10}  ${style.marginTop10}`}
                alt=""
              />
            </div>
            <Icon
              icon="cross"
              size={20}
              intent={Intent.DANGER}
              className={style.dialogCrossStyle}
              onClick={() => getAddStateDialog(false)}
            />
          </div>
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <div className={`${style.countryGridInput} ${style.displayInRow}`}>
            <div className={style.entityLableStyle}>State Name*</div>
            <div className={style.displayInRow}>
              <InputGroup
                value={stateName}
                placeholder=""
                id="stateName"
                className={`${style.width50}`}
                onChange={(e) => setStateName(e.target.value)}
              />
            </div>
          </div>
          <div className={`${style.countryGridInput} ${style.displayInRow} ${style.marginTop10}`}>
            <div className={style.entityLableStyle}>Abbreviation</div>
            <div className={style.displayInRow}>
              <InputGroup
                value={abbreviation}
                placeholder=""
                id="abbreviation"
                className={`${style.width50}`}
                onChange={(e) => setAbbreviation(e.target.value)}
              />
            </div>
          </div>
          <div className={`${style.countryGridInput} ${style.displayInRow} ${style.marginTop10}`}>
            <div className={style.entityLableStyle}>Language</div>
            <div className={style.displayInRow}>
              <InputGroup
                value={language}
                placeholder=""
                id="language"
                className={`${style.width50}`}
                onChange={(e) => setLanguage(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button
              className={style.outlinedButton}
              onClick={() => getAddStateDialog(false)}
            >
              CANCEL
            </button>
            <button
              className={`${style.buttonStyle} ${style.marginLeft20}`}
              onClick={() => saveSubmitHandler("Save & Exit")}
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddStateType;
