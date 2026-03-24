import React, { useEffect, useState } from "react";
import { Dialog, Classes, Icon, Intent } from "@blueprintjs/core";
import style from "./../index.module.scss";
import { ErrorToaster, SuccessToaster } from "./../../../utils/toaster";
import { POST, GET, PUT } from "./../../dataSaver";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Switch, makeStyles } from "@material-ui/core";
import WritingFile from "./../../../images/writing-file.svg";
import CommonDropZone from "../../../Components/CommonFields/CommonDropZone";
import Editor from "../common/Editor";
import MarkdownEditor from "../../../Components/MarkdownEditor";
import CommonInputField from "../../../Components/CommonFields/CommonInputField";

const useStyles = makeStyles({
  switch: {
    "& .Mui-checked":     { color: "#06617A" },
    "& .MuiSwitch-track": { backgroundColor: "#06617A !important" },
  },
});

const AcknowledgmentDialog = ({
  open,
  handleClose,
  isEdit,
  selectedAcknowledgement,
  applicantTypeList: propApplicantTypeList,
}) => {
  const classes = useStyles();

  const [applicantTypeList, setApplicantTypeList]           = useState([]);
  const [applicantTypeIds, setApplicantTypeIds]             = useState([]);
  const [selectedApplicantTypes, setSelectedApplicantTypes] = useState([]);
  const [title, setTitle]                                   = useState("");
  const [content, setContent]                               = useState("");
  const [disclaimer, setDisclaimer]                         = useState("");
  const [file, setFile]                                     = useState(null);
  const [uploadedFileName, setUploadedFileName]             = useState("");
  const [eInitialRequired, setEInitialRequired]             = useState(false);
  const [signatureRequired, setSignatureRequired]           = useState(false);
  const [followUpRequired, setFollowUpRequired]             = useState(false);
  const [isSubmitting, setIsSubmitting]                     = useState(false);
  const [titleError, setTitleError]                         = useState(false);

  // ── Load applicant type list ──────────────────────────────
  useEffect(() => {
    if (propApplicantTypeList?.length > 0) {
      setApplicantTypeList(propApplicantTypeList);
    } else {
      fetchApplicantTypes();
    }
  }, [propApplicantTypeList]);

  const fetchApplicantTypes = async () => {
    try {
      const { data } = await GET("entity-service/applicantType");
      setApplicantTypeList(data || []);
    } catch (e) { console.error("applicantType:", e); }
  };

  // ── Populate or reset when dialog opens ──────────────────
  useEffect(() => {
    if (!open) return;
    if (isEdit && selectedAcknowledgement) {
      const ids = (selectedAcknowledgement?.applicantTypes || []).map((d) => d?.id).filter(Boolean);
      setApplicantTypeIds(ids);
      setSelectedApplicantTypes(selectedAcknowledgement?.applicantTypes || []);
      setTitle(selectedAcknowledgement?.title || "");
      setContent(selectedAcknowledgement?.content?.content || "");
      setDisclaimer(selectedAcknowledgement?.disclaimer?.content || "");
      setFile(selectedAcknowledgement?.file || null);
      setUploadedFileName(selectedAcknowledgement?.file?.fileName || "");
      setEInitialRequired(selectedAcknowledgement?.einitialRequiredOnEachPage   || false);
      setSignatureRequired(selectedAcknowledgement?.esignatureRequiredOnEachPage || false);
      setFollowUpRequired(selectedAcknowledgement?.followUpTaskRequired          || false);
    } else {
      resetFields();
    }
    setTitleError(false);
  }, [open, isEdit, selectedAcknowledgement]);

  // Sync selected objects when IDs or list change
  useEffect(() => {
    if (applicantTypeIds.length > 0 && applicantTypeList.length > 0) {
      setSelectedApplicantTypes(
        applicantTypeList.filter((d) => applicantTypeIds.includes(d?.id))
      );
    }
  }, [applicantTypeIds, applicantTypeList]);

  const resetFields = () => {
    setApplicantTypeIds([]);
    setSelectedApplicantTypes([]);
    setTitle("");
    setContent("");
    setDisclaimer("");
    setFile(null);
    setUploadedFileName("");
    setEInitialRequired(false);
    setSignatureRequired(false);
    setFollowUpRequired(false);
    setTitleError(false);
  };

  // ── Helpers ───────────────────────────────────────────────
  const getApplicantLabel = (item) => {
    const raw = item?.applicantType;
    if (typeof raw === "string") return raw;
    if (Array.isArray(raw))      return raw[0] || "";
    if (typeof raw === "object") return raw?.type || raw?.name || "";
    return "";
  };

  const handleApplicantTypeChange = (value) => {
    const ids = typeof value === "string" ? value.split(",") : value;
    setApplicantTypeIds(ids);
  };

  // ── File upload ───────────────────────────────────────────
  const changeHandler = async (files) => {
    const fileObj = Array.isArray(files) ? files[0] : files?.[0];
    if (!fileObj) return;
    const formData = new FormData();
    formData.append(
      "fileDTO",
      new Blob([JSON.stringify({ fileName: fileObj.name })], { type: "application/json" })
    );
    formData.append("file", fileObj);
    try {
      const response = await POST("entity-service/acknowledgementForm/file", formData);
      SuccessToaster("File uploaded successfully.");
      setFile(response?.data);
      setUploadedFileName(fileObj.name);
    } catch (e) {
      ErrorToaster("File upload failed. Please try again.");
    }
  };

  // ── Validation ────────────────────────────────────────────
  const validate = () => {
    if (!title.trim()) {
      setTitleError(true);
      ErrorToaster("Acknowledgement Form Title is required.");
      return false;
    }
    setTitleError(false);
    return true;
  };

  // ── Save ──────────────────────────────────────────────────
  // isSaveAndExit=true  → close dialog, parent refreshes table
  // isSaveAndExit=false → stay open with cleared fields (Add More)
  const handleSave = async (isSaveAndExit) => {
    if (!validate()) return;
    setIsSubmitting(true);

    const payload = {
      applicantTypes:               selectedApplicantTypes,
      title:                        title.trim(),
      content:                      { content },
      file:                         file || null,
      contentType:                  "Text",
      disclaimer:                   { content: disclaimer },
      einitialRequiredOnEachPage:   eInitialRequired,
      esignatureRequiredOnEachPage: signatureRequired,
      followUpTaskRequired:         followUpRequired,
    };

    try {
      if (!isEdit) {
        await POST("entity-service/acknowledgementForm", JSON.stringify(payload));
        SuccessToaster("Acknowledgement Form added successfully.");
      } else {
        await PUT(
          `entity-service/acknowledgementForm/${selectedAcknowledgement?.id}`,
          JSON.stringify(payload)
        );
        SuccessToaster("Acknowledgement Form updated successfully.");
      }

      resetFields();

      if (isSaveAndExit) {
        handleClose(true); // → parent calls getAcknowledgement() with no filter
      }
      // SAVE & ADD MORE: dialog stays open, fields cleared, user can add another
    } catch (e) {
      console.error("[AckDialog] Save error:", e);
      ErrorToaster(e?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetFields();
    handleClose(false);
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <Dialog
      isOpen={open}
      onClose={handleCancel}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>

        {/* Header */}
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>
            {isEdit ? "Edit Acknowledgement Form" : "Setup Your Acknowledgement Forms"}
          </p>
          <div className={`${style.floatRight} ${style.imageSpaceAlignment}`}>
            <img src={WritingFile} className={style.dialogCrossStyle} alt="Writing File" />
            <Icon
              icon="cross"
              size={30}
              intent={Intent.DANGER}
              className={style.dialogCrossStyle}
              onClick={handleCancel}
            />
          </div>
        </div>

        <div className={style.ReferenceListEntityBorder} />

        <div className={style.addHealthCareBoxStyle}>

          {/* APPLICANT TYPE multiselect */}
          <div>
            <div className={style.entityLableStyle}>APPLICANT TYPE *</div>
            <FormControl className={style.fullWidth} size="small">
              <Select
                multiple
                value={applicantTypeIds}
                onChange={(e) => handleApplicantTypeChange(e.target.value)}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected?.length)
                    return <span style={{ color: "#9e9e9e" }}>Select Applicant Type - Multiselect</span>;
                  return applicantTypeList
                    .filter((d) => selected.includes(d?.id))
                    .map(getApplicantLabel)
                    .join(", ");
                }}
                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
              >
                {applicantTypeList.length === 0 && (
                  <MenuItem disabled value="">No applicant types found</MenuItem>
                )}
                {applicantTypeList.map((item, idx) => (
                  <MenuItem value={item?.id} key={item?.id || idx}>
                    {getApplicantLabel(item)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`} />

          {/* TITLE */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>ACKNOWLEDGEMENT FORM TITLE *</div>
            <CommonInputField
              value={title}
              className={style.fullWidth}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setTitleError(false);
              }}
              placeholder={"Enter Acknowledgement Form Title Here"}
            />
            {titleError && (
              <span style={{ color: "#d32f2f", fontSize: 12, marginTop: 4, display: "block" }}>
                Title is required
              </span>
            )}
          </div>

          {/* CONTENT */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>ACKNOWLEDGEMENT FORM CONTENT *</div>
            <Editor
              editorHtml={content}
              onChange={(val) => setContent(val)}
              placeholder={"Enter Acknowledgement form Content Here"}
            />
          </div>

          {/* OR divider */}
          <div className={style.acknowledgementListContainer}>
            <div className={style.acknowledgementListEntityBorder} />
            <span className={style.acknowledgementText}>OR</span>
          </div>

          {/* Upload zones */}
          <div className={`${style.twoCol} ${style.marginTop20}`}>
            <CommonDropZone
              title={"Upload Your Documents"}
              description={"Upload your files or drag & drop from your cabinet"}
              changeHandler={changeHandler}
            />
            <CommonDropZone
              title={"Upload A Photo"}
              description={"Click a picture with your Camera or upload from Gallery."}
              changeHandler={changeHandler}
              accept="image/*"
            />
          </div>

          {/* Uploaded file badge */}
          {uploadedFileName && (
            <div style={{ marginTop: 8, fontSize: 13, color: "#06617A" }}>
              ✓ Uploaded: <strong>{uploadedFileName}</strong>
              <button
                style={{ marginLeft: 8, background: "none", border: "none", color: "#d32f2f", cursor: "pointer", fontSize: 13 }}
                onClick={() => { setFile(null); setUploadedFileName(""); }}
              >
                Remove
              </button>
            </div>
          )}

          {/* DISCLAIMER */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>DISCLAIMER CONTENTS *</div>
            <MarkdownEditor
              editorHtml={disclaimer}
              onChange={(val) => setDisclaimer(val)}
              placeholder={"Enter Disclaimer Here"}
            />
          </div>

          {/* Toggles */}
          <div className={`${style.signatureGrid} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>
              Applicant e-Initials required on each page
            </div>
            <FormControlLabel
              control={
                <Switch
                  checked={eInitialRequired}
                  onChange={(e) => setEInitialRequired(e.target.checked)}
                  className={classes.switch}
                />
              }
              className={style.switchFontStyle}
              label={eInitialRequired ? "Yes" : "No"}
              labelPlacement="start"
            />
          </div>

          <div className={`${style.signatureGrid} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>
              Applicant e-Signature With Date Required
            </div>
            <FormControlLabel
              control={
                <Switch
                  checked={signatureRequired}
                  onChange={(e) => setSignatureRequired(e.target.checked)}
                  className={classes.switch}
                />
              }
              className={style.switchFontStyle}
              label={signatureRequired ? "Yes" : "No"}
              labelPlacement="start"
            />
          </div>

          <div className={`${style.signatureGrid} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>Follow Up Task Required</div>
            <FormControlLabel
              control={
                <Switch
                  checked={followUpRequired}
                  onChange={(e) => setFollowUpRequired(e.target.checked)}
                  className={classes.switch}
                />
              }
              className={style.switchFontStyle}
              label={followUpRequired ? "Yes" : "No"}
              labelPlacement="start"
            />
          </div>
        </div>

        {/* Footer buttons */}
        <div className={style.marginTop20}>
          <div className={style.floatLeft}>
            <input
              type="file"
              id="ack-bulk-upload"
              multiple
              style={{ display: "none" }}
              onChange={(e) => changeHandler(Array.from(e.target.files))}
            />
            <button
              className={style.outlinedButton}
              onClick={() => document.getElementById("ack-bulk-upload").click()}
              disabled={isSubmitting}
            >
              BULK UPLOAD
            </button>
          </div>

          <div className={style.floatRight}>
            <button
              className={style.outlinedButton}
              onClick={() => handleSave(true)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "SAVING..." : "SAVE & EXIT"}
            </button>
            <button
              className={`${style.buttonStyle} ${style.marginLeft20}`}
              onClick={() => handleSave(false)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "SAVING..." : "SAVE & ADD MORE"}
            </button>
          </div>
        </div>

      </div>
    </Dialog>
  );
};

export default AcknowledgmentDialog;