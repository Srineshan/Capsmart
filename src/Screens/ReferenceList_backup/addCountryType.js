import React, { useState, useEffect } from "react";
import { Dialog, Classes, Icon, Intent, InputGroup, RadioGroup, Radio } from '@blueprintjs/core';
import ArrowDown from "./../../images/arrowDown.png";
import style from "./index.module.scss";
import { POST, PUT, TenantID } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import Select from "react-select";

const AddCountryType = ({ getAddCountryDialog, getCountryList, isCountryEdit, selectedCountry, getAddStateList }) => {
  const [countryId, setCountryId] = useState("");
  const [countryName, setCountryName] = useState("United States");
  const [countryType, setCountryType] = useState("$");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [abbreviation, setAbbreviation] = useState("");
  const [decimalFormat, setDecimalFormat] = useState("");
  const [language, setLanguage] = useState([]);
  const [createdDate, setCreatedDate] = useState("");
  const [flag, setFlag] = useState({ fileName: '', fileURL: '', filePath: '' });
  const [arrayOfStrings, setArrayOfStrings] = useState([]);

  console.log("selectedCountry", selectedCountry)

  useEffect(() => {
    if (isCountryEdit) {
      setCountryId(selectedCountry?.id)
      setCountryName(selectedCountry?.country)
      setCountryType(selectedCountry?.currencyType)
      setAbbreviation(selectedCountry?.abbreviation)
      setDecimalFormat(selectedCountry?.decimalFormat)
      setDateFormat(selectedCountry?.dateFormat)
      setLanguage(selectedCountry?.languages.map((data) => ({
        value: data, label: data
      })))
      setFlag(selectedCountry?.flag)
    }
  }, [isCountryEdit, selectedCountry]);

  useEffect(() => {
    const strings = language.map(obj => `${obj.value}`);
    setArrayOfStrings(strings);
  }, [language]);

  const handleChange = (language) => {
    console.log(language)
    setLanguage(language || []);
  };

  const handleFlagFile = async (e) => {
    const formData = new FormData();
    let data = {
      "fileName": e.target?.files?.[0]?.name
    }
    if (flag !== null) {
      formData.append('file', new Blob([JSON.stringify(data)], {
        type: "application/json"
      }));

      formData.append('flag', e.target.files[0]);

      await POST(`entity-service/countryMaster/flag`, formData)
        .then(response => {
          // console.log(response)
          setFlag({ ...flag, fileURL: response?.data?.fileURL || '', fileName: response?.data?.fileName || '', filePath: response?.data?.filePath || '' });
          SuccessToaster('Country Flag Updated Successfully');
        })
        .catch(error => {
          ErrorToaster('Unexpected Error Occured');
        })
    }
  }


  const saveSubmitHandler = async () => {
    const data = {
      "country": countryName,
      "abbreviation": abbreviation,
      "currencyType": countryType,
      "dateFormat": dateFormat,
      "decimalFormat": decimalFormat,
      "languages": arrayOfStrings,
      "flag": flag,
      "customized": true
    }

    // console.log("CountryName", data)

    if (!isCountryEdit) {
      await POST("entity-service/countryMaster", JSON.stringify(data))
        .then((response) => {
          SuccessToaster("Country Added Successfully");
          getCountryList()
        })
        .catch((error) => {
          ErrorToaster(error);
        });
      getAddCountryDialog(false)
    } else {
      await PUT(`entity-service/countryMaster/${countryId}?id=${countryId}`, JSON.stringify(data))
        .then((response) => {
          SuccessToaster("Country Updated Successfully");
          getCountryList()
          getAddStateList(false)
        })
        .catch((error) => {
          ErrorToaster(error);
        });
      getAddCountryDialog(false)
    }

  }

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
        <label for="flag-upload" className={style.customFileUpload}>
          UPLOAD
        </label>
        <input id="flag-upload" type="file" accept="image/png, image/jpeg" onChange={handleFlagFile} />
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
            {isCountryEdit ? "Edit" : "Add"} Country
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
                  value={countryName}
                  onChange={(e) => setCountryName(e.target.value)}
                  className={`${style.selectDropdownInputBox} ${style.width140}`}
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="United Kingdom">United Kingdom</option>
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
                value={countryType}
                onChange={(e) => setCountryType(e.target.value)}
                className={`${style.width34} ${style.selectDropdownInputBox}`}
              >
                <option value="$">$</option>
                <option value="£">£</option>
                <option value="CAN $">CAN $</option>
                <option value="AU $">AU $</option>
              </select>
            </div>
          </div>
          <div className={`${style.countryGridInput} ${style.marginTop10}`}>
            <div className={style.entityLableStyle}>Date Format*</div>
            <div className={style.displayInRow}>
              <select
                name="class"
                id="Class"
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className={`${style.width34} ${style.selectDropdownInputBox}`}
              >
                <option value="dd/MM/yyyy">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="M/d/yyyy">M/d/yyyy</option>
                <option value="yyyy-MM-dd">yyyy-MM-dd</option>
                <option value="yyyyMMddTHH:mmzzz">yyyyMMddTHH:mmzzz</option>
              </select>
            </div>
          </div>
          <div className={`${style.countryGridInput} ${style.marginTop20}`}>
            <div className={style.extentionLableStyle}>Flag Image</div>
            <div className={style.displayInRow}>
              <InputGroup value={flag?.fileName} leftElement={leftElement()} className={style.width34} />
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
                  value={decimalFormat}
                  placeholder="Alberta"
                  id="decimalFormat"
                  className={`${style.fullWidth} ${style.marginTop10}`}
                  onChange={(e) => setDecimalFormat(e.target.value)}
                />
              </div>
            </div>
            <div className={`${style.countryGridInput} ${style.displayInRow} ${style.marginTop15}`}>
              <div className={style.entityLableStyle}>Abbreviation*</div>
              <div className={style.displayInRow}>
                <InputGroup
                  value={abbreviation}
                  placeholder="AB"
                  id="abbreviation"
                  className={style.width34}
                  onChange={(e) => setAbbreviation(e.target.value)}
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

export default AddCountryType;
