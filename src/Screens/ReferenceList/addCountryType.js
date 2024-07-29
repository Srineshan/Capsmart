import React, { useState, useEffect } from "react";
import { Dialog, Classes, Icon, Intent, InputGroup, RadioGroup, Radio } from '@blueprintjs/core';
import ArrowDown from "./../../images/arrowDown.png";
import style from "./index.module.scss";
import { POST, PUT, TenantID } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import Select from "react-select";

const AddCountryType = ({ getAddCountryDialog }) => {
  const [absenseType, setAbsenseType] = useState("Planned");
  const [language, setLanguage] = useState([]);

  const handleChange = (language) => {
    setLanguage(language || []);
  };

  const options = [
    { value: "English", label: "English" },
    { value: "French", label: "French" },
  ];

  const arrowDown = () => {
    return (
      <img
        src={ArrowDown}
        className={`${style.colorFileStyle3} ${style.marginRight}`}
        alt=""
      />
    );
  };

  const leftElement = () => {
    return (
      <div>
        <label for="file-upload" className={style.customFileUpload}>
          UPLOAD
        </label>
        <input id="file-upload" type="file" />
      </div>
    )
  }


  return (
    <Dialog
      isOpen={getAddCountryDialog}
      onClose={() => getAddCountryDialog(false)}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>
            Add / Edit Country
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
              onClick={() => getAddCountryDialog(false)}
            />
          </div>
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <div className={`${style.countryGridInput}`}>
            <div className={style.entityLableStyle}>Country Name</div>
            <div className={style.twoCol}>
              <div className={`${style.displayInRow} ${style.width140}`}>
                <select
                  name="class"
                  id="Class"
                  value={absenseType}
                  onChange={(e) => setAbsenseType(e.target.value)}
                  className={`${style.selectDropdownInputBox} ${style.width140}`}
                >
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                </select>
              </div>
              <RadioGroup
                inline={true}
                className={` ${style.marginLeft20} ${style.marginTop} ${style.textAlignRight}`}
                selectedValue={"ADD STATES"}
              >
                <Radio label="ADD STATES" value="ADD STATES" />
              </RadioGroup>
            </div>
          </div>
          <div className={`${style.countryGridInput} ${style.marginTop10}`}>
            <div className={style.entityLableStyle}>Language*</div>
            <div className={style.displayInRow}>
              <Select
                className={`${style.halfWidth} ${style.selectDropdownInputBox}`}
                options={options}
                onChange={handleChange}
                value={language}
                isMulti
              />
            </div>
          </div>
          <div className={`${style.countryGridInput} ${style.marginTop10}`}>
            <div className={style.entityLableStyle}>Currency Type*</div>
            <div className={style.displayInRow}>
              <select
                name="class"
                id="Class"
                value={absenseType}
                onChange={(e) => setAbsenseType(e.target.value)}
                className={`${style.width34} ${style.selectDropdownInputBox}`}
              >
                <option value="$">$</option>
              </select>
            </div>
          </div>
          <div className={`${style.countryGridInput} ${style.marginTop10}`}>
            <div className={style.entityLableStyle}>Date Format*</div>
            <div className={style.displayInRow}>
              <select
                name="class"
                id="Class"
                value={absenseType}
                onChange={(e) => setAbsenseType(e.target.value)}
                className={`${style.width34} ${style.selectDropdownInputBox}`}
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              </select>
            </div>
          </div>
          <div className={`${style.countryGridInput} ${style.marginTop20}`}>
            <div className={style.extentionLableStyle}>Flag Image</div>
            <div className={style.displayInRow}>
              <InputGroup leftElement={leftElement()} className={style.width34} />
            </div>
          </div>
          <div
            className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
          ></div>
          <div className={`${style.addHealthCareBoxStyle}`}>
            <div className={`${style.countryGridInput} ${style.displayInRow}`}>
              <div className={style.entityLableStyle}>State / Province / Territory Name*</div>
              <div className={style.displayInRow}>
                <InputGroup
                  value={""}
                  placeholder="Alberta"
                  id="absenceEl"
                  className={`${style.fullWidth} ${style.marginTop10}`}
                // onChange={(e) => setAbsenseReason(e.target.value)}
                />
              </div>
            </div>
            <div className={`${style.countryGridInput} ${style.displayInRow} ${style.marginTop15}`}>
              <div className={style.entityLableStyle}>Abbreviation*</div>
              <div className={style.displayInRow}>
                <InputGroup
                  value={""}
                  placeholder="AB"
                  id="absenceEl"
                  className={style.width34}
                // onChange={(e) => setAbsenseReason(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={`${style.spaceBetween} ${style.marginTop20}`}>
            <div></div>
            <div
              className={`${style.addMoreCardStyle} ${style.addMoreTextStyle}`}
            >
              ADD MORE
            </div>
          </div>
        </div>
        <div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button
              className={style.outlinedButton}
              onClick={() => getAddCountryDialog(false)}
            >
              CANCEL
            </button>
            <button
              className={`${style.buttonStyle} ${style.marginLeft20}`}
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddCountryType;
