import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  Classes,
  Icon,
  Intent,
  TextArea,
  InputGroup,
  Button,
  RadioGroup,
} from "@blueprintjs/core";
import style from "./../index.module.scss";
import { GET, POST, PUT, TenantID } from "../../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../../utils/toaster";
import WritingFile from "./../../../images/writing-file.svg";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CommonInputField from "../../../Components/CommonFields/CommonInputField";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Switch, makeStyles } from "@material-ui/core";
import {
  Box,
  Checkbox,
  InputAdornment,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import PreviewDialog from "./PreviewDialog";
import CheckboxIcon from "./../../../images/CheckboxIcon.png";
import CommonDropZone from "../../../Components/CommonFields/CommonDropZone";
import CompletedIcon from "./../../../images/completedIcon.png";
import Alert from "./../../../images/alert.png";
import redWarning from "./../../../images/redWarning.png";
import axios from "axios";
import CommonCheckBox from "../../../Components/CommonFields/CommonCheckBox";

const useStyles = makeStyles({
  switch: {
    "& .Mui-checked": {
      color: "#7165e3",
    },
    "& .MuiSwitch-track": {
      backgroundColor: "#7165e3 !important",
    },
  },
  radio: {
    "& .Mui-checked": {
      color: "#7165e3 !important",
    },
  },
});

const CheckListDialog = ({ open, handleClose, isEdit, selectedApplicant }) => {
  const [isConstraintsRequired, setIsConstraintsRequired] = useState(false);
  const [isApplicantInformation, setIsApplicantInformation] = useState(false);

  const [activityTitle, setActivityTitle] = useState("");
  const [promptLabel, setPromptLabel] = useState("");
  const [applicantTypes, setApplicantTypesState] = useState([]);
  const [selectedApplicantValues, setSelectedApplicantValues] = useState([]);
  const [departmentTypes, setDepartmentTypesState] = useState([]);
  const [selectedDepartmentValues, setSelectedDepartmentValues] = useState([]);
  const [sendAsType, setSendAsType] = useState("");
  const [isProofOfDocumentRequired, setIsProofOfDocumentRequired] =
    useState(false);
  const [
    isProofOfCompleteDocumentRequired,
    setIsProofOfCompleteDocumentRequired,
  ] = useState(false);

  const [isCompletionDependant, setIsCompletionDependant] = useState(false);
  const [toemails, setToEmails] = useState([]); // Store entered emails
  const [inputToEmailValue, setInputToEmailValue] = useState(""); // Store the current input value
  const [ccemails, setCCEmails] = useState([]); // Store entered emails
  const [inputCCEmailValue, setInputCCEmailValue] = useState(""); // Store the current input value
  const [emailSubject, setEmailSubject] = useState(""); // Initialize state
  const [isToChecked, setIsToChecked] = useState(false); // State to track checkbox
  const [isCCChecked, setIsCCChecked] = useState(false); // State to track checkbox
  const [toDocumentemails, setToDocumentEmails] = useState([]); // Store entered emails
  const [inputToDocumentEmailValue, setInputToDocumentEmailValue] =
    useState(""); // Store the current input value
  const [ccDocumentemails, setCCDocumentEmails] = useState([]); // Store entered emails
  const [inputCCDocumentEmailValue, setInputCCDocumentEmailValue] =
    useState(""); // Store the current input value
  const [emailDocumentSubject, setEmailDocumentSubject] = useState(""); // Initialize state
  const [isToDocumentChecked, setIsDocumentToChecked] = useState(false); // State to track checkbox
  const [isCCDocumentChecked, setIsDocumentCCChecked] = useState(false); // State to track checkbox
  const [sendAsDocumentType, setSendAsDocumentType] = useState("");
  const [toCompleteemails, setToCompleteEmails] = useState([]); // Store entered emails
  const [inputToCompleteEmailValue, setInputToCompleteEmailValue] =
    useState(""); // Store the current input value
  const [ccCompleteemails, setCCCompleteEmails] = useState([]); // Store entered emails
  const [inputCCCompleteEmailValue, setInputCCCompleteEmailValue] =
    useState(""); // Store the current input value
  const [emailCompleteSubject, setEmailCompleteSubject] = useState(""); // Initialize state
  const [isToCompleteChecked, setIsToCompleteChecked] = useState(false); // State to track checkbox
  const [isCCCompleteChecked, setIsCCCompleteChecked] = useState(false); // State to track checkbox

  const [editorContent, setEditorContent] = useState(
    "Hello,<br>We have a new {Privilege type}{applicant type} starting {expeted StartDates};in{Department/Servicearea}<br>{name}<br>{Phone Number}<br>CPSO Number:{License number}<br>OHP Billing Number:{OHP Billing Number}"
  );
  const [taskAction, setTaskAction] = useState("");
  const [notelabel, setNoteLabel] = useState(""); // Initialize state
  const [selectedDisplayOption, setSelectedDisplayOption] = useState("");

  const [selectedValue, setSelectedValue] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [taskactivityTitle, setTaskActivityTitle] = useState("");
  const [taskDefaultStatus, setTaskDefaultStatus] = useState("");
  const [taskInprogressStatus, setTaskInprogressStatus] = useState("");
  const [taskCompleteStatus, setTaskCompleteStatus] = useState("");
  const [taskDefaultStatus2, setTaskDefaultStatus2] = useState("");
  const [taskInprogressStatus2, setTaskInprogressStatus2] = useState("");
  const [taskCompleteStatus2, setTaskCompleteStatus2] = useState("");
  const [documentLabel, setDocumentLabel] = useState("");
  const [file, setFile] = useState(null);
  const [sendAsCompleteType, setSendAsCompleteType] = useState("");
  const [isToFormDetailsChecked, setIsToFormDetailsChecked] = useState(false); // State to track checkbox
  const [isCCFormDetailsChecked, setIsCCFormDetailsChecked] = useState(false); // State to track checkbox
  const [toFormDetailsemails, setToFormDetailsEmails] = useState([]); // Store entered emails
  const [inputToFormDetailsEmailValue, setInputToFormDetailsEmailValue] =
    useState(""); // Store the current input value
  const [ccFormDetailsemails, setCCFormDetailsEmails] = useState([]); // Store entered emails
  const [inputCCFormDetailsEmailValue, setInputCCFormDetailsEmailValue] =
    useState(""); // Store the current input value
  const [emailFormDetailsSubject, setEmailFormDetailsSubject] = useState(""); // Initialize state
  const [sendAsFormDetailType, setSendAsFormDetailType] = useState("");
  const [isPODFormDetailsRequired, setIsPODFormDetailsRequired] =
    useState(false);
  const [completeLabel, setCompleteLabel] = useState("");
  const [editorDocumentContent, setEditorDocumentContent] = useState(
    "Hello& Welcome,<br>Please find the parking information you need to review<br>Parking office Contact information"
  );
  const [editorCompleteContent, setEditorCompleteContent] = useState(
    "Hello,<br>We have a new {Privilege type}{applicant type} starting {expected Start Date};in{Department/Service area}<br>{name}<br>{Phone Number}<br>CPSO Number:{License number}<br>OHIP Billing Number:{OHIP Billing Number}"
  );
  const [editorFormDetailsContent, setEditorFormDetailsContent] = useState(
    "Greetings,<br>{name}has listed you as a reference in an application for{privilege type}privileges here to CambridgeMemorial Hospital.<br>If you could kindly complete the attached questionnaire and return to me,by e-mail or fax to 519-740-4934 at your earliest convenience it would be greatly appreciated.<br>please let me know if you have any questions."
  );
  const [responseData, setResponseData] = useState(null);
  const [previewData, setPreviewData] = useState({});

  const editorRef = useRef();

  const [fromLinkText, setFromLinkText] = useState("");

  const [fromLinkurl, setFromLinkUrl] = useState("");

  const displayOptions = [
    { value: "IN_TASK_OR_ACTIVITY_BAR", label: "In Task/Activity Bar" },
    { value: "IN_CHECKLIST_HEADER", label: "In CheckList Header" },
  ];

  const sites = [
    {
      id: 1,
      name: "Send notification email",
      label: "SEND_NOTIFICATION_EMAIL",
    },
    {
      id: 2,
      name: "Task Status Update Only",
      label: "TASK_STATUS_UPDATE_ONLY",
    },
    {
      id: 3,
      name: "Send Non-Capsmart Form-Internal Source URL",
      label: "SEND_NON_CAPSMART_FORM_INTERNAL_SOURCE_URL",
    },
    {
      id: 4,
      name: "Send Non-Capsmart Form-PDF Document/ Form",
      label: "SEND_NON_CAPSMART_FORM_PDF_DOCUMENT_OR_FORM", // Corrected
    },
    {
      id: 5,
      name: "Send Applicants Completed Information",
      label: "SEND_APPLICANTS_COMPLETED_INFORMATION",
    },
    { id: 6, name: "Send Capsmart Form", label: "SEND_CAPSMART_FORM" },
  ];

  const handleEditorChange = (setState) => (event, editor) => {
    let data = editor.getData();
    setState(data);
  };

  const handleDisplaySelectChange = (event) => {
    const selectedOption = displayOptions.find(
      (option) => option.value === event.target.value
    );
    if (selectedOption) {
      setSelectedDisplayOption(selectedOption.value); // Set the value in the state
    }
  };

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    setSelectedValue(selectedId);

    const selectedSite = sites.find(
      (site) => site.id === parseInt(selectedId, 10)
    );
    if (selectedSite) {
      setTaskAction(selectedSite.label);
    }
  };

  const sendAs = [
    {
      id: "SECURE_EMAIL",
      value: "SECURE_EMAIL",
      label: "Secure Email",
    },
    {
      id: "STANDARD_EMAIL",
      value: "STANDARD_EMAIL",
      label: "Standard Email",
    },
  ];

  const classes = useStyles();

  useEffect(() => {
    fetchApplicantTypes();
    fetchDepartmentTypes();
  }, []);

  useEffect(() => {
    if (!isEdit) {
      resetForm();
    }
  }, [isEdit, selectedApplicant]);

  const resetForm = () => {
    setActivityTitle("");
    setPromptLabel("");
    setSelectedApplicantValues([]);
    setSelectedDepartmentValues([]);
    setSendAsType("");
    setIsProofOfDocumentRequired(false);
    setIsCompletionDependant(false);
    setToEmails([]);
    setCCEmails([]);
    setIsToChecked(false);
    setIsCCChecked(false);
    setEmailSubject("");
    setTaskAction("");
    setSelectedValue(null);
    setNoteLabel("");
    setSelectedDisplayOption("");
    setTaskDefaultStatus("");
    setTaskInprogressStatus("");
    setTaskCompleteStatus("");
    setTaskDefaultStatus2("");
    setTaskInprogressStatus2("");
    setTaskCompleteStatus2("");
    setFromLinkText("");
    setFromLinkUrl("");
    setIsToCompleteChecked(false);
    setIsCCCompleteChecked(false);
    setEmailCompleteSubject("");
    setSendAsCompleteType("");
    setIsProofOfCompleteDocumentRequired(false);
    setIsApplicantInformation(false);
    setToFormDetailsEmails([]);
    setCCFormDetailsEmails([]);
    setEmailFormDetailsSubject("");
    setSendAsFormDetailType("");
    setIsPODFormDetailsRequired(false);
  };

  useEffect(() => {
    if (isEdit && selectedApplicant) {
      setActivityTitle(selectedApplicant.taskName || "");
      setPromptLabel(
        selectedApplicant.activityExecutionPromptLabel?.text || ""
      );
      setSelectedApplicantValues(
        selectedApplicant.applicantTypes.map((type) => type.id)
      );
      setSelectedDepartmentValues(
        selectedApplicant.departments.map((dept) => dept.id)
      );
      setIsConstraintsRequired(selectedApplicant.hasAnyConstraints);
      setSendAsType(
        selectedApplicant.notificationEmail?.taskEmailDetails
          ?.emailDeliveryMethod || ""
      );
      setIsProofOfDocumentRequired(
        selectedApplicant.isProofOfDocumentRequired || false
      );
      setIsCompletionDependant(
        selectedApplicant.taskDependentNoteDetail?.hasDependentNote || false
      );
      setToEmails(
        selectedApplicant.notificationEmail?.taskEmailDetails?.recipients
          ?.recipientEmails || []
      );
      setCCEmails(
        selectedApplicant.notificationEmail?.taskEmailDetails?.ccRecipients
          ?.recipientEmails || []
      );
      setIsToChecked(
        selectedApplicant.notificationEmail?.taskEmailDetails?.recipients
          .includeApplicantEmail || false
      );
      setIsCCChecked(
        selectedApplicant.notificationEmail?.taskEmailDetails?.ccRecipients
          .includeApplicantEmail || false
      );
      setEmailSubject(
        selectedApplicant.notificationEmail?.taskEmailDetails?.subject || ""
      );
      setEditorContent(
        selectedApplicant.notificationEmail?.taskEmailDetails?.content || ""
      );
      const selectedSite = sites.find(
        (site) => site.label === selectedApplicant.taskAction
      );
      if (selectedSite) {
        setTaskAction(selectedSite.label);
        setSelectedValue(selectedSite.id);
      }
      setNoteLabel(
        selectedApplicant.taskDependentNoteDetail?.noteLabel?.text || ""
      );
      setSelectedDisplayOption(
        selectedApplicant.taskDependentNoteDetail?.displayOption || ""
      );
      setTaskDefaultStatus(
        selectedApplicant.taskStatusUpdate?.statusLabels?.[0]?.label || ""
      );
      setTaskInprogressStatus(
        selectedApplicant.taskStatusUpdate?.statusLabels?.[1]?.label || ""
      );
      setTaskCompleteStatus2(
        selectedApplicant.taskStatusUpdate?.statusLabels?.[2]?.label || ""
      );
      setTaskDefaultStatus2(
        selectedApplicant.externalFormSourceLink?.statusLabels?.[0]?.label || ""
      );
      setTaskInprogressStatus2(
        selectedApplicant.externalFormSourceLink?.statusLabels?.[1]?.label || ""
      );
      setTaskCompleteStatus(
        selectedApplicant.externalFormSourceLink?.statusLabels?.[2]?.label || ""
      );
      setFromLinkText(
        selectedApplicant.externalFormSourceLink?.formLink?.urlLabel?.text || ""
      );
      setFromLinkUrl(
        selectedApplicant.externalFormSourceLink?.formLink?.url || ""
      );

      setToDocumentEmails(
        selectedApplicant.externalFormDocument?.taskEmailDetails
          ?.recipientEmails || []
      );
      setCCDocumentEmails(
        selectedApplicant.externalFormDocument?.taskEmailDetails
          ?.ccRecipients || []
      );

      setIsDocumentToChecked(
        selectedApplicant.externalFormDocument?.taskEmailDetails?.recipients
          ?.includeApplicantEmail || false
      );
      setIsDocumentCCChecked(
        selectedApplicant.externalFormDocument?.taskEmailDetails?.ccRecipients
          ?.includeApplicantEmail || false
      );

      setEmailDocumentSubject(
        selectedApplicant.externalFormDocument?.taskEmailDetails?.subject || ""
      );
      setEditorDocumentContent(
        selectedApplicant.completedApplicantDetails?.taskEmailDetails
          ?.content || ""
      );
      setSendAsCompleteType(
        selectedApplicant.completedApplicantDetails?.taskEmailDetails
          ?.emailDeliveryMethod || ""
      );

      setIsProofOfCompleteDocumentRequired(
        selectedApplicant.completedApplicantDetails?.taskEmailDetails
          ?.podRequired || false
      );

      setIsApplicantInformation(
        selectedApplicant.completedApplicantDetails?.attachmentDetails
          ?.includeApplicantAttachment || false
      );

      setToCompleteEmails(
        selectedApplicant.completedApplicantDetails?.taskEmailDetails
          ?.recipientEmails || []
      );
      setCCCompleteEmails(
        selectedApplicant.completedApplicantDetails?.taskEmailDetails
          ?.ccRecipients || []
      );

      setIsToCompleteChecked(
        selectedApplicant.completedApplicantDetails?.taskEmailDetails
          ?.recipients?.includeApplicantEmail || false
      );
      setIsCCCompleteChecked(
        selectedApplicant.completedApplicantDetails?.taskEmailDetails
          ?.ccRecipients?.includeApplicantEmail || false
      );

      setEmailCompleteSubject(
        selectedApplicant.completedApplicantDetails?.taskEmailDetails
          ?.subject || ""
      );
      setEditorCompleteContent(
        selectedApplicant.completedApplicantDetails?.taskEmailDetails
          ?.content || ""
      );
      setSendAsCompleteType(
        selectedApplicant.completedApplicantDetails?.taskEmailDetails
          ?.emailDeliveryMethod || ""
      );

      setIsProofOfCompleteDocumentRequired(
        selectedApplicant.completedApplicantDetails?.taskEmailDetails
          ?.podRequired || false
      );

      setIsApplicantInformation(
        selectedApplicant.completedApplicantDetails?.attachmentDetails
          ?.includeApplicantAttachment || false
      );

      setToFormDetailsEmails(
        selectedApplicant.formDetails?.taskEmailDetails?.recipients
          ?.recipientEmails || []
      );
      setCCFormDetailsEmails(
        selectedApplicant.formDetails?.taskEmailDetails?.ccRecipients
          ?.recipientEmails || []
      );
      setEmailFormDetailsSubject(
        selectedApplicant.formDetails?.taskEmailDetails?.subject || ""
      );
      setEditorFormDetailsContent(
        selectedApplicant.formDetails?.taskEmailDetails?.content || ""
      );

      setSendAsFormDetailType(
        selectedApplicant.formDetails?.taskEmailDetails?.emailDeliveryMethod ||
          ""
      );
      setIsPODFormDetailsRequired(
        selectedApplicant.formDetails?.taskEmailDetails?.podRequired || false
      );
    } else {
      resetForm();
    }
  }, [isEdit, selectedApplicant]);

  const fetchApplicantTypes = async () => {
    try {
      const response = await GET("entity-service/applicantType");
      const applicantTypes = response.data.map((item) => ({
        id: item.id,
        type: item.applicantType,
      }));

      if (applicantTypes && applicantTypes.length > 0) {
        setApplicantTypesState(applicantTypes);
      }
    } catch (error) {
      console.error("Error fetching applicant types:", error);
    }
  };
  const fetchDepartmentTypes = async () => {
    try {
      const response = await GET("entity-service/department");
      console.log("department", response.data);
      const departmentTypes = response.data.map((item) => ({
        id: item.id,
        type: item.departmentName.name,
      }));

      if (departmentTypes && departmentTypes.length > 0) {
        setDepartmentTypesState(departmentTypes);
      }
    } catch (error) {
      console.error("Error fetching applicant types:", error);
    }
  };
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedApplicantValues(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleDepartmentChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedDepartmentValues(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputToEmailValue) {
      if (validateEmail(inputToEmailValue)) {
        setToEmails((prevToEmails) => [...prevToEmails, inputToEmailValue]);
        setInputToEmailValue("");
      } else {
        alert("Please enter a valid email address.");
      }
    }
  };

  const handleCCKeyPress = (e) => {
    if (e.key === "Enter" && inputCCEmailValue) {
      if (validateEmail(inputCCEmailValue)) {
        setCCEmails((prevToEmails) => [...prevToEmails, inputCCEmailValue]);
        setInputCCEmailValue("");
      } else {
        alert("Please enter a valid email address.");
      }
    }
  };
  const removeCCEmail = (email) => {
    setCCEmails((prevToEmails) =>
      prevToEmails.filter((existingEmail) => existingEmail !== email)
    );
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  const removeEmail = (email, setEmailState) => {
    setEmailState((prevEmails) =>
      prevEmails.filter((existingEmail) => existingEmail !== email)
    );
  };
  const handleKeyDocumentPress = (e) => {
    if (e.key === "Enter" && inputToDocumentEmailValue) {
      if (validateEmail(inputToDocumentEmailValue)) {
        setToDocumentEmails((prevToEmails) => [
          ...prevToEmails,
          inputToDocumentEmailValue,
        ]);
        setInputToDocumentEmailValue(""); // Clear input field
      } else {
        alert("Please enter a valid email address.");
      }
    }
  };

  const handleCCDocumentKeyPress = (e) => {
    if (e.key === "Enter" && inputCCDocumentEmailValue) {
      if (validateEmail(inputCCDocumentEmailValue)) {
        setCCDocumentEmails((prevToEmails) => [
          ...prevToEmails,
          inputCCDocumentEmailValue,
        ]);
        setInputCCDocumentEmailValue("");
      } else {
        alert("Please enter a valid email address.");
      }
    }
  };
  const removeCCDocumentEmail = (email) => {
    setCCDocumentEmails((prevToEmails) =>
      prevToEmails.filter((existingEmail) => existingEmail !== email)
    );
  };

  const handleKeyCompletePress = (e) => {
    if (e.key === "Enter" && inputToCompleteEmailValue) {
      console.log("handlekrypress");
      if (validateEmail(inputToCompleteEmailValue)) {
        setToCompleteEmails((prevToEmails) => [
          ...prevToEmails,
          inputToCompleteEmailValue,
        ]); // Add email to the list
        setInputToCompleteEmailValue(""); // Clear input field
      } else {
        alert("Please enter a valid email address.");
      }
    }
  };

  const handleCCCompleteKeyPress = (e) => {
    if (e.key === "Enter" && inputCCCompleteEmailValue) {
      if (validateEmail(inputCCCompleteEmailValue)) {
        setCCCompleteEmails((prevToEmails) => [
          ...prevToEmails,
          inputCCCompleteEmailValue,
        ]);
        setInputCCCompleteEmailValue("");
      } else {
        alert("Please enter a valid email address.");
      }
    }
  };
  const removeCCCompleteEmail = (email) => {
    setCCCompleteEmails((prevToEmails) =>
      prevToEmails.filter((existingEmail) => existingEmail !== email)
    );
  };

  const handleKeyFormDetailsPress = (e) => {
    if (e.key === "Enter" && inputToFormDetailsEmailValue) {
      if (validateEmail(inputToFormDetailsEmailValue)) {
        setToFormDetailsEmails((prevToEmails) => [
          ...prevToEmails,
          inputToFormDetailsEmailValue,
        ]); // Add email to the list
        setInputToFormDetailsEmailValue(""); // Clear input field
      } else {
        alert("Please enter a valid email address.");
      }
    }
  };

  const handleCCFormDetailsKeyPress = (e) => {
    if (e.key === "Enter" && inputCCFormDetailsEmailValue) {
      if (validateEmail(inputCCFormDetailsEmailValue)) {
        setCCFormDetailsEmails((prevToEmails) => [
          ...prevToEmails,
          inputCCFormDetailsEmailValue,
        ]);
        setInputCCFormDetailsEmailValue("");
      } else {
        alert("Please enter a valid email address.");
      }
    }
  };

  const removeCCFormDetailsEmail = (email) => {
    setCCFormDetailsEmails((prevToEmails) =>
      prevToEmails.filter((existingEmail) => existingEmail !== email)
    );
  };

  // const handleEditorChange = (setContent) => (event, editor) => {
  //   const data = editor.getData();
  //   setContent(data);
  // };

  const handleSendAsTypeChange = (event) => {
    const selectedId = event.target.id;
    setSendAsType(selectedId);
    setIsProofOfDocumentRequired(false);
  };

  const handleSendAsFormDetailsTypeChange = (event) => {
    const selectedId = event.target.id;
    setSendAsFormDetailType(selectedId);
    setIsPODFormDetailsRequired(false);
  };

  const handleSendAsDoumentTypeChange = (event) => {
    const selectedId = event.target.id;
    setSendAsDocumentType(selectedId);
  };

  const handleSendAsCompleteTypeChange = (event) => {
    console.log("event.target.id", event.target.id);
    const selectedId = event.target.id;
    setSendAsCompleteType(selectedId);
  };

  const changeHandler = async (event) => {
    const selectedFile = event[0]; // Assuming only one file is selected

    setFile(event);

    if (selectedFile) {
      // Extract file metadata before uploading
      const fileName = selectedFile.name;
      const fileFormat = fileName.split(".").pop();
      const fileSize = selectedFile.size;
      const lastModifiedDate = new Date(
        selectedFile.lastModified
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      console.log("File metadata:", {
        fileFormat,
        fileSize,
        lastModifiedDate,
      });

      const formData = new FormData();

      const fileNameData = {
        fileName: fileName,
        fileFormat,
        fileSize,
        lastModifiedDate,
      };

      formData.append(
        "fileDTO",
        new Blob([JSON.stringify(fileNameData)], {
          type: "application/json",
        })
      );
      formData.append("file", selectedFile);

      // setFile(event);
      // let fileName = {
      //   fileName: event[0]?.name,
      // };
      // const formData = new FormData();

      // if (event[0] !== null) {
      //   formData.append(
      //     "fileDTO",
      //     new Blob([JSON.stringify(fileName)], {
      //       type: "application/json",
      //     })
      //   );
      //   formData.append("file", event[0]);
      try {
        const response = await POST(`entity-service/checklist/file`, formData);
        SuccessToaster("File Uploaded Successfully");
        const uploadedFile = response?.data;
        const updatedFileData = {
          filePath: uploadedFile.filePath,
          fileName: uploadedFile.fileName,
          fileURL: uploadedFile.fileURL,
          fileFormat,
          fileSize,
          lastModifiedDate,
        };
        console.log("updatedFileData", updatedFileData);
        setFile(updatedFileData);
      } catch (error) {
        ErrorToaster("File Upload Failed");
        console.error(error);
      }
    }
  };

  const handleSubmit = async () => {
    const formattedApplicantTypes = selectedApplicantValues.map((value) => {
      const selectedType = applicantTypes.find((type) => type.id === value);
      return {
        id: selectedType?.id || "",
        applicantType: selectedType?.type || "",
      };
    });

    const formattedDepartments = selectedDepartmentValues.map((value) => {
      const selectedDepartment = departmentTypes.find(
        (type) => type.id === value
      );
      return {
        id: selectedDepartment?.id || "",
        departmentName: {
          name: selectedDepartment?.type || "",
        },
      };
    });

    if (inputToEmailValue && validateEmail(inputToEmailValue)) {
      setToEmails((prevToEmails) => [...prevToEmails, inputToEmailValue]);
    }
    if (inputCCEmailValue && validateEmail(inputCCEmailValue)) {
      setCCEmails((prevToEmails) => [...prevToEmails, inputCCEmailValue]);
    }
    const statusLabel = [
      {
        status: "NOT_STARTED",
        label: taskDefaultStatus || "Not Started(Default)",
      },
      {
        status: "IN_PROGRESS",
        label: taskInprogressStatus || "In Progress",
      },
      {
        status: "COMPLETED_OR_DONE",
        label: taskCompleteStatus || "Complete/Done",
      },
    ];
    const statusLabel2 = [
      {
        status: "NOT_STARTED",
        label: taskDefaultStatus2 || "Not Started(Default)",
      },
      {
        status: "IN_PROGRESS",
        label: taskInprogressStatus2 || "In Progress",
      },
      {
        status: "COMPLETED_OR_DONE",
        label: taskCompleteStatus2 || "Complete/Done",
      },
    ];

    let data = {
      applicantTypes: formattedApplicantTypes,
      departments: formattedDepartments,
      taskName: activityTitle,
      taskAction: taskAction,
      hasAnyConstraints: isConstraintsRequired,
      activityExecutionPromptLabel: {
        text: promptLabel,
      },
      taskDependentNoteDetail: {
        hasDependentNote: isCompletionDependant,
        noteLabel: {
          text: notelabel,
        },
        displayOption: selectedDisplayOption,
      },
    };

    if (selectedValue === 1) {
      data = {
        ...data,
        notificationEmail: {
          taskEmailDetails: {
            recipients: {
              recipientEmails: [...toemails, inputToEmailValue],
              includeApplicantEmail: isToChecked,
            },
            ccRecipients: {
              recipientEmails: [...ccemails, inputCCEmailValue],
              includeApplicantEmail: isCCChecked,
            },
            subject: emailSubject,
            content: editorContent,
            emailDeliveryMethod: sendAsType,
            podRequired: isProofOfDocumentRequired,
          },
        },
      };
    } else if (selectedValue === 2) {
      data = {
        ...data,
        taskStatusUpdate: {
          statusLabels: statusLabel2,
        },
      };
    } else if (selectedValue === 3) {
      data = {
        ...data,
        externalFormSourceLink: {
          statusLabels: statusLabel,
          formLink: {
            url: fromLinkurl,
            urlLabel: {
              text: fromLinkText,
            },
          },
        },
      };
    } else if (selectedValue === 4) {
      data = {
        ...data,
        externalFormDocument: {
          taskEmailDetails: {
            recipients: [...toDocumentemails, inputToDocumentEmailValue].filter(
              Boolean
            ),
            includeApplicantEmail: isToDocumentChecked,
          },
          ccRecipients: [...ccDocumentemails, inputCCDocumentEmailValue].filter(
            Boolean
          ),
          includeApplicantEmail: isCCDocumentChecked,
          subject: emailDocumentSubject,
          content: editorDocumentContent,
        },
        externalFormSource: {
          document: {
            filePath: file.filePath,
            fileName: file.fileName,
            fileURL: file.fileURL,
          },
          label: {
            text: documentLabel,
          },
        },
      };
    } else if (selectedValue === 5) {
      data = {
        ...data,
        completedApplicantDetails: {
          taskEmailDetails: {
            recipients: [...toCompleteemails, inputToCompleteEmailValue].filter(
              Boolean
            ),
            includeApplicantEmail: true,
          },
          ccRecipients: [...ccCompleteemails, inputCCCompleteEmailValue].filter(
            Boolean
          ),
          includeApplicantEmail: true,
          subject: emailCompleteSubject,
          content: editorCompleteContent,
          podRequired: isProofOfCompleteDocumentRequired,
        },
        attachmentDetails: {
          includeApplicantAttachment: isApplicantInformation,
        },
      };
    } else if (selectedValue === 6) {
      data = {
        ...data,
        formDetails: {
          taskEmailDetails: {
            recipients: [...toFormDetailsemails, inputToFormDetailsEmailValue],
            includeApplicantEmail: isToFormDetailsChecked,
            ccRecipients: [
              ...ccFormDetailsemails,
              inputCCFormDetailsEmailValue,
            ],
            includeApplicantEmail: isCCFormDetailsChecked,
            subject: emailFormDetailsSubject,
            content: editorFormDetailsContent,
            podRequired: isPODFormDetailsRequired,
          },
          formSourceDetails: {
            label: {
              text: completeLabel,
            },
          },
        },
      };
    }
    // if (!isEdit) {
    //   await POST("entity-service/checklist", JSON.stringify(data))
    //     .then((response) => {
    //       SuccessToaster("CheckList Form Added Successfully");
    //       setResponseData(response);
    //       handleClose(true);
    //     })
    //     .catch((error) => {
    //       ErrorToaster(error);
    //     });
    // } else {
    //   await PUT(
    //     `entity-service/checklist/${selectedApplicant?.id}`,
    //     JSON.stringify(data)
    //   )
    //     .then((response) => {
    //       SuccessToaster("CheckList Form Updated Successfully");
    //       setResponseData(response); // Store the response data

    //       handleClose(true);
    //     })
    //     .catch((error) => {
    //       ErrorToaster(error);
    //     });
    // }
  };

  const handlePreviewClick = () => {
    const data = {};

    if (selectedValue === 1) {
      data.mail = {
        recipientEmails: [...toemails, inputToEmailValue],
        ccRecipientEmails: [...ccemails, inputCCEmailValue],
        subject: emailSubject,
        content: editorContent,
      };
    } else if (selectedValue === 4) {
      data.mail = {
        recipients: [...toDocumentemails, inputToDocumentEmailValue],
        ccRecipients: [...ccDocumentemails, inputCCDocumentEmailValue],
        subject: emailDocumentSubject,
        content: editorDocumentContent,
      };
      data.externalFormSource = {
        document: file,
      };
    } else if (selectedValue === 5) {
      data.mail = {
        recipients: [...toCompleteemails, inputToCompleteEmailValue],
        ccRecipients: [...ccCompleteemails, inputCCCompleteEmailValue],
        subject: emailCompleteSubject,
        content: editorCompleteContent,
      };
    } else if (selectedValue === 6) {
      data.mail = {
        taskEmailDetails: {
          recipients: [...toFormDetailsemails, inputToFormDetailsEmailValue],
          ccRecipients: [...ccFormDetailsemails, inputCCFormDetailsEmailValue],
          subject: emailFormDetailsSubject,
          content: editorFormDetailsContent,
        },
      };
    }
    setPreviewData(data);
    setPreviewOpen(true);
  };

  return (
    <Dialog
      isOpen={open}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div className={style.spaceBetween}>
          <p
            className={style.extensionStyle}
          >{`Application Processing Task/Activity`}</p>
          <div className={`${style.floatRight} ${style.imageSpaceAlignment2}`}>
            <div className={style.marginRight20}>
              <img
                src={WritingFile}
                className={style.dialogCrossStyle}
                alt="Writing File"
              />
            </div>
            <div>
              <Icon
                icon="cross"
                size={30}
                intent={Intent.DANGER}
                className={style.dialogCrossStyle}
                onClick={() => {
                  handleClose();
                }}
              />
            </div>
          </div>
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <div>
            <div className={style.entityLableStyle}>APPLICANT TYPE*</div>
            <FormControl fullWidth size="small">
              <Select
                labelId="department-service-select"
                id="department-service-select"
                value={selectedApplicantValues}
                onChange={handleChange}
                multiple
                SelectDisplayProps={{
                  style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 },
                }}
                renderValue={() => "Select Applicant Type"} // Keep placeholder when nothing selected
              >
                {applicantTypes.map((data, index) => (
                  <MenuItem value={data?.id} key={index}>
                    {data?.type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedApplicantValues.length > 0 && (
              <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {selectedApplicantValues.map((value) => (
                  <Chip
                    key={value}
                    label={
                      applicantTypes.find((type) => type.id === value)?.type ||
                      ""
                    }
                    sx={{
                      backgroundColor: "#EDE7F6",
                      color: "#673AB7",
                      borderRadius: "4px",
                      fontSize: "13px",
                      padding: "0px 5px",
                    }}
                    onDelete={() => {
                      setSelectedApplicantValues(
                        selectedApplicantValues.filter((val) => val !== value)
                      );
                    }}
                    deleteIcon={<span style={{ fontSize: "14px" }}>✖</span>}
                  />
                ))}
              </Box>
            )}
          </div>
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>
              DEPARTMENT/SERVICE AREA*
            </div>
            <FormControl fullWidth size="small">
              <Select
                labelId="department-service-select"
                id="department-service-select"
                value={selectedDepartmentValues}
                onChange={handleDepartmentChange}
                multiple
                SelectDisplayProps={{
                  style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 },
                }}
                renderValue={() => "Select Applicant Type"}
              >
                {departmentTypes.map((data, index) => (
                  <MenuItem value={data?.id} key={index}>
                    {data?.type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedDepartmentValues.length > 0 && (
              <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {selectedDepartmentValues.map((value) => (
                  <Chip
                    key={value}
                    label={
                      departmentTypes.find((type) => type.id === value)?.type ||
                      ""
                    }
                    sx={{
                      backgroundColor: "#EDE7F6",
                      color: "#673AB7",
                      borderRadius: "4px",
                      fontSize: "13px",
                      padding: "0px 5px",
                    }}
                    onDelete={() => {
                      setSelectedDepartmentValues(
                        selectedDepartmentValues.filter((val) => val !== value)
                      );
                    }}
                    deleteIcon={<span style={{ fontSize: "14px" }}>✖</span>}
                  />
                ))}
              </Box>
            )}
          </div>
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>
              ACTION REQUIRED TO COMPLETE TASK
            </div>
            <FormControl fullWidth size="small">
              <Select
                value={selectedValue}
                onChange={handleSelectChange}
                SelectDisplayProps={{
                  style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 },
                }}
              >
                {sites.map((data) => (
                  <MenuItem value={data.id} key={data.id}>
                    {data.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className={`${style.validation} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>
              ARE THERE ANY CONSTRAINTS FOR THIS TASK
            </div>
            <div>
              <FormControlLabel
                control={
                  <Switch
                    checked={isConstraintsRequired}
                    onChange={(e) => {
                      setIsConstraintsRequired(e.target.checked);
                    }}
                    className={classes.switch}
                  />
                }
                className={`${style.switchFontStyle}`}
                label={isConstraintsRequired ? "Yes" : "No"}
                labelPlacement="start"
              />
            </div>
          </div>
          <div
            className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
          ></div>
          {selectedValue === 1 && (
            <>
              <Box display={"flex"} gap={3}>
                <Box width={"50%"} key={"department-service"}>
                  <div className={style.entityLableStyle}>
                    TASK/ACTIVITY TITLE *
                  </div>
                  <CommonInputField
                    value={activityTitle}
                    className={style.fullWidth}
                    onChange={(e) => setActivityTitle(e.target.value)}
                    placeholder={"Send Email To Switchboard"}
                    required={true}
                  />
                </Box>
                <Box width={"50%"}>
                  <div className={style.entityLableStyle}>
                    ACTIVITY EXECUTION PROMPT LABEL*
                  </div>
                  <CommonInputField
                    value={promptLabel}
                    className={style.fullWidth}
                    onChange={(e) => setPromptLabel(e.target.value)}
                    placeholder={"Send To Switchboard"}
                    required={true}
                  />
                </Box>
              </Box>
              <div className={style.marginTop20}>
                <div
                  className={`${style.entityLableStyle} ${style.spaceBetween}`}
                >
                  SELECT EMAIL ADDRESSES TO SEND TO*
                  <CommonCheckBox
                    className={` ${style.marginLeft20} ${style.marginTop}`}
                    label="INCLUDE APPLICANT EMAIL ADDRESS"
                    checked={isToChecked}
                    sx={{
                      "&.Mui-checked": {
                        color: "#7165e3",
                      },
                    }}
                    onChange={(e) => setIsToChecked(e.target.checked)} // Inline handler
                  />
                </div>
                <CommonInputField
                  value={inputToEmailValue}
                  className={style.fullWidth}
                  multiple
                  placeholder={"name@gmail.com"}
                  required={true}
                  onChange={(e) => setInputToEmailValue(e.target.value)}
                  onKeyDown={handleKeyPress} // Call when pressing keys
                />
              </div>
              <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {toemails.map((email, index) => (
                  <Chip
                    key={index}
                    label={email}
                    sx={{
                      backgroundColor: "#EDE7F6", // Light purple background
                      color: "#673AB7", // Dark purple text color
                      borderRadius: "4px",
                      fontSize: "13px",
                      padding: "0px 5px",
                    }}
                    onDelete={() => removeEmail(email, setToEmails)} // Remove from `ToEmails`
                    deleteIcon={<span style={{ fontSize: "14px" }}>✖</span>}
                  />
                ))}
              </Box>

              <div className={style.marginTop20}>
                <div
                  className={`${style.entityLableStyle} ${style.spaceBetween}`}
                >
                  SELECT EMAIL ADDRESSES TO SEND CC*
                  <CommonCheckBox
                    className={` ${style.marginLeft20} ${style.marginTop}`}
                    label="INCLUDE APPLICANT EMAIL ADDRESS"
                    sx={{
                      "&.Mui-checked": {
                        color: "#7165e3",
                      },
                    }}
                    checked={isCCChecked}
                    onChange={(e) => setIsCCChecked(e.target.checked)} // Inline handler
                  />
                </div>
                <CommonInputField
                  value={inputCCEmailValue}
                  className={style.fullWidth}
                  multiple
                  placeholder={"name@gmail.com"}
                  required={true}
                  onChange={(e) => setInputCCEmailValue(e.target.value)}
                  onKeyDown={handleCCKeyPress} // Call when pressing keys
                />
                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {ccemails.map((email, index) => (
                    <Chip
                      key={index}
                      label={email}
                      sx={{
                        backgroundColor: "#EDE7F6", // Light purple background
                        color: "#673AB7", // Dark purple text color
                        borderRadius: "4px",
                        fontSize: "13px",
                        padding: "0px 5px",
                      }}
                      onDelete={() => removeCCEmail(email)} // Allow removing the email
                      deleteIcon={<span style={{ fontSize: "14px" }}>✖</span>}
                    />
                  ))}
                </Box>
              </div>
              <div className={style.marginTop20}>
                <div className={style.entityLableStyle}>EMAIL SUBJECT*</div>
                <Box display={"flex"} gap={3}>
                  <Box width={"50%"}>
                    <CommonInputField
                      value={emailSubject} // Set value to the state
                      onChange={(e) => setEmailSubject(e.target.value)} // Inline handler
                      placeholder={"Swichboard Notification"}
                      required={true}
                      sx={{ width: "100%" }}
                    />
                  </Box>
                  <p>FOR[APPLICANT NAME]</p>
                </Box>
              </div>
              <div className={style.marginTop20}>
                <div className={style.entityLableStyle}>EMAIL CONTENTS*</div>
                <CKEditor
                  editor={ClassicEditor}
                  data={editorCompleteContent}
                  onChange={handleEditorChange(setEditorContent)}
                  config={{
                    placeholder: " ",
                    toolbar: {
                      shouldNotGroupWhenFull: true,
                      sticky: true,
                      items: [
                        'undo', 'redo',
                        '|',
                        'heading',
                        '|',
                        'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                        '|',
                        'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                        '|',
                        'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
                    ],
                    },
                    autoGrow: false,
                  }}
                />
              </div>
              <div className={`${style.marginTop20} ${style.validation}`}>
                <div className={style.entityLableStyle}>SEND AS*</div>
                {sendAs.map((item) => (
                  <div className={`${style.marginLeft40} ${style.validation}`}>
                    <FormControlLabel
                      control={
                        <Radio
                          id={item.id}
                          className={classes.radio}
                          checked={sendAsType === item.id} // Compare sendAsType with item.id
                          onChange={handleSendAsTypeChange}
                          value={item.value}
                          sx={{
                            "&.Mui-checked": {
                              color: "#7165e3",
                            },
                          }}
                          style={{
                            marginBottom: 0,
                          }}
                        />
                      }
                    />
                    <label>{item.label}</label>
                  </div>
                ))}
              </div>
              {sendAsType === "Standard_Email" && (
                <div className={`${style.validation} ${style.marginTop20}`}>
                  <div className={style.entityLableStyle}>
                    PROOF OF DOCUMENTATION REQUIRED?
                  </div>
                  <div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isProofOfDocumentRequired}
                          onChange={(e) => {
                            setIsProofOfDocumentRequired(e.target.checked);
                          }}
                          className={classes.switch}
                        />
                      }
                      className={`${style.switchFontStyle}`}
                      label={isProofOfDocumentRequired ? "Yes" : "No"}
                      labelPlacement="start"
                    />
                  </div>
                </div>
              )}

              <div
                className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
              ></div>
              <div className={style.marginTop20}>
                <p>
                  NOTE: Activity/Task Status Completion will be captured
                  automatically by the system when the user executes the
                  required action.
                </p>
              </div>
            </>
          )}
          {selectedValue === 2 && (
            <>
              <div className={style.marginTop20}>
                <div className={style.entityLableStyle}>
                  TASK/ACTIVITY TITLE*
                </div>
                <CommonInputField
                  value={activityTitle}
                  className={style.fullWidth}
                  onChange={(e) => setActivityTitle(e.target.value)}
                  placeholder={
                    "Add To Outlook For Medical & Professional Staff"
                  }
                  required={true}
                />
              </div>
              <div className={style.marginTop20}>
                <div className={style.entityLableStyle}>
                  TASK/ACTIVITY COMPLETION STATUS*
                </div>
                <Box display="flex" gap={3} alignItems="center">
                  <Box width={"80%"}>
                    <TextField
                      className={`${style.fullWidth}`}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <img src={CheckboxIcon} alt="Email" />
                            <img
                              src={redWarning}
                              alt="alert"
                              className={`${style.completedIconStyle2}`}
                            ></img>

                            <span style={{ marginRight: "8px" }}>
                              Not Started(Default)
                            </span>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  <Box width={"10%"}>
                    <span style={{ fontSize: "30px", fontWeight: 100 }}>=</span>
                  </Box>
                  <Box width={"90%"}>
                    <CommonInputField
                      value={taskDefaultStatus2}
                      className={style.fullWidth}
                      onChange={(e) => setTaskDefaultStatus2(e.target.value)}
                      placeholder={"Enter Applicant Type"}
                      required={true}
                    ></CommonInputField>
                  </Box>
                </Box>
                <div className={style.marginTop10}>
                  <Box display="flex" gap={3} alignItems="center">
                    <Box width={"80%"}>
                      <TextField
                        className={`${style.fullWidth}`}
                        variant="outlined"
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <img src={CheckboxIcon} alt="Email" />
                              <img
                                src={Alert}
                                alt="alert"
                                className={`${style.completedIconStyle2}`}
                              ></img>

                              <span style={{ marginRight: "8px" }}>
                                In Progress
                              </span>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <Box width={"10%"}>
                      <span style={{ fontSize: "30px", fontWeight: 100 }}>
                        =
                      </span>
                    </Box>
                    <Box width={"90%"}>
                      <CommonInputField
                        value={taskInprogressStatus2}
                        className={style.fullWidth}
                        onChange={(e) =>
                          setTaskInprogressStatus2(e.target.value)
                        }
                        placeholder={"Enter Applicant Type"}
                        required={true}
                      ></CommonInputField>
                    </Box>
                  </Box>
                </div>
                <div className={style.marginTop10}>
                  <Box display="flex" gap={3} alignItems="center">
                    <Box width={"80%"}>
                      <TextField
                        className={`${style.fullWidth}`}
                        variant="outlined"
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <img src={CheckboxIcon} alt="Email" />
                              <img
                                src={CompletedIcon}
                                alt="completed"
                                className={`${style.completedIconStyle2}`}
                              ></img>
                              <span style={{ marginRight: "8px" }}>
                                Complete/Done
                              </span>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <Box width={"10%"}>
                      <span style={{ fontSize: "30px", fontWeight: 100 }}>
                        =
                      </span>
                    </Box>
                    <Box width={"90%"}>
                      <CommonInputField
                        value={taskCompleteStatus2}
                        className={style.fullWidth}
                        onChange={(e) => setTaskCompleteStatus2(e.target.value)}
                        placeholder={"Enter Applicant Type"}
                        required={true}
                      ></CommonInputField>
                    </Box>
                  </Box>
                </div>
              </div>
            </>
          )}
          {selectedValue === 3 && (
            <>
              <div className={style.marginTop20}>
                <div className={style.entityLableStyle}>
                  TASK/ACTIVITY TITLE*
                </div>
                <CommonInputField
                  value={activityTitle}
                  className={style.fullWidth}
                  onChange={(e) => setActivityTitle(e.target.value)}
                  placeholder={"IT Logistics From To Get Completed"}
                  required={true}
                />
              </div>
              <div className={style.marginTop20}>
                <div className={style.entityLableStyle}>
                  NON CAPSMART FORM SOURCE*
                </div>
                <CommonInputField
                  value={fromLinkurl}
                  placeholder={"https://www.google.com"}
                  className={style.fullWidth}
                  onChange={(e) => setFromLinkUrl(e.target.value)}
                />
              </div>
              <div className={style.marginTop20}>
                <div className={style.entityLableStyle}>
                  DISPLAY LABEL TO ACCESS*
                </div>
                <CommonInputField
                  value={fromLinkText}
                  placeholder={"Click to complete & send Logistics form"}
                  className={style.fullWidth}
                  onChange={(e) => setFromLinkText(e.target.value)}
                />
              </div>
              <div className={style.marginTop20}>
                <div className={style.entityLableStyle}>
                  TASK/ACTIVITY COMPLETION STATUS*
                </div>
                <Box display="flex" gap={3} alignItems="center">
                  <Box width={"80%"}>
                    <TextField
                      className={`${style.fullWidth}`}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <img src={CheckboxIcon} alt="Email" />
                            <img
                              src={redWarning}
                              alt="alert"
                              className={`${style.completedIconStyle2}`}
                            ></img>

                            <span style={{ marginRight: "8px" }}>
                              Not Started(Default)
                            </span>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  <Box width={"10%"}>
                    <span style={{ fontSize: "30px", fontWeight: 100 }}>=</span>
                  </Box>
                  <Box width={"90%"}>
                    <CommonInputField
                      value={taskDefaultStatus}
                      className={style.fullWidth}
                      onChange={(e) => setTaskDefaultStatus(e.target.value)}
                      placeholder={"Logistics From Not Send To IT"}
                      required={true}
                    ></CommonInputField>
                  </Box>
                </Box>
                <div className={style.marginTop10}>
                  <Box display="flex" gap={3} alignItems="center">
                    <Box width={"80%"}>
                      <TextField
                        className={`${style.fullWidth}`}
                        variant="outlined"
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <img src={CheckboxIcon} alt="Email" />
                              <img
                                src={Alert}
                                alt="alert"
                                className={`${style.completedIconStyle2}`}
                              ></img>

                              <span style={{ marginRight: "8px" }}>
                                In Progress
                              </span>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <Box width={"10%"}>
                      <span style={{ fontSize: "30px", fontWeight: 100 }}>
                        =
                      </span>
                    </Box>
                    <Box width={"90%"}>
                      <CommonInputField
                        value={taskInprogressStatus}
                        className={style.fullWidth}
                        onChange={(e) =>
                          setTaskInprogressStatus(e.target.value)
                        }
                        placeholder={"Logistics From  Send To IT"}
                        required={true}
                      ></CommonInputField>
                    </Box>
                  </Box>
                </div>
                <div className={style.marginTop10}>
                  <Box display="flex" gap={3} alignItems="center">
                    <Box width={"80%"}>
                      <TextField
                        className={`${style.fullWidth}`}
                        variant="outlined"
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <img src={CheckboxIcon} alt="Email" />
                              <img
                                src={CompletedIcon}
                                alt="completed"
                                className={`${style.completedIconStyle2}`}
                              ></img>
                              <span style={{ marginRight: "8px" }}>
                                Complete/Done
                              </span>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <Box width={"10%"}>
                      <span style={{ fontSize: "30px", fontWeight: 100 }}>
                        =
                      </span>
                    </Box>
                    <Box width={"90%"}>
                      <CommonInputField
                        value={taskCompleteStatus}
                        className={style.fullWidth}
                        onChange={(e) => setTaskCompleteStatus(e.target.value)}
                        placeholder={"Logistics From Processed By IT"}
                        required={true}
                      ></CommonInputField>
                    </Box>
                  </Box>
                </div>
              </div>
            </>
          )}
          {selectedValue === 4 && (
            <>
              <Box display={"flex"} gap={3}>
                <Box width={"50%"} key={"department-service"}>
                  <div className={style.entityLableStyle}>
                    TASK/ACTIVITY TITLE *
                  </div>
                  <CommonInputField
                    value={activityTitle}
                    className={style.fullWidth}
                    onChange={(e) => setActivityTitle(e.target.value)}
                    placeholder={"Send Parking Lot instructions"}
                    required={true}
                  />
                </Box>
                <Box width={"50%"}>
                  <div className={style.entityLableStyle}>
                    ACTIVITY EXECUTION PROMPT LABEL*
                  </div>
                  <CommonInputField
                    value={promptLabel}
                    className={style.fullWidth}
                    onChange={(e) => setPromptLabel(e.target.value)}
                    placeholder={"Send To Applicant"}
                    required={true}
                  />
                </Box>
              </Box>
              <div className={style.marginTop20}>
                <div className={`${style.entityLableStyle}`}>
                  NON CAPSMART FORM SOURCE
                </div>
                <CommonDropZone
                  title={"Upload Your PDF Document/Form"}
                  description={
                    "Upload your files or drag & drop from your cabinet"
                  }
                  changeHandler={changeHandler}
                />
                <div className={`${style.marginTop10} ${style.dropzoneStyle}`}>
                  <p>Document</p>
                  <p>5 Mb</p>
                  <p>Delete</p>
                </div>
                <div className={style.marginTop20}>
                  <div className={style.entityLableStyle}>
                    DISPLAY LABEL TO VIEW*
                  </div>
                  <CommonInputField
                    value={documentLabel}
                    className={style.fullWidth}
                    placeholder={"View Parking Document"}
                    onChange={(e) => setDocumentLabel(e.target.value)}
                  />
                </div>
              </div>
              <div className={style.marginTop20}>
                <div
                  className={`${style.entityLableStyle} ${style.spaceBetween}`}
                >
                  SELECT EMAIL ADDRESSES TO SEND TO*
                  <CommonCheckBox
                    className={` ${style.marginLeft20} ${style.marginTop}`}
                    label="INCLUDE APPLICANT EMAIL ADDRESS"
                    checked={isToDocumentChecked} // Control checkbox state
                    onChange={(e) => setIsDocumentToChecked(e.target.checked)} // Inline handler
                  />
                </div>
                <CommonInputField
                  value={inputToDocumentEmailValue}
                  className={style.fullWidth}
                  multiple
                  placeholder={"name@gmail.com"}
                  required={true}
                  onChange={(e) => setInputToDocumentEmailValue(e.target.value)}
                  onKeyDown={handleKeyDocumentPress} // Call when pressing keys
                />
              </div>
              <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {toDocumentemails.map((email, index) => (
                  <Chip
                    key={index}
                    label={email}
                    sx={{
                      backgroundColor: "#EDE7F6", // Light purple background
                      color: "#673AB7", // Dark purple text color
                      borderRadius: "4px",
                      fontSize: "13px",
                      padding: "0px 5px",
                    }}
                    onDelete={() => removeEmail(email, setToDocumentEmails)} // Remove from `DocumentEmails`
                    deleteIcon={<span style={{ fontSize: "14px" }}>✖</span>}
                  />
                ))}
              </Box>

              <div className={style.marginTop20}>
                <div
                  className={`${style.entityLableStyle} ${style.spaceBetween}`}
                >
                  SELECT EMAIL ADDRESSES TO SEND CC*
                  <CommonCheckBox
                    className={` ${style.marginLeft20} ${style.marginTop}`}
                    label="INCLUDE APPLICANT EMAIL ADDRESS"
                    checked={isCCDocumentChecked} // Control checkbox state
                    onChange={(e) => setIsDocumentCCChecked(e.target.checked)} // Inline handler
                  />
                </div>
                <CommonInputField
                  value={inputCCDocumentEmailValue}
                  className={style.fullWidth}
                  multiple
                  placeholder={"name@gmail.com"}
                  required={true}
                  onChange={(e) => setInputCCDocumentEmailValue(e.target.value)}
                  onKeyDown={handleCCDocumentKeyPress} // Call when pressing keys
                />
                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {ccDocumentemails.map((email, index) => (
                    <Chip
                      key={index}
                      label={email}
                      sx={{
                        backgroundColor: "#EDE7F6", // Light purple background
                        color: "#673AB7", // Dark purple text color
                        borderRadius: "4px",
                        fontSize: "13px",
                        padding: "0px 5px",
                      }}
                      onDelete={() => removeCCDocumentEmail(email)} // Allow removing the email
                      deleteIcon={<span style={{ fontSize: "14px" }}>✖</span>}
                    />
                  ))}
                </Box>
              </div>
              <div className={style.marginTop20}>
                <div className={style.entityLableStyle}>EMAIL SUBJECT*</div>
                <Box display={"flex"} gap={3}>
                  <Box width={"50%"}>
                    <CommonInputField
                      value={emailDocumentSubject} // Set value to the state
                      onChange={(e) => setEmailDocumentSubject(e.target.value)} // Inline handler
                      placeholder={"Swichboard Notification"}
                      required={true}
                      sx={{ width: "100%" }}
                    />
                  </Box>
                  <p>FOR[APPLICANT NAME]</p>
                </Box>
              </div>
              <div className={style.marginTop20}>
                <div className={style.entityLableStyle}>EMAIL CONTENTS*</div>
                <CKEditor
                  editor={ClassicEditor}
                  data={editorDocumentContent} // Set initial value from state
                  onChange={handleEditorChange(setEditorDocumentContent)}
                  config={{
                    placeholder: " ",
                    toolbar: {
                      shouldNotGroupWhenFull: true,
                      sticky: true,
                      items: [
                        'undo', 'redo',
                        '|',
                        'heading',
                        '|',
                        'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                        '|',
                        'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                        '|',
                        'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
                    ],
                    },
                    autoGrow: false,
                  }}
                />
              </div>
              <div className={`${style.marginTop20} ${style.validation}`}>
                <div className={style.entityLableStyle}>SEND AS*</div>
                {sendAs.map((item) => (
                  <div className={`${style.marginLeft40} ${style.validation}`}>
                    <FormControlLabel
                      control={
                        <Radio
                          id={item.id}
                          className={classes.radio}
                          checked={item.id == sendAsDocumentType}
                          onChange={handleSendAsDoumentTypeChange}
                          value={item.value}
                          sx={{
                            "&.Mui-checked": {
                              color: "#7165e3",
                            },
                          }}
                          style={{
                            color: "#B3B8BD",
                            marginBottom: 0,
                          }}
                        />
                      }
                    />
                    <label>{item.label}</label>
                  </div>
                ))}
              </div>
              <div
                className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
              ></div>
              <div className={style.marginTop20}>
                <p>
                  NOTE: Activity/Task Status Completion will be captured
                  automatically by the system when the user executes the
                  required action.
                </p>
              </div>
            </>
          )}
          {selectedValue === 5 && (
            <>
              <Box display={"flex"} gap={3}>
                <Box width={"50%"} key={"department-service"}>
                  <div className={style.entityLableStyle}>
                    TASK/ACTIVITY TITLE *
                  </div>
                  <CommonInputField
                    value={activityTitle}
                    className={style.fullWidth}
                    onChange={(e) => setActivityTitle(e.target.value)}
                    placeholder={"Send Email To Switchboard"}
                    required={true}
                  />
                </Box>
                <Box width={"50%"}>
                  <div className={style.entityLableStyle}>
                    ACTIVITY EXECUTION PROMPT LABEL*
                  </div>
                  <CommonInputField
                    value={promptLabel}
                    className={style.fullWidth}
                    onChange={(e) => setPromptLabel(e.target.value)}
                    placeholder={"Send To Switchboard"}
                    required={true}
                  />
                </Box>
              </Box>
              <div className={style.marginTop20}>
                <div
                  className={`${style.entityLableStyle} ${style.spaceBetween}`}
                >
                  SELECT EMAIL ADDRESSES TO SEND TO*
                  <CommonCheckBox
                    className={` ${style.marginLeft20} ${style.marginTop}`}
                    label="INCLUDE APPLICANT EMAIL ADDRESS"
                    checked={isToCompleteChecked} // Control checkbox state
                    onChange={(e) => setIsToCompleteChecked(e.target.checked)} // Inline handler
                  />
                </div>
                <CommonInputField
                  value={inputToCompleteEmailValue}
                  className={style.fullWidth}
                  multiple
                  placeholder={"name@gmail.com"}
                  required={true}
                  onChange={(e) => setInputToCompleteEmailValue(e.target.value)}
                  onKeyDown={handleKeyCompletePress} // Call when pressing keys
                />
              </div>
              <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {toCompleteemails.map((email, index) => (
                  <Chip
                    key={index}
                    label={email}
                    sx={{
                      backgroundColor: "#EDE7F6",
                      color: "#673AB7",
                      borderRadius: "4px",
                      fontSize: "13px",
                      padding: "0px 5px",
                    }}
                    onDelete={() => removeEmail(email, setToCompleteEmails)} // Remove from `CompleteEmails`
                    deleteIcon={<span style={{ fontSize: "14px" }}>✖</span>}
                  />
                ))}
              </Box>
              <div className={style.marginTop20}>
                <div
                  className={`${style.entityLableStyle} ${style.spaceBetween}`}
                >
                  SELECT EMAIL ADDRESSES TO SEND CC*
                  <CommonCheckBox
                    className={` ${style.marginLeft20} ${style.marginTop}`}
                    label="INCLUDE APPLICANT EMAIL ADDRESS"
                    checked={isCCCompleteChecked} // Control checkbox state
                    onChange={(e) => setIsCCCompleteChecked(e.target.checked)} // Inline handler
                  />
                </div>
                <CommonInputField
                  value={inputCCCompleteEmailValue}
                  className={style.fullWidth}
                  multiple
                  placeholder={"name@gmail.com"}
                  required={true}
                  onChange={(e) => setInputCCCompleteEmailValue(e.target.value)}
                  onKeyDown={handleCCCompleteKeyPress} // Call when pressing keys
                />
                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {ccCompleteemails.map((email, index) => (
                    <Chip
                      key={index}
                      label={email}
                      sx={{
                        backgroundColor: "#EDE7F6", // Light purple background
                        color: "#673AB7", // Dark purple text color
                        borderRadius: "4px",
                        fontSize: "13px",
                        padding: "0px 5px",
                      }}
                      onDelete={() => removeCCCompleteEmail(email)} // Allow removing the email
                      deleteIcon={<span style={{ fontSize: "14px" }}>✖</span>}
                    />
                  ))}
                </Box>
              </div>
              <div className={style.marginTop20}>
                <div className={style.entityLableStyle}>EMAIL SUBJECT*</div>
                <Box display={"flex"} gap={3}>
                  <Box width={"50%"}>
                    <CommonInputField
                      value={emailCompleteSubject} // Set value to the state
                      onChange={(e) => setEmailCompleteSubject(e.target.value)} // Inline handler
                      placeholder={"Swichboard Notification"}
                      required={true}
                      sx={{ width: "100%" }}
                    />
                  </Box>
                  <p>FOR[APPLICANT NAME]</p>
                </Box>
              </div>
              <div className={style.marginTop20}>
                <div className={style.entityLableStyle}>EMAIL CONTENTS*</div>
                <CKEditor
                  editor={ClassicEditor}
                  data={editorCompleteContent} // Set initial value from state
                  onChange={handleEditorChange(setEditorCompleteContent)}
                  config={{
                    placeholder: " ",
                    toolbar: {
                      shouldNotGroupWhenFull: true,
                      sticky: true,
                      items: [
                        'undo', 'redo',
                        '|',
                        'heading',
                        '|',
                        'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                        '|',
                        'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                        '|',
                        'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
                    ],
                    },
                    autoGrow: false,
                  }}
                />
              </div>
              <div className={`${style.validation} ${style.marginTop20}`}>
                <div className={style.entityLableStyle}>
                  ATTACH APPLICANT INFORMATION FROM APPLICATION
                </div>
                <div>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isApplicantInformation}
                        onChange={(e) => {
                          setIsApplicantInformation(e.target.checked);
                        }}
                        className={classes.switch}
                      />
                    }
                    className={`${style.switchFontStyle}`}
                    label={isConstraintsRequired ? "Yes" : "No"}
                    labelPlacement="start"
                  />
                </div>
                <div className={style.marginLeft40}>
                  {isApplicantInformation && (
                    <>
                      <FormControl fullWidth size="small">
                        <Select
                          labelId="department-service-select"
                          id="department-service-select"
                          value={"Select from list-multi select"}
                          multiple
                          SelectDisplayProps={{
                            style: {
                              paddingTop: 5,
                              paddingBottom: 5,
                              fontSize: 15,
                            },
                          }}
                          renderValue={() => "Select from list-multi select"} // Keep placeholder when nothing selected
                        >
                          {/* {applicantTypes.map((data, index) => (
                  <MenuItem value={data?.id} key={index}>
                    {data?.type}
                  </MenuItem>
                ))} */}
                        </Select>
                      </FormControl>
                      {/* {selectedValues.length > 0 && (
              <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {selectedValues.map((value) => (
                  <Chip
                    key={value}
                    label={
                      applicantTypes.find((type) => type.id === value)?.type ||
                      ""
                    }
                    sx={{
                      backgroundColor: "#EDE7F6", // Light purple background
                      color: "#673AB7", // Dark purple text color
                      borderRadius: "4px",
                      fontSize: "13px",
                      padding: "0px 5px",
                    }}
                    onDelete={() => {
                      setSelectedValues(
                        selectedValues.filter((val) => val !== value)
                      );
                    }}
                    deleteIcon={<span style={{ fontSize: "14px" }}>✖</span>}
                  />
                ))}
              </Box>
            )} */}
                    </>
                  )}
                </div>
              </div>

              <div className={`${style.marginTop20} ${style.validation}`}>
                <div className={style.entityLableStyle}>SEND AS*</div>
                {sendAs.map((item) => (
                  <div className={`${style.marginLeft40} ${style.validation}`}>
                    <FormControlLabel
                      control={
                        <Radio
                          id={item.id}
                          checked={item.id == sendAsCompleteType}
                          onChange={handleSendAsCompleteTypeChange}
                          sx={{
                            "&.Mui-checked": {
                              color: "#7165e3",
                            },
                          }}
                          value={item.value}
                          style={{
                            marginBottom: 0,
                          }}
                        />
                      }
                    />
                    <label>{item.label}</label>
                  </div>
                ))}
              </div>
              {sendAsCompleteType == "Standard_Email" && (
                <div className={`${style.validation} ${style.marginTop20}`}>
                  <div className={style.entityLableStyle}>
                    PROOF OF DOCUMENTATION REQUIRED?
                  </div>
                  <div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isProofOfCompleteDocumentRequired}
                          onChange={(e) => {
                            setIsProofOfCompleteDocumentRequired(
                              e.target.checked
                            );
                          }}
                          className={classes.switch}
                        />
                      }
                      className={`${style.switchFontStyle}`}
                      label={isProofOfDocumentRequired ? "Yes" : "No"}
                      labelPlacement="start"
                    />
                  </div>
                </div>
              )}

              <div
                className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
              ></div>
              <div className={style.marginTop20}>
                <p>
                  NOTE: Activity/Task Status Completion will be captured
                  automatically by the system when the user executes the
                  required action.
                </p>
              </div>
            </>
          )}
          {selectedValue === 6 && (
            <>
              <Box display={"flex"} gap={3}>
                <Box width={"50%"} key={"department-service"}>
                  <div className={style.entityLableStyle}>
                    TASK/ACTIVITY TITLE *
                  </div>
                  <CommonInputField
                    value={activityTitle}
                    className={style.fullWidth}
                    onChange={(e) => setActivityTitle(e.target.value)}
                    placeholder={"Send Email To Switchboard"}
                    required={true}
                  />
                </Box>
                <Box width={"50%"}>
                  <div className={style.entityLableStyle}>
                    ACTIVITY EXECUTION PROMPT LABEL*
                  </div>
                  <CommonInputField
                    value={promptLabel}
                    className={style.fullWidth}
                    onChange={(e) => setPromptLabel(e.target.value)}
                    placeholder={"Send To Switchboard"}
                    required={true}
                  />
                </Box>
              </Box>
              <div className={style.marginTop20}>
                <div
                  className={`${style.entityLableStyle} ${style.spaceBetween}`}
                >
                  SELECT EMAIL ADDRESSES TO SEND TO*
                  <CommonCheckBox
                    className={` ${style.marginLeft20} ${style.marginTop}`}
                    label="INCLUDE APPLICANT EMAIL ADDRESS"
                    checked={isToFormDetailsChecked} // Control checkbox state
                    onChange={(e) =>
                      setIsToFormDetailsChecked(e.target.checked)
                    } // Inline handler
                  />
                </div>
                <CommonInputField
                  value={inputToFormDetailsEmailValue}
                  className={style.fullWidth}
                  multiple
                  placeholder={"name@gmail.com"}
                  required={true}
                  onChange={(e) =>
                    setInputToFormDetailsEmailValue(e.target.value)
                  }
                  onKeyDown={handleKeyFormDetailsPress} // Call when pressing keys
                />
              </div>
              <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {toFormDetailsemails.map((email, index) => (
                  <Chip
                    key={index}
                    label={email}
                    sx={{
                      backgroundColor: "#EDE7F6", // Light purple background
                      color: "#673AB7", // Dark purple text color
                      borderRadius: "4px",
                      fontSize: "13px",
                      padding: "0px 5px",
                    }}
                    onDelete={() => removeEmail(email, setToFormDetailsEmails)} // Remove from `FormDetailsEmails`
                    deleteIcon={<span style={{ fontSize: "14px" }}>✖</span>}
                  />
                ))}
              </Box>

              <div className={style.marginTop20}>
                <div
                  className={`${style.entityLableStyle} ${style.spaceBetween}`}
                >
                  SELECT EMAIL ADDRESSES TO SEND CC*
                  <CommonCheckBox
                    className={` ${style.marginLeft20} ${style.marginTop}`}
                    label="INCLUDE APPLICANT EMAIL ADDRESS"
                    checked={isCCFormDetailsChecked} // Control checkbox state
                    onChange={(e) =>
                      setIsCCFormDetailsChecked(e.target.checked)
                    }
                  />
                </div>
                <CommonInputField
                  value={inputCCFormDetailsEmailValue}
                  className={style.fullWidth}
                  multiple
                  placeholder={"name@gmail.com"}
                  required={true}
                  onChange={(e) =>
                    setInputCCFormDetailsEmailValue(e.target.value)
                  }
                  onKeyDown={handleCCFormDetailsKeyPress}
                />
                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {ccFormDetailsemails.map((email, index) => (
                    <Chip
                      key={index}
                      label={email}
                      sx={{
                        backgroundColor: "#EDE7F6",
                        color: "#673AB7",
                        borderRadius: "4px",
                        fontSize: "13px",
                        padding: "0px 5px",
                      }}
                      onDelete={() => removeCCFormDetailsEmail(email)}
                      deleteIcon={<span style={{ fontSize: "14px" }}>✖</span>}
                    />
                  ))}
                </Box>
              </div>
              <div className={style.marginTop20}>
                <div className={style.entityLableStyle}>EMAIL SUBJECT*</div>
                <Box display={"flex"} gap={3}>
                  <Box width={"50%"}>
                    <CommonInputField
                      value={emailFormDetailsSubject}
                      onChange={(e) =>
                        setEmailFormDetailsSubject(e.target.value)
                      }
                      placeholder={"Swichboard Notification"}
                      required={true}
                      sx={{ width: "100%" }}
                    />
                  </Box>
                  <p>FOR[APPLICANT NAME]</p>
                </Box>
              </div>
              <div className={style.marginTop20}>
                <div className={style.entityLableStyle}>EMAIL CONTENTS*</div>
                <CKEditor
                  editor={ClassicEditor}
                  data={editorFormDetailsContent}
                  onChange={handleEditorChange(setEditorFormDetailsContent)}
                  config={{
                    placeholder: " ",
                    toolbar: {
                      shouldNotGroupWhenFull: true,
                      sticky: true,
                      items: [
                        'undo', 'redo',
                        '|',
                        'heading',
                        '|',
                        'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                        '|',
                        'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                        '|',
                        'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
                    ],
                    },
                    autoGrow: false,
                  }}
                />
              </div>
              <div className={style.marginTop20}>
                <Box display={"flex"} gap={3}>
                  <Box width={"50%"} key={"department-service"}>
                    <div className={style.entityLableStyle}>
                      TASK/ACTIVITY TITLE *
                    </div>
                    <CommonInputField
                      value={activityTitle}
                      className={style.fullWidth}
                      // onChange={(e) => setActivityTitle(e.target.value)}
                      placeholder={"Send Email To Switchboard"}
                      required={true}
                    />
                  </Box>
                  <Box width={"50%"}>
                    <div className={style.entityLableStyle}>
                      DISPLAY LABEL TO ACCESS*
                    </div>
                    <CommonInputField
                      value={completeLabel}
                      className={style.fullWidth}
                      onChange={(e) => setCompleteLabel(e.target.value)}
                      placeholder={"Click to Complete form"}
                      required={true}
                    />
                  </Box>
                </Box>
              </div>
              <div className={`${style.marginTop20} ${style.validation}`}>
                <div className={style.entityLableStyle}>SEND AS*</div>
                {sendAs.map((item) => (
                  <div className={`${style.marginLeft40} ${style.validation}`}>
                    <FormControlLabel
                      control={
                        <Radio
                          id={item.id}
                          className={classes.radio}
                          checked={item.id == sendAsFormDetailType}
                          sx={{
                            "&.Mui-checked": {
                              color: "#7165e3",
                            },
                          }}
                          onChange={handleSendAsFormDetailsTypeChange}
                          value={item.value}
                          style={{
                            color: "#B3B8BD",
                            marginBottom: 0,
                          }}
                        />
                      }
                    />
                    <label>{item.label}</label>
                  </div>
                ))}
              </div>
              {sendAsFormDetailType === "STANDARD_EMAIL" && (
                <div className={`${style.validation} ${style.marginTop20}`}>
                  <div className={style.entityLableStyle}>
                    PROOF OF DOCUMENTATION REQUIRED?
                  </div>
                  <div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isPODFormDetailsRequired}
                          onChange={(e) => {
                            setIsPODFormDetailsRequired(e.target.checked);
                          }}
                          className={classes.switch}
                        />
                      }
                      className={`${style.switchFontStyle}`}
                      label={isPODFormDetailsRequired ? "Yes" : "No"}
                      labelPlacement="start"
                    />
                  </div>
                </div>
              )}

              <div
                className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
              ></div>
              <div className={style.marginTop20}>
                <p>
                  NOTE: Activity/Task Status Completion will be captured
                  automatically by the system when the user executes the
                  required action.
                </p>
              </div>
            </>
          )}

          <div className={`${style.validation} ${style.marginTop20}`}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div className={style.entityLableStyle}>
                Task Completion Dependant Note Capture
              </div>
              <div className={style.marginLeft40}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isCompletionDependant}
                      onChange={(e) => {
                        setIsCompletionDependant(e.target.checked);
                      }}
                      className={classes.switch}
                    />
                  }
                  className={`${style.switchFontStyle}`}
                  label={isCompletionDependant ? "Yes" : "No"}
                  labelPlacement="start"
                />
              </div>
            </div>
            {isCompletionDependant && (
              <div className={`${style.marginLeft40}`}>
                <div className={style.entityLableStyle}>NOTE LABEL</div>
                <CommonInputField
                  value={notelabel}
                  placeholder={"Outlook ID"}
                  required={true}
                  onChange={(e) => setNoteLabel(e.target.value)} // Update state inline
                />
                <div className={style.entityLableStyle}>DISPLAY OPTION</div>
                <FormControl fullWidth size="small">
                  <Select
                    labelId="department-service-select"
                    id="department-service-select"
                    value={selectedDisplayOption}
                    onChange={handleDisplaySelectChange}
                    SelectDisplayProps={{
                      style: {
                        paddingTop: 5,
                        paddingBottom: 5,
                        fontSize: 15,
                      },
                    }}
                  >
                    {displayOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className={`${style.marginTop20} `} style={{ float: "left" }}>
            <button
              className={`${style.outlinedButton} ${style.borderRadius10}`}
              onClick={handlePreviewClick}
            >
              PREVIEW
            </button>

            {!selectedValue && (
              <button
                className={`${style.outlinedButton} ${style.borderRadius10} ${style.marginLeft20}`}
              >
                BULK UPOAD
              </button>
            )}
          </div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button
              className={`${style.outlinedButton} ${style.borderRadius10}`}
              onClick={handleSubmit}
            >
              SAVE & EXIT
            </button>
            <button
              className={`${style.buttonStyle} ${style.marginLeft20} ${style.borderRadius10}`}
            >
              SAVE & ADD MORE
            </button>
          </div>
        </div>
      </div>
      <PreviewDialog
        open={previewOpen}
        handleClose={() => setPreviewOpen(false)}
        selectedValue={selectedValue}
        previewData={previewData}
      />
    </Dialog>
  );
};

export default CheckListDialog;
