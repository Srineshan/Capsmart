import React, { useState, useEffect } from "react";
import { Dialog } from "@blueprintjs/core";
import TextField from "@mui/material/TextField";
import CrossPink from "../../images/crossPink.png";
import { GET, PUT } from "../../Screens/dataSaver";
import { ErrorToaster, SuccessToaster } from "../../utils/toaster";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CommonSelectField from "../CommonFields/CommonSelectField";
import CommonRadio from "../CommonFields/CommonRadio";
import CommonTextField from "../CommonFields/CommonTextField";
import CommonDropZone from "../CommonFields/CommonDropZone";
import style from "./index.module.scss";

const TASK_AVAILABILITY_OPTIONS = [
  "Upon Verification By Staff Manager",
  "By Default",
];
const TASK_AVAILABILITY_VALUES = [
  "UPON_VERIFICATION",
  "AVAILABLE_BY_DEFAULT",
];
const TASK_COMPLETION_OPTIONS = [
  "Automatically send email notification",
  "Staff Manager to manually send email notification",
  "Status to be updated manually by Staff Manager (No Email)",
];
const TASK_COMPLETION_VALUES = [
  "AUTOMATIC",
  "MANUAL",
  "NA",
];
const RECIPIENT_TYPE_OPTIONS = [
  "Team / Group",
  "External Recipient",
  "CMH Staff Recipient",
  "Entered In Application - reference from application",
  "Applicant",
];
const ACCESS_METHOD_OPTIONS = [
  "Action Button within Email body for recipient to access",
  "Send as PDF attachment(s)",
  "Both - Action Button & PDF Attachment(s)",
  "No Completed Application Forms To Include",
];
const ACCESS_METHOD_VALUES = [
  "ACTION_BUTTON",
  "PDF_ATTACHMENT",
  "BOTH",
  "NONE",
];
const RECEIPT_OPTIONS = [
  "Enable Receipt And Access Confirmation",
  "Do Not Enable",
];
const APPLICANT_DATA_CHIPS = [
  "Name",
  "Staff Type",
  "Email Address",
  "Contact Number",
  "Department / Specialty",
];

const makeRecipientId = () => `recipient-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const buildEmailTemplateHtml = ({ taskName, introHtml, closingHtml }) => {
  const safeTaskName = taskName || "Task";
  const safeIntro =
    introHtml && introHtml.trim().length > 0
      ? introHtml
      : `The applicant referenced below has applied for credentialing and privileging at \${entityName} and requires ${safeTaskName} as part of the onboarding process.`;
  const safeClosing =
    closingHtml && closingHtml.trim().length > 0
      ? closingHtml
      : `Please review and complete the attached ${safeTaskName} form for the new member of staff. If you have any questions regarding this request, please contact the Medical Staff Office.`;

  // Email-safe: tables + inline CSS. Keep backend placeholders intact (e.g. ${entityName}).
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTaskName}</title>
</head>
<body style="margin:10px;padding:20px;font-family:Montserrat,Arial,sans-serif;background-color:#CCD7DA;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;margin:20px auto;background-color:#ffffff;border-radius:8px;overflow:hidden;">
    <tr>
      <td style="padding:60px 40px 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="left">
              <img src=\${logo} alt="logo" width="140" style="display:block;" />
            </td>
            <td align="right">
              <img src="https://capmanager-dev.s3.us-east-1.amazonaws.com/CAP_Manager.png" alt="Cap Manager" width="40" style="display:block;" />
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 40px;line-height:1.3;">
        <h3 style="color:#06617a;font-size:20px;margin:0 0 10px 0;">New Staff Applicant</h3>
        <h1 style="color:#06617a;font-size:35px;margin:0 0 15px 0;">${safeTaskName}</h1>
        <div style="color:#171A1A;font-size:14px;margin-bottom:15px;">${safeIntro}</div>
        <div style="border:1px solid #9AAFB5;padding:20px;border-radius:8px;background:#F5F8F8;width:95%;margin:20px 0;">
          <table style="width:100%;table-layout:fixed;">
            <tr>
              <td style="width:60%;text-align:left;vertical-align:top;">
                <p style="font-size:18px;font-weight:bold;color:#171A1A;margin:0;">
                  \${applicantFirstName}, \${applicantMiddleName} \${applicantLastName}
                  <span style="font-size:12px;font-weight:normal;">(\${position})</span>
                </p>
              </td>
            </tr>
          </table>
          <table style="width:100%;margin-top:10px;font-size:14px;color:#171A1A;">
            <tr style="width:100%;">
              <td style="padding:3px 0;width:50%;">Applicant Email Address:</td>
              <td style="padding:3px 0;width:50%;">\${applicantEmailId}</td>
            </tr>
            <tr style="width:100%;">
              <td style="padding:3px 0;width:50%;">Contact Number:</td>
              <td style="padding:3px 0;width:50%;">\${mobileNumber}</td>
            </tr>
            <tr style="width:100%;">
              <td style="padding:3px 0;width:50%;">Department / Specialty:</td>
              <td style="padding:3px 0;width:50%;">\${basicDetailReferenceDepartment}</td>
            </tr>
            <tr style="width:100%;">
              <td style="padding:3px 0;width:50%;">Application Date:</td>
              <td style="padding:3px 0;width:50%;">\${applicationSubmittedDate}</td>
            </tr>
          </table>
        </div>
        <div style="color:#171A1A;font-size:14px;margin-bottom:15px;">${safeClosing}</div>
      </td>
    </tr>
  </table>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;margin:20px auto;background-color:#ffffff;border-radius:8px;overflow:hidden;margin-bottom:0;">
    <tr>
      <td style="padding:20px 40px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="left">
              <img src="https://capmanager-dev.s3.us-east-1.amazonaws.com/powered_by_HapiCare.png" alt="Powered by HapiCare" width="100" />
            </td>
            <td align="right" style="font-size:12px;color:#737375;text-align:right;opacity:0.74;">
              © 2026. HapiCare Inc. - All Rights Reserved
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:0 40px;">
        <p style="font-size:14px;color:#94979A;">
          This email is sent from an account we use for sending messages only. If you want to contact us or
          have any questions, reach out to our support staff at
          <a href="mailto:support@hapicare.com" style="color:#06617a;font-weight:bold;text-decoration:none;">support@hapicare.com</a>.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const SetupConfigurationDialog = ({ getIsOpen, selectedItem }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [rawChecklist, setRawChecklist] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [taskAvailabilityCriteria, setTaskAvailabilityCriteria] = useState("UPON_VERIFICATION");
  const [taskCompletionMethod, setTaskCompletionMethod] = useState("AUTOMATIC");
  const [recipientType, setRecipientType] = useState("Team / Group");
  const [emailRecipientType, setEmailRecipientType] = useState("To");
  const [emailRecipient, setEmailRecipient] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [recipients, setRecipients] = useState([]);
  const [staffManagerList, setStaffManagerList] = useState([]);
  const [selectedStaffManagerId, setSelectedStaffManagerId] = useState("");
  const [subject, setSubject] = useState(
    "New Staff Applicant - (John DOE) (Physician) : PACS Access Request"
  );
  const [introText, setIntroText] = useState(
    "The applicant referenced below has applied for credentialing and privileging at (Entity Name) and requires PACS access as part of the onboarding process."
  );
  const [applicantDataSelect, setApplicantDataSelect] = useState("");
  const [accessMethod, setAccessMethod] = useState("PDF_ATTACHMENT");
  const [sectionsToInclude, setSectionsToInclude] = useState("");
  const [closingText, setClosingText] = useState(
    "Please review and complete the attached PACS Access Request Form for the new member of staff. If you have any questions regarding this request, please contact the Medical Staff Office."
  );
  const [receiptConfirmation, setReceiptConfirmation] = useState(
    "Enable Receipt And Access Confirmation"
  );
  const [statusDoneLabel, setStatusDoneLabel] = useState("Done");
  const [statusNotDoneLabel, setStatusNotDoneLabel] = useState("Not Done");

  useEffect(() => {
    const getSMDetails = async () => {
      try {
        const { data: smData } = await GET(
          `user-management-service/user/role?role=${["Staff Manager", "Entity Sys Admin"]}`
        );
        const list = smData || [];
        setStaffManagerList(list);

        const staffManager = list?.find((user) =>
          user?.roles?.some((role) => role.roleName === "Staff Manager")
        );
        const defaultUser = staffManager || list?.[0];
        if (defaultUser?.id) setSelectedStaffManagerId(defaultUser.id);
      } catch (err) {
        // Non-blocking: dropdown can remain empty if API fails
      }
    };
    getSMDetails();
  }, []);

  useEffect(() => {
    if (selectedItem) setTaskName(selectedItem?.taskName ?? "");
  }, [selectedItem]);

  useEffect(() => {
    if (!selectedItem?.id) return;
    const fetchConfig = async () => {
      setIsLoading(true);
      try {
        const { data } = await GET(`entity-service/checklist/${selectedItem.id}`);
        if (data) {
          setRawChecklist(data);
          if (data.taskName != null) setTaskName(data.taskName);
          if (data.taskAvailabilityCriteria != null) setTaskAvailabilityCriteria(data.taskAvailabilityCriteria);
          if (data.taskCompletionMethod != null) setTaskCompletionMethod(data.taskCompletionMethod);

          // Map backend shape: completedApplicantDetails.taskEmailDetails
          const taskEmailDetails = data?.completedApplicantDetails?.taskEmailDetails;
          if (taskEmailDetails?.subject != null) setSubject(taskEmailDetails.subject);
          // Do NOT map taskEmailDetails.content into editor fields. We generate a full HTML email template
          // (tables + inline CSS) at save-time into `content` from the CKEditor fragments.

          const toEmails = taskEmailDetails?.recipients?.recipientEmails || [];
          const ccEmails = taskEmailDetails?.ccRecipients?.recipientEmails || [];
          const bccEmails = taskEmailDetails?.bccRecipients?.recipientEmails || [];

          const mappedRecipients = [
            ...toEmails.map((email) => ({ id: makeRecipientId(), type: "To", email, firstName: "", lastName: "" })),
            ...ccEmails.map((email) => ({ id: makeRecipientId(), type: "CC", email, firstName: "", lastName: "" })),
            ...bccEmails.map((email) => ({ id: makeRecipientId(), type: "BCC", email, firstName: "", lastName: "" })),
          ];
          setRecipients(mappedRecipients);

          // Attachments mapping: completedApplicantDetails.attachmentDetails.formDetails
          const formDetails = data?.completedApplicantDetails?.attachmentDetails?.formDetails || [];
          if (Array.isArray(formDetails) && formDetails.length > 0) {
            setAccessMethod("PDF_ATTACHMENT");
            setSectionsToInclude(formDetails?.[0]?.title || formDetails?.[0]?.schemaCategory || "");
          } else {
            setAccessMethod("NONE");
            setSectionsToInclude("");
          }

          // If backend stores notificationEmail, try to match it to a staff manager.
          if (data?.notificationEmail) {
            const match = (staffManagerList || []).find(
              (u) => u?.email?.officialEmail === data.notificationEmail
            );
            if (match?.id) setSelectedStaffManagerId(match.id);
          }

          // Optional: map task status labels (for no-email/manual workflows)
          const statusLabels = data?.taskStatusUpdate?.statusLabels;
          if (Array.isArray(statusLabels) && statusLabels.length > 0) {
            const done = statusLabels.find((s) => (s?.status || "").toUpperCase().includes("DONE"));
            const notDone = statusLabels.find((s) => (s?.status || "").toUpperCase().includes("NOT"));
            if (done?.label) setStatusDoneLabel(done.label);
            if (notDone?.label) setStatusNotDoneLabel(notDone.label);
          }
        }
      } catch (err) {
        ErrorToaster("Failed to load checklist configuration");
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, [selectedItem?.id, staffManagerList]);

  const selectedStaffManager =
    (staffManagerList || []).find((u) => u?.id === selectedStaffManagerId) || null;
  const selectedStaffManagerLabel = selectedStaffManager
    ? `${selectedStaffManager?.name?.firstName || ""} ${selectedStaffManager?.name?.lastName || ""}`.trim()
    : "";

  const handleAddMore = () => {
    const email = (emailRecipient || "").trim();
    if (!email) return;
    setRecipients((prev) => [
      ...prev,
      {
        id: makeRecipientId(),
        type: emailRecipientType,
        email,
        firstName: (firstName || "").trim(),
        lastName: (lastName || "").trim(),
      },
    ]);
    setEmailRecipient("");
    setFirstName("");
    setLastName("");
  };

  const handleRemoveRecipient = (id) => {
    setRecipients((prev) => prev.filter((r) => r.id !== id));
  };

  const getPayload = () => {
    // Preserve server fields by starting from latest fetched checklist object
    const base = rawChecklist || {};

    const toList = recipients.filter((r) => r.type === "To").map((r) => r.email).filter(Boolean);
    const ccList = recipients.filter((r) => r.type === "CC").map((r) => r.email).filter(Boolean);
    const bccList = recipients.filter((r) => r.type === "BCC").map((r) => r.email).filter(Boolean);

    const existingTaskEmail = base?.completedApplicantDetails?.taskEmailDetails || {};
    const existingRecipients = existingTaskEmail?.recipients || {};
    const existingCc = existingTaskEmail?.ccRecipients || {};
    const existingBcc = existingTaskEmail?.bccRecipients || {};

    const updatedTaskEmailDetails = {
      ...existingTaskEmail,
      subject: subject,
      content: buildEmailTemplateHtml({
        taskName,
        introHtml: introText,
        closingHtml: closingText,
      }),
      recipients: {
        ...existingRecipients,
        recipientEmails: toList,
      },
      ccRecipients: {
        ...existingCc,
        recipientEmails: ccList,
      },
      ...(bccList.length > 0
        ? {
          bccRecipients: {
            ...existingBcc,
            recipientEmails: bccList,
          },
        }
        : { bccRecipients: existingBcc }),
    };

    return {
      ...base,
      taskName,
      notificationEmail: selectedStaffManager?.email?.officialEmail ?? base?.notificationEmail ?? null,
      completedApplicantDetails: {
        ...(base?.completedApplicantDetails || {}),
        taskEmailDetails: updatedTaskEmailDetails,
      },
      taskStatusUpdate: {
        ...(base?.taskStatusUpdate || {}),
        statusLabels: [
          { status: "DONE", label: statusDoneLabel },
          { status: "NOT_DONE", label: statusNotDoneLabel },
        ],
      },
    };
  };

  const handleBackToChecklist = () => {
    getIsOpen(false);
  };

  const handleSave = async (exitAfterSave) => {
    if (!selectedItem?.id) return;
    setIsSaving(true);
    try {
      await PUT(`entity-service/checklist/${selectedItem.id}`, getPayload());
      SuccessToaster("Configuration saved successfully");
      if (exitAfterSave) getIsOpen(false);
    } catch (err) {
      ErrorToaster("Failed to save configuration");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveExit = () => handleSave(true);
  const handleSaveContinue = () => handleSave(false);

  const handleDrop = (files) => {
    // TODO: handle uploaded files
  };

  if (!selectedItem) return null;

  const isNoEmailFlow = taskCompletionMethod === "NA";

  return (
    <Dialog
      isOpen={!!selectedItem}
      onClose={() => getIsOpen(false)}
      className={style.setupConfigDialog}
      canOutsideClickClose={false}
      canEscapeKeyClose={false}
    >
      <div className={style.setupConfigWrap}>
        <div className={style.setupConfigHeader}>
          <div className={style.setupConfigTitleRow}>
            <h2 className={style.setupConfigTitle}>
              Setup Your New Applicant Processing Checklist &amp; Task Manager
            </h2>
            <div className={style.setupConfigHeaderRight}>
              <span className={style.setupStatus}>
                <span className={style.setupStatusDot} />
                Setup In-Progress
              </span>
              <img
                src={CrossPink}
                alt="Close"
                className={`${style.crossStyle} ${style.cursorPointer}`}
                onClick={() => getIsOpen(false)}
              />
            </div>
          </div>
        </div>

        <div className={`${style.setupConfigBody} ${isNoEmailFlow ? style.singleColumn : ""}`}>
          <div className={style.setupConfigLeft}>
            {isLoading && (
              <div className={style.setupConfigLoading}>Loading configuration…</div>
            )}
            <div className={style.formSection}>
              <CommonTextField
                label="Checklist / Task Label"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter task name"
                className={style.fullWidth}
              />
            </div>
            <p className={style.instructionText}>
              Click on the default Checklist / Task Label to modify as needed
            </p>

            <div className={style.formSection}>
              <CommonSelectField
                label="Task Availability Criteria"
                required
                value={taskAvailabilityCriteria}
                onChange={(e) => setTaskAvailabilityCriteria(e.target.value)}
                valueList={TASK_AVAILABILITY_VALUES}
                labelList={TASK_AVAILABILITY_OPTIONS}
                disabledList={TASK_AVAILABILITY_OPTIONS.map(() => false)}
              />
            </div>

            <div className={style.formSection}>
              <div className={style.fieldLabel}>Task Completion Method:</div>
              <CommonRadio
                value={taskCompletionMethod}
                onChange={(e) => setTaskCompletionMethod(e.target.value)}
                radioValue={TASK_COMPLETION_VALUES}
                label={TASK_COMPLETION_OPTIONS}
                isRow={false}
              />
            </div>

            {!isNoEmailFlow && (
              <div className={style.formSection}>
                <div className={style.sectionHeading}>Email Notification Recipients</div>
                <CommonSelectField
                  label="Recipient type"
                  value={recipientType}
                  onChange={(e) => setRecipientType(e.target.value)}
                  valueList={RECIPIENT_TYPE_OPTIONS}
                  labelList={RECIPIENT_TYPE_OPTIONS}
                  disabledList={RECIPIENT_TYPE_OPTIONS.map(() => false)}
                />
                <div>
                  <div className={style.displayInRow} style={{ gap: 8, alignItems: "flex-end" }}>
                    <CommonSelectField
                      label=""
                      value={emailRecipientType}
                      onChange={(e) => setEmailRecipientType(e.target.value)}
                      valueList={["To", "CC", "BCC"]}
                      labelList={["To", "CC", "BCC"]}
                      disabledList={[false, false, false]}
                      widthValue="80px"
                    />
                    <div className={style.flex1}>
                      <CommonTextField
                        placeholder="Email recipient"
                        required={false}
                        value={emailRecipient}
                        onChange={(e) => setEmailRecipient(e.target.value)}
                        className={style.fullWidth}
                      />
                    </div>
                  </div>
                </div>
                <div className={style.twoCol}>
                  <CommonTextField
                    required={false}
                    placeholder={"First name"}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={style.fullWidth}
                  />
                  <CommonTextField
                    placeholder="Last name"
                    required={false}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={style.fullWidth}
                  />
                </div>
                <div className={style.addMoreRow}>
                  <button type="button" className={style.addMoreButton} onClick={handleAddMore}>
                    Add More
                  </button>
                </div>
                <CommonSelectField
                  label="Choose the Staff Manager this notification will be sent from"
                  value={selectedStaffManagerId}
                  onChange={(e) => setSelectedStaffManagerId(e.target.value)}
                  valueList={(staffManagerList || []).map((u) => u?.id)}
                  labelList={(staffManagerList || []).map((u) => {
                    const name = `${u?.name?.firstName || ""} ${u?.name?.lastName || ""}`.trim();
                    const email = u?.email?.officialEmail ? ` - ${u.email.officialEmail}` : "";
                    return `${name}${email}`;
                  })}
                  disabledList={(staffManagerList || []).map(() => false)}
                />
              </div>
            )}

            {!isNoEmailFlow && (
              <div className={style.formSection}>
                <div className={style.sectionHeading}>Email Contents</div>
                <CommonTextField
                  label="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={style.fullWidth}
                />
                <p className={style.helperText}>(To Modify contact your CSM)</p>
                <div className={style.displayInRow}>
                  <div className={style.fieldLabel}>Intro Notification Text</div>
                  <p className={`${style.helperText} ${style.marginLeft}`}>(Modify as needed)</p>
                </div>
                <div className={style.ckeditorField}>
                  <CKEditor
                    editor={ClassicEditor}
                    data={introText || ""}
                    onChange={(_, editor) => setIntroText(editor.getData())}
                  />
                </div>
              </div>
            )}

            {!isNoEmailFlow && (
              <div className={style.formSection}>
                <div className={style.sectionHeading}>Applicant Reference information To Include</div>
                <CommonSelectField
                  firstOptionLabel="Select Applicant Data"
                  firstOptionValue=""
                  value={applicantDataSelect}
                  onChange={(e) => setApplicantDataSelect(e.target.value)}
                  valueList={[]}
                  labelList={[]}
                  disabledList={[]}
                />
                <div className={style.chipRow}>
                  {APPLICANT_DATA_CHIPS.map((chip) => (
                    <span key={chip} className={style.chip}>
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!isNoEmailFlow && (
              <div className={style.formSection}>
                <div className={style.sectionHeading}>Applicant Information To Include & Access Method</div>
                <CommonRadio
                  value={accessMethod}
                  onChange={(e) => setAccessMethod(e.target.value)}
                  radioValue={ACCESS_METHOD_VALUES}
                  label={ACCESS_METHOD_OPTIONS}
                  isRow={false}
                />
                {accessMethod === "PDF_ATTACHMENT" && (
                  <div className={style.formSection}>
                    <CommonSelectField
                      label="Completed Applicant Information / Sections To Include"
                      firstOptionLabel="Select Application Information"
                      firstOptionValue=""
                      value={sectionsToInclude}
                      onChange={(e) => setSectionsToInclude(e.target.value)}
                      valueList={["PACS Request"]}
                      labelList={["PACS Request"]}
                      disabledList={[false]}
                    />
                    <span className={style.chip}>
                      PACS Request <span className={style.chipRemove}>×</span>
                    </span>
                  </div>
                )}
              </div>
            )}

            {!isNoEmailFlow && (
              <div className={style.formSection}>
                <div className={style.displayInRow}>
                  <div className={style.fieldLabel}>Closing Notification Text</div>
                  <p className={`${style.helperText} ${style.marginLeft}`}>(Modify as needed)</p>
                </div>
                <div className={style.ckeditorField}>
                  <CKEditor
                    editor={ClassicEditor}
                    data={closingText || ""}
                    onChange={(_, editor) => setClosingText(editor.getData())}
                  />
                </div>
              </div>
            )}

            {!isNoEmailFlow && (
              <>
                <div className={style.formSection}>
                  <div className={style.sectionHeading}>Other Documents To Attach With Notification</div>
                  <CommonDropZone
                    title="Upload Additional Documents"
                    description="click to browse or drag & drop"
                    changeHandler={handleDrop}
                  />
                </div>
                <div className={style.formSection}>
                  <div className={style.sectionHeading}>Notification Receipt & Access Confirmation</div>
                  <CommonRadio
                    value={receiptConfirmation}
                    onChange={(e) => setReceiptConfirmation(e.target.value)}
                    radioValue={RECEIPT_OPTIONS}
                    label={RECEIPT_OPTIONS}
                  />
                </div>
              </>
            )}

            {isNoEmailFlow && (
              <div className={style.formSection}>
                <div className={style.fieldLabel}>Checklist / Task Status Labels</div>
                <p className={style.helperText}>(Modify label titles as needed)</p>
                <div className={style.twoCol}>
                  <CommonTextField
                    value={statusDoneLabel}
                    onChange={(e) => setStatusDoneLabel(e.target.value)}
                    className={style.fullWidth}
                  />
                  <CommonTextField
                    value={statusNotDoneLabel}
                    onChange={(e) => setStatusNotDoneLabel(e.target.value)}
                    className={style.fullWidth}
                  />
                </div>
              </div>
            )}
          </div>

          {!isNoEmailFlow && <div className={style.setupConfigRight}>
            <div className={style.previewTitle}>Email Notification Preview</div>
            {(["To", "CC", "BCC"] || []).map((type) => {
              const list = (recipients || []).filter((r) => r.type === type);
              if (list.length === 0) return null;
              return (
                <div key={type} className={style.previewRecipientRow}>
                  <span className={style.previewRecipientLabel}>{type}:</span>{" "}
                  <span className={style.previewRecipientChips}>
                    {list.map((r) => (
                      <span key={r.id} className={style.previewChip}>
                        {r.email}
                        {(r.firstName || r.lastName) &&
                          ` (${[r.firstName, r.lastName].filter(Boolean).join(" ")})`}
                        <span
                          className={style.previewChipRemove}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveRecipient(r.id);
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === "Enter" && handleRemoveRecipient(r.id)}
                          aria-label="Remove recipient"
                        >
                          ×
                        </span>
                      </span>
                    ))}
                  </span>
                </div>
              );
            })}
            {recipients.length === 0 && (
              <div className={style.previewTo}>
                <span className={style.previewRecipientLabel}>To:</span> —
              </div>
            )}
            <div className={style.previewSubject}>{subject || "Subject"}</div>
            <div className={style.previewBranding}>CAPManager</div>
            <div className={style.previewBody}>
              <div className={style.previewContactBox}>
                <div className={style.previewBodyTitle}>New Staff Applicant</div>
                <div className={style.previewBodySubtitle}>
                  {taskName || "—"}
                </div>
                <div
                  className={`${style.previewIntro} `}
                  dangerouslySetInnerHTML={{ __html: introText || "—" }}
                />
              </div>
              <div className={`${style.previewDetails} ${style.previewContactBox}`}>
                <div className={style.previewDetailsTitle}>DOE, John - Physician</div>
                <div>Applicant Email Address: Jdoe@email.com</div>
                <div>Contact Number: +1 (123) 456 7890</div>
                <div>Department / Specialty: Surgery - Orthopedics</div>
                <div>Application Date: Jan 13, 2026</div>
              </div>
              <div
                className={`${style.previewClosing} ${style.previewContactBox}`}
                dangerouslySetInnerHTML={{ __html: closingText || "—" }}
              />
              <div className={style.previewContactBox}>
                <div className={style.previewContactName}>
                  {selectedStaffManagerLabel || "—"}
                </div>
                <div className={style.previewContactRole}>Medical Staff Office</div>
                <div className={style.previewContactMeta}>
                  {selectedStaffManager?.email?.officialEmail || "—"}
                  {selectedStaffManager?.communication?.mobileNumber
                    ? ` | ${selectedStaffManager.communication.mobileNumber}`
                    : ""}
                </div>
              </div>
              {(accessMethod === "PDF_ATTACHMENT" || accessMethod === "BOTH") && (
                  <div className={style.previewAttachment}>
                    PDF {sectionsToInclude || taskName || "attachment"}
                  </div>
                )}
            </div>
          </div>}
        </div>

        <div className={style.setupConfigFooter}>
          <button type="button" className={style.backButton} onClick={handleBackToChecklist}>
            BACK TO CHECKLIST
          </button>
          <div className={style.footerRight}>
            <button type="button" className={style.saveExitButton} onClick={handleSaveExit} disabled={isSaving}>
              SAVE & EXIT
            </button>
            <button type="button" className={style.saveContinueButton} onClick={handleSaveContinue} disabled={isSaving}>
              SAVE & CONTINUE
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default SetupConfigurationDialog;
