import React, { useState, useEffect, useRef } from "react";
import { InputGroup, Icon, Intent, Dialog, Classes } from "@blueprintjs/core";
import FileImg from "./../../images/fileImg.png";
import WritingFile from "./../../images/writingFile.png";
import CompletedIcon from "./../../images/completedIcon.png";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import RedWarning from "./../../images/redWarning.png";
import Verified from "./../../images/verifiedImage.png";
import CrossPink from "./../../images/crossPink.png";
import ToBeVerified from "./../../images/toBeVerifiedImage.png";
import Tooltip from "@mui/material/Tooltip";
import { DELETE, TenantID, GET, PUT, POST } from "./../dataSaver";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import "react-datalist-input/dist/styles.css";
import Alert from "../../Components/AlertPopUp";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DataStatusIcon from "./../../images/dqStatus.png";
import DocumentIcon from "../../images/document.png";
import EditBlue from "../../images/editBlue.png";
import CryptoJS from "crypto-js";
import OutGoing from "../../images/Outgoing.png";
import Popover from "@mui/material/Popover";
import style from "./index.module.scss";
import ApplicationDecline from "./applicationDeclineDialog";
import ApplicationHeader from "../../Components/ApplicationHeader";
import ApplicationFieldCard from "../../Components/ApplicationFieldCard";
import CommonDivider from "../../Components/CommonFields/CommonDivider";
import ESignature from "../../Components/ESignature";
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import CommonDateField from "../../Components/CommonFields/CommonDateField";
import { add, format, isValid, parse, sub } from 'date-fns';
import TextField from "@mui/material/TextField";
import CommonDropZone from '../../Components/CommonFields/CommonDropZone';
import DescriptionIcon from '@mui/icons-material/Description';
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import WarningIcon from "@mui/icons-material/Warning";
import Dropzone from "react-dropzone";
const NewActiveApplication = ({
  contracts,
  getNewContract,
  contractType,
  selectedContract,
  selectedContractType,
  contractIdFromActive,
  getContractIdFromActive,
  method,
  isEditable,
  selectedTab,
  getActiveApplicationView,
  getApprovalNotesCommentBox,
  getActiveApplicationTask,
  getEmailDialogBox,
  index

}) => {
  console.log("contract Type", contractType);
  const [applicationId, setApplicationId] = useState(
    sessionStorage.getItem("applicationId")
  );
  const [form, setForm] = useState();
  const contractStatus = sessionStorage.getItem("Selected Contract Status");
  const [selectContractInfo, setSelectContractInfo] = useState(
    contractType?.value
  );
  const [deleteExecutedContractDialog, setDeleteExecutedContractDialog] =
    useState(false);
  const [newServiceProviderDialog, setNewServiceProviderDialog] =
    useState(false);
  const [formSchema, setFormSchema] = useState();
  const [formSchemaId, setFormSchemaId] = useState();
  const [addOn, setAddOn] = useState(false);
  const [viewPage1, setViewPage1] = useState(true);
  const [viewPage2, setViewPage2] = useState(false);
  const [viewPage3, setViewPage3] = useState(false);
  const [viewPage4, setViewPage4] = useState(false);
  const [viewPage5, setViewPage5] = useState(false);
  const [viewPage6, setViewPage6] = useState(false);
  const [viewPage7, setViewPage7] = useState(false);
  const [viewPage8, setViewPage8] = useState(false);
  const [viewPage9, setViewPage9] = useState(false);
  const [viewPage10, setViewPage10] = useState(false);
  const [currentPage, setCurrentPage] = useState("Contract ID & Term Limit");
  const [isMultipleContract, setIsMultipleContract] = useState(false);
  const [contractId, setContractId] = useState(contractIdFromActive);
  const [fileFields, setFileFields] = useState([]);
  const [contractName, setContractName] = useState("");
  const [fileDeletionIndex, setFileDeletionIndex] = useState();
  const [fileItems, setFileItems] = useState([]);
  const [isMultiSiteEntity, setIsMultiSiteEntity] = useState(false);
  const [helpTextData, setHelpTextData] = useState();
  const [form1, setForm1] = useState();
  const [selectedField, setSelectedField] = useState({
    fieldName: "",
    empty: false,
  });
  const [selectedFileURL, setSelectedFileURL] = useState("");
  const [priorContractId, setPriorContractId] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showPrevContractDataAlert, setShowPrevContractDataAlert] =
    useState(false);
  const [isTabsValid, setIsTabsValid] = useState([]);
  const [expand, setExpand] = useState({ status: false, index: 0 });
  const [expandStates, setExpandStates] = useState({
    section1: false,
    section2: false,
    section3: false,
  });
  const [expandAcknowledgement, setExpandAcknowledgement] = useState({
    status: false,
    index: 0,
  });
  const [contractSelected, setContractSelected] = useState(
    contracts
      ?.filter((contract) => contract?.id === contractId)
      ?.map((data) => data)[0]
  );
  const [showDocVerifyDialog, setShowDocVerifyDialog] = useState(false);
  const [file, setFile] = useState();
  const [selectedRow, setSelectedRow] = useState();
  const [selectedRowTableName, setSelectedRowTableName] = useState();
  const [selectedFormId, setSelectedFormId] = useState();
  const [credApproval, setCredApproval] = useState();
  const [calendarStart, setCalendarStart] = useState(false);
  const [calendarEnd, setCalendarEnd] = useState(false);
  const [selectedDateForBod, setSelectedDateForBod] = useState(null);
  const [selectedDateForReappoint, setSelectedDateForReappoint] = useState(null);
  const [selectedDateForMac, setSelectedDateForMac] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isButtonDisabled1, setIsButtonDisabled1] = useState(true);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  let cookie = new Cookie();
  let userDetails = cookie.get('user');
  const users = jwt(userDetails);
  const [userRole, setUserRole] = useState('');
  const [taskCount, setTaskCount] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const [statusStyle, setStatusStyle] = useState();
  const canadaData =
    sessionStorage.getItem("canadaData") !== "undefined"
      ? JSON.parse(sessionStorage.getItem("canadaData"))
      : {};
  let user =
    sessionStorage.getItem("user") !== undefined
      ? JSON.parse(sessionStorage.getItem("user"))
      : {};
  const publicKey =
    "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
  const [encryptedText, setEncryptedText] = useState(
    CryptoJS.AES.encrypt(
      `${user?.name?.firstName} ${user?.name?.lastName}` +
      new Date().toISOString(),
      publicKey
    ).toString()
  );
  const [currentDate, setCurrentDate] = useState();

  const dropzoneStyle = {
    width: "100%",
    height: "auto",
    borderWidth: 2,
    borderColor: "rgb(102, 102, 102)",
    borderStyle: "dashed",
    borderRadius: 5,
};
  useEffect(() => {
    getPreApplication();
    getPreApplicationTask();
  }, []);

  const handleDateChange = (date, field) => {
    const formattedDate = date
    ? format(new Date(date), "yyyy-MM-dd'T'HH:mm:ss'Z'")
    : format(new Date(date), 'yyyy-MM-dd');


    if (field === 'BOD') {
      setSelectedDateForBod(formattedDate);
    } else if (field === 'Reappoint') {
      setSelectedDateForReappoint(formattedDate);
    }else if (field === 'MAC') {
      setSelectedDateForMac(formattedDate);
    }
  
    setCalendarStart(false);
    setIsButtonDisabled(false); 
   
  };

  useEffect(() => {
    if (canadaData) {
      setCurrentDate(
        format(new Date(), canadaData?.dateFormat || "dd/MM/yyyy")
      );
    }
  }, [canadaData]);

  const [providerDetails, setProviderDetails] = useState();
  const [prevContractData, setPrevContractData] = useState();
  const [showApplicationDeclineDialog, setShowApplicationDeclineDialog] =
    useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const getPreApplication = async () => {
    const { data: basicForm } = await GET(
      `application-management-service/application/${applicationId}`
    );
    setForm(basicForm);
    console.log("basicFormmmm"+ JSON.stringify(basicForm));
    
  };

  // const isApproved = form?.forms[index]?.status === "APPROVED";

 

  // useEffect(() => {
  //   if (form?.formSchemas) {
  //     const approvalStatuses = form.formSchemas.map((_, index) => {
  //       const isFormApproved = form?.forms[index]?.status === "APPROVED";
  //       console.log(`Form ${index} status:`, form?.forms[index]?.status);
  //       console.log(`Form ${index} isApproved:`, isFormApproved);
  //       return isFormApproved;
  //     });
      
  //     setIsApproved(approvalStatuses);
  //   }
  // }, [form]);

  useEffect(() => {
    if (form?.formSchemas) {
      // Check if all forms are approved
      const areAllFormsApproved = form.formSchemas.every((_, index) => 
        form?.forms[index]?.status === "APPROVED"
      );
      
      setIsApproved(areAllFormsApproved);
      
      // Debug logging
      form.formSchemas.forEach((_, index) => {
        console.log(`Form ${index} status:`, form?.forms[index]?.status);
        console.log(`Form ${index} isApproved:`, form?.forms[index]?.status === "APPROVED");
      });

      const approvalStatuses = form.formSchemas.map((_, index) => 
        form?.forms[index]?.status === "APPROVED"
      );
        // Check if any form is approved
        const hasAnyApproved = approvalStatuses.some(status => status);
        // Check if all forms are approved
        const hasAllApproved = approvalStatuses.every(status => status);
  
        if (hasAllApproved) {
          setStatusStyle(style.greenBigDotStyle);
        } else if (hasAnyApproved) {
          setStatusStyle(style.yellowBigDotStyle);
        } else {
          setStatusStyle(style.greyBigDotStyle);
        }
    }
  }, [form]);
  

  const getPreApplicationTask = async () => {
    const { data: tasks } = await GET(`application-management-service/application/${applicationId}/tasks`);
    const pendingTasks = tasks.filter(task => task.taskStatus !== 'COMPLETED');
    setTaskCount(pendingTasks.length);
  };

  const allTasksCompleted = taskCount !== 0;


  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    getFormSchema();
  }, [formSchemaId]);

  const open = Boolean(anchorEl);

  const [anchorTextEl, setAnchorTextEl] = React.useState(null);

  const handlePopoverTextOpen = (event) => {
    setAnchorTextEl(event.currentTarget);
  };

  const handlePopoverTextClose = () => {
    setAnchorTextEl(null);
  };

  const openTextWithHover = Boolean(anchorTextEl);

  const getApplicationDeclineDialog = (value) => {
    setShowApplicationDeclineDialog(value);
  };

  console.log(contractSelected, prevContractData, "selected contract");

 

  useEffect(() => {
    getFileData();
    getEntityData();
    getBasicForm();
    helpText();
  }, []);

  useEffect(() => {
    helpText();
  }, [currentPage]);

  useEffect(() => {
    getFileData();
    console.log("entered");
  }, [fileFields]);

  useEffect(() => {
    setContractSelected(
      contracts
        ?.filter((contract) => contract?.id === contractId)
        ?.map((data) => data)[0]
    );
  }, [contractId]);

  useEffect(() => {
    if (
      contractSelected?.contractDetail?.priorContractRefId?.id !== undefined
    ) {
      getPrevContractData();
    }
  }, [contractSelected]);

  useEffect(() => {
    approveView();
  }, []);

  useEffect(() => {
    setUserDetails();
  }, [users?.id])

  const setUserDetails = async () => {
    const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
    console.log("userdataaaa" + JSON.stringify(userData))
    sessionStorage.setItem('user', JSON.stringify(userData))
    setUserRole(userData?.roles?.map((data) => data?.roleName));
  }

  const isLableEmpty = (data) => {
    if (data === "" || data === null) {
        return true;
    } else {
        return false;
    }
};


  const getPrevContractData = async () => {
    const { data: contractData } = await GET(
      `contract-managment-service/contracts/${contractSelected?.contractDetail?.priorContractRefId?.id}/contractDetail`
    );
    if (contractData) {
      setPrevContractData(contractData);
    }
  };

  const getFormSchema = async () => {
    if (
      formSchemaId !== "" &&
      formSchemaId !== undefined &&
      formSchemaId !== null
    ) {
      const { data: form } = await GET(
        `application-management-service/formSchema/${formSchemaId}`
      );
      setFormSchema(form?.schema);
    }
  };


  const getPriorContractId = (value) => {
    console.log("prior contract id", value);
    setPriorContractId(value);
  };

  const checkFieldAndPopAlert = (value, fieldName) => {
    if (
      value === null ||
      value === 0 ||
      value === "" ||
      value === undefined ||
      value === "0"
    ) {
      console.log("inside");
      setSelectedField({ fieldName: fieldName, empty: false });
    } else {
      setSelectedField({ fieldName: fieldName, empty: true });
    }
  };

  const changeHandler = async (event) => {
    setIsLoading(true);
    const filesArray = Array.from(event);
    setFiles(filesArray);
    console.log(event, 'Test');


    const formData = new FormData();
    let fileNameArray = [];
    filesArray?.forEach(file => {
      fileNameArray.push({ "fileName": file?.name });
      formData.append('documents', file);
    });
    
    
    

    formData.append('files', new Blob([JSON.stringify(fileNameArray)], {
      type: "application/json"
    }));

    fileNameArray.forEach(file => {
      console.log("File name:", file.fileName);
    });

    console.log("file?.name" + JSON.stringify(fileNameArray));
    console.log(fileNameArray)
    console.log(event?.name);
    
    try {
      const response = await POST(`application-management-service/application/${applicationId}/files/bulk?isLLMRequired=${false}`, formData);
      SuccessToaster('File Uploaded Successfully');
      console.log(response?.data?.fileName);

      
    
      setIsLoading(false);
      return response?.data;
    } catch (error) {
      ErrorToaster('File Upload Failed');
      console.error(error);
      setIsLoading(false);
      return null;
    }
  };



  const helpText = async () => {
    const { data: data } = await GET(
      `contract-managment-service/helpText?tabName=${encodeURIComponent(
        currentPage
      )}`
    );
    setHelpTextData(data?.dataElement);
  };

  const getEntityData = async () => {
    const { data: data } = await GET(`entity-service/entity/${TenantID}`);
    setIsMultiSiteEntity(data?.multiSiteEntity);
  };

  const getShowPrevContractDataAlert = (value) => {
    console.log(value, "test");
    setShowPrevContractDataAlert(value === false ? true : false);
  };

  const getBasicForm = async () => {
    const { data: basicForm } = await GET(
      `application-management-service/application/basicForm`
    );
    if (basicForm) {
      const { data: form1 } = await GET(
        `application-management-service/formSchema/${basicForm?.generalSchemas?.[1]?.id}`
      );
      let temp = form1?.schema;
      if (temp.properties.applicant.properties !== null) {
        delete temp.properties.applicant.properties["applicantType"];
        delete temp.properties.applicant.properties["startDate"];
      }
      setForm1(form1?.schema);
    }
  };

  const getFileData = () => {
    let temp = [];
    console.log("entered", fileFields);
    for (let i = 0; i < fileFields?.length || 0; i++) {
      temp[i] = (
        <div className={`${style.documentCard} ${style.marginTop10}`} key={i}>
          <div className={`${style.documentGrid}`}>
            <a href={fileFields?.[i]?.fileURL} target="_blank">
              <Tooltip title={"Preview"} arrow>
                <ArticleOutlinedIcon
                  sx={{ color: "#0e5197", fontSize: 35 }}
                  onClick={() => {
                    setSelectedFileURL(fileFields?.[i]?.fileURL);
                  }}
                />
              </Tooltip>
            </a>
            <div className={style.marginTop}>
              <a href={fileFields?.[i]?.fileURL} target="_blank">
                <Tooltip title={"Preview"} arrow>
                  <p
                    className={`${style.documentText} ${style.leftAlign} ${style.removeUnderline}`}
                    onClick={() => {
                      setSelectedFileURL(fileFields?.[i]?.fileURL);
                    }}
                  >
                    <strong>{fileFields?.[i]?.documentType}</strong>
                  </p>
                </Tooltip>
              </a>

              <div className={style.spaceBetween}>
                <p className={`${style.documentText} ${style.leftAlign}`}>
                  <strong>{fileFields?.[i]?.fileName}</strong>
                </p>
                <div
                  onClick={() => {
                    getDeleteExecutedContractDialog(true);
                    setFileDeletionIndex(i);
                  }}
                  className={`${style.floatRight} ${style.cursorPointer}`}
                >
                  <DeleteOutlineIcon sx={{ color: "#F94848" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    setFileItems(temp);
  };

  const handleVerify = async (formId) => {
    await PUT(
      `application-management-service/application/${applicationId}/APPROVED`
    )
      .then((response) => {
        console.log("success");
      })
      .catch((error) => {
        console.log(error);
      });
    getPreApplication();
  };

  const handleStepsVerify = async (formId) => {
    await PUT(
      `application-management-service/application/${applicationId}/form/${formId}/APPROVED`
    )
      .then((response) => {
        console.log("success");
      })
      .catch((error) => {
        console.log(error);
      });
    getPreApplication();
  };

  const handleStaffEsign = async (formId) => {
    console.log("entered");
    let index = form?.forms?.findIndex((row) => row?.id === formId);
    console.log("entered", index, formId, form);
    let tempData =
      form?.forms?.[index]?.staffEsign === null
        ? {
          name: `${user?.name?.firstName} ${user?.name?.lastName}`,
          esign: encryptedText,
          signedDate: currentDate,
        }
        : form?.forms?.[index]?.staffEsign;
    let temp = {
      schemaId: formSchemaId,
      data: form?.forms?.[index]?.data,
      acknowledged: form?.forms?.[index]?.acknowledged,
      esign: form?.forms?.[index]?.esign,
      staffEsign: tempData,
    };
    console.log("entered", tempData, index, formId);
    await PUT(
      `application-management-service/application/${applicationId}/form/${formId}`,
      temp
    )
      .then((response) => {
        getPreApplication();
        SuccessToaster("Signed Successfully");
      })
      .catch((error) => {
        console.log(error);
        ErrorToaster("Unexpected Error");
      });
  };

  const handleDocVerify = async (rowId) => {
    let temp = {
      formId: selectedFormId,
      contentToVerify: "DOCUMENT",
      tableName: selectedRowTableName,
      rowId: rowId,
    };
    await PUT(
      `application-management-service/application/${applicationId}/verifyForm`,
      temp
    )
      .then((response) => {
        console.log("success");
      })
      .catch((error) => {
        console.log(error);
      });
    getPreApplication();
  };

  const approveView = async () => {
    // const roleMap = {
    //     'level-1': "Chief Of Staff",
    //     'level-2': "Department Head",
    //     'level-3': "Credentialing Committee",
    //     'level-4': "Advisory Committee",
    //     'level-5': "Board"
    //   };
    //   console.log("roleMap" + roleMap);
      

    //   const role = roleMap[selectedTab];
    //   console.log("roleeeeee1" + role);
      

        const { data: basicApproval } = await GET(
          `application-management-service/application/${applicationId}/approvalRequiredForms?role=${userRole}`
        );
        setCredApproval(basicApproval)  
        console.log("basicApproval" + JSON.stringify(credApproval));     
  }

  const onClickApprovalFunction = () => {
    getApprovalNotesCommentBox(true);
  };

  const onClickCheckListFunction = () => {
    getActiveApplicationTask(true);
  };
  
  const onClickEmailDialogFunction = () => {
    getEmailDialogBox(true);
  };

  const onClickApproveFunction = () => {
    handleApplicationAccept(true);
  };

  const handleApplicationAccept = async () => {
    let role;
    let notes;

    if (selectedTab === 'level-2') {
      role = "Department Head";
      notes = "Send"
    } else if (selectedTab === 'level-3') {
      role = "Credentialing Committee";
      notes = "Send"
    } else if (selectedTab === 'level-4') {
      role = "Advisory Committee";
      notes = "Send"
    } else if (selectedTab === 'level-5') {
      role = "Board";
      notes = "Send"
    } 

    let temp = {
      role: role,
      notes: notes
    };

    const isDelegate = selectedTab === 'level-2' || selectedTab === 'level-3' || selectedTab === 'level-4' || selectedTab === 'level-5' ? true : false;
    const requestData = isDelegate === true ? temp : {};
    await PUT(`application-management-service/application/${applicationId}/workflow/complete/APPROVED?isDelegate=${isDelegate}`, requestData)
      .then(response => {
        console.log('success')
        onClose()
      })
      .catch((error) => {
        console.log(error);
      });
    getPreApplication();
  };

  const getContractId = (value) => {
    setContractId(value);
  };

  const getNewServiceProviderDialog = (value) => {
    setNewServiceProviderDialog(value);
  };

  const getDeleteExecutedContractDialog = (value) => {
    setDeleteExecutedContractDialog(value);
  };

  const getAddOn = (value) => {
    setAddOn(value);
  };


  const getValueByPath = (obj, path) => {
    const keys = path.split(/[\.\[\]]+/).filter(Boolean);
    console.log(
      path,
      keys.reduce(
        (acc, key) => acc && acc[isNaN(key) ? key : Number(key)],
        form
      ),
      form,
      "if"
    );
    return keys.reduce(
      (acc, key) => acc && acc[isNaN(key) ? key : Number(key)],
      form
    );
  };

 

  const toggleExpand = (section) => {
    setExpandStates((prevStates) => ({
      ...prevStates,
      [section]: !prevStates[section],
    }));
  };

  const getShowAlert = (value, type = "cross") => {
    setShowAlert(value);
    if (!value && type === "ok") {
      getNewContract(false);
      getContractIdFromActive("");
    }
  };

  const getViewPage1 = (value) => {
    setViewPage1(value);
  };

  const getViewPage2 = (value) => {
    setViewPage2(value);
  };

  const getViewPage3 = (value) => {
    setViewPage3(value);
  };

  const getViewPage4 = (value) => {
    setViewPage4(value);
  };

  const getViewPage5 = (value) => {
    setViewPage5(value);
  };

  const getViewPage6 = (value) => {
    setViewPage6(value);
  };

  const getViewPage7 = (value) => {
    setViewPage7(value);
  };

  const getViewPage8 = (value) => {
    setViewPage8(value);
  };

  const getViewPage9 = (value) => {
    setViewPage9(value);
  };

  const getViewPage10 = (value) => {
    setViewPage10(value);
  };

  const getCurrentPage = (value) => {
    setCurrentPage(value);
  };

  

  const getFileFields = (value) => {
    console.log(value);
    setFileFields(value);
    if (value?.[value?.length - 1]?.id === "" && value?.length !== 0) {
      getFileData();
    }
  };

  const getContractName = (value) => {
    setContractName(value);
  };

  useEffect(() => {
    setIsMultipleContract(selectContractInfo === "MULTIPLE" ? true : false);
  }, [selectContractInfo]);

  const handleFileDeletion = async () => {
    let fileIdToDelete = fileFields
      ?.filter((data, index) => index === fileDeletionIndex)
      ?.map((data) => data?.id)[0];
    setFileFields(
      fileFields
        ?.filter((data, index) => index !== fileDeletionIndex)
        ?.map((data) => data)
    );
    if (fileIdToDelete) {
      await DELETE(
        `contract-managment-service/contracts/contractFile/${fileIdToDelete}`
      ).then((response) => {
        SuccessToaster("Document Deleted Successfully");
      });
    }
    getDeleteExecutedContractDialog(false);
    setFileDeletionIndex();
  };

  const onClose = () => {
    getActiveApplicationView(false);
  };

  const renderFieldsBasedOnStep = (data) => {
    switch (data?.schemaCategory) {
      case "ContactAddress":
        return (
          <>
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "contactAddress1" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.contactAddress1}
                  basicForm={form}
                  setBasicForm={setForm}
                  stepPath={`forms[1].data`}
                  gridStyle={style.homeMailingAddressGrid}
                  baseKey={"contactAddress1"}
                  isPOD={true}
                />
              )}
            <CommonDivider />
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "contactAddress2" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.contactAddress2}
                  basicForm={form}
                  setBasicForm={setForm}
                  stepPath={`forms[1].data`}
                  gridStyle={style.mailingAddressGrid}
                  baseKey={"contactAddress2"}
                  isPOD={true}
                />
              )}
            <CommonDivider />
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "contactAddress3" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.contactAddress3}
                  basicForm={form}
                  setBasicForm={setForm}
                  stepPath={`forms[1].data`}
                  gridStyle={style.businessMailingAddressGrid}
                  baseKey={"contactAddress3"}
                  isPOD={true}
                />
              )}
          </>
        );
      case "Qualification":
        return (
          <>
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "certifications" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.certifications}
                  basicForm={form}
                  setBasicForm={setForm}
                  stepPath={`forms[2].data`}
                  gridStyle={style.licenseGrid}
                  baseKey={"certifications"}
                  isPOD={true}
                />
              )}
          </>
        );
      case "MalpracticeInfo":
        return (
          <>
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "insuranceCarrierInformation" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.insuranceCarrierInformation}
                  basicForm={form}
                  setBasicForm={setForm}
                  stepPath={`forms[3].data`}
                  gridStyle={style.insuranceGrid}
                  baseKey={"insuranceCarrierInformation"}
                  isPOD={true}
                />
              )}
          </>
        );
      case "Education":
        return (
          <>
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "graduation" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.graduation}
                  basicForm={form}
                  gridStyle={style.EducationGrid}
                  baseKey={"graduation"}
                  addMoreType={true}
                  formId={form?.forms?.[4]?.id}
                  applicationId={applicationId}
                  tableGrid={style.tableGridGraduation}
                  isPOD={true}
                  heading={"Information Requirement Alert"}
                  subHeading={
                    "For this application you are required to provide information on all of the different undergraduate / graduate qualifications you have."
                  }
                  subHeading2={
                    "You will not be able to submit your application if this is not provided."
                  }
                />
              )}
            <div className={style.marginTop20}>
              {form?.forms?.[4]?.data?.graduation?.map((data, index) =>
                data?.file?.fileURL !== undefined ? (
                  <div
                    className={`${style.documentBackground} ${style.documentCardGrid} ${style.marginTop10}`}
                    key={index}
                  >
                    <div
                      className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                    >
                      {data?.file?.fileName}
                    </div>
                    <div
                      className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                    >
                      {data?.file?.classification !== null
                        ? data?.file?.classification
                        : "-"}
                    </div>
                    <div
                      className={`${style.displayInRow} ${style.cursorPointer}`}
                      onClick={() => {
                        setFile(data?.file);
                        setShowDocVerifyDialog(true);
                        setSelectedRow(data);
                        setSelectedRowTableName("graduation");
                        setSelectedFormId(form?.forms?.[4]?.id);
                      }}
                    >
                      {data?.file?.isVerified !== undefined &&
                        data?.file?.isVerified ? (
                        <>
                          <img
                            src={Verified}
                            alt=""
                            className={style.verifyImage}
                          />
                          <div
                            className={`${style.greenButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}
                          >
                            <div
                              className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}
                            >
                              Verified
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            src={ToBeVerified}
                            alt=""
                            className={style.verifyImage}
                          />
                          <div
                            className={`${style.purpleButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}
                          >
                            <div
                              className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}
                            >
                              Verify
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )
              )}
            </div>
          </>
        );
      case "WorkExperience":
        return (
          <>
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "trainingAndWorkingExperience" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.trainingAndWorkingExperience}
                  basicForm={form}
                  gridStyle={style.trainingGrid}
                  baseKey={"trainingAndWorkingExperience"}
                  addMoreType={true}
                  formId={form?.forms?.[5]?.id}
                  applicationId={applicationId}
                  tableGrid={style.tableGridTrainingAndExperience}
                  isPOD={true}
                />
              )}
            <div className={style.marginTop20}>
              {form?.forms?.[5]?.data?.trainingAndWorkingExperience?.map(
                (data, index) =>
                  data?.file?.fileURL !== undefined ? (
                    <div
                      className={`${style.documentBackground} ${style.documentCardGrid} ${style.marginTop10}`}
                      key={index}
                    >
                      <div
                        className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                      >
                        {data?.file?.fileName}
                      </div>
                      <div
                        className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                      >
                        {data?.file?.classification !== null
                          ? data?.file?.classification
                          : "-"}
                      </div>
                      <div
                        className={`${style.displayInRow} ${style.cursorPointer}`}
                        onClick={() => {
                          setFile(data?.file);
                          setShowDocVerifyDialog(true);
                          setSelectedRow(data);
                          setSelectedRowTableName(
                            "trainingAndWorkingExperience"
                          );
                          setSelectedFormId(form?.forms?.[5]?.id);
                        }}
                      >
                        {data?.file?.isVerified !== undefined &&
                          data?.file?.isVerified ? (
                          <>
                            <img
                              src={Verified}
                              alt=""
                              className={style.verifyImage}
                            />
                            <div
                              className={`${style.greenButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}
                            >
                              <div
                                className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}
                              >
                                Verified
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              src={ToBeVerified}
                              alt=""
                              className={style.verifyImage}
                            />
                            <div
                              className={`${style.purpleButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}
                            >
                              <div
                                className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}
                              >
                                Verify
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    ""
                  )
              )}
            </div>
            <CommonDivider />
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "healthcareFacilityAppointments" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={
                    formSchema?.properties?.healthcareFacilityAppointments
                  }
                  basicForm={form}
                  gridStyle={style.healthCareGrid}
                  baseKey={"healthcareFacilityAppointments"}
                  addMoreType={true}
                  formId={form?.forms?.[5]?.id}
                  applicationId={applicationId}
                  tableGrid={style.tableGridTrainingAndExperience}
                  isPOD={true}
                />
              )}
            <div className={style.marginTop20}>
              {form?.forms?.[5]?.data?.healthcareFacilityAppointments?.map(
                (data, index) =>
                  data?.file?.fileURL !== undefined ? (
                    <div
                      className={`${style.documentBackground} ${style.documentCardGrid} ${style.marginTop10}`}
                      key={index}
                    >
                      <div
                        className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                      >
                        {data?.file?.fileName}
                      </div>
                      <div
                        className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                      >
                        {data?.file?.classification !== null
                          ? data?.file?.classification
                          : "-"}
                      </div>
                      <div
                        className={`${style.displayInRow} ${style.cursorPointer}`}
                        onClick={() => {
                          setFile(data?.file);
                          setShowDocVerifyDialog(true);
                          setSelectedRow(data);
                          setSelectedRowTableName(
                            "healthcareFacilityAppointments"
                          );
                          setSelectedFormId(form?.forms?.[5]?.id);
                        }}
                      >
                        {data?.file?.isVerified !== undefined &&
                          data?.file?.isVerified ? (
                          <>
                            <img
                              src={Verified}
                              alt=""
                              className={style.verifyImage}
                            />
                            <div
                              className={`${style.greenButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}
                            >
                              <div
                                className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}
                              >
                                Verified
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              src={ToBeVerified}
                              alt=""
                              className={style.verifyImage}
                            />
                            <div
                              className={`${style.purpleButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}
                            >
                              <div
                                className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}
                              >
                                Verify
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    ""
                  )
              )}
            </div>
          </>
        );
      case "References":
        console.log(formSchema);
        return (
          <>
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "references" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.references}
                  basicForm={form}
                  gridStyle={style.twoCol}
                  baseKey={"references"}
                  setBasicForm={setForm}
                  addMoreType={true}
                  formId={form?.forms?.[7]?.id}
                  applicationId={applicationId}
                  tableGrid={style.tableGridReferences}
                  isPOD={true}
                />
              )}
            <div className={style.marginTop20}>
              {form?.forms?.[7]?.data?.references?.map((data, index) =>
                data?.file?.fileURL !== undefined ? (
                  <div
                    className={`${style.documentBackground} ${style.documentCardGrid} ${style.marginTop10}`}
                    key={index}
                  >
                    <div
                      className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                    >
                      {data?.file?.fileName}
                    </div>
                    <div
                      className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                    >
                      {data?.file?.classification !== null
                        ? data?.file?.classification
                        : "-"}
                    </div>
                    <div
                      className={`${style.displayInRow} ${style.cursorPointer}`}
                      onClick={() => {
                        setFile(data?.file);
                        setShowDocVerifyDialog(true);
                        setSelectedRow(data);
                        setSelectedRowTableName("references");
                        setSelectedFormId(form?.forms?.[7]?.id);
                      }}
                    >
                      {data?.file?.isVerified !== undefined &&
                        data?.file?.isVerified ? (
                        <>
                          <img
                            src={Verified}
                            alt=""
                            className={style.verifyImage}
                          />
                          <div
                            className={`${style.greenButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}
                          >
                            <div
                              className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}
                            >
                              Verified
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            src={ToBeVerified}
                            alt=""
                            className={style.verifyImage}
                          />
                          <div
                            className={`${style.purpleButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}
                          >
                            <div
                              className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}
                            >
                              Verify
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )
              )}
            </div>
            <CommonDivider />
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "privilegeReferences" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.privilegeReferences}
                  basicForm={form}
                  gridStyle={style.twoCol}
                  baseKey={"privilegeReferences"}
                  setBasicForm={setForm}
                  addMoreType={true}
                  formId={form?.forms?.[7]?.id}
                  applicationId={applicationId}
                  tableGrid={style.tableGridReferences}
                  isPOD={true}
                />
              )}
            <div className={style.marginTop20}>
              {form?.forms?.[7]?.data?.privilegeReferences?.map((data, index) =>
                data?.file?.fileURL !== undefined ? (
                  <div
                    className={`${style.documentBackground} ${style.documentCardGrid} ${style.marginTop10}`}
                    key={index}
                  >
                    <div
                      className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                    >
                      {data?.file?.fileName}
                    </div>
                    <div
                      className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                    >
                      {data?.file?.classification !== null
                        ? data?.file?.classification
                        : "-"}
                    </div>
                    <div
                      className={`${style.displayInRow} ${style.cursorPointer}`}
                      onClick={() => {
                        setFile(data?.file);
                        setShowDocVerifyDialog(true);
                        setSelectedRow(data);
                        setSelectedRowTableName("privilegeReferences");
                        setSelectedFormId(form?.forms?.[7]?.id);
                      }}
                    >
                      {data?.file?.isVerified !== undefined &&
                        data?.file?.isVerified ? (
                        <>
                          <img
                            src={Verified}
                            alt=""
                            className={style.verifyImage}
                          />
                          <div
                            className={`${style.greenButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}
                          >
                            <div
                              className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}
                            >
                              Verified
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            src={ToBeVerified}
                            alt=""
                            className={style.verifyImage}
                          />
                          <div
                            className={`${style.purpleButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}
                          >
                            <div
                              className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}
                            >
                              Verify
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )
              )}
            </div>
          </>
        );
      case "ProfessionalConduct":
        return (
          <>
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "conductDisclosure1" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.conductDisclosure1}
                  basicForm={form}
                  stepPath={`forms[8].data`}
                  gridStyle={style.conductGrid}
                  baseKey={"conductDisclosure1"}
                  collapsableQuestionCard={true}
                  isPOD={true}
                />
              )}
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "conductDisclosure2" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.conductDisclosure2}
                  basicForm={form}
                  stepPath={`forms[8].data`}
                  gridStyle={style.conductGrid}
                  baseKey={"conductDisclosure2"}
                  collapsableQuestionCard={true}
                  isPOD={true}
                />
              )}
          </>
        );
      case "CriminalHistory":
        return (
          <>
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "criminalData1" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.criminalData1}
                  basicForm={form}
                  stepPath={`forms[9].data`}
                  gridStyle={style.conductGrid}
                  baseKey={"criminalData1"}
                  collapsableQuestionCard={true}
                  isPOD={true}
                />
              )}
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "criminalData2" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.criminalData2}
                  basicForm={form}
                  stepPath={`forms[9].data`}
                  gridStyle={style.conductGrid}
                  baseKey={"criminalData2"}
                  collapsableQuestionCard={true}
                  isPOD={true}
                />
              )}
          </>
        );
      case "MedicalHistory":
        return (
          <>
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "impactingPractice" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.impactingPractice}
                  basicForm={form}
                  stepPath={`forms[10].data`}
                  gridStyle={style.conductGrid}
                  baseKey={"impactingPractice"}
                  collapsableQuestionCard={true}
                  isPOD={true}
                />
              )}
          </>
        );
      case "PrivilegeSelection":
        return (
          <>
            <div className={style.marginLeft50}>
              <div className={style.cardTextBoldStyle}>Selected Previleges</div>
              {form?.privileges?.obligatedPrivileges?.map((data, index) => (
                <div
                  className={`${style.documentTextStyle} ${style.marginLeft} ${style.marginTop10}`}
                  key={index}
                >
                  {data?.privilegeSetTitle}
                </div>
              ))}
              {form?.privileges?.additionalPrivileges?.map((data, index) => (
                <div
                  className={`${style.documentTextStyle} ${style.marginLeft} ${style.marginTop10}`}
                  key={index}
                >
                  {data?.privilegeSetTitle}
                </div>
              ))}
            </div>
          </>
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      <div className={style.screenBackground}></div>
  
      <ApplicationHeader
        title={`New ${form?.basicDetails?.applicant?.applicantType !== undefined
          ? form?.basicDetails?.applicant?.applicantType
          : "{Applicant Type}"
          } Application For ${form?.basicDetails?.applicant?.name?.firstName !== undefined
            ? form?.basicDetails?.applicant?.name?.firstName
            : "{First Name}"
          } ${form?.basicDetails?.applicant?.name?.lastName !== undefined
            ? form?.basicDetails?.applicant?.name?.lastName
            : "{Last Name}"
          }`}
      />

      <div className={style.welcomeBorder}></div>

      <div className={`${style.marginLeftRight50}`}>
        <div
          className={`${style.displayInRow} ${style.spaceBetween} ${style.topHeadingTextStyle} ${style.marginTop20}`}
        >
          {`CAP MANAGER > APPLICATIONS >> ${form?.basicDetails?.applicant?.name?.firstName || ""
            } ${form?.basicDetails?.applicant?.name?.lastName || ""}`}
          <img
            src={CrossPink}
            alt="cross"
            className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft20} `}
            onClick={() => {
              onClose();
            }}
          />
        </div>
        <div className={style.grid2}>
          <>
        {userRole.includes('Staff Manager') || userRole.includes('Chief Of Staff') || userRole.includes('Credentialing Committee') || userRole.includes('Department Head') ? (
            <>
            <div>
              <div className={style.grid5and1}>
                <div className={`${style.cardLeftStyle} ${style.bigCalendarLeftCardWidth}`}>
                  <div className={style.spaceBetween}>
                    <div className={style.displayInRow}>
                      <div className={`${style.photoBorderStyle} ${style.marginLeftRight10}`}>
                        <div className={style.photoCardStyle}>
                          <span>Photo</span>
                        </div>
                      </div>
                      <div className={`${style.displayInCol} ${style.textAlignLeft}`}>
                        <div className={style.marginTop10}>
                          <span className={`${style.cardTextBoldStyle} ${style.marginTop10}`}>
                            {form?.basicDetails?.applicant?.name?.firstName || ""} {form?.basicDetails?.applicant?.name?.middleName || ""} {form?.basicDetails?.applicant?.name?.lastName || ""}
                          </span>
                          <span className={`${style.cardTextNormalStyle} ${style.marginTop10} ${style.marginLeft10}`}>
                          {form?.displayId || ""}
                          </span>
                        </div>
                        <div className={`${style.cardTextNormalStyle} ${style.marginTop10}`}>
                        {form?.providerType?.serviceProviderType || ""} Applying As {form?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory || ""} 
                        </div>
                        <div className={style.spaceBetween}>
                          <span className={`${style.cardTextBoldStyle} ${style.marginTop30}`}>
                            {form?.basicDetails?.applicant?.cellPhone ? `+1 ${form?.basicDetails?.applicant?.cellPhone}` : ""}
                          </span>
                          <span className={`${style.emailTextBoldStyle} ${style.marginTop30} ${style.marginLeft20}`}>
                            {form?.basicDetails?.applicant?.email?.officialEmail || ""}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={`${style.displayInRow} ${style.marginRight20}`}>
                      <div className={style.displayInCol}>
                        <div className={style.marginTop15}>
                          <span className={style.rightAlignTextStyle}>
                            Days To Complete:
                          </span>
                          <span className={`${style.leftAlignTextStyle} ${style.marginLeft10}`}>
                            15
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`${style.cardLeftStyle} ${style.bigCalendarLeftCardWidth} ${style.statusCardHeight} ${style.displayInCol}`}>
                  <div className={`${statusStyle} ${style.marginCenter}`}></div>
                  <div className={style.greyDotTextStyle}>
                    Overall Verification & Acceptance Status
                  </div>
                </div>
              </div>
              <>
              {((userRole?.includes('Staff Manager') &&  selectedTab === "level-1") || (userRole?.includes('Chief Of Staff') && selectedTab === "level-1"))? (
            <div
            className={`${style.cardLeftStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop20}`}
          >
  
            <div>
              <div
                className={`${style.tableHeaderStyle} ${style.marginTop20} ${style.tableHeaderGridStyle} `}
              >
                <div
                  className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                >
                  <div
                    className={`${style.marginLeft30} ${style.tableHeaderTextStyle}`}
                  ></div>
                </div>
                <div
                  className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                >
                  <div className={`${style.tableHeaderTextStyle}`}>
                    Required Data & POD Verification
                  </div>
                </div>
                <div
                  className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                >
                  <div
                    className={`${style.tableHeaderTextStyle}`}
                    aria-owns={open ? "mouse-over-popover" : undefined}
                    aria-haspopup="true"
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                  >
                    <img
                      src={DataStatusIcon}
                      alt=""
                      style={{
                        width: "18px",
                        height: "20px",
                      }}
                    />
                    <Popover
                      id={"mouse-over-popover"}
                      sx={{
                        pointerEvents: "none",
                      }}
                      open={open}
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      onClose={handlePopoverClose}
                      PaperProps={{
                        style: {
                          backgroundColor: "transparent",
                          boxShadow: "none",
                          borderRadius: 0,
                        },
                      }}
                      disableRestoreFocus
                    >
                      <div className={style.multipleOptionsCard}>
                        <div
                          className={`${style.specificActionCard} ${style.cursorPointer}`}
                        >
                          Data Quality Status
                        </div>
                      </div>
                    </Popover>
                  </div>
                </div>
                <div
                  className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                >
                  <div
                    className={`${style.tableHeaderTextStyle}`}
                    aria-owns={
                      openTextWithHover ? "mouse-over-popover" : undefined
                    }
                    aria-haspopup="true"
                    onMouseEnter={handlePopoverTextOpen}
                    onMouseLeave={handlePopoverTextClose}
                  >
                    <img
                      src={DocumentIcon}
                      alt=""
                      style={{
                        width: "18px",
                        height: "20px",
                      }}
                    />
                    <Popover
                      id={"mouse-over-popover"}
                      sx={{
                        pointerEvents: "none",
                      }}
                      open={openTextWithHover}
                      anchorEl={anchorTextEl}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      onClose={handlePopoverTextClose}
                      PaperProps={{
                        style: {
                          backgroundColor: "transparent",
                          boxShadow: "none",
                          borderRadius: 0,
                        },
                      }}
                      disableRestoreFocus
                    >
                      <div className={style.multipleOptionsCard}>
                        <div
                          className={`${style.specificActionCard} ${style.cursorPointer}`}
                        >
                          Document Status
                        </div>
                      </div>
                    </Popover>
                  </div>
                </div>
                <div
                  className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                >
                  <div className={`${style.tableHeaderTextStyle}`}>
                    Documents
                  </div>
                </div>
              </div>
              <div>
                <div
                  className={` ${style.marginTop5} ${expand?.status && expand?.index === 0
                    ? style.tableDataStyle1
                    : style.tableDataStyle
                    }`}
                >
                  <div
                    className={` ${expand?.status && expand?.index === 0
                      ? style.tableHeaderGridStyleForm
                      : style.tableHeaderGridStyle
                      } ${style.marginTop10}`}
                  >
                    <div
                      className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                    >
                      <div
                        className={`${style.marginLeft10} ${style.justifySpaceAround
                          } ${form?.basicInformationStatus
                            ? style.greenDotStyle
                            : style.greyDotStyle
                          }`}
                      ></div>
                    </div>
                    <div
                      className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                    >
                      <div
                        className={`${expand?.status && expand?.index === 0
                          ? style.tableHeaderTextStyle
                          : style.tableDataFontStyle1
                          }`}
                      >
                        Applicant Profile Information
                      </div>
                    </div>
                    {expand?.status && expand?.index === 0 ? (
                      <>
                        {!form?.basicInformationStatus ? (
                          <div
                            className={`${style.purpleButton} ${style.cursorPointer} `}
                          >
                            <div
                              className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                              onClick={() => handleVerify()}
                            >
                              Verify
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`${style.greenButton}  ${style.cursorPointer} `}
                          >
                            <div
                              className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                            >
                              Verified
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                        >
                          <div
                            className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}
                          ></div>
                        </div>
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                        >
                          <div
                            className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}
                          ></div>
                        </div>
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                        >
                          <div
                            className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                          >
                            -
                          </div>
                        </div>
                      </>
                    )}

                    <div
                      className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                    >
                      <div
                        className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                      >
                        {expand?.status && expand?.index === 0 ? (
                          <RemoveIcon
                            sx={{
                              fontSize: 20,
                              color: "#94979A",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              setExpand({ status: false, index: 0 })
                            }
                          />
                        ) : (
                          <AddIcon
                            sx={{
                              fontSize: 20,
                              color: "#94979A",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              setExpand({ status: true, index: 0 })
                            }
                          />
                        )}{" "}
                      </div>
                    </div>
                  </div>
                  {expand?.status && expand?.index === 0 && (
                    <div
                      className={`${style.marginTop} ${style.screenPadding}`}
                    >
                     
                      {form1 !== undefined &&
                        "applicant" in form1?.properties && (
                          <ApplicationFieldCard
                            object={form1?.properties?.applicant}
                            gridStyle={style.applicantGrid}
                            baseKey={"applicant"}
                            basicForm={form}
                            setBasicForm={setForm}
                            isBasicPath={true}
                            isPOD={true}
                          />
                        )}
                      {form1 !== undefined &&
                        "credentialingPrivilegeCategory" in
                        form1?.properties && (
                          <ApplicationFieldCard
                            object={
                              form1?.properties?.credentialingPrivilegeCategory
                            }
                            gridStyle={style.credentialingGrid}
                            baseKey={"credentialingPrivilegeCategory"}
                            basicForm={form}
                            setBasicForm={setForm}
                            isBasicPath={true}
                            isPOD={true}
                          />
                        )}
                      {form1 !== undefined &&
                        "departmentSpecialty" in form1?.properties && (
                          <ApplicationFieldCard
                            object={form1?.properties?.departmentSpecialty}
                            gridStyle={style.twoCol}
                            baseKey={"departmentSpecialty"}
                            basicForm={form}
                            setBasicForm={setForm}
                            isBasicPath={true}
                            isPOD={true}
                          />
                        )}
                      {form1 !== undefined &&
                        getValueByPath(
                          form,
                          "basicDetails.departmentSpecialty.department"
                        ) ===
                        form1.if.properties.departmentSpecialty.properties
                          .department.const &&
                        form1.if.properties.departmentSpecialty.properties.specialty.enum?.includes(
                          getValueByPath(
                            form,
                            "basicDetails.departmentSpecialty.specialty"
                          )
                        ) &&
                        form1 !== undefined &&
                        "regionalCallResponsibilities" in form1?.properties && (
                          <ApplicationFieldCard
                            object={
                              form1?.properties?.regionalCallResponsibilities
                            }
                            gridStyle={""}
                            baseKey={"regionalCallResponsibilities"}
                            basicForm={form}
                            setBasicForm={setForm}
                            isBasicPath={true}
                            isPOD={true}
                          />
                        )}
                      {form1 !== undefined &&
                        "billingNumber" in form1?.properties && (
                          <ApplicationFieldCard
                            object={form1?.properties?.billingNumber}
                            gridStyle={style.twoCol}
                            baseKey={"billingNumber"}
                            basicForm={form}
                            setBasicForm={setForm}
                            isBasicPath={true}
                            isPOD={true}
                          />
                        )}
                    </div>
                  )}
                </div>

                {form?.formSchemas
                  ?.filter(
                    (data) =>
                      (data?.formCategory === "Form" ||
                        data?.formCategory === "Disclosure") &&
                      data?.schemaCategory !== "UploadYourDoc"
                  )
                  ?.map((data, index) => (
                    <div
                      className={` ${style.marginTop5} ${expand?.status && expand?.index === index + 1
                        ? style.tableDataStyle1
                        : style.tableDataStyle
                        }`}
                    >
                      <div
                        className={` ${expand?.index === index + 1
                          ? style.tableHeaderGridStyleForm
                          : style.tableHeaderGridStyle
                          } ${style.marginTop10}`}
                      >
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                        >
                          <div
                            className={`${style.marginLeft10} ${style.justifySpaceAround
                              } ${form?.forms[index]?.status !== "APPROVED"
                                ? style.greyDotStyle
                                : style.greenDotStyle
                              }`}
                          ></div>
                        </div>
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                        >
                          <div className={`${style.tableDataFontStyle1}`}>
                            {data?.description}
                          </div>
                        </div>
                        {expand?.status && expand?.index === index + 1 ? (
                          <>
                            {form?.forms[index]?.status !== "APPROVED" ? (
                              <div
                                className={`${style.purpleButton} ${style.cursorPointer} `}
                              >
                                <div
                                  className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                  onClick={() =>
                                    handleStepsVerify(form?.forms[index]?.id)
                                  }
                                >
                                  Verify
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`${style.greenButton}  ${style.cursorPointer} `}
                              >
                                <div
                                  className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                >
                                  Verified
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div
                              className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                            >
                              <div
                                className={`${style.marginLeft10}${style.justifySpaceAround
                                  } ${form?.forms[index]?.status !== "APPROVED"
                                    ? style.greyDotStyle
                                    : style.greenDotStyle
                                  }`}
                              ></div>
                            </div>
                            <div
                              className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                            >
                              <div
                                className={`${style.marginLeft10}${style.justifySpaceAround
                                  } ${form?.forms[index]?.status !== "APPROVED"
                                    ? style.greyDotStyle
                                    : style.greenDotStyle
                                  }`}
                              ></div>
                            </div>
                            <div
                              className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                            >
                              <div
                                className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                              >
                                {form?.forms
                                  ?.filter(
                                    (formData, formIndex) => formIndex === index
                                  )
                                  ?.map(
                                    (data) => data?.uploadedFiles?.length || 0
                                  )}
                              </div>
                            </div>
                          </>
                        )}
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                        >
                          <div
                            className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                          >
                            {expand?.status && expand?.index === index + 1 ? (
                              <RemoveIcon
                                sx={{
                                  fontSize: 20,
                                  color: "#94979A",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setExpand({ status: false, index: 0 });
                                  setFormSchemaId("");
                                }}
                              />
                            ) : (
                              <AddIcon
                                sx={{
                                  fontSize: 20,
                                  color: "#94979A",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setExpand({ status: true, index: index + 1 });
                                  setFormSchemaId(data?.id);
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      {expand?.status && expand?.index === index + 1 && (
                        <div
                          className={`${style.marginTop} ${style.screenPadding}`}
                        >
                          {renderFieldsBasedOnStep(data)}
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              <div>
                <div
                  className={`${style.tableHeaderStyle} ${style.marginTop20} ${style.tableHeaderGridStyle1} `}
                >
                  <div
                    className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                  >
                    <div
                      className={`${style.marginLeft10} ${style.tableHeaderTextStyle}`}
                    ></div>
                  </div>
                  <div
                    className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                  >
                    <div className={`${style.tableHeaderTextStyle}`}>
                      Requested Form Completeness Check
                    </div>
                  </div>
                </div>
                {form?.formSchemas
                  ?.filter((data) => data?.formCategory === "Acknowledgement")
                  ?.map((data, index) => (
                    <div
                      className={` ${style.marginTop5} ${expandAcknowledgement?.status &&
                        expandAcknowledgement?.index === index
                        ? style.tableDataStyle1
                        : style.tableDataStyle
                        }`}
                    >
                      <div
                        className={` ${style.marginTop10} ${expandAcknowledgement?.status &&
                          expandAcknowledgement?.index === index
                          ? style.tableHeaderGridStyleForm
                          : style.tableHeaderGridStyle1
                          }`}
                      >
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                        >
                          <div
                            className={`${style.marginLeft10} ${style.justifySpaceAround
                              } ${form?.forms?.filter(
                                (data) =>
                                  data?.formCategory === "Acknowledgement"
                              )[index]?.status !== "APPROVED"
                                ? style.greyDotStyle
                                : style.greenDotStyle
                              }`}
                          ></div>
                        </div>
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                        >
                          <div className={`${style.tableDataFontStyle1}`}>
                            {data?.description}
                          </div>
                        </div>
                        {expandAcknowledgement?.status &&
                          expandAcknowledgement?.index === index && (
                            <>
                              {form?.forms?.filter(
                                (data) =>
                                  data?.formCategory === "Acknowledgement"
                              )[index]?.status !== "APPROVED" ? (
                                <div
                                  className={`${style.purpleButton} ${style.cursorPointer} `}
                                >
                                  <div
                                    className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                    onClick={() =>
                                      handleStepsVerify(
                                        form?.forms?.filter(
                                          (data) =>
                                            data?.formCategory ===
                                            "Acknowledgement"
                                        )[index]?.id
                                      )
                                    }
                                  >
                                    Verify
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className={`${style.greenButton}  ${style.cursorPointer} `}
                                >
                                  <div
                                    className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                  >
                                    Verified
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                        >
                          <div
                            className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                          >
                            {expandAcknowledgement?.status &&
                              expandAcknowledgement?.index === index ? (
                              <RemoveIcon
                                sx={{
                                  fontSize: 20,
                                  color: "#94979A",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setExpandAcknowledgement({
                                    status: false,
                                    index: 0,
                                  });
                                  setFormSchemaId("");
                                }}
                              />
                            ) : (
                              <AddIcon
                                sx={{
                                  fontSize: 20,
                                  color: "#94979A",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setExpandAcknowledgement({
                                    status: true,
                                    index: index,
                                  });
                                  setFormSchemaId(data?.id);
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      {expandAcknowledgement?.status &&
                        expandAcknowledgement?.index === index && (
                          <div
                            className={`${style.marginTop} ${style.screenPadding}`}
                          >
                            {form?.forms?.filter(
                              (data) => data?.formCategory === "Acknowledgement"
                            )[index]?.uploadedFiles?.length !== 0 && (
                                <>
                                  <iframe
                                    src={
                                      form?.forms?.filter(
                                        (data) =>
                                          data?.formCategory === "Acknowledgement"
                                      )[index]?.uploadedFiles[
                                        form?.forms?.filter(
                                          (data) =>
                                            data?.formCategory ===
                                            "Acknowledgement"
                                        )[index]?.uploadedFiles?.length - 1
                                      ]?.fileURL
                                    }
                                    width="100%"
                                    height="600px"
                                  ></iframe>
                                  {(data?.description ===
                                    "Statement of Confidentiality and Non-Disclosure" ||
                                    data?.description ===
                                    "Conflict Of Interest Policy") && (
                                      <div className={style.grid2}>
                                        <div
                                          onClick={
                                            form?.forms[index]?.staffEsign === null
                                              ? () =>
                                                handleStaffEsign(
                                                  form?.forms?.filter(
                                                    (data) =>
                                                      data?.formCategory ===
                                                      "Acknowledgement"
                                                  )[index]?.id
                                                )
                                              : () => { }
                                          }
                                        >
                                          <ESignature
                                            userName={
                                              form?.forms?.filter(
                                                (data) =>
                                                  data?.formCategory ===
                                                  "Acknowledgement"
                                              )[index]?.staffEsign !== null
                                                ? form?.forms?.filter(
                                                  (data) =>
                                                    data?.formCategory ===
                                                    "Acknowledgement"
                                                )[index]?.staffEsign?.name
                                                : ""
                                            }
                                            encData={
                                              form?.forms?.filter(
                                                (data) =>
                                                  data?.formCategory ===
                                                  "Acknowledgement"
                                              )[index]?.staffEsign !== null
                                                ? form?.forms?.filter(
                                                  (data) =>
                                                    data?.formCategory ===
                                                    "Acknowledgement"
                                                )[index]?.staffEsign?.esign
                                                : ""
                                            }
                                            showData={
                                              form?.forms?.filter(
                                                (data) =>
                                                  data?.formCategory ===
                                                  "Acknowledgement"
                                              )[index]?.staffEsign !== null
                                                ? true
                                                : false
                                            }
                                            showDatais={true}
                                          />
                                        </div>
                                        <div className={style.verticalAlignCenter}>
                                          <div className={style.displayInRow}>
                                            <div className={style.dateTitle}>
                                              Date:{" "}
                                            </div>
                                            <div
                                              className={`${style.date} ${style.marginLeft}`}
                                            >
                                              {form?.forms?.filter(
                                                (data) =>
                                                  data?.formCategory ===
                                                  "Acknowledgement"
                                              )[index]?.staffEsign !== null
                                                ? format(
                                                  new Date(
                                                    form?.forms?.filter(
                                                      (data) =>
                                                        data?.formCategory ===
                                                        "Acknowledgement"
                                                    )[
                                                      index
                                                    ]?.staffEsign?.signedDate
                                                  ),
                                                  canadaData?.dateFormat ||
                                                  "dd/MM/yyyy"
                                                )
                                                : ""}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                </>
                              )}
                          </div>
                        )}
                    </div>
                  ))}
              </div>
              <div className={style.marginBottom20}></div>
            </div>
          </div>
          ) : (
             <div className={`${style.cardLeftStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop10}`}>
            <div>
             
                
              <div className={`${style.tableHeaderStyle} ${style.marginTop20} ${style.tableHeaderGridStyleCred1} `}>
               
                <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                  <div className={`${style.tableHeaderTextStyleCred}`}> POD Verification Check </div>
                </div>
              
              </div>
              <div>
                <div className={` ${style.marginTop5} ${(expand?.status && expand?.index === 0) ? style.tableDataStyle1 : style.tableDataStyle}`}>
                  <div className={` ${(expand?.status && expand?.index === 0) ? style.tableHeaderGridStyleFormCred : style.tableHeaderGridStyleCred1} ${style.marginTop10}`}>
                   
                    <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                      <div className={`${(expand?.status && expand?.index === 0) ? style.tableHeaderTextStyleCred : style.tableDataFontStyleCred}`}>Applicant Profile Information</div>
                    </div>
 

                    {(expand?.status && expand?.index === 0) ? (
                      <>
                        {!form?.basicInformationStatus ? (
                          <div className={`${style.purpleButton} ${style.cursorPointer} `}>
                            <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`} onClick={() => handleVerify()}>Approve</div>
                          </div>
                        ) : (
                          <div className={`${style.greenButton}  ${style.cursorPointer} `}>
                            <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>Approved</div>
                          </div>
                        )}
                      </>
                    ) : (
                      " "
                    )}

                    <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                      <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                        {
                          (expand?.status && expand?.index === 0) ? (<RemoveIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => setExpand({ status: false, index: 0 })} />)
                            : (<AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => setExpand({ status: true, index: 0 })} />)
                        }                    </div>
                    </div>
                  </div>
                  {expand?.status && expand?.index === 0 &&
                    <div className={`${style.marginTop} ${style.screenPadding}`}>
                     
                      {form1 !== undefined && 'applicant' in form1?.properties && (
                        <ApplicationFieldCard object={form1?.properties?.applicant} gridStyle={style.applicantGrid} baseKey={'applicant'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                      )}
                      {form1 !== undefined && 'credentialingPrivilegeCategory' in form1?.properties && (
                        <ApplicationFieldCard object={form1?.properties?.credentialingPrivilegeCategory} gridStyle={style.credentialingGrid} baseKey={'credentialingPrivilegeCategory'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                      )}
                      {form1 !== undefined && 'departmentSpecialty' in form1?.properties && (
                        <ApplicationFieldCard object={form1?.properties?.departmentSpecialty} gridStyle={style.twoCol} baseKey={'departmentSpecialty'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                      )}
                      {form1 !== undefined && (getValueByPath(form, 'basicDetails.departmentSpecialty.department') === form1.if.properties.departmentSpecialty.properties.department.const && form1.if.properties.departmentSpecialty.properties.specialty.enum?.includes(getValueByPath(form, 'basicDetails.departmentSpecialty.specialty'))) && (
                        form1 !== undefined && 'regionalCallResponsibilities' in form1?.properties && (
                          <ApplicationFieldCard object={form1?.properties?.regionalCallResponsibilities} gridStyle={''} baseKey={'regionalCallResponsibilities'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                        )
                      )}
                      {form1 !== undefined && 'billingNumber' in form1?.properties && (
                        <ApplicationFieldCard object={form1?.properties?.billingNumber} gridStyle={style.twoCol} baseKey={'billingNumber'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                      )}
                    </div>
                  }


                </div>

                {
                  form?.formSchemas?.filter(data => (data?.formCategory === 'Form' || data?.formCategory === 'Disclosure') && data?.schemaCategory !== "UploadYourDoc")?.map((data, index) => (

                    <div className={` ${style.marginTop5} ${(expand?.status && expand?.index === index + 1) ? style.tableDataStyle1 : style.tableDataStyle}`}>
                      <div className={` ${expand?.index === index + 1 ? style.tableHeaderGridStyleFormCred : style.tableHeaderGridStyleCred} ${style.marginTop10}`}>
                      
                        <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                          <div className={`${style.tableDataFontStyleCred}`}>{data?.description}</div>
                        </div>
                        {!(expand?.status && expand?.index === index + 1) && (
                          <>
                            {form?.forms[index]?.status === "APPROVED" ? (
                              <div className={`${style.approvedButtonStyle} ${style.ApprovedTextStyle}`}>Approved</div>
                            ) : (
                              <div className={`${style.assessInCred} ${style.assessTextStyle}`}>4 to Assess</div>
                            )}
                          </>
                        )}
                        {expand?.status && expand?.index === index + 1 && (
                            <>
                                {credApproval?.filter(
                                (newData) =>{console.log("newData.schema:", newData.schemaId);
                                    console.log("data.id:", data.id);
                                   return newData.schemaId === data.id
                                }
                                )[0]?.approvalRequired === true ? (
                                <>
                                    {form?.forms[index]?.status !== "APPROVED" ? (
                                    <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                                        <div
                                        className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                        onClick={() => handleStepsVerify(form?.forms[index]?.id)}
                                        >
                                        Approve
                                        </div>
                                    </div>
                                    ) : (
                                    <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                        <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                        Approved
                                        </div>
                                    </div>
                                    )}
                                </>
                                ) : (""
                                )}
                            </>
                            )}
                        <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                          <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                            {
                              (expand?.status && expand?.index === index + 1) ? (<RemoveIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => { setExpand({ status: false, index: 0 }); setFormSchemaId('') }} />)
                                : (<AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => { setExpand({ status: true, index: index + 1 }); setFormSchemaId(data?.id) }} />)
                            }

                          </div>
                        </div>
                      </div>
                      {expand?.status && expand?.index === index + 1 &&
                        <div className={`${style.marginTop} ${style.screenPadding}`}>
                          {renderFieldsBasedOnStep(data)}
                        </div>
                      }
                    </div>))}

              </div>

              <div>
                <div className={`${style.tableHeaderStyle} ${style.marginTop20} ${style.tableHeaderStyleCred} `}>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    <div className={`${style.marginLeft10} ${style.tableHeaderTextStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    <div className={`${style.tableHeaderTextStyleCred}`}>Requested Form Completeness Check</div>
                  </div>
                </div>
                {form?.formSchemas?.filter(data => data?.formCategory === 'Acknowledgement')?.map((data, index) => (
                  <div className={` ${style.marginTop5} ${(expandAcknowledgement?.status && expandAcknowledgement?.index === index) ? style.tableDataStyle1 : style.tableDataStyle}`}>
                    <div className={` ${style.marginTop10} ${(expandAcknowledgement?.status && expandAcknowledgement?.index === index) ? style.tableHeaderGridStyleFormCred : style.tableHeaderGridStyleCred1}`}>
                     
                      <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                        <div className={`${style.tableDataFontStyleCred}`}>{data?.description}</div>
                      </div>
                      {expandAcknowledgement?.status && expandAcknowledgement?.index === index && (
                        <>
                          {form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.status !== "APPROVED" ? (
                            <div className={`${style.purpleButton} ${style.cursorPointer} `}>
                              <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`} onClick={() => handleStepsVerify(form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.id)}>Approve</div>
                            </div>
                          ) : (
                            <div className={`${style.greenButton}  ${style.cursorPointer} `}>
                              <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>Approved</div>
                            </div>
                          )}
                        </>
                      )}
                      <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                        <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                          {
                            (expandAcknowledgement?.status && expandAcknowledgement?.index === index) ? (<RemoveIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => { setExpandAcknowledgement({ status: false, index: 0 }); setFormSchemaId('') }} />)
                              : (<AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => { setExpandAcknowledgement({ status: true, index: index }); setFormSchemaId(data?.id) }} />)
                          }
                        </div>
                      </div>
                    </div>
                    {expandAcknowledgement?.status && expandAcknowledgement?.index === index &&
                      <div className={`${style.marginTop} ${style.screenPadding}`}>
                        {form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.uploadedFiles?.length !== 0 && (
                          <>
                            <iframe src={form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.uploadedFiles[form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.uploadedFiles?.length - 1]?.fileURL} width="100%" height="600px"></iframe>
                            {(data?.description === 'Statement of Confidentiality and Non-Disclosure' || data?.description === 'Conflict Of Interest Policy') && (
                              <div className={style.grid2}>
                                <div onClick={form?.forms[index]?.staffEsign === null ? () => handleStaffEsign(form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.id) : () => { }} >
                                  <ESignature
                                    userName={form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign !== null ? form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign?.name : ""}
                                    encData={form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign !== null ? form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign?.esign : ''}
                                    showData={form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign !== null ? true : false}
                                    showDatais={true}
                                  />
                                </div>
                                <div className={style.verticalAlignCenter}>
                                  <div className={style.displayInRow}>
                                    <div className={style.dateTitle}>Date: </div>
                                    <div className={`${style.date} ${style.marginLeft}`}>{form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign !== null ? format(new Date(form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign?.signedDate), canadaData?.dateFormat || 'dd/MM/yyyy') : ""}</div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    }
                  </div>))}
              </div>
              <div className={style.marginBottom20}></div>
            </div>
          </div>
          )}
          </>
              </div>
            </>
          ) : (
            <>
            <div className={`${style.displayInCol}`}>
              <div className={`${style.cardLeftStyle} ${style.bigCalendarLeftCardWidth}`}>
                <div className={style.spaceBetween}>
                  <div className={style.displayInRow}>
                    <div className={`${style.photoBorderStyle} ${style.marginLeftRight10}`}>
                      <div className={style.photoCardStyle}>
                        <span>Photo</span>
                      </div>
                    </div>
                    <div className={`${style.displayInCol} ${style.textAlignLeft}`}>
                      <div className={style.marginTop10}>
                        <span className={`${style.cardTextBoldStyle} ${style.marginTop10}`}>
                          {form?.basicDetails?.applicant?.name?.firstName || ""} {form?.basicDetails?.applicant?.name?.middleName || ""} {form?.basicDetails?.applicant?.name?.lastName || ""}
                        </span>
                        <span className={`${style.cardTextNormalStyle} ${style.marginTop10} ${style.marginLeft10}`}>
                         {form?.displayId || ""}
                        </span>
                      </div>
                      <div className={`${style.cardTextNormalStyle} ${style.marginTop10}`}>
                      {form?.providerType?.serviceProviderType || ""} Applying As {form?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory || ""} 
                      </div>
                      <div className={style.spaceBetween}>
                        <span className={`${style.cardTextBoldStyle} ${style.marginTop30}`}>
                          {form?.basicDetails?.applicant?.cellPhone ? `+1 ${form?.basicDetails?.applicant?.cellPhone}` : ""}
                        </span>
                        <span className={`${style.emailTextBoldStyle} ${style.marginTop30} ${style.marginLeft20}`}>
                          {form?.basicDetails?.applicant?.email?.officialEmail || ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`${style.displayInRow} ${style.marginRight20}`}>
                    <div className={style.displayInCol}>
                      <div className={style.marginTop15}>
                        <span className={style.rightAlignTextStyle}>
                          Days To Complete:
                        </span>
                        <span className={`${style.leftAlignTextStyle} ${style.marginLeft10}`}>
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <>
          {userRole?.includes('Staff Manager') ? (
            <div
            className={`${style.cardLeftStyle} ${style.bigCalendarLeftCardWidth}`}
          >
  
            <div>
              <div
                className={`${style.tableHeaderStyle} ${style.marginTop20} ${style.tableHeaderGridStyle} `}
              >
                <div
                  className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                >
                  <div
                    className={`${style.marginLeft30} ${style.tableHeaderTextStyle}`}
                  ></div>
                </div>
                <div
                  className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                >
                  <div className={`${style.tableHeaderTextStyle}`}>
                    Required Data & POD Verification
                  </div>
                </div>
                <div
                  className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                >
                  <div
                    className={`${style.tableHeaderTextStyle}`}
                    aria-owns={open ? "mouse-over-popover" : undefined}
                    aria-haspopup="true"
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                  >
                    <img
                      src={DataStatusIcon}
                      alt=""
                      style={{
                        width: "18px",
                        height: "20px",
                      }}
                    />
                    <Popover
                      id={"mouse-over-popover"}
                      sx={{
                        pointerEvents: "none",
                      }}
                      open={open}
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      onClose={handlePopoverClose}
                      PaperProps={{
                        style: {
                          backgroundColor: "transparent",
                          boxShadow: "none",
                          borderRadius: 0,
                        },
                      }}
                      disableRestoreFocus
                    >
                      <div className={style.multipleOptionsCard}>
                        <div
                          className={`${style.specificActionCard} ${style.cursorPointer}`}
                        >
                          Data Quality Status
                        </div>
                      </div>
                    </Popover>
                  </div>
                </div>
                <div
                  className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                >
                  <div
                    className={`${style.tableHeaderTextStyle}`}
                    aria-owns={
                      openTextWithHover ? "mouse-over-popover" : undefined
                    }
                    aria-haspopup="true"
                    onMouseEnter={handlePopoverTextOpen}
                    onMouseLeave={handlePopoverTextClose}
                  >
                    <img
                      src={DocumentIcon}
                      alt=""
                      style={{
                        width: "18px",
                        height: "20px",
                      }}
                    />
                    <Popover
                      id={"mouse-over-popover"}
                      sx={{
                        pointerEvents: "none",
                      }}
                      open={openTextWithHover}
                      anchorEl={anchorTextEl}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      onClose={handlePopoverTextClose}
                      PaperProps={{
                        style: {
                          backgroundColor: "transparent",
                          boxShadow: "none",
                          borderRadius: 0,
                        },
                      }}
                      disableRestoreFocus
                    >
                      <div className={style.multipleOptionsCard}>
                        <div
                          className={`${style.specificActionCard} ${style.cursorPointer}`}
                        >
                          Document Status
                        </div>
                      </div>
                    </Popover>
                  </div>
                </div>
                <div
                  className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                >
                  <div className={`${style.tableHeaderTextStyle}`}>
                    Documents
                  </div>
                </div>
              </div>
              <div>
                <div
                  className={` ${style.marginTop5} ${expand?.status && expand?.index === 0
                    ? style.tableDataStyle1
                    : style.tableDataStyle
                    }`}
                >
                  <div
                    className={` ${expand?.status && expand?.index === 0
                      ? style.tableHeaderGridStyleForm
                      : style.tableHeaderGridStyle
                      } ${style.marginTop10}`}
                  >
                    <div
                      className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                    >
                      <div
                        className={`${style.marginLeft10} ${style.justifySpaceAround
                          } ${form?.basicInformationStatus
                            ? style.greenDotStyle
                            : style.greyDotStyle
                          }`}
                      ></div>
                    </div>
                    <div
                      className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                    >
                      <div
                        className={`${expand?.status && expand?.index === 0
                          ? style.tableHeaderTextStyle
                          : style.tableDataFontStyle1
                          }`}
                      >
                        Applicant Profile Information
                      </div>
                    </div>
                    {expand?.status && expand?.index === 0 ? (
                      <>
                        {!form?.basicInformationStatus ? (
                          <div
                            className={`${style.purpleButton} ${style.cursorPointer} `}
                          >
                            <div
                              className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                              onClick={() => handleVerify()}
                            >
                              Verify
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`${style.greenButton}  ${style.cursorPointer} `}
                          >
                            <div
                              className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                            >
                              Verified
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                        >
                          <div
                            className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}
                          ></div>
                        </div>
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                        >
                          <div
                            className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}
                          ></div>
                        </div>
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                        >
                          <div
                            className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                          >
                            -
                          </div>
                        </div>
                      </>
                    )}

                    <div
                      className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                    >
                      <div
                        className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                      >
                        {expand?.status && expand?.index === 0 ? (
                          <RemoveIcon
                            sx={{
                              fontSize: 20,
                              color: "#94979A",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              setExpand({ status: false, index: 0 })
                            }
                          />
                        ) : (
                          <AddIcon
                            sx={{
                              fontSize: 20,
                              color: "#94979A",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              setExpand({ status: true, index: 0 })
                            }
                          />
                        )}{" "}
                      </div>
                    </div>
                  </div>
                  {expand?.status && expand?.index === 0 && (
                    <div
                      className={`${style.marginTop} ${style.screenPadding}`}
                    >
                     
                      {form1 !== undefined &&
                        "applicant" in form1?.properties && (
                          <ApplicationFieldCard
                            object={form1?.properties?.applicant}
                            gridStyle={style.applicantGrid}
                            baseKey={"applicant"}
                            basicForm={form}
                            setBasicForm={setForm}
                            isBasicPath={true}
                            isPOD={true}
                          />
                        )}
                      {form1 !== undefined &&
                        "credentialingPrivilegeCategory" in
                        form1?.properties && (
                          <ApplicationFieldCard
                            object={
                              form1?.properties?.credentialingPrivilegeCategory
                            }
                            gridStyle={style.credentialingGrid}
                            baseKey={"credentialingPrivilegeCategory"}
                            basicForm={form}
                            setBasicForm={setForm}
                            isBasicPath={true}
                            isPOD={true}
                          />
                        )}
                      {form1 !== undefined &&
                        "departmentSpecialty" in form1?.properties && (
                          <ApplicationFieldCard
                            object={form1?.properties?.departmentSpecialty}
                            gridStyle={style.twoCol}
                            baseKey={"departmentSpecialty"}
                            basicForm={form}
                            setBasicForm={setForm}
                            isBasicPath={true}
                            isPOD={true}
                          />
                        )}
                      {form1 !== undefined &&
                        getValueByPath(
                          form,
                          "basicDetails.departmentSpecialty.department"
                        ) ===
                        form1.if.properties.departmentSpecialty.properties
                          .department.const &&
                        form1.if.properties.departmentSpecialty.properties.specialty.enum?.includes(
                          getValueByPath(
                            form,
                            "basicDetails.departmentSpecialty.specialty"
                          )
                        ) &&
                        form1 !== undefined &&
                        "regionalCallResponsibilities" in form1?.properties && (
                          <ApplicationFieldCard
                            object={
                              form1?.properties?.regionalCallResponsibilities
                            }
                            gridStyle={""}
                            baseKey={"regionalCallResponsibilities"}
                            basicForm={form}
                            setBasicForm={setForm}
                            isBasicPath={true}
                            isPOD={true}
                          />
                        )}
                      {form1 !== undefined &&
                        "billingNumber" in form1?.properties && (
                          <ApplicationFieldCard
                            object={form1?.properties?.billingNumber}
                            gridStyle={style.twoCol}
                            baseKey={"billingNumber"}
                            basicForm={form}
                            setBasicForm={setForm}
                            isBasicPath={true}
                            isPOD={true}
                          />
                        )}
                    </div>
                  )}
                </div>

                {form?.formSchemas
                  ?.filter(
                    (data) =>
                      (data?.formCategory === "Form" ||
                        data?.formCategory === "Disclosure") &&
                      data?.schemaCategory !== "UploadYourDoc"
                  )
                  ?.map((data, index) => (
                    <div
                      className={` ${style.marginTop5} ${expand?.status && expand?.index === index + 1
                        ? style.tableDataStyle1
                        : style.tableDataStyle
                        }`}
                    >
                      <div
                        className={` ${expand?.index === index + 1
                          ? style.tableHeaderGridStyleForm
                          : style.tableHeaderGridStyle
                          } ${style.marginTop10}`}
                      >
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                        >
                          <div
                            className={`${style.marginLeft10} ${style.justifySpaceAround
                              } ${form?.forms[index]?.status !== "APPROVED"
                                ? style.greyDotStyle
                                : style.greenDotStyle
                              }`}
                          ></div>
                        </div>
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                        >
                          <div className={`${style.tableDataFontStyle1}`}>
                            {data?.description}
                          </div>
                        </div>
                        {expand?.status && expand?.index === index + 1 ? (
                          <>
                            {form?.forms[index]?.status !== "APPROVED" ? (
                              <div
                                className={`${style.purpleButton} ${style.cursorPointer} `}
                              >
                                <div
                                  className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                  onClick={() =>
                                    handleStepsVerify(form?.forms[index]?.id)
                                  }
                                >
                                  Verify
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`${style.greenButton}  ${style.cursorPointer} `}
                              >
                                <div
                                  className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                >
                                  Verified
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div
                              className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                            >
                              <div
                                className={`${style.marginLeft10}${style.justifySpaceAround
                                  } ${form?.forms[index]?.status !== "APPROVED"
                                    ? style.greyDotStyle
                                    : style.greenDotStyle
                                  }`}
                              ></div>
                            </div>
                            <div
                              className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                            >
                              <div
                                className={`${style.marginLeft10}${style.justifySpaceAround
                                  } ${form?.forms[index]?.status !== "APPROVED"
                                    ? style.greyDotStyle
                                    : style.greenDotStyle
                                  }`}
                              ></div>
                            </div>
                            <div
                              className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                            >
                              <div
                                className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                              >
                                {form?.forms
                                  ?.filter(
                                    (formData, formIndex) => formIndex === index
                                  )
                                  ?.map(
                                    (data) => data?.uploadedFiles?.length || 0
                                  )}
                              </div>
                            </div>
                          </>
                        )}
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                        >
                          <div
                            className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                          >
                            {expand?.status && expand?.index === index + 1 ? (
                              <RemoveIcon
                                sx={{
                                  fontSize: 20,
                                  color: "#94979A",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setExpand({ status: false, index: 0 });
                                  setFormSchemaId("");
                                }}
                              />
                            ) : (
                              <AddIcon
                                sx={{
                                  fontSize: 20,
                                  color: "#94979A",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setExpand({ status: true, index: index + 1 });
                                  setFormSchemaId(data?.id);
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      {expand?.status && expand?.index === index + 1 && (
                        <div
                          className={`${style.marginTop} ${style.screenPadding}`}
                        >
                          {renderFieldsBasedOnStep(data)}
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              <div>
                <div
                  className={`${style.tableHeaderStyle} ${style.marginTop20} ${style.tableHeaderGridStyle1} `}
                >
                  <div
                    className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                  >
                    <div
                      className={`${style.marginLeft10} ${style.tableHeaderTextStyle}`}
                    ></div>
                  </div>
                  <div
                    className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                  >
                    <div className={`${style.tableHeaderTextStyle}`}>
                      Requested Form Completeness Check
                    </div>
                  </div>
                </div>
                {form?.formSchemas
                  ?.filter((data) => data?.formCategory === "Acknowledgement")
                  ?.map((data, index) => (
                    <div
                      className={` ${style.marginTop5} ${expandAcknowledgement?.status &&
                        expandAcknowledgement?.index === index
                        ? style.tableDataStyle1
                        : style.tableDataStyle
                        }`}
                    >
                      <div
                        className={` ${style.marginTop10} ${expandAcknowledgement?.status &&
                          expandAcknowledgement?.index === index
                          ? style.tableHeaderGridStyleForm
                          : style.tableHeaderGridStyle1
                          }`}
                      >
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                        >
                          <div
                            className={`${style.marginLeft10} ${style.justifySpaceAround
                              } ${form?.forms?.filter(
                                (data) =>
                                  data?.formCategory === "Acknowledgement"
                              )[index]?.status !== "APPROVED"
                                ? style.greyDotStyle
                                : style.greenDotStyle
                              }`}
                          ></div>
                        </div>
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                        >
                          <div className={`${style.tableDataFontStyle1}`}>
                            {data?.description}
                          </div>
                        </div>
                        {expandAcknowledgement?.status &&
                          expandAcknowledgement?.index === index && (
                            <>
                              {form?.forms?.filter(
                                (data) =>
                                  data?.formCategory === "Acknowledgement"
                              )[index]?.status !== "APPROVED" ? (
                                <div
                                  className={`${style.purpleButton} ${style.cursorPointer} `}
                                >
                                  <div
                                    className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                    onClick={() =>
                                      handleStepsVerify(
                                        form?.forms?.filter(
                                          (data) =>
                                            data?.formCategory ===
                                            "Acknowledgement"
                                        )[index]?.id
                                      )
                                    }
                                  >
                                    Verify
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className={`${style.greenButton}  ${style.cursorPointer} `}
                                >
                                  <div
                                    className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                  >
                                    Verified
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                        >
                          <div
                            className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                          >
                            {expandAcknowledgement?.status &&
                              expandAcknowledgement?.index === index ? (
                              <RemoveIcon
                                sx={{
                                  fontSize: 20,
                                  color: "#94979A",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setExpandAcknowledgement({
                                    status: false,
                                    index: 0,
                                  });
                                  setFormSchemaId("");
                                }}
                              />
                            ) : (
                              <AddIcon
                                sx={{
                                  fontSize: 20,
                                  color: "#94979A",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setExpandAcknowledgement({
                                    status: true,
                                    index: index,
                                  });
                                  setFormSchemaId(data?.id);
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      {expandAcknowledgement?.status &&
                        expandAcknowledgement?.index === index && (
                          <div
                            className={`${style.marginTop} ${style.screenPadding}`}
                          >
                            {form?.forms?.filter(
                              (data) => data?.formCategory === "Acknowledgement"
                            )[index]?.uploadedFiles?.length !== 0 && (
                                <>
                                  <iframe
                                    src={
                                      form?.forms?.filter(
                                        (data) =>
                                          data?.formCategory === "Acknowledgement"
                                      )[index]?.uploadedFiles[
                                        form?.forms?.filter(
                                          (data) =>
                                            data?.formCategory ===
                                            "Acknowledgement"
                                        )[index]?.uploadedFiles?.length - 1
                                      ]?.fileURL
                                    }
                                    width="100%"
                                    height="600px"
                                  ></iframe>
                                  {(data?.description ===
                                    "Statement of Confidentiality and Non-Disclosure" ||
                                    data?.description ===
                                    "Conflict Of Interest Policy") && (
                                      <div className={style.grid2}>
                                        <div
                                          onClick={
                                            form?.forms[index]?.staffEsign === null
                                              ? () =>
                                                handleStaffEsign(
                                                  form?.forms?.filter(
                                                    (data) =>
                                                      data?.formCategory ===
                                                      "Acknowledgement"
                                                  )[index]?.id
                                                )
                                              : () => { }
                                          }
                                        >
                                          <ESignature
                                            userName={
                                              form?.forms?.filter(
                                                (data) =>
                                                  data?.formCategory ===
                                                  "Acknowledgement"
                                              )[index]?.staffEsign !== null
                                                ? form?.forms?.filter(
                                                  (data) =>
                                                    data?.formCategory ===
                                                    "Acknowledgement"
                                                )[index]?.staffEsign?.name
                                                : ""
                                            }
                                            encData={
                                              form?.forms?.filter(
                                                (data) =>
                                                  data?.formCategory ===
                                                  "Acknowledgement"
                                              )[index]?.staffEsign !== null
                                                ? form?.forms?.filter(
                                                  (data) =>
                                                    data?.formCategory ===
                                                    "Acknowledgement"
                                                )[index]?.staffEsign?.esign
                                                : ""
                                            }
                                            showData={
                                              form?.forms?.filter(
                                                (data) =>
                                                  data?.formCategory ===
                                                  "Acknowledgement"
                                              )[index]?.staffEsign !== null
                                                ? true
                                                : false
                                            }
                                            showDatais={true}
                                          />
                                        </div>
                                        <div className={style.verticalAlignCenter}>
                                          <div className={style.displayInRow}>
                                            <div className={style.dateTitle}>
                                              Date:{" "}
                                            </div>
                                            <div
                                              className={`${style.date} ${style.marginLeft}`}
                                            >
                                              {form?.forms?.filter(
                                                (data) =>
                                                  data?.formCategory ===
                                                  "Acknowledgement"
                                              )[index]?.staffEsign !== null
                                                ? format(
                                                  new Date(
                                                    form?.forms?.filter(
                                                      (data) =>
                                                        data?.formCategory ===
                                                        "Acknowledgement"
                                                    )[
                                                      index
                                                    ]?.staffEsign?.signedDate
                                                  ),
                                                  canadaData?.dateFormat ||
                                                  "dd/MM/yyyy"
                                                )
                                                : ""}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                </>
                              )}
                          </div>
                        )}
                    </div>
                  ))}
              </div>
              <div className={style.marginBottom20}></div>
            </div>
          </div>
          ) : (
             <div className={`${style.cardLeftStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop10}`}>
            <div>
             
                
              <div className={`${style.tableHeaderStyle} ${style.marginTop20} ${style.tableHeaderGridStyleCred1} `}>
               
                <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                  <div className={`${style.tableHeaderTextStyleCred}`}> POD Verification Check </div>
                </div>
              
              </div>
              <div>
                <div className={` ${style.marginTop5} ${(expand?.status && expand?.index === 0) ? style.tableDataStyle1 : style.tableDataStyle}`}>
                  <div className={` ${(expand?.status && expand?.index === 0) ? style.tableHeaderGridStyleFormCred : style.tableHeaderGridStyleCred1} ${style.marginTop10}`}>
                   
                    <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                      <div className={`${(expand?.status && expand?.index === 0) ? style.tableHeaderTextStyleCred : style.tableDataFontStyleCred}`}>Applicant Profile Information</div>
                    </div>
 

                    {(expand?.status && expand?.index === 0) ? (
                      <>
                        {!form?.basicInformationStatus ? (
                          <div className={`${style.purpleButton} ${style.cursorPointer} `}>
                            <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`} onClick={() => handleVerify()}>Approve</div>
                          </div>
                        ) : (
                          <div className={`${style.greenButton}  ${style.cursorPointer} `}>
                            <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>Approved</div>
                          </div>
                        )}
                      </>
                    ) : (
                      " "
                    )}

                    <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                      <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                        {
                          (expand?.status && expand?.index === 0) ? (<RemoveIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => setExpand({ status: false, index: 0 })} />)
                            : (<AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => setExpand({ status: true, index: 0 })} />)
                        }                    </div>
                    </div>
                  </div>
                  {expand?.status && expand?.index === 0 &&
                    <div className={`${style.marginTop} ${style.screenPadding}`}>
                     
                      {form1 !== undefined && 'applicant' in form1?.properties && (
                        <ApplicationFieldCard object={form1?.properties?.applicant} gridStyle={style.applicantGrid} baseKey={'applicant'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                      )}
                      {form1 !== undefined && 'credentialingPrivilegeCategory' in form1?.properties && (
                        <ApplicationFieldCard object={form1?.properties?.credentialingPrivilegeCategory} gridStyle={style.credentialingGrid} baseKey={'credentialingPrivilegeCategory'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                      )}
                      {form1 !== undefined && 'departmentSpecialty' in form1?.properties && (
                        <ApplicationFieldCard object={form1?.properties?.departmentSpecialty} gridStyle={style.twoCol} baseKey={'departmentSpecialty'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                      )}
                      {form1 !== undefined && (getValueByPath(form, 'basicDetails.departmentSpecialty.department') === form1.if.properties.departmentSpecialty.properties.department.const && form1.if.properties.departmentSpecialty.properties.specialty.enum?.includes(getValueByPath(form, 'basicDetails.departmentSpecialty.specialty'))) && (
                        form1 !== undefined && 'regionalCallResponsibilities' in form1?.properties && (
                          <ApplicationFieldCard object={form1?.properties?.regionalCallResponsibilities} gridStyle={''} baseKey={'regionalCallResponsibilities'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                        )
                      )}
                      {form1 !== undefined && 'billingNumber' in form1?.properties && (
                        <ApplicationFieldCard object={form1?.properties?.billingNumber} gridStyle={style.twoCol} baseKey={'billingNumber'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                      )}
                    </div>
                  }


                </div>

                {
                  form?.formSchemas?.filter(data => (data?.formCategory === 'Form' || data?.formCategory === 'Disclosure') && data?.schemaCategory !== "UploadYourDoc")?.map((data, index) => (

                    <div className={` ${style.marginTop5} ${(expand?.status && expand?.index === index + 1) ? style.tableDataStyle1 : style.tableDataStyle}`}>
                      <div className={` ${expand?.index === index + 1 ? style.tableHeaderGridStyleFormCred : style.tableHeaderGridStyleCred} ${style.marginTop10}`}>
                      
                        <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                          <div className={`${style.tableDataFontStyleCred}`}>{data?.description}</div>
                        </div>
                        {!(expand?.status && expand?.index === index + 1) && (
                          <>
                            {form?.forms[index]?.status === "APPROVED" ? (
                              <div className={`${style.approvedButtonStyle} ${style.ApprovedTextStyle}`}>Approved</div>
                            ) : (
                              <div className={`${style.assessInCred} ${style.assessTextStyle}`}>4 to Assess</div>
                            )}
                          </>
                        )}
                        {expand?.status && expand?.index === index + 1 && (
                            <>
                                {credApproval?.filter(
                                (newData) =>{console.log("newData.schema:", newData.schemaId);
                                    console.log("data.id:", data.id);
                                   return newData.schemaId === data.id
                                }
                                )[0]?.approvalRequired === true ? (
                                <>
                                    {form?.forms[index]?.status !== "APPROVED" ? (
                                    <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                                        <div
                                        className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                        onClick={() => handleStepsVerify(form?.forms[index]?.id)}
                                        >
                                        Approve
                                        </div>
                                    </div>
                                    ) : (
                                    <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                        <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                        Approved
                                        </div>
                                    </div>
                                    )}
                                </>
                                ) : (""
                                )}
                            </>
                            )}
                        <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                          <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                            {
                              (expand?.status && expand?.index === index + 1) ? (<RemoveIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => { setExpand({ status: false, index: 0 }); setFormSchemaId('') }} />)
                                : (<AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => { setExpand({ status: true, index: index + 1 }); setFormSchemaId(data?.id) }} />)
                            }

                          </div>
                        </div>
                      </div>
                      {expand?.status && expand?.index === index + 1 &&
                        <div className={`${style.marginTop} ${style.screenPadding}`}>
                          {renderFieldsBasedOnStep(data)}
                        </div>
                      }
                    </div>))}

              </div>

              <div>
                <div className={`${style.tableHeaderStyle} ${style.marginTop20} ${style.tableHeaderStyleCred} `}>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    <div className={`${style.marginLeft10} ${style.tableHeaderTextStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    <div className={`${style.tableHeaderTextStyleCred}`}>Requested Form Completeness Check</div>
                  </div>
                </div>
                {form?.formSchemas?.filter(data => data?.formCategory === 'Acknowledgement')?.map((data, index) => (
                  <div className={` ${style.marginTop5} ${(expandAcknowledgement?.status && expandAcknowledgement?.index === index) ? style.tableDataStyle1 : style.tableDataStyle}`}>
                    <div className={` ${style.marginTop10} ${(expandAcknowledgement?.status && expandAcknowledgement?.index === index) ? style.tableHeaderGridStyleFormCred : style.tableHeaderGridStyleCred1}`}>
                     
                      <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                        <div className={`${style.tableDataFontStyleCred}`}>{data?.description}</div>
                      </div>
                      {expandAcknowledgement?.status && expandAcknowledgement?.index === index && (
                        <>
                          {form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.status !== "APPROVED" ? (
                            <div className={`${style.purpleButton} ${style.cursorPointer} `}>
                              <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`} onClick={() => handleStepsVerify(form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.id)}>Approve</div>
                            </div>
                          ) : (
                            <div className={`${style.greenButton}  ${style.cursorPointer} `}>
                              <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>Approved</div>
                            </div>
                          )}
                        </>
                      )}
                      <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                        <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                          {
                            (expandAcknowledgement?.status && expandAcknowledgement?.index === index) ? (<RemoveIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => { setExpandAcknowledgement({ status: false, index: 0 }); setFormSchemaId('') }} />)
                              : (<AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => { setExpandAcknowledgement({ status: true, index: index }); setFormSchemaId(data?.id) }} />)
                          }
                        </div>
                      </div>
                    </div>
                    {expandAcknowledgement?.status && expandAcknowledgement?.index === index &&
                      <div className={`${style.marginTop} ${style.screenPadding}`}>
                        {form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.uploadedFiles?.length !== 0 && (
                          <>
                            <iframe src={form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.uploadedFiles[form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.uploadedFiles?.length - 1]?.fileURL} width="100%" height="600px"></iframe>
                            {(data?.description === 'Statement of Confidentiality and Non-Disclosure' || data?.description === 'Conflict Of Interest Policy') && (
                              <div className={style.grid2}>
                                <div onClick={form?.forms[index]?.staffEsign === null ? () => handleStaffEsign(form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.id) : () => { }} >
                                  <ESignature
                                    userName={form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign !== null ? form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign?.name : ""}
                                    encData={form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign !== null ? form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign?.esign : ''}
                                    showData={form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign !== null ? true : false}
                                    showDatais={true}
                                  />
                                </div>
                                <div className={style.verticalAlignCenter}>
                                  <div className={style.displayInRow}>
                                    <div className={style.dateTitle}>Date: </div>
                                    <div className={`${style.date} ${style.marginLeft}`}>{form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign !== null ? format(new Date(form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign?.signedDate), canadaData?.dateFormat || 'dd/MM/yyyy') : ""}</div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    }
                  </div>))}
              </div>
              <div className={style.marginBottom20}></div>
            </div>
          </div>
          )}
          </>
            </div>
                 <>
          {userRole?.includes('Staff Manager') ? (
            <div
            className={`${style.cardLeftStyle} ${style.bigCalendarLeftCardWidth}`}
          >
  
            <div>
              <div
                className={`${style.tableHeaderStyle} ${style.marginTop20} ${style.tableHeaderGridStyle} `}
              >
                <div
                  className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                >
                  <div
                    className={`${style.marginLeft30} ${style.tableHeaderTextStyle}`}
                  ></div>
                </div>
                <div
                  className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                >
                  <div className={`${style.tableHeaderTextStyle}`}>
                    Required Data & POD Verification
                  </div>
                </div>
                <div
                  className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                >
                  <div
                    className={`${style.tableHeaderTextStyle}`}
                    aria-owns={open ? "mouse-over-popover" : undefined}
                    aria-haspopup="true"
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                  >
                    <img
                      src={DataStatusIcon}
                      alt=""
                      style={{
                        width: "18px",
                        height: "20px",
                      }}
                    />
                    <Popover
                      id={"mouse-over-popover"}
                      sx={{
                        pointerEvents: "none",
                      }}
                      open={open}
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      onClose={handlePopoverClose}
                      PaperProps={{
                        style: {
                          backgroundColor: "transparent",
                          boxShadow: "none",
                          borderRadius: 0,
                        },
                      }}
                      disableRestoreFocus
                    >
                      <div className={style.multipleOptionsCard}>
                        <div
                          className={`${style.specificActionCard} ${style.cursorPointer}`}
                        >
                          Data Quality Status
                        </div>
                      </div>
                    </Popover>
                  </div>
                </div>
                <div
                  className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                >
                  <div
                    className={`${style.tableHeaderTextStyle}`}
                    aria-owns={
                      openTextWithHover ? "mouse-over-popover" : undefined
                    }
                    aria-haspopup="true"
                    onMouseEnter={handlePopoverTextOpen}
                    onMouseLeave={handlePopoverTextClose}
                  >
                    <img
                      src={DocumentIcon}
                      alt=""
                      style={{
                        width: "18px",
                        height: "20px",
                      }}
                    />
                    <Popover
                      id={"mouse-over-popover"}
                      sx={{
                        pointerEvents: "none",
                      }}
                      open={openTextWithHover}
                      anchorEl={anchorTextEl}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      onClose={handlePopoverTextClose}
                      PaperProps={{
                        style: {
                          backgroundColor: "transparent",
                          boxShadow: "none",
                          borderRadius: 0,
                        },
                      }}
                      disableRestoreFocus
                    >
                      <div className={style.multipleOptionsCard}>
                        <div
                          className={`${style.specificActionCard} ${style.cursorPointer}`}
                        >
                          Document Status
                        </div>
                      </div>
                    </Popover>
                  </div>
                </div>
                <div
                  className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                >
                  <div className={`${style.tableHeaderTextStyle}`}>
                    Documents
                  </div>
                </div>
              </div>
              <div>
                <div
                  className={` ${style.marginTop5} ${expand?.status && expand?.index === 0
                    ? style.tableDataStyle1
                    : style.tableDataStyle
                    }`}
                >
                  <div
                    className={` ${expand?.status && expand?.index === 0
                      ? style.tableHeaderGridStyleForm
                      : style.tableHeaderGridStyle
                      } ${style.marginTop10}`}
                  >
                    <div
                      className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                    >
                      <div
                        className={`${style.marginLeft10} ${style.justifySpaceAround
                          } ${form?.basicInformationStatus
                            ? style.greenDotStyle
                            : style.greyDotStyle
                          }`}
                      ></div>
                    </div>
                    <div
                      className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                    >
                      <div
                        className={`${expand?.status && expand?.index === 0
                          ? style.tableHeaderTextStyle
                          : style.tableDataFontStyle1
                          }`}
                      >
                        Applicant Profile Information
                      </div>
                    </div>
                    {expand?.status && expand?.index === 0 ? (
                      <>
                        {!form?.basicInformationStatus ? (
                          <div
                            className={`${style.purpleButton} ${style.cursorPointer} `}
                          >
                            <div
                              className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                              onClick={() => handleVerify()}
                            >
                              Verify
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`${style.greenButton}  ${style.cursorPointer} `}
                          >
                            <div
                              className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                            >
                              Verified
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                        >
                          <div
                            className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}
                          ></div>
                        </div>
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                        >
                          <div
                            className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}
                          ></div>
                        </div>
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                        >
                          <div
                            className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                          >
                            -
                          </div>
                        </div>
                      </>
                    )}

                    <div
                      className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                    >
                      <div
                        className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                      >
                        {expand?.status && expand?.index === 0 ? (
                          <RemoveIcon
                            sx={{
                              fontSize: 20,
                              color: "#94979A",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              setExpand({ status: false, index: 0 })
                            }
                          />
                        ) : (
                          <AddIcon
                            sx={{
                              fontSize: 20,
                              color: "#94979A",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              setExpand({ status: true, index: 0 })
                            }
                          />
                        )}{" "}
                      </div>
                    </div>
                  </div>
                  {expand?.status && expand?.index === 0 && (
                    <div
                      className={`${style.marginTop} ${style.screenPadding}`}
                    >
                     
                      {form1 !== undefined &&
                        "applicant" in form1?.properties && (
                          <ApplicationFieldCard
                            object={form1?.properties?.applicant}
                            gridStyle={style.applicantGrid}
                            baseKey={"applicant"}
                            basicForm={form}
                            setBasicForm={setForm}
                            isBasicPath={true}
                            isPOD={true}
                          />
                        )}
                      {form1 !== undefined &&
                        "credentialingPrivilegeCategory" in
                        form1?.properties && (
                          <ApplicationFieldCard
                            object={
                              form1?.properties?.credentialingPrivilegeCategory
                            }
                            gridStyle={style.credentialingGrid}
                            baseKey={"credentialingPrivilegeCategory"}
                            basicForm={form}
                            setBasicForm={setForm}
                            isBasicPath={true}
                            isPOD={true}
                          />
                        )}
                      {form1 !== undefined &&
                        "departmentSpecialty" in form1?.properties && (
                          <ApplicationFieldCard
                            object={form1?.properties?.departmentSpecialty}
                            gridStyle={style.twoCol}
                            baseKey={"departmentSpecialty"}
                            basicForm={form}
                            setBasicForm={setForm}
                            isBasicPath={true}
                            isPOD={true}
                          />
                        )}
                      {form1 !== undefined &&
                        getValueByPath(
                          form,
                          "basicDetails.departmentSpecialty.department"
                        ) ===
                        form1.if.properties.departmentSpecialty.properties
                          .department.const &&
                        form1.if.properties.departmentSpecialty.properties.specialty.enum?.includes(
                          getValueByPath(
                            form,
                            "basicDetails.departmentSpecialty.specialty"
                          )
                        ) &&
                        form1 !== undefined &&
                        "regionalCallResponsibilities" in form1?.properties && (
                          <ApplicationFieldCard
                            object={
                              form1?.properties?.regionalCallResponsibilities
                            }
                            gridStyle={""}
                            baseKey={"regionalCallResponsibilities"}
                            basicForm={form}
                            setBasicForm={setForm}
                            isBasicPath={true}
                            isPOD={true}
                          />
                        )}
                      {form1 !== undefined &&
                        "billingNumber" in form1?.properties && (
                          <ApplicationFieldCard
                            object={form1?.properties?.billingNumber}
                            gridStyle={style.twoCol}
                            baseKey={"billingNumber"}
                            basicForm={form}
                            setBasicForm={setForm}
                            isBasicPath={true}
                            isPOD={true}
                          />
                        )}
                    </div>
                  )}
                </div>

                {form?.formSchemas
                  ?.filter(
                    (data) =>
                      (data?.formCategory === "Form" ||
                        data?.formCategory === "Disclosure") &&
                      data?.schemaCategory !== "UploadYourDoc"
                  )
                  ?.map((data, index) => (
                    <div
                      className={` ${style.marginTop5} ${expand?.status && expand?.index === index + 1
                        ? style.tableDataStyle1
                        : style.tableDataStyle
                        }`}
                    >
                      <div
                        className={` ${expand?.index === index + 1
                          ? style.tableHeaderGridStyleForm
                          : style.tableHeaderGridStyle
                          } ${style.marginTop10}`}
                      >
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                        >
                          <div
                            className={`${style.marginLeft10} ${style.justifySpaceAround
                              } ${form?.forms[index]?.status !== "APPROVED"
                                ? style.greyDotStyle
                                : style.greenDotStyle
                              }`}
                          ></div>
                        </div>
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                        >
                          <div className={`${style.tableDataFontStyle1}`}>
                            {data?.description}
                          </div>
                        </div>
                        {expand?.status && expand?.index === index + 1 ? (
                          <>
                            {form?.forms[index]?.status !== "APPROVED" ? (
                              <div
                                className={`${style.purpleButton} ${style.cursorPointer} `}
                              >
                                <div
                                  className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                  onClick={() =>
                                    handleStepsVerify(form?.forms[index]?.id)
                                  }
                                >
                                  Verify
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`${style.greenButton}  ${style.cursorPointer} `}
                              >
                                <div
                                  className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                >
                                  Verified
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div
                              className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                            >
                              <div
                                className={`${style.marginLeft10}${style.justifySpaceAround
                                  } ${form?.forms[index]?.status !== "APPROVED"
                                    ? style.greyDotStyle
                                    : style.greenDotStyle
                                  }`}
                              ></div>
                            </div>
                            <div
                              className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                            >
                              <div
                                className={`${style.marginLeft10}${style.justifySpaceAround
                                  } ${form?.forms[index]?.status !== "APPROVED"
                                    ? style.greyDotStyle
                                    : style.greenDotStyle
                                  }`}
                              ></div>
                            </div>
                            <div
                              className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                            >
                              <div
                                className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                              >
                                {form?.forms
                                  ?.filter(
                                    (formData, formIndex) => formIndex === index
                                  )
                                  ?.map(
                                    (data) => data?.uploadedFiles?.length || 0
                                  )}
                              </div>
                            </div>
                          </>
                        )}
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                        >
                          <div
                            className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                          >
                            {expand?.status && expand?.index === index + 1 ? (
                              <RemoveIcon
                                sx={{
                                  fontSize: 20,
                                  color: "#94979A",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setExpand({ status: false, index: 0 });
                                  setFormSchemaId("");
                                }}
                              />
                            ) : (
                              <AddIcon
                                sx={{
                                  fontSize: 20,
                                  color: "#94979A",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setExpand({ status: true, index: index + 1 });
                                  setFormSchemaId(data?.id);
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      {expand?.status && expand?.index === index + 1 && (
                        <div
                          className={`${style.marginTop} ${style.screenPadding}`}
                        >
                          {renderFieldsBasedOnStep(data)}
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              <div>
                <div
                  className={`${style.tableHeaderStyle} ${style.marginTop20} ${style.tableHeaderGridStyle1} `}
                >
                  <div
                    className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                  >
                    <div
                      className={`${style.marginLeft10} ${style.tableHeaderTextStyle}`}
                    ></div>
                  </div>
                  <div
                    className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                  >
                    <div className={`${style.tableHeaderTextStyle}`}>
                      Requested Form Completeness Check
                    </div>
                  </div>
                </div>
                {form?.formSchemas
                  ?.filter((data) => data?.formCategory === "Acknowledgement")
                  ?.map((data, index) => (
                    <div
                      className={` ${style.marginTop5} ${expandAcknowledgement?.status &&
                        expandAcknowledgement?.index === index
                        ? style.tableDataStyle1
                        : style.tableDataStyle
                        }`}
                    >
                      <div
                        className={` ${style.marginTop10} ${expandAcknowledgement?.status &&
                          expandAcknowledgement?.index === index
                          ? style.tableHeaderGridStyleForm
                          : style.tableHeaderGridStyle1
                          }`}
                      >
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                        >
                          <div
                            className={`${style.marginLeft10} ${style.justifySpaceAround
                              } ${form?.forms?.filter(
                                (data) =>
                                  data?.formCategory === "Acknowledgement"
                              )[index]?.status !== "APPROVED"
                                ? style.greyDotStyle
                                : style.greenDotStyle
                              }`}
                          ></div>
                        </div>
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                        >
                          <div className={`${style.tableDataFontStyle1}`}>
                            {data?.description}
                          </div>
                        </div>
                        {expandAcknowledgement?.status &&
                          expandAcknowledgement?.index === index && (
                            <>
                              {form?.forms?.filter(
                                (data) =>
                                  data?.formCategory === "Acknowledgement"
                              )[index]?.status !== "APPROVED" ? (
                                <div
                                  className={`${style.purpleButton} ${style.cursorPointer} `}
                                >
                                  <div
                                    className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                    onClick={() =>
                                      handleStepsVerify(
                                        form?.forms?.filter(
                                          (data) =>
                                            data?.formCategory ===
                                            "Acknowledgement"
                                        )[index]?.id
                                      )
                                    }
                                  >
                                    Verify
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className={`${style.greenButton}  ${style.cursorPointer} `}
                                >
                                  <div
                                    className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                  >
                                    Verified
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                        >
                          <div
                            className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                          >
                            {expandAcknowledgement?.status &&
                              expandAcknowledgement?.index === index ? (
                              <RemoveIcon
                                sx={{
                                  fontSize: 20,
                                  color: "#94979A",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setExpandAcknowledgement({
                                    status: false,
                                    index: 0,
                                  });
                                  setFormSchemaId("");
                                }}
                              />
                            ) : (
                              <AddIcon
                                sx={{
                                  fontSize: 20,
                                  color: "#94979A",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setExpandAcknowledgement({
                                    status: true,
                                    index: index,
                                  });
                                  setFormSchemaId(data?.id);
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      {expandAcknowledgement?.status &&
                        expandAcknowledgement?.index === index && (
                          <div
                            className={`${style.marginTop} ${style.screenPadding}`}
                          >
                            {form?.forms?.filter(
                              (data) => data?.formCategory === "Acknowledgement"
                            )[index]?.uploadedFiles?.length !== 0 && (
                                <>
                                  <iframe
                                    src={
                                      form?.forms?.filter(
                                        (data) =>
                                          data?.formCategory === "Acknowledgement"
                                      )[index]?.uploadedFiles[
                                        form?.forms?.filter(
                                          (data) =>
                                            data?.formCategory ===
                                            "Acknowledgement"
                                        )[index]?.uploadedFiles?.length - 1
                                      ]?.fileURL
                                    }
                                    width="100%"
                                    height="600px"
                                  ></iframe>
                                  {(data?.description ===
                                    "Statement of Confidentiality and Non-Disclosure" ||
                                    data?.description ===
                                    "Conflict Of Interest Policy") && (
                                      <div className={style.grid2}>
                                        <div
                                          onClick={
                                            form?.forms[index]?.staffEsign === null
                                              ? () =>
                                                handleStaffEsign(
                                                  form?.forms?.filter(
                                                    (data) =>
                                                      data?.formCategory ===
                                                      "Acknowledgement"
                                                  )[index]?.id
                                                )
                                              : () => { }
                                          }
                                        >
                                          <ESignature
                                            userName={
                                              form?.forms?.filter(
                                                (data) =>
                                                  data?.formCategory ===
                                                  "Acknowledgement"
                                              )[index]?.staffEsign !== null
                                                ? form?.forms?.filter(
                                                  (data) =>
                                                    data?.formCategory ===
                                                    "Acknowledgement"
                                                )[index]?.staffEsign?.name
                                                : ""
                                            }
                                            encData={
                                              form?.forms?.filter(
                                                (data) =>
                                                  data?.formCategory ===
                                                  "Acknowledgement"
                                              )[index]?.staffEsign !== null
                                                ? form?.forms?.filter(
                                                  (data) =>
                                                    data?.formCategory ===
                                                    "Acknowledgement"
                                                )[index]?.staffEsign?.esign
                                                : ""
                                            }
                                            showData={
                                              form?.forms?.filter(
                                                (data) =>
                                                  data?.formCategory ===
                                                  "Acknowledgement"
                                              )[index]?.staffEsign !== null
                                                ? true
                                                : false
                                            }
                                            showDatais={true}
                                          />
                                        </div>
                                        <div className={style.verticalAlignCenter}>
                                          <div className={style.displayInRow}>
                                            <div className={style.dateTitle}>
                                              Date:{" "}
                                            </div>
                                            <div
                                              className={`${style.date} ${style.marginLeft}`}
                                            >
                                              {form?.forms?.filter(
                                                (data) =>
                                                  data?.formCategory ===
                                                  "Acknowledgement"
                                              )[index]?.staffEsign !== null
                                                ? format(
                                                  new Date(
                                                    form?.forms?.filter(
                                                      (data) =>
                                                        data?.formCategory ===
                                                        "Acknowledgement"
                                                    )[
                                                      index
                                                    ]?.staffEsign?.signedDate
                                                  ),
                                                  canadaData?.dateFormat ||
                                                  "dd/MM/yyyy"
                                                )
                                                : ""}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                </>
                              )}
                          </div>
                        )}
                    </div>
                  ))}
              </div>
              <div className={style.marginBottom20}></div>
            </div>
          </div>
          ) : (
          ""
          )}
          </>
            </>
          )}
          </>
          <div>
            {userRole.includes('Staff Manager') || userRole.includes('Chief Of Staff') || userRole.includes('Credentialing Committee') || userRole.includes('Department Head') ? (
              <>
              {selectedTab !== "level-4" && selectedTab !== "level-5" && (
              <div className={`${style.twoColumnGrid} ${style.marginTop20}`}>
              <div className={`${style.buttonCardStyle} `}>
                <div
                  className={`${style.buttonTextStyle} ${style.alignCenter}`}
                >
                  SAVE IN PROGRESS
                </div>
              </div>
              <div
                className={`${style.buttonCardStyle} ${style.cursorPointer}`}
              >
                <div
                  className={`${style.buttonTextStyle} ${style.alignCenter}`}
                  onClick={() => {
                    setShowApplicationDeclineDialog(true);
                  }}
                >
                  REJECT
                </div>
              </div>
            </div>
              )}
            <div className={`${style.marginTop20} ${style.marginBottom20}`}>

                {userRole?.includes('Staff Manager') && selectedTab !== "level-4" && selectedTab !== "level-5" && (
                     <div 
                     className={`${style.bigButtonStyle} ${isApproved ? style.cursorPointer : ''}`}
                     style={{ opacity: isApproved ? 1 : 0.5 }}
                   >
                      <div 
                        className={`${style.bigButtonTextStyle} ${style.alignCenter}`}
                        onClick={isApproved ? onClickApproveFunction : undefined}
                      >
                         {selectedTab === 'level-1' ? 'VERIFY FOR DEPT. HEAD' : selectedTab === 'level-2' ? 'VERIFY FOR CRED COMM REVIEW' : selectedTab === 'level-3' ? 'NOT READY FOR MAC' : selectedTab === 'level-4' ? ' MAC APPROVED' : selectedTab === 'level-5' ? ' BOD APPROVED' : " " }
                      </div>
                    </div>
                  )}

                  {userRole?.includes('Department Head') && selectedTab === 'level-2' &&  (
                    <div className={`${style.bigButtonStyle} ${style.cursorPointer}`}>
                      <div 
                        className={`${style.bigButtonTextStyle} ${style.alignCenter}`}
                        onClick={onClickApproveFunction}
                      >
                        ACCEPT FOR CRED. COMM. REVIEW
                      </div>
                    </div>
                  )}

                  {userRole?.includes('Chief Of Staff') && (
                    <>
                      {selectedTab === "level-3" && (
                        <>
                          <div className={`${style.bigButtonStyle} ${style.cursorPointer}`}>
                            <div 
                              className={`${style.bigButtonTextStyle} ${style.alignCenter}`}
                              onClick={onClickApprovalFunction}
                            >
                              APPROVE APPLICANT
                            </div>
                          </div>
                          <div className={`${style.bigButtonStyle1} ${style.cursorPointer}`}>
                            <div 
                              className={`${style.bigButtonTextStyle} ${style.alignCenter}`}
                              onClick={onClickApprovalFunction}
                            >
                              OVERRIDE FOR TEMPORARY PRIVILEGES
                            </div>
                          </div>
                        </>
                      )}
                      {(selectedTab === "level-1") && (
                        <>
                         <div 
                     className={`${style.bigButtonStyle} ${isApproved ? style.cursorPointer : ''}`}
                     style={{ opacity: isApproved ? 1 : 0.5 }}
                   >
                      <div 
                        className={`${style.bigButtonTextStyle} ${style.alignCenter}`}
                        onClick={isApproved ? onClickApproveFunction : undefined}
                      >
                         VERIFY FOR DEPT. HEAD
                      </div>
                    </div>
                        <div className={`${style.bigButtonStyle1} ${style.cursorPointer}`}>
                          <div 
                            className={`${style.bigButtonTextStyle} ${style.alignCenter}`}
                            // onClick={onClickApprovalFunction}
                          >
                            OVERRIDE FOR TEMPORARY PRIVILEGES
                          </div>
                        </div>
                        </>
                      )}
                       {(selectedTab === "level-2") && (
                        <>
                        <div className={`${style.bigButtonStyle} ${style.cursorPointer}`}>
                          <div 
                            className={`${style.bigButtonTextStyle} ${style.alignCenter}`}
                            onClick={onClickApproveFunction}
                          >
                            ACCEPT FOR CRED. COMM. REVIEW
                          </div>
                        </div>
                        <div className={`${style.bigButtonStyle1} ${style.cursorPointer}`}>
                          <div 
                            className={`${style.bigButtonTextStyle} ${style.alignCenter}`}
                            // onClick={onClickApprovalFunction}
                          >
                            OVERRIDE FOR TEMPORARY PRIVILEGES
                          </div>
                        </div>
                        </>
                      )}
                    </>
                  )}

                  {((userRole?.includes('Credentialing Committee') && selectedTab === 'level-3') || (userRole?.includes('Department Head') && selectedTab === 'level-3')) && (
                    <div className={`${style.bigButtonStyle} ${style.cursorPointer}`}>
                      <div 
                        className={`${style.bigButtonTextStyle} ${style.alignCenter}`}
                        onClick={onClickApprovalFunction}
                      >
                        NOT READY FOR MAC
                      </div>
                    </div>
                  )}

                  {((userRole?.includes('Credentialing Committee')&& selectedTab === 'level-3') || (userRole?.includes('Chief Of Staff') && selectedTab === "level-3") || (userRole?.includes('Staff Manager') && selectedTab === "level-3") || (userRole?.includes('Department Head') && selectedTab === "level-3")) ? (
                      <div className={`${style.statusCard} ${style.marginTop20} ${style.marginBottom20}`}>
                      <div className={`${style.statusCardTextStyle1} ${style.marginTop20}`}>Review and Approval Status</div>
                      <div className={`${style.spaceEvenly} ${style.marginTop20}`}>
                      <div className={`${style.displayInCol}`}>
                        <div className={`${style.statusStartTextStyle}`}>Not Started Yet</div>
                        <div className={`${style.statusRoleTextStyle}`}>CHIEF OF STAFF / DEPUTY</div>
                      </div>
                      <div className={`${style.displayInCol}`}>
                        <div className={`${style.statusStartTextStyle}`}>Not Started Yet</div>
                        <div className={`${style.statusRoleTextStyle}`}>CREDENTIALING COMMITTEE</div>
                      </div>
                      </div>
                    </div>
                    ) : null }
                {/* <div
                  className={`${style.bigButtonTextStyle} ${style.alignCenter}`}
                  onClick={handleApplicationAccept}
                >
                  ACCEPT APPLICATION
                </div> */}
              
            </div>
            <>
            {selectedTab !== "level-4" && selectedTab !== "level-5" && (
            <>
            <div className={style.cardLeftStyle}>
              <div className={`${style.displayInRow}${style.marginTop20}`}>
                <div
                  className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}
                >
                  <div
                    className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                  >
                    <span className={`${style.tableHeaderHeadingTextStyle}`}>
                      Notes
                    </span>
                    <div
                      className={`${style.marginTop5} ${style.marginLeft10} ${style.tableDataFontStyle1}`}
                    >
                      <img
                        src={EditBlue}
                        alt="EditBlue"
                        className={style.colorFileStyle}
                      />
                    </div>
                  </div>
                  <div
                    className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                  >
                    <div
                      className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                    >
                      <AddIcon
                        sx={{
                          fontSize: 20,
                          color: "#94979A",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${style.cardLeftStyle} ${style.marginTop20}`}>
              <div className={`${style.displayInRow}${style.marginTop20}`}>
                <div
                  className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}
                >
                  <span className={`${style.tableHeaderHeadingTextStyle}`}>
                    RFCs & Doc Clarification
                  </span>
                  <div
                    className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                  >
                    <div
                      className={`${style.marginLeft10} ${style.tableDataFontStyle1}`} onClick={() => toggleExpand("section1")}
                    >
                    {expandStates.section1 ? (
                          <RemoveIcon
                            sx={{
                              fontSize: 20,
                              color: "#94979A",
                              cursor: "pointer",
                            }}
                          />
                        ) : (
                          <AddIcon
                            sx={{
                              fontSize: 20,
                              color: "#94979A",
                              cursor: "pointer",
                            }}
                          />
                        )}
                    </div>
                  </div>
                </div>
                {expandStates.section1 && (
                  <>
                  <div  className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}>
                  <div>Proof of Qualifications</div>
                  <RemoveIcon
                            sx={{
                              fontSize: 20,
                              color: "#94979A",
                              cursor: "pointer",
                            }}
                          />
                  </div>
                  <div className={`${style.marginBottom20} ${style.clarificationCardStyle}`}>
                    <div className={`${style.gridGap3}`}>
                      <div className={`${style.greenDotStyle} ${style.buttonCenter}`}></div>
                      <div className={`${style.sideHeadingFontStyle}`}>Queen's University Clarification Title To Address</div>
                      <AddIcon
                            sx={{
                              fontSize: 20,
                              color: "#94979A",
                              cursor: "pointer",
                            }}
                          />
                    </div>
                  </div>
                 </>
                  )}
              </div>
           
              <div className={style.marginBottom20}></div>
            </div>
            <div className={`${style.cardLeftStyle} ${style.marginTop20}`}>
              <div className={`${style.displayInRow}${style.marginTop20}`}>
                <div
                  className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}
                >
                  <span className={`${style.tableHeaderHeadingTextStyle}`}>
                   Reference Feedback Status
                  </span>
                  <div
                    className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                  >
                    <div
                      className={`${style.marginLeft10} ${style.tableDataFontStyle1}`} onClick={() => toggleExpand("section2")}
                    >
                    {expandStates.section2 ? (
                          <RemoveIcon
                            sx={{
                              fontSize: 20,
                              color: "#94979A",
                              cursor: "pointer",
                            }}
                          />
                        ) : (
                          <AddIcon
                            sx={{
                              fontSize: 20,
                              color: "#94979A",
                              cursor: "pointer",
                            }}
                          />
                        )}
                    </div>
                  </div>
                </div>
                {expandStates.section2  && (
                  <>
                  <div className={`${style.marginBottom20} ${style.referenceCardStyle}`}>
                
                    <div className={`${style.gridGap}`}>
                      <div className={`${style.greenDotStyle} ${style.buttonCenter}`}></div>
                       <div>
                        <div className={style.displayInRow}>
                          <div>
                          <div className={`${style.sideHeadingFontStyle}`}>Professional Reference Name For Special Priv.</div>
                          <div className={`${style.sideHeadingRefFrontStyle}`}>Reference Questionnaire Sent On Oct 11, 2024</div>
                          </div>
                         {/* <div className={`${style.viewTextStyle} ${style.viewButton} ${style.alignItem} ${style.cursorPointer}`} onClick={onClickEmailDialogFunction}>Send</div> */}
                         <div className={`${style.viewTextStyle} ${style.viewButton} ${style.alignItem} ${style.cursorPointer}`}>Send</div>
                         </div>   
                         <CommonDivider />
                       </div>
                    </div>
                    <div className={`${style.gridGap1}`}>
                      <div className={`${style.greenDotStyle} ${style.buttonCenter}`}></div>
                      <div className={`${style.sideHeadingFontStyle}`}>Marked As Favourable By Dept. Head On Oct 12, 2024</div>
                      <div className={`${style.viewTextStyle} ${style.viewButton} `}>Review</div>   
                    </div>
                  </div>
                  </>
                  )}
              </div>
              <div className={style.marginBottom20}></div>
            </div>
            <div className={`${style.cardLeftStyle} ${style.marginTop20}`}>
              <div className={`${style.displayInRow}${style.marginTop20}`}>
                <div
                  className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}
                >
                  <span className={`${style.tableHeaderHeadingTextStyle}`}>
                    Immunization History Review
                  </span>
                  <div
                    className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                  >
                    <div
                      className={`${style.marginLeft10} ${style.tableDataFontStyle1}`} onClick={() => toggleExpand("section3")}
                    >
                    {expandStates.section3 ? (
                          <RemoveIcon
                            sx={{
                              fontSize: 20,
                              color: "#94979A",
                              cursor: "pointer",
                            }}
                          />
                        ) : (
                          <AddIcon
                            sx={{
                              fontSize: 20,
                              color: "#94979A",
                              cursor: "pointer",
                            }}
                          />
                        )}
                    </div>
                  </div>
                </div>
                {expandStates.section3 && (
                  <>
                  <div className={`${style.marginBottom20} ${style.referenceCardStyle}`}>
              
                    <div className={`${style.gridGap}`}>
                      <div className={`${style.greenDotStyle} ${style.buttonCenter}`}></div>
                       <div>
                         <div className={`${style.sideHeadingFontStyle}`}>Immunization History</div>
                         <div className={`${style.sideHeadingRefFrontStyle}`}>Approved By Safety & Wellness On Oct 11, 2024</div>
                       </div>
                    </div>
                  </div>
                  </>
                  )}
              </div>
              <div className={style.marginBottom20}></div>
            </div>
            </>
            )}
           </>
              </>
            ) : null
            }
             {selectedTab === 'level-4' ? (
                      <>
                        <div className={`${style.cardLeftStyle2}`}>
                          <div className={`${style.displayInRow}${style.marginTop20}`}>
                            <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20}`}>
                              <span className={`${style.tableHeaderHeadingTextStyle}`}>MAC Meeting Date*</span>
                            </div>
                            <CommonDateField
                              className={style.dateWidth}
                              onChange={(date) => handleDateChange(date, 'MAC')}
                              open={calendarStart}
                              onOpen={() => setCalendarStart(true)}
                              onClose={() => setCalendarStart(false)}
                              minDate={sub(new Date(), { years: 3 })}
                              maxDate={new Date()}
                              value={selectedDateForMac}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  inputProps={{
                                    ...params.inputProps,
                                    placeholder: 'Start Date',
                                  }}
                                  variant="outlined"
                                  margin="normal"
                                  fullWidth
                                />
                              )}
                            />
                          </div>
                          <div className={style.marginBottom20}></div>
                          <>
                            <div className={`${style.buttonCardStyle2} ${style.cursorPointer}`}>
                              <div className={`${style.buttonTextStyle} ${style.alignCenter}`}>REJECT</div>
                            </div>
                            <div
                              className={`${style.bigButtonStyle2} ${style.cursorPointer}`}
                              style={{ opacity: isButtonDisabled ? 0.5 : 1 }}
                              onClick={isButtonDisabled ? undefined : onClickApproveFunction}
                            >
                              <div className={`${style.bigButtonTextStyle} ${style.alignCenter} ${style.marginTop20} ${style.marginBottom20}`}>
                                MAC APPROVED
                              </div>
                            </div>
                          </>
                          {userRole?.includes('Chief Of Staff') && (
                            <div className={`${style.bigButtonStyle2} ${style.cursorPointer}`}>
                              <div className={`${style.bigButtonTextStyle} ${style.alignCenter} ${style.marginTop20} ${style.marginBottom20}`}>
                               OVERRIDE FOR TEMPORARY PRIVILEGES
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    ) :  selectedTab === 'level-5' ? (
                                <>
                                    <div className={`${style.cardLeftStyle2}`}>
                                    <div className={`${style.displayInCol}`}>
                                      <div
                                        className={`${style.spaceBetween} ${style.marginLeftRight20}`}
                                      >
                                        <span className={`${style.tableHeaderHeadingTextStyle} ${style.marginTop20}`}>
                                        BOD Approval Date
                                        </span>
                                      </div>
                                      <CommonDateField
                                            className={style.dateWidth}
                                            onChange={(date) => handleDateChange(date, 'BOD')}
                                            open={calendarStart}
                                            onOpen={() => setCalendarStart(true)}
                                            onClose={() => setCalendarStart(false)}
                                          
                                            minDate={sub(new Date(), { years: 3 })}
                                            maxDate={new Date()}
                                            value={selectedDateForBod}
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                inputProps={{
                                                  ...params.inputProps,
                                                  placeholder: 'Start Date',
                                                }}
                                                variant="outlined"
                                                margin="normal"
                                                fullWidth
                                              />
                                            )}
                                          />
                                    </div>
                                    <div className={style.marginBottom20}></div>
                                    <div className={`${style.displayInRow}${style.marginTop20}`}>
                                      <div
                                        className={`${style.spaceBetween} ${style.marginLeftRight20}`}
                                      >
                                        <span className={`${style.tableHeaderHeadingTextStyle}`}>
                                        Reappointment Credentialing Application Creation Date
                                        </span>
                                      </div>
                                      <CommonDateField
                                            className={style.dateWidth}
                                            onChange={(date) => handleDateChange(date, 'Reappoint')}
                                            open={calendarStart}
                                            onOpen={() => setCalendarStart(true)}
                                            onClose={() => setCalendarStart(false)}
                                          
                                            minDate={sub(new Date(), { years: 3 })}
                                            maxDate={new Date()}
                                            value={selectedDateForReappoint}
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                inputProps={{
                                                  ...params.inputProps,
                                                  placeholder: 'Start Date',
                                                }}
                                                variant="outlined"
                                                margin="normal"
                                                fullWidth
                                              />
                                            )}
                                          />
                                    </div>
                                    <div
                                        className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}
                                      >
                                        <span className={`${style.tableHeaderHeadingTextStyle}`}>
                                        Upload Privilege request Approval from BOD
                                        </span>
                                      </div>
                                      <div className={`${style.twoColFile} ${style.marginTop} ${style.cursorPointer}`}>
                                  
                                            <>
                          
                                  <Dropzone
                                      style={dropzoneStyle}
                                      onDrop={(acceptedFiles) => changeHandler(acceptedFiles)}
                                      accept={{
                                          'image/jpeg': [],
                                          'image/png': [],
                                          'image/jpg': [],
                                          'application/pdf': []
                                      }}
                                  >
                                      {({ getRootProps, getInputProps }) => (
                                          <section>
                                              <div {...getRootProps()}>
                                                  <input {...getInputProps()} />
                                                  <div className={style.uploadBorderStyle}>
                                                      <p className={style.uploadTextStyle}>
                                                          Upload Your Documents
                                                      </p>
                                                      <p className={style.uploadDescriptionText}>
                                                          Upload your files or drag & drop from your file cabinet (Computer / Online Drive)
                                                      </p>
                                                  </div>
                                              </div>
                                          </section>
                                      )}
                                  </Dropzone>


                                  <Dropzone
                                      style={dropzoneStyle}
                                      onDrop={(acceptedFiles) => changeHandler(acceptedFiles)}
                                      accept="image/*"
                                  >
                                      {({ getRootProps, getInputProps }) => (
                                          <section>
                                              <div {...getRootProps()}>
                                                  <input {...getInputProps()} />
                                                  <div className={style.uploadBorderStyle}>
                                                      <p className={style.uploadTextStyle}>
                                                          Upload A Photo
                                                      </p>
                                                      <p className={style.uploadDescriptionText}>
                                                          Click a picture of the document with your camera and Upload or Upload from your photo gallery.
                                                      </p>
                                                  </div>
                                              </div>
                                          </section>
                                      )}
                                  </Dropzone>
                              </>

                                  </div>
                                  <div className={`${style.displayInRow} ${style.referenceCardStyle} ${style.alignItem}  ${style.marginTop10}`}>
                                    <DescriptionIcon className={`${style.docsIcon}`}/>
                                      {files.length > 0 ? (
                                          files.map((file, index) => (
                                              <div key={index} className= {`${style.marginLeft20}`}>{file.name}</div>
                                          ))
                                      ) : (
                                          <div className= {`${style.marginLeft20}`}>No documents uploaded</div>
                                      )}
                                  </div>
                                    <>
                                    {taskCount > 0 ? (
                                      <>
                                      <div className={`${style.displayInRow} ${style.alignContent} ${style.marginTop10}`}>
                                        <WarningIcon className={style.warning} />
                                        <div className= {`${style.marginLeft20} ${style.alignItem}`}>ChecklistList Item Pending Completion <span className={style.checkListitem}> {taskCount} items </span></div>
                                        </div>
                                
                                        </>
                                      ) : (
                                        <>
                                        <div className={`${style.displayInRow} ${style.alignContent} ${style.marginTop10}`}>
                                        <TaskAltIcon className={style.correcticon} />
                                        <div className= {`${style.marginLeft20} ${style.alignItem}`}>All checklist items are completed</div>
                                        </div>
                                        </>
                                      )}
                                    <div
                                        className={`${style.bigButtonStyle2} ${style.cursorPointer}`}
                                      >
                                        <div
                                          className={`${style.bigButtonTextStyle} ${style.alignCenter} ${style.marginTop20} ${style.marginBottom20} ${style.paddingButton}`}
                                          onClick={onClickCheckListFunction}
                                        >
                                          SAVE & VIEW CHECKLIST
                                        </div>
                                        <div className={`${style.marginTop20} ${style.marginBottom20}`}></div>
                                        </div>
                                        <div
                                      className={`${style.buttonCardStyle2} ${style.cursorPointer} ${style.marginTop20} ${style.paddingButton}`}
                                      >
                                        <div
                                          className={`${style.buttonTextStyle} ${style.alignCenter}`}
                                  
                                        >
                                          REJECT
                                        </div>
                                        </div>
                                        <div
                                      >
                                      {/* <div
                                        className={`${allTasksCompleted  ? style.bigButtonGreyStyle2 : style.bigButtonStyle2} ${style.cursorPointer}`}
                                      > */}
                                        <div
                                        className={` ${style.bigButtonStyle2} ${style.cursorPointer}`}
                                      >
                                        <div
                                          className={`${style.bigButtonTextStyle} ${style.alignCenter} ${style.marginTop20} ${style.marginBottom20}`}
                                          //  onClick={allTasksCompleted ? handleApplicationAccept : null}
                                          onClick={onClickApproveFunction}
                                        >
                                          BOD APPROVED
                                        </div>
                                        </div>
                                        <div className={style.marginBottom20}></div>
                                        </div>
                                        </> 
                                        {userRole?.includes('Chief Of Staff') && (
                                          <div className={`${style.bigButtonStyle2} ${style.cursorPointer}`}>
                                            <div className={`${style.bigButtonTextStyle} ${style.alignCenter} ${style.marginTop20} ${style.marginBottom20}`}>
                                            OVERRIDE FOR TEMPORARY PRIVILEGES
                                            </div>
                                          </div>
                                        )}
                                    </div>
                                    </>
                    ): " "}
          </div>  
        </div>
        <div className={style.marginTop50}></div>
        {showApplicationDeclineDialog && (
          <ApplicationDecline
            getApplicationDeclineDialog={getApplicationDeclineDialog}
          />
        )}
        {showDocVerifyDialog && (
          <Dialog
            isOpen={showDocVerifyDialog}
            onClose={() => setShowDocVerifyDialog(false)}
            className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
            canOutsideClickClose={false}
            canEscapeKeyClose={false}
          >
            <div>
              <div className={Classes.DIALOG_BODY}>
                <div className={style.spaceBetween}>
                  <div
                    className={style.heading}
                  >{`${form?.basicDetails?.applicant?.name?.firstName} ${form?.basicDetails?.applicant?.name?.lastName} ${file?.fileName} Preview`}</div>
                  <div className={style.displayInRow}>
                    {file?.isVerified !== undefined && file?.isVerified ? (
                      <div
                        className={`${style.greenButton} ${style.cursorPointer} `}
                      >
                        <div
                          className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                        >
                          Verified
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`${style.purpleButton} ${style.cursorPointer}`}
                      >
                        <div
                          className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                          onClick={() => {
                            handleDocVerify(selectedRow?.rowId);
                            setShowDocVerifyDialog(false);
                          }}
                        >
                          Verify
                        </div>
                      </div>
                    )}
                    <img
                      src={CrossPink}
                      alt="cross"
                      className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft20} `}
                      onClick={() => {
                        setShowDocVerifyDialog(false);
                      }}
                    />
                  </div>
                </div>
                <div className={style.marginTop20}>
                  <iframe
                    src={file?.fileURL}
                    width="100%"
                    height="600px"
                  ></iframe>
                </div>
                <div
                  className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}
                >
                  <div
                    className={`${style.continue} ${style.marginLeft}`}
                    onClick={() => {
                      setShowDocVerifyDialog(false);
                    }}
                  >
                    CLOSE
                  </div>
                </div>
              </div>
            </div>
          </Dialog>
        )}
      </div>
    </>
  );
};
export default NewActiveApplication;