import React, { useEffect, useState } from "react";
import {
  Dialog,
  Classes,
  Icon,
  Intent,
  InputGroup,
  RadioGroup,
  Radio,
} from "@blueprintjs/core";
import style from "./index.module.scss";
import { GET, POST } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { index } from "d3";
import ArrowDown from "./../../images/arrowDown.png";

const AddHolidayType = ({ getAddEntityDialog }) => {
  const [industry, setIndustry] = useState([]);
  const [industryName, setIndustryName] = useState("");
  const [years, setYears] = useState("");

  const GetIndustryData = async () => {
    const { data: Industrydata } = await GET(`entity-service/industryMaster`);
    setIndustry(Industrydata);
  };

  const useDynamicYears = ({ startingYear, numberOfYears }) => {
    const dynamicYears = [];
    for (let year = startingYear; year < startingYear + numberOfYears; year++) {
      dynamicYears.push(year);
    }
    return dynamicYears;
  };

  const dynamicYears = useDynamicYears({
    startingYear: 2023,
    numberOfYears: 28,
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    let data = {
      year: `${years}`,
      industryId: {
        id: industryName,
      },
      customized: true,
    };

    await POST("entity-service/yearMaster", JSON.stringify(data))
      .then((response) => {
        SuccessToaster("Year Added Successfully");
        getAddEntityDialog(false);
      })
      .catch((error) => {
        ErrorToaster(error);
      });
  };

  useEffect(() => {
    GetIndustryData();
  }, []);

  useEffect(() => {
    setIndustryName(industry?.[0]?.id);
    setYears(dynamicYears?.[0]);
  }, [industry]);

  return (
    <Dialog
      isOpen={getAddEntityDialog}
      onClose={() => getAddEntityDialog(false)}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>Company Holiday</p>
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
              onClick={() => getAddEntityDialog(false)}
            />
          </div>
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <div className={`${style.editHealthCareGrid2}`}>
            <div className={style.entityLableStyle}>Industry Name</div>
            <div className={style.displayInRow}>
              <select
                name="class"
                id="Class"
                value={industryName}
                onChange={(e) => setIndustryName(e.target.value)}
                className={`${style.halfWidth} ${style.selectDropdownInputBox}`}
              >
                {industry.map((data, index) => (
                  <option key={index} value={data.id}>
                    {data.industry}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={`${style.editHealthCareGrid2} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>YEAR</div>
            <div className={style.displayInRow}>
              <select
                name="class"
                id="Class"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className={`${style.halfWidth} ${style.selectDropdownInputBox}`}
              >
                {dynamicYears.map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button
              className={style.outlinedButton}
              onClick={() => getAddEntityDialog(false)}
            >
              CANCEL
            </button>
            <button
              onClick={onSubmitHandler}
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

export default AddHolidayType;
