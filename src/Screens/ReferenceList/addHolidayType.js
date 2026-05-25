import React, { useEffect, useState } from "react";
import { Dialog, Classes, Icon, Intent } from "@blueprintjs/core";
import style from "./index.module.scss";
import { GET, POST } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";

const AddHolidayType = ({
  open,                  // boolean — controls dialog visibility
  getAddEntityDialog,    // callback(false) to close
  onSuccess,             // optional: called after successful save
  preSelectedIndustryId, // pre-selects the currently active industry
}) => {
  const [industry, setIndustry]         = useState([]);
  const [industryName, setIndustryName] = useState("");
  const [years, setYears]               = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Year list: 2021 → 2050
  const dynamicYears = [];
  for (let y = 2021; y <= 2050; y++) dynamicYears.push(y);

  const handleClose = () => getAddEntityDialog(false);

  useEffect(() => {
    if (open) GetIndustryData();
  }, [open]);

  // Pre-select active industry when list loads
  useEffect(() => {
    if (industry.length > 0) {
      setIndustryName(preSelectedIndustryId || industry[0]?.id || "");
      setYears(new Date().getFullYear()); // default to current year
    }
  }, [industry, preSelectedIndustryId]);

  const GetIndustryData = async () => {
    try {
      const { data } = await GET("entity-service/industryMaster");
      setIndustry(data || []);
    } catch (e) { console.error("industryMaster:", e); }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!industryName) { ErrorToaster("Please select an Industry."); return; }
    if (!years)        { ErrorToaster("Please select a Year."); return; }

    setIsSubmitting(true);
    try {
      // FIX: Removed customized: true — HolidayMaster model has no customized field
      await POST(
        "entity-service/yearMaster",
        JSON.stringify({ year: `${years}`, industryId: { id: industryName } })
      );
      SuccessToaster("Year Added Successfully");
      if (onSuccess) onSuccess();
      else handleClose();
    } catch (error) {
      ErrorToaster(error?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={open}
      onClose={handleClose}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>

        {/* Header */}
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>Add Holiday Year</p>
          <Icon
            icon="cross"
            size={20}
            intent={Intent.DANGER}
            className={style.dialogCrossStyle}
            onClick={handleClose}
          />
        </div>

        <div className={style.ReferenceListEntityBorder} />

        <div className={style.addHealthCareBoxStyle}>

          {/* Industry dropdown — pre-selects active industry */}
          <div className={style.editHealthCareGrid2}>
            <div className={style.entityLableStyle}>Industry Name *</div>
            <div className={style.displayInRow}>
              <select
                value={industryName}
                onChange={(e) => setIndustryName(e.target.value)}
                className={`${style.halfWidth} ${style.selectDropdownInputBox}`}
              >
                <option value="">Select Industry</option>
                {industry.map((data) => (
                  <option key={data.id} value={data.id}>
                    {data.industry || data.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Year dropdown — 2021 to 2050 */}
          <div className={`${style.editHealthCareGrid2} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>Year *</div>
            <div className={style.displayInRow}>
              <select
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className={`${style.halfWidth} ${style.selectDropdownInputBox}`}
              >
                <option value="">Select Year</option>
                {dynamicYears.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={`${style.floatRight} ${style.marginTop20}`}>
          <button
            className={style.outlinedButton}
            onClick={handleClose}
            disabled={isSubmitting}
          >
            CANCEL
          </button>
          <button
            onClick={onSubmitHandler}
            className={`${style.buttonStyle} ${style.marginLeft20}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "SAVING..." : "SAVE"}
          </button>
        </div>

      </div>
    </Dialog>
  );
};

export default AddHolidayType;