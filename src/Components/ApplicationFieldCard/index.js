// main applicationFieldCard

import React, { useEffect, useState, useRef } from "react";
import CommonPhoneField from "../../Components/CommonFields/CommonPhoneField";
import CommonInputField from "../CommonFields/CommonInputField";
import CommonSelectField from "../CommonFields/CommonSelectField";
import CommonMultiSelectField from "../CommonFields/CommonMultiSelectField";
import CommonDateField from "../CommonFields/CommonDateField";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import { TextField, Tooltip } from "@mui/material";
import { add, format, isValid, parse, parseISO, sub } from "date-fns";
import { fileLoadingURL, FormatPhoneNumber, FormatPostalCode } from "../../utils/formatting";
import CommonRadio from "../CommonFields/CommonRadio";
import CommonSwitch from "../CommonFields/CommonSwitch";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CheckIcon from "@mui/icons-material/Check";
import VerifiedImage from "../../images/verifiedImage.png";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import ToBeVerifiedImage from "../../images/toBeVerifiedImage.png";
import NotVerifiedImage from "../../images/notVerifiedImage.png";
import DeleteIcon from "../../images/deleteHcRow.png";
import style from "./index.module.scss";
import CommonCheckBox from "../CommonFields/CommonCheckBox";
import { TextArea } from "@blueprintjs/core";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CommonDivider from "../CommonFields/CommonDivider";
import { POST, GET, PUT } from "../../Screens/dataSaver";
import DatalistInput, { useComboboxControls } from "react-datalist-input";
import "react-datalist-input/dist/styles.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import TableTwo from "../TableDesignTwo";
import CommonDropZone from "../CommonFields/CommonDropZone";
import CommonTextField from "../CommonFields/CommonTextField";
import CommonLabel from "../CommonFields/CommonLabel";
import { useParams } from "react-router-dom";
import axios from "axios";
import ValidationDialog from "../validationDialog";
import FileDisplayDialog from "../fileDisplayDialog";
import PriorDataDialog from "../PriorDataDialog"
import DeleteConfirmation from "../DeleteConfirmation";


const TEXTFIELDLEN50 = 50;

const ApplicationFieldCard = ({
  object,
  gridStyle,
  baseKey,
  basicForm,
  setBasicForm,
  showAdd,
  addMoreType,
  addMoreOpenBydefault,
  collapsableQuestionCard,
  isBasicPath,
  stepPath,
  formId,
  priorData,
  getIsSubmitClicked,
  applicationId,
  tableGrid,
  setIsEdited,
  heading,
  subHeading,
  subHeading2,
  getAllPath,
  isPOD,
  getAllLabels,
  warningFields,
  refsMap,
  getMissingFields,
  showValidationDialog,
  setShowValidationDialog,
  isAddMore,
  setIsAddMore,
  formSchema,
  isReappointment,
  dataChangedObject,
  isChanged,
  setIsChanged,
  isView,
  setIsView,
  isEdited,
  yesOrNoDemographic,
  setYesOrNoDemographic,
  formPermission,
  refGridStyle,
  hideBackground,
  customRadioStyle,
  referenceRadioShowLabel,
  alternateReferenceRadioColor
}) => {
  const [calendarStart, setCalendarStart] = useState(false);
  const { section, step } = useParams();
  const [formIndex, setFormIndex] = useState();
  // const [isAddMore, setIsAddMore] = useState(
  //     addMoreOpenBydefault ? true : false
  // );
  const [showPriorDataDialog, setShowPriorDataDialog] = useState(false);
  const [isCollapsableCard, setIsCollapsableCard] = useState(true);
  const [showFileDisplayDialog, setShowFileDisplayDialog] = useState(false);
  const [selectedFile, setselectedFile] = useState(false);
  const basicpath = isBasicPath ? "basicDetails" : stepPath;
  const [isTableEdit, setIsTableEdit] = useState(false);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [disclosureBaseKey, setDisclosureBaseKey] = useState('');
  const [disclosureFieldKey, setDisclosureFieldKey] = useState('');
  const [disclosurSchema, setDisclosureSchema] = useState({});
  const [isMasked, setIsMasked] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const toDelete = useRef(null);;
  const { setValue, value } = useComboboxControls({ initialValue: "" });
  const canadaData = JSON.parse(sessionStorage.getItem("canadaData")) || {};
  let user = JSON.parse(sessionStorage.getItem("user"));
  const hometimeoutRef = useRef(null);
  const mailingTimeoutRef = useRef(null);
  const businessTimeoutRef = useRef(null);
  const addMoreRef = useRef(null);

  const referenceRadioColor = {
    'OUTSTANDING': '#14B15A',
    'SATISFACTORY': '#FEC106',
    'UNSATISFACTORY': '#F94848',
    'UNABLE TO ASSESS': '#14358F',
    'No Knowledge': '#14358F',
    'Yes': '#F94848',
    'No': '#14B15A'
  }

  console.log(user);
  useEffect(() => {
    renderObjectFields(object);
    console.log("entered");
  }, [basicForm, isAddMore]);

  useEffect(() => {
    if (step !== undefined && basicForm !== undefined) {
      setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === atob(step)))
    }
  }, [step])

  const getShowDeleteConfirmation = (value) => {
    setShowDeleteConfirmation(value)
  }

  const getDeleteConfirmation = () => {
    handleDelete(toDelete.current)
  }

  const getValueByPath = (obj, path) => {
    const keys = path.split(/[\.\[\]]+/).filter(Boolean);
    return keys.reduce(
      (acc, key) => acc && acc[isNaN(key) ? key : Number(key)],
      basicForm
    );
  };

  let temp = [];

  // const setNestedValue = (obj, path, value) => {
  //     console.log(obj, path, value, 'Test')
  //     const keys = path.split('.');
  //     let current = obj;
  //     console.log(current)
  //     for (let i = 0; i < keys.length - 1; i++) {
  //         if (!current[keys[i]]) current[keys[i]] = {};
  //         current = current[keys[i]];
  //     }

  //     current[keys[keys.length - 1]] = value;
  // };

  const isFileObject = (value) => {
    if (value instanceof File) {
      return true;
    }

    if (Array.isArray(value)) {
      return value.every((item) => item instanceof File);
    }

    return false;
  };

  const changeHandler = async (event) => {
    console.log(event);
    setFiles(event);
    const formData = new FormData();
    let fileNameArray = [];
    event?.forEach((file) => {
      fileNameArray.push({ fileName: file?.name });
      formData.append("documents", file); // Append each file individually
    });

    formData.append(
      "files",
      new Blob([JSON.stringify(fileNameArray)], {
        type: "application/json",
      })
    );
    console.log(fileNameArray);
    try {
      const response = await POST(
        `application-management-service/application/${applicationId}/files/bulk?isLLMRequired=${formSchema?.requiredDocuments?.length !== 0 ? true : false
        }&schemaId=${formSchema?.id}`,
        formData
      );
      for (let triggerIndex = 0; triggerIndex < event.length; triggerIndex++) {
        try {
          if (
            response?.data[triggerIndex]?.documentType !== null &&
            formSchema?.requiredDocuments?.length !== 0
          ) {
            await PUT(
              `application-management-service/application/${applicationId}/form/updateData?documentType=${response?.data[triggerIndex]?.documentType?.name}&applicationDocumentId=${response?.data[triggerIndex]?.id}`,
              {
                documentType:
                  response?.data[triggerIndex]?.documentType !== null
                    ? response?.data[triggerIndex]?.documentType?.name
                    : "",
                fileSize: `${(
                  event[triggerIndex]?.size /
                  (1024 * 1024)
                ).toFixed(2)} Mb`,
                fileURL: response?.data[triggerIndex]?.file?.fileURL,
                fileType: response?.data[triggerIndex]?.file?.fileType,
                fileUploaded: event[triggerIndex]?.name,
                requirement:
                  response?.data[triggerIndex]?.documentType !== null
                    ? basicForm?.documentsRequired?.filter(
                      (data) =>
                        data?.document?.name ===
                        response?.data[triggerIndex]?.documentType?.name
                    )?.[0]?.required
                      ? "Required"
                      : "Recommended"
                    : "",
                valid: response?.data[triggerIndex]?.valid,
                verified: response?.data[triggerIndex]?.verified,
                rowId: response?.data[triggerIndex]?.id
              }
            );
          }
          console.log(response);
        } catch (error) {
          console.log(error);
        }
      }
      console.log(response, "response");
      if (response?.data) {
        SuccessToaster("File Uploaded Successfully");
      } else {
        ErrorToaster("File Upload Failed");
      }
      return response?.data;
    } catch (error) {
      ErrorToaster("File Upload Failed");
      console.error(error, "response");
      return null;
    }
  };

  const setNestedValue = async (obj, path, value) => {
    console.log(obj, path, value, "Test");

    // Split the path into keys, handling both dot and bracket notation
    const keys = path.split(/[\.\[\]]+/).filter(Boolean);

    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      // Convert to a number if the key is an integer, to handle array indices correctly
      const key = isNaN(keys[i]) ? keys[i] : Number(keys[i]);

      if (!current[key]) {
        // Check if the next key is a number to decide whether to create an array or an object
        current[key] = isNaN(keys[i + 1]) ? {} : [];
      }
      current = current[key];
    }

    const lastKey = isNaN(keys[keys.length - 1])
      ? keys[keys.length - 1]
      : Number(keys[keys.length - 1]);
    console.log(value);
    if (isFileObject(value)) {
      setIsLoading(true);
      let file;
      if (Array.isArray(value)) {
        file = await changeHandler(value);
      } else {
        file = await addNewDocument(value);
      }
      current[lastKey] = file?.file;
      current['rowId'] = file?.id;
      console.log(file, 'file', lastKey, current, basicForm);
      setIsLoading(false);
    } else {
      current[lastKey] = value;
    }
  };

  console.log(basicForm, "Test");

  const handleChange = (path, value, basePath, basePath2, basePath3) => {
    console.log(path, value, basePath, baseKey, "Check");
    if (stepPath !== undefined || isReappointment) {
      setIsEdited(true);
    }
    setBasicForm((prevData) => {
      const newData = { ...prevData };
      if (basePath3 && basePath2 && basePath && path) {
        setNestedValue(
          newData,
          `${basePath}.${basePath2}.${basePath3}.${path}`,
          value
        );
        setNestedValue(newData, `${basicpath}.${basePath}.${path}`, value);
      } else if (basePath2 && basePath && path) {
        setNestedValue(newData, `${basePath}.${basePath2}.${path}`, value);
        setNestedValue(newData, `${basicpath}.${basePath}.${path}`, value);
      } else if (basePath && path) {
        setNestedValue(newData, `${basePath}.${path}`, value);
        setNestedValue(newData, `${basicpath}.${basePath}.${path}`, value);
      } else if (path) {
        setNestedValue(newData, `${path}`, value);
        setNestedValue(newData, `${basicpath}.${path}`, value);
      } else {
        setNestedValue(newData, baseKey, value);
        setNestedValue(newData, `${basicpath}.${baseKey}`, value);
      }
      // **New Logic to Reset Address Fields**
      if (path === "isMailingAddressSameAsHomeAddress") {
        if (value === "Different Address") {
          setNestedValue(newData, `forms[${addressPageIndex}].data.contactAddress2.mailingAddress`, {
            pinCode: "",
            streetName: "",
            city: "",
            province: "",
          });
        }
      }

      // Business Address Logic
      if (path === "isBusinessAddressSameAsHomeAddressOrMailingAddress") {
        if (value === "Different Address") {
          setNestedValue(newData, `forms[${addressPageIndex}].data.contactAddress3.business.businessAddress`, {
            pinCode: "",
            streetName: "",
            city: "",
            province: "",
          });
        }
      }


      return newData;
    });
  };

  const getSpecialityValues = (obj) => {
    let temp = obj?.dependencies?.department?.oneOf?.filter(
      (data) =>
        data?.properties?.department?.enum[0] ===
        getValueByPath(basicForm, "basicDetails.departmentSpecialty.department")
    )[0];
    return temp?.properties?.specialty?.enum || [];
  };

  // const handleChange = (path, value, basePath, basePath2, basePath3) => {
  //     console.log(basePath, basePath2, basePath3, path, value)
  //     setBasicForm((prevData) => {
  //         const newData = { ...prevData };
  //         const fullPath = basePath;
  //         const basicPath = `basicDetails.${fullPath}`;

  //         setNestedValue(newData, fullPath, value);
  //         setNestedValue(newData, basicPath, value);

  //         return newData;
  //     });
  // };

  // const setNestedValue = (obj, path, value) => {
  //     const keys = path.split('.');
  //     let current = obj;
  //     for (let i = 0; i < keys.length - 1; i++) {
  //         if (typeof current[keys[i]] !== 'object' || current[keys[i]] === null) {
  //             current[keys[i]] = {};
  //         }
  //         current = current[keys[i]];
  //     }
  //     current[keys[keys.length - 1]] = value;
  // };

  const getAllThenStrings = (obj) => {
    let result = [];

    // Recursive function to traverse the object
    const traverse = (node) => {
      if (!node || typeof node !== "object") return;

      // Check if the current node has a `then` block
      if (node.then) {
        // If `then` contains a `required` array, collect the strings
        if (Array.isArray(node.then.required)) {
          node.then.required?.map((data) => {
            result.push({
              key: Object.keys(node.if.properties)?.[0],
              value: data,
              checkValue:
                node.if.properties[Object.keys(node.if.properties)]?.const,
            });
          });
        }
      }

      // Recursively check each property in the object
      for (let key in node) {
        if (node.hasOwnProperty(key)) {
          traverse(node[key]);
        }
      }
    };
    traverse(obj);
    return result;
  };

  let addressPageIndex = basicForm?.forms?.findIndex((data) =>
    basicForm?.creationType === "REAPPOINTMENT"
      ? data?.schemaCategory === "DemographicData"
      : data?.schemaCategory === "ContactAddress"
  );

  let isMailingAddressSameAsHomeAddress = getValueByPath(
    basicForm,
    `forms[${addressPageIndex}].data.contactAddress2.isMailingAddressSameAsHomeAddress`
  );
  let isBusinessAddressSameAsHomeAddressOrMailingAddress = getValueByPath(
    basicForm,
    `forms[${addressPageIndex}].data.contactAddress3.isBusinessAddressSameAsHomeAddressOrMailingAddress`
  );
  let isHomeAddressPincodeEntered = getValueByPath(
    basicForm,
    `forms[${addressPageIndex}].data.contactAddress1.homeAddress.pinCode`
  );
  let isMailingAddressPincodeEntered = getValueByPath(
    basicForm,
    `forms[${addressPageIndex}].data.contactAddress2.mailingAddress.pinCode`
  );
  let isBusinessAddressPincodeEntered = getValueByPath(
    basicForm,
    `forms[${addressPageIndex}].data.contactAddress3.business.businessAddress.pinCode`
  );
  let registeredBusinessAddress = getValueByPath(
    basicForm,
    `forms[${addressPageIndex}].data.contactAddress3.registeredBusinessAddress`
  );
  let department = getValueByPath(
    basicForm,
    `basicDetails.departmentSpecialty.department`
  );
  console.log(
    isMailingAddressSameAsHomeAddress,
    isBusinessAddressSameAsHomeAddressOrMailingAddress
  );
  // useEffect(() => {
  //   if (
  //     isMailingAddressSameAsHomeAddress !== undefined &&
  //     isMailingAddressSameAsHomeAddress !== null &&
  //     !isPOD &&
  //     (baseKey?.split(".")[0] === "contactAddress1" ||
  //       baseKey?.split(".")[0] === "contactAddress2" ||
  //       baseKey?.split(".")[0] === "contactAddress3")
  //   ) {
  //     setBasicForm((prevData) => {
  //       let tempBasicForm = { ...prevData };
  //       if (
  //         tempBasicForm?.forms[addressPageIndex]?.data?.contactAddress2
  //           ?.mailingAddress === undefined
  //       ) {
  //         tempBasicForm.forms[
  //           addressPageIndex
  //         ].data.contactAddress2.mailingAddress = {};
  //       }
  //       tempBasicForm.contactAddress2 = { mailingAddress: {} };
  //       if (isMailingAddressSameAsHomeAddress) {
  //         tempBasicForm.forms[
  //           addressPageIndex
  //         ].data.contactAddress2.mailingAddress.streetName =
  //           tempBasicForm?.forms[addressPageIndex]?.data?.contactAddress1
  //             ?.homeAddress?.streetName !== undefined
  //             ? tempBasicForm?.forms[addressPageIndex]?.data?.contactAddress1
  //               ?.homeAddress?.streetName
  //             : "";
  //         tempBasicForm.forms[
  //           addressPageIndex
  //         ].data.contactAddress2.mailingAddress.pinCode =
  //           tempBasicForm?.forms[addressPageIndex]?.data?.contactAddress1
  //             ?.homeAddress?.pinCode !== undefined
  //             ? tempBasicForm?.forms[addressPageIndex]?.data?.contactAddress1
  //               ?.homeAddress?.pinCode
  //             : "";
  //         tempBasicForm.forms[
  //           addressPageIndex
  //         ].data.contactAddress2.mailingAddress.city =
  //           tempBasicForm?.forms[addressPageIndex]?.data?.contactAddress1
  //             ?.homeAddress?.city !== undefined
  //             ? tempBasicForm?.forms[addressPageIndex]?.data?.contactAddress1
  //               ?.homeAddress?.city
  //             : "";
  //         tempBasicForm.forms[
  //           addressPageIndex
  //         ].data.contactAddress2.mailingAddress.province =
  //           tempBasicForm?.forms[addressPageIndex]?.data?.contactAddress1
  //             ?.homeAddress?.province !== undefined
  //             ? tempBasicForm?.forms[addressPageIndex]?.data?.contactAddress1
  //               ?.homeAddress?.province
  //             : "";
  //       } else {
  //         tempBasicForm.forms[
  //           addressPageIndex
  //         ].data.contactAddress2.mailingAddress.streetName = "";
  //         tempBasicForm.forms[
  //           addressPageIndex
  //         ].data.contactAddress2.mailingAddress.pinCode = "";
  //         tempBasicForm.forms[
  //           addressPageIndex
  //         ].data.contactAddress2.mailingAddress.city = "";
  //         tempBasicForm.forms[
  //           addressPageIndex
  //         ].data.contactAddress2.mailingAddress.province = "";
  //       }
  //       tempBasicForm.contactAddress2.mailingAddress =
  //         tempBasicForm.forms[
  //           addressPageIndex
  //         ].data.contactAddress2.mailingAddress;
  //       return tempBasicForm;
  //     });
  //   }
  // }, [isMailingAddressSameAsHomeAddress]);

  // useEffect(() => {
  //   if (
  //     isMailingAddressSameAsHomeAddress !== undefined &&
  //     isMailingAddressSameAsHomeAddress !== null &&
  //     !isPOD &&
  //     (baseKey?.split(".")[0] === "contactAddress1" ||
  //       baseKey?.split(".")[0] === "contactAddress2" ||
  //       baseKey?.split(".")[0] === "contactAddress3")
  //   ) {
  //     console.log("isMailingAddress:", isMailingAddressSameAsHomeAddress);
  //     setBasicForm((prevData) => {
  //       let tempContactAddress2 = { ...prevData };
  //       if (
  //         tempContactAddress2?.forms[addressPageIndex]?.data?.contactAddress2
  //           ?.mailingAddress === undefined
  //       ) {
  //         tempContactAddress2.forms[
  //           addressPageIndex
  //         ].data.contactAddress2.mailingAddress = {};
  //       }

  //       if (
  //         isMailingAddressSameAsHomeAddress ===
  //         "Same as Home Address"
  //       ) {
  //         tempContactAddress2.contactAddress2 = { mailingAddress: {} };
  //         tempContactAddress2.forms[
  //           addressPageIndex
  //         ].data.contactAddress2.mailingAddress.streetName =
  //           tempContactAddress2?.forms[addressPageIndex]?.data?.contactAddress1
  //             ?.homeAddress?.streetName !== undefined
  //             ? tempContactAddress2?.forms[addressPageIndex]?.data?.contactAddress1
  //               ?.homeAddress?.streetName
  //             : ""
  //         tempContactAddress2.forms[
  //           addressPageIndex
  //         ].data.contactAddress2.mailingAddress.pinCode =
  //           tempContactAddress2?.forms[addressPageIndex]?.data?.contactAddress1
  //             ?.homeAddress?.pinCode !== undefined
  //             ? tempContactAddress2?.forms[addressPageIndex]?.data?.contactAddress1
  //               ?.homeAddress?.pinCode
  //             : "";
  //         tempContactAddress2.forms[
  //           addressPageIndex
  //         ].data.contactAddress2.mailingAddress.city =
  //           tempContactAddress2?.forms[addressPageIndex]?.data?.contactAddress1
  //             ?.homeAddress?.city !== undefined
  //             ? tempContactAddress2?.forms[addressPageIndex]?.data?.contactAddress1
  //               ?.homeAddress?.city
  //             : "";
  //         tempContactAddress2.forms[
  //           addressPageIndex
  //         ].data.contactAddress2.mailingAddress.province =
  //           tempContactAddress2?.forms[addressPageIndex]?.data?.contactAddress1
  //             ?.homeAddress?.province !== undefined
  //             ? tempContactAddress2?.forms[addressPageIndex]?.data?.contactAddress1
  //               ?.homeAddress?.province
  //             : "";
  //         tempContactAddress2.contactAddress2 = {
  //           mailingAddress:
  //             tempContactAddress2.forms[addressPageIndex].data.contactAddress2
  //               .mailingAddress,
  //         };
  //       } else if (
  //         isMailingAddressSameAsHomeAddress ===
  //         "Same as Business Address"
  //       ) {
  //         tempContactAddress2.contactAddress2 = { mailingAddress: {} };
  //         tempContactAddress2.forms[
  //           addressPageIndex
  //         ].data.contactAddress2.mailingAddress.streetName =
  //           tempContactAddress2?.forms[addressPageIndex]?.data.contactAddress3
  //             ?.business?.businessAddress?.streetName !== undefined
  //             ? tempContactAddress2?.forms[addressPageIndex]?.data.contactAddress3
  //               ?.business?.businessAddress?.streetName
  //             : "";
  //         tempContactAddress2.forms[
  //           addressPageIndex
  //         ].data.contactAddress2.mailingAddress.pinCode =
  //           tempContactAddress2?.forms[addressPageIndex]?.data.contactAddress3
  //             ?.business?.businessAddress?.pinCode !== undefined
  //             ? tempContactAddress2?.forms[addressPageIndex]?.data.contactAddress3
  //               ?.business?.businessAddress?.pinCode
  //             : "";
  //         tempContactAddress2.forms[
  //           addressPageIndex
  //         ].data.contactAddress2.mailingAddress.city =
  //           tempContactAddress2?.forms[addressPageIndex]?.data.contactAddress3
  //             ?.business?.businessAddress?.city !== undefined
  //             ? tempContactAddress2?.forms[addressPageIndex]?.data.contactAddress3
  //               ?.business?.businessAddress?.city
  //             : "";
  //         tempContactAddress2.forms[
  //           addressPageIndex
  //         ].data.contactAddress2.mailingAddress.province =
  //           tempContactAddress2?.forms[addressPageIndex]?.data.contactAddress3
  //             ?.business?.businessAddress?.province !== undefined
  //             ? tempContactAddress2?.forms[addressPageIndex]?.data.contactAddress3
  //               ?.business?.businessAddress?.province
  //             : "";
  //         tempContactAddress2.contactAddress2 = {

  //           mailingAddress:
  //             tempContactAddress2.forms[addressPageIndex].data.contactAddress2
  //               .mailingAddress,

  //         };
  //       } else {
  //         tempContactAddress2.contactAddress2 = {
  //           mailingAddress: {}
  //         };
  //         tempContactAddress2.forms[
  //           addressPageIndex
  //         ].data.contactAddress2.mailingAddress.streetName = "";
  //         tempContactAddress2.forms[
  //           addressPageIndex
  //         ].data.contactAddress2.mailingAddress.pinCode = "";
  //         tempContactAddress2.forms[
  //           addressPageIndex
  //         ].data.contactAddress2.mailingAddress.city = "";
  //         tempContactAddress2.forms[
  //           addressPageIndex
  //         ].data.contactAddress2.mailingAddress.province = "";
  //         tempContactAddress2.contactAddress2 = {

  //           mailingAddress:
  //             tempContactAddress2.forms[addressPageIndex].data.contactAddress3
  //               .mailingAddress,

  //         };
  //       }
  //       return tempContactAddress2;
  //     });
  //   }
  // }, [isMailingAddressSameAsHomeAddress]);

  // useEffect(() => {
  //   if (
  //     isBusinessAddressSameAsHomeAddressOrMailingAddress !== undefined &&
  //     isBusinessAddressSameAsHomeAddressOrMailingAddress !== null &&
  //     !isPOD &&
  //     (baseKey?.split(".")[0] === "contactAddress1" ||
  //       baseKey?.split(".")[0] === "contactAddress2" ||
  //       baseKey?.split(".")[0] === "contactAddress3")
  //   ) {
  //     setBasicForm((prevData) => {
  //       let tempContactAddress3 = { ...prevData };
  //       if (
  //         tempContactAddress3?.forms[addressPageIndex]?.data?.contactAddress3
  //           ?.business === undefined
  //       ) {
  //         tempContactAddress3.forms[
  //           addressPageIndex
  //         ].data.contactAddress3.business = {};
  //       }
  //       if (
  //         tempContactAddress3?.forms[addressPageIndex]?.data?.contactAddress3
  //           ?.business?.businessAddress === undefined
  //       ) {
  //         tempContactAddress3.forms[
  //           addressPageIndex
  //         ].data.contactAddress3.business.businessAddress = {};
  //       }
  //       if (
  //         isBusinessAddressSameAsHomeAddressOrMailingAddress ===
  //         "Same as Home Address"
  //       ) {
  //         tempContactAddress3.contactAddress3 = {
  //           business: { businessAddress: {} },
  //         };
  //         tempContactAddress3.forms[
  //           addressPageIndex
  //         ].data.contactAddress3.business.businessAddress.streetName =
  //           tempContactAddress3?.forms[addressPageIndex]?.data?.contactAddress1
  //             ?.homeAddress?.streetName !== undefined
  //             ? tempContactAddress3?.forms[addressPageIndex]?.data
  //               ?.contactAddress1?.homeAddress?.streetName
  //             : "";
  //         tempContactAddress3.forms[
  //           addressPageIndex
  //         ].data.contactAddress3.business.businessAddress.pinCode =
  //           tempContactAddress3?.forms[addressPageIndex]?.data?.contactAddress1
  //             ?.homeAddress?.pinCode !== undefined
  //             ? tempContactAddress3?.forms[addressPageIndex]?.data
  //               ?.contactAddress1?.homeAddress?.pinCode
  //             : "";
  //         tempContactAddress3.forms[
  //           addressPageIndex
  //         ].data.contactAddress3.business.businessAddress.city =
  //           tempContactAddress3?.forms[addressPageIndex]?.data?.contactAddress1
  //             ?.homeAddress?.city !== undefined
  //             ? tempContactAddress3?.forms[addressPageIndex]?.data
  //               ?.contactAddress1?.homeAddress?.city
  //             : "";
  //         tempContactAddress3.forms[
  //           addressPageIndex
  //         ].data.contactAddress3.business.businessAddress.province =
  //           tempContactAddress3?.forms[addressPageIndex]?.data?.contactAddress1
  //             ?.homeAddress?.province !== undefined
  //             ? tempContactAddress3?.forms[addressPageIndex]?.data
  //               ?.contactAddress1?.homeAddress?.province
  //             : "";
  //         tempContactAddress3.contactAddress3 = {
  //           business: {
  //             businessAddress:
  //               tempContactAddress3.forms[addressPageIndex].data.contactAddress3
  //                 .business.businessAddress,
  //           },
  //         };
  //       } else if (
  //         isBusinessAddressSameAsHomeAddressOrMailingAddress ===
  //         "Same as Mailing Address"
  //       ) {
  //         tempContactAddress3.contactAddress3 = {
  //           business: { businessAddress: {} },
  //         };
  //         tempContactAddress3.forms[
  //           addressPageIndex
  //         ].data.contactAddress3.business.businessAddress.streetName =
  //           tempContactAddress3?.forms[addressPageIndex]?.data.contactAddress2
  //             ?.mailingAddress?.streetName !== undefined
  //             ? tempContactAddress3?.forms[addressPageIndex]?.data
  //               .contactAddress2?.mailingAddress?.streetName
  //             : "";
  //         tempContactAddress3.forms[
  //           addressPageIndex
  //         ].data.contactAddress3.business.businessAddress.pinCode =
  //           tempContactAddress3?.forms[addressPageIndex]?.data.contactAddress2
  //             ?.mailingAddress?.pinCode !== undefined
  //             ? tempContactAddress3?.forms[addressPageIndex]?.data
  //               .contactAddress2?.mailingAddress?.pinCode
  //             : "";
  //         tempContactAddress3.forms[
  //           addressPageIndex
  //         ].data.contactAddress3.business.businessAddress.city =
  //           tempContactAddress3?.forms[addressPageIndex]?.data.contactAddress2
  //             ?.mailingAddress?.city !== undefined
  //             ? tempContactAddress3?.forms[addressPageIndex]?.data
  //               .contactAddress2?.mailingAddress?.city
  //             : "";
  //         tempContactAddress3.forms[
  //           addressPageIndex
  //         ].data.contactAddress3.business.businessAddress.province =
  //           tempContactAddress3?.forms[addressPageIndex]?.data.contactAddress2
  //             ?.mailingAddress?.province !== undefined
  //             ? tempContactAddress3?.forms[addressPageIndex]?.data
  //               .contactAddress2?.mailingAddress?.province
  //             : "";
  //         tempContactAddress3.contactAddress3 = {
  //           business: {
  //             businessAddress:
  //               tempContactAddress3.forms[addressPageIndex].data.contactAddress3
  //                 .business.businessAddress,
  //           },
  //         };
  //       } else {
  //         tempContactAddress3.contactAddress3 = {
  //           business: { businessAddress: {} },
  //         };
  //         tempContactAddress3.forms[
  //           addressPageIndex
  //         ].data.contactAddress3.business.businessAddress.streetName = "";
  //         tempContactAddress3.forms[
  //           addressPageIndex
  //         ].data.contactAddress3.business.businessAddress.pinCode = "";
  //         tempContactAddress3.forms[
  //           addressPageIndex
  //         ].data.contactAddress3.business.businessAddress.city = "";
  //         tempContactAddress3.forms[
  //           addressPageIndex
  //         ].data.contactAddress3.business.businessAddress.province = "";
  //         tempContactAddress3.contactAddress3 = {
  //           business: {
  //             businessAddress:
  //               tempContactAddress3.forms[addressPageIndex].data.contactAddress3
  //                 .business.businessAddress,
  //           },
  //         };
  //       }
  //       return tempContactAddress3;
  //     });

  //   }
  // }, [isBusinessAddressSameAsHomeAddressOrMailingAddress]);


  useEffect(() => {
    if (
      isMailingAddressSameAsHomeAddress !== undefined &&
      isMailingAddressSameAsHomeAddress !== null &&
      !isPOD &&
      ["contactAddress1", "contactAddress2", "contactAddress3"].includes(baseKey?.split(".")[0])
    ) {
      setBasicForm((prevData) => {
        let tempData = { ...prevData };
        let formRef = tempData.forms[addressPageIndex].data;

        if (!formRef.contactAddress2) {
          formRef.contactAddress2 = { mailingAddress: {} };
        }
        if (!formRef.contactAddress2.mailingAddress) {
          formRef.contactAddress2.mailingAddress = {};
        }

        if (isMailingAddressSameAsHomeAddress === "Same as Home Address") {
          if (formRef.contactAddress1?.homeAddress) {
            formRef.contactAddress2.mailingAddress = {
              streetName: formRef.contactAddress1.homeAddress.streetName,
              pinCode: formRef.contactAddress1.homeAddress.pinCode,
              city: formRef.contactAddress1.homeAddress.city,
              province: formRef.contactAddress1.homeAddress.province,
            };
          }
        } else if (isMailingAddressSameAsHomeAddress === "Same as Business Address") {
          if (formRef.contactAddress3?.business?.businessAddress) {
            formRef.contactAddress2.mailingAddress = {
              streetName: formRef.contactAddress3.business.businessAddress.streetName,
              pinCode: formRef.contactAddress3.business.businessAddress.pinCode,
              city: formRef.contactAddress3.business.businessAddress.city,
              province: formRef.contactAddress3.business.businessAddress.province,
            };
          }
        }

        return tempData;
      });
    }
  }, [isMailingAddressSameAsHomeAddress]);

  useEffect(() => {
    if (
      isBusinessAddressSameAsHomeAddressOrMailingAddress !== undefined &&
      isBusinessAddressSameAsHomeAddressOrMailingAddress !== null &&
      !isPOD &&
      ["contactAddress1", "contactAddress2", "contactAddress3"].includes(baseKey?.split(".")[0])
    ) {
      setBasicForm((prevData) => {
        let tempData = { ...prevData };
        let formRef = tempData.forms[addressPageIndex].data;

        if (!formRef.contactAddress3) {
          formRef.contactAddress3 = { business: { businessAddress: {} } };
        }
        if (!formRef.contactAddress3.business) {
          formRef.contactAddress3.business = { businessAddress: {} };
        }
        if (!formRef.contactAddress3.business.businessAddress) {
          formRef.contactAddress3.business.businessAddress = {};
        }

        if (isBusinessAddressSameAsHomeAddressOrMailingAddress === "Same as Home Address") {
          if (formRef.contactAddress1?.homeAddress) {
            formRef.contactAddress3.business.businessAddress = {
              streetName: formRef.contactAddress1.homeAddress.streetName,
              pinCode: formRef.contactAddress1.homeAddress.pinCode,
              city: formRef.contactAddress1.homeAddress.city,
              province: formRef.contactAddress1.homeAddress.province,
            };
          }
        } else if (isBusinessAddressSameAsHomeAddressOrMailingAddress === "Same as Mailing Address") {
          if (formRef.contactAddress2?.mailingAddress) {
            formRef.contactAddress3.business.businessAddress = {
              streetName: formRef.contactAddress2.mailingAddress.streetName,
              pinCode: formRef.contactAddress2.mailingAddress.pinCode,
              city: formRef.contactAddress2.mailingAddress.city,
              province: formRef.contactAddress2.mailingAddress.province,
            };
          }
        }
        return tempData;
      });
    }
  }, [isBusinessAddressSameAsHomeAddressOrMailingAddress]);


  // const updateMailingAddress = (prevData) => {
  //   let tempData = { ...prevData };
  //   let formRef = tempData.forms[addressPageIndex].data;


  //   if (!formRef.contactAddress2) {
  //     formRef.contactAddress2 = { mailingAddress: {} };
  //   }

  //   switch (isMailingAddressSameAsHomeAddress) {
  //     case "Same as Home Address":
  //       if (formRef.contactAddress1?.homeAddress) {
  //         formRef.contactAddress2.mailingAddress = {
  //           streetName: formRef.contactAddress1.homeAddress.streetName || "",
  //           pinCode: formRef.contactAddress1.homeAddress.pinCode || "",
  //           city: formRef.contactAddress1.homeAddress.city || "",
  //           province: formRef.contactAddress1.homeAddress.province || "",
  //         };
  //       }
  //       break;

  //     case "Same as Business Address":
  //       if (formRef.contactAddress3?.business?.businessAddress) {
  //         formRef.contactAddress2.mailingAddress = {
  //           streetName: formRef.contactAddress3.business.businessAddress.streetName || "",
  //           pinCode: formRef.contactAddress3.business.businessAddress.pinCode || "",
  //           city: formRef.contactAddress3.business.businessAddress.city || "",
  //           province: formRef.contactAddress3.business.businessAddress.province || "",
  //         };
  //       }
  //       break;

  //     case "Different Address":

  //       if (!isInitialLoad && isManualChange) {
  //         formRef.contactAddress2.mailingAddress = {
  //           streetName: "",
  //           pinCode: "",
  //           city: "",
  //           province: "",
  //         };
  //       }
  //       break;

  //     default:
  //       break;
  //   }

  //   return tempData;
  // };



  // const updateBusinessAddress = (prevData) => {
  //   let tempData = { ...prevData };
  //   let formRef = tempData.forms[addressPageIndex].data;


  //   if (!formRef.contactAddress3) {
  //     formRef.contactAddress3 = { business: { businessAddress: {} } };
  //   }

  //   switch (isBusinessAddressSameAsHomeAddressOrMailingAddress) {
  //     case "Same as Home Address":
  //       if (formRef.contactAddress1?.homeAddress) {
  //         formRef.contactAddress3.business.businessAddress = {
  //           streetName: formRef.contactAddress1.homeAddress.streetName || "",
  //           pinCode: formRef.contactAddress1.homeAddress.pinCode || "",
  //           city: formRef.contactAddress1.homeAddress.city || "",
  //           province: formRef.contactAddress1.homeAddress.province || "",
  //         };
  //       }
  //       break;

  //     case "Same as Mailing Address":
  //       if (formRef.contactAddress2?.mailingAddress) {
  //         formRef.contactAddress3.business.businessAddress = {
  //           streetName: formRef.contactAddress2.mailingAddress.streetName || "",
  //           pinCode: formRef.contactAddress2.mailingAddress.pinCode || "",
  //           city: formRef.contactAddress2.mailingAddress.city || "",
  //           province: formRef.contactAddress2.mailingAddress.province || "",
  //         };
  //       }
  //       break;

  //     case "Different Address":

  //       if (!isInitialLoad && isManualChange) {
  //         formRef.contactAddress3.business.businessAddress = {
  //           streetName: "",
  //           pinCode: "",
  //           city: "",
  //           province: "",
  //         };
  //       }
  //       break;

  //     default:
  //       break;
  //   }

  //   return tempData;
  // };



  // useEffect(() => {
  //   if (isMailingAddressSameAsHomeAddress) {
  //     setBasicForm((prevData) => updateMailingAddress(prevData));
  //     setIsManualChange(false);
  //   }
  // }, [isMailingAddressSameAsHomeAddress]);


  // useEffect(() => {
  //   if (isBusinessAddressSameAsHomeAddressOrMailingAddress) {
  //     setBasicForm((prevData) => updateBusinessAddress(prevData));
  //     setIsManualChange(false);
  //   }
  // }, [isBusinessAddressSameAsHomeAddressOrMailingAddress]);


  // useEffect(() => {
  //   setIsInitialLoad(false);
  // }, []);



  useEffect(() => {
    if (
      registeredBusinessAddress !== undefined &&
      registeredBusinessAddress !== null &&
      !registeredBusinessAddress &&
      !isPOD &&
      (baseKey?.split(".")[0] === "contactAddress1" ||
        baseKey?.split(".")[0] === "contactAddress2" ||
        baseKey?.split(".")[0] === "contactAddress3")
    ) {
      setBasicForm((prevData) => {
        let tempContactAddress3 = { ...prevData };
        if (
          tempContactAddress3?.forms[addressPageIndex]?.data?.contactAddress3
            ?.business === undefined
        ) {
          tempContactAddress3.forms[
            addressPageIndex
          ].data.contactAddress3.business = {};
        }
        if (
          tempContactAddress3?.forms[addressPageIndex]?.data?.contactAddress3
            ?.business?.businessAddress === undefined
        ) {
          tempContactAddress3.forms[
            addressPageIndex
          ].data.contactAddress3.business.businessAddress = {};
        }

        tempContactAddress3.contactAddress3 = {
          business: { businessAddress: {} },
        };
        tempContactAddress3.forms[
          addressPageIndex
        ].data.contactAddress3.business.businessAddress.streetName = "";
        tempContactAddress3.forms[
          addressPageIndex
        ].data.contactAddress3.business.businessAddress.pinCode = "";
        tempContactAddress3.forms[
          addressPageIndex
        ].data.contactAddress3.business.businessAddress.city = "";
        tempContactAddress3.forms[
          addressPageIndex
        ].data.contactAddress3.business.businessAddress.province = "";
        tempContactAddress3.forms[
          addressPageIndex
        ].data.contactAddress3.business.businessName = "";
        tempContactAddress3.forms[
          addressPageIndex
        ].data.contactAddress3.business.businessPhone = "";
        tempContactAddress3.forms[
          addressPageIndex
        ].data.contactAddress3.business.businessWebsite = "";
        tempContactAddress3.forms[
          addressPageIndex
        ].data.contactAddress3.isBusinessAddressSameAsHomeAddressOrMailingAddress =
          "";
        tempContactAddress3.contactAddress3 = {
          business: {
            businessAddress:
              tempContactAddress3.forms[addressPageIndex].data.contactAddress3
                .business.businessAddress,
          },
          isBusinessAddressSameAsHomeAddressOrMailingAddress: "",
        };
        return tempContactAddress3;
      });
    }
  }, [registeredBusinessAddress]);

  useEffect(() => {
    if (department !== undefined && department !== null && !isPOD && !window.location.pathname.includes("reappointmentApplicationForm") && !window.location.pathname.includes("locumApplicationForm")) {
      setBasicForm((prevData) => {
        let tempData = { ...prevData };
        if (
          (!formSchema?.schema?.properties?.departmentSpecialty?.dependencies?.department?.oneOf
            ?.map((data) => data?.properties?.department?.enum[0])
            ?.includes(tempData.basicDetails.departmentSpecialty.department) ||
            !(
              formSchema?.schema?.properties?.departmentSpecialty?.dependencies?.department?.oneOf
                ?.map((data) => data?.properties?.department?.enum[0])
                ?.includes(
                  tempData.basicDetails.departmentSpecialty.department
                ) &&
              formSchema?.schema?.properties?.departmentSpecialty?.dependencies?.department?.oneOf
                ?.filter(
                  (data) =>
                    data?.properties?.department?.enum[0] ===
                    tempData.basicDetails.departmentSpecialty.department
                )[0]
                ?.properties?.specialty?.enum?.includes(
                  tempData.basicDetails.departmentSpecialty.specialty
                )
            )) &&
          formSchema !== undefined
        ) {
          tempData.basicDetails.departmentSpecialty.specialty = "";
        }
        return tempData;
      });
    }
  }, [department, formSchema]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://geocoder.ca/${isHomeAddressPincodeEntered}?json=1`
        );
        let data = response.data;
        console.log(data);
        setBasicForm((prevData) => {
          let tempContactAddress1 = { ...prevData };
          tempContactAddress1.forms[
            addressPageIndex
          ].data.contactAddress1.homeAddress.city = data?.standard?.city || "";
          tempContactAddress1.forms[
            addressPageIndex
          ].data.contactAddress1.homeAddress.province =
            data?.standard?.prov || "";
          return tempContactAddress1;
        });
      } catch (error) {
        console.log("Error fetching data");
      }
    };
    if (
      isHomeAddressPincodeEntered !== undefined &&
      isHomeAddressPincodeEntered !== null &&
      isHomeAddressPincodeEntered?.length >= 7 &&
      !isPOD &&
      (baseKey?.split(".")[0] === "contactAddress1" ||
        baseKey?.split(".")[0] === "contactAddress2" ||
        baseKey?.split(".")[0] === "contactAddress3")
    ) {
      if (validateCanadianPostalCode(isHomeAddressPincodeEntered)) {
        if (hometimeoutRef.current) {
          clearTimeout(hometimeoutRef.current);
        }
        hometimeoutRef.current = setTimeout(() => {
          fetchData();
        }, 2000);
      } else {
        setBasicForm((prevData) => {
          let tempContactAddress1 = { ...prevData };
          tempContactAddress1.forms[
            addressPageIndex
          ].data.contactAddress1.homeAddress.pinCode = "";
          return tempContactAddress1;
        });
      }
    }
  }, [isHomeAddressPincodeEntered]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://geocoder.ca/${isMailingAddressPincodeEntered}?json=1`
        );
        let data = response.data;
        console.log(data);

        setBasicForm((prevData) => {
          let tempContactAddress2 = { ...prevData };
          tempContactAddress2.forms[
            addressPageIndex
          ].data.contactAddress2.mailingAddress.city = data?.standard?.city || "";
          tempContactAddress2.forms[
            addressPageIndex
          ].data.contactAddress2.mailingAddress.province = data?.standard?.prov || "";
          return tempContactAddress2;
        });
      } catch (error) {
        console.log("Error fetching data");
      }
    };

    if (
      isMailingAddressSameAsHomeAddress === "Different Address" &&
      isMailingAddressPincodeEntered !== undefined &&
      isMailingAddressPincodeEntered !== null &&
      isMailingAddressPincodeEntered?.length >= 7 &&
      !isPOD &&
      (baseKey?.split(".")[0] === "contactAddress1" ||
        baseKey?.split(".")[0] === "contactAddress2" ||
        baseKey?.split(".")[0] === "contactAddress3")
    ) {
      if (validateCanadianPostalCode(isMailingAddressPincodeEntered)) {
        if (mailingTimeoutRef.current) {
          clearTimeout(mailingTimeoutRef.current);
        }
        mailingTimeoutRef.current = setTimeout(() => {
          fetchData();
        }, 2000);
      } else {
        setBasicForm((prevData) => {
          let tempContactAddress2 = { ...prevData };
          tempContactAddress2.forms[
            addressPageIndex
          ].data.contactAddress2.mailingAddress.pinCode = "";
          return tempContactAddress2;
        });
      }
    }
  }, [isMailingAddressPincodeEntered, isMailingAddressSameAsHomeAddress]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://geocoder.ca/${isBusinessAddressPincodeEntered}?json=1`
        );
        let data = response.data;
        console.log(data);

        setBasicForm((prevData) => {
          let tempContactAddress3 = { ...prevData };
          tempContactAddress3.forms[
            addressPageIndex
          ].data.contactAddress3.business.businessAddress.city = data?.standard?.city || "";
          tempContactAddress3.forms[
            addressPageIndex
          ].data.contactAddress3.business.businessAddress.province = data?.standard?.prov || "";
          return tempContactAddress3;
        });
      } catch (error) {
        console.log("Error fetching data");
      }
    };

    if (
      isBusinessAddressSameAsHomeAddressOrMailingAddress === "Different Address" &&
      isBusinessAddressPincodeEntered !== undefined &&
      isBusinessAddressPincodeEntered !== null &&
      isBusinessAddressPincodeEntered?.length >= 7 &&
      !isPOD &&
      (baseKey?.split(".")[0] === "contactAddress1" ||
        baseKey?.split(".")[0] === "contactAddress2" ||
        baseKey?.split(".")[0] === "contactAddress3")
    ) {
      if (validateCanadianPostalCode(isBusinessAddressPincodeEntered)) {
        if (businessTimeoutRef.current) {
          clearTimeout(businessTimeoutRef.current);
        }
        businessTimeoutRef.current = setTimeout(() => {
          fetchData();
        }, 2000);
      } else {
        setBasicForm((prevData) => {
          let tempContactAddress3 = { ...prevData };
          tempContactAddress3.forms[
            addressPageIndex
          ].data.contactAddress3.business.businessAddress.pinCode = "";
          return tempContactAddress3;
        });
      }
    }
  }, [isBusinessAddressPincodeEntered, isBusinessAddressSameAsHomeAddressOrMailingAddress]);


  const getItems = (data) => {
    let temp = [];
    data?.map((data) => {
      temp.push({ id: data, value: data });
    });
    return temp;
  };

  const getIsValidationDialogOpen = (value) => {
    setShowValidationDialog(value);
  };

  const getIsShowFileDialog = (value) => {
    setShowFileDisplayDialog(value);
  };
  const getIsShowPriorDataDialog = (value) => {
    setShowPriorDataDialog(value);
  };
  const getSkipClicked = (value) => {
    if (value) {
      console.log("skip clicked", baseKey);
      // setIsAddMore(false);
      setShowValidationDialog(false);
      handleAddMore(addMoreRef.current, "skipped");
    }
  };

  const isLableEmpty = (data) => {
    if (data === "" || data === null) {
      return true;
    } else {
      return false;
    }
  };

  const handleDatalistInput = (fieldKey, value) => {
    let temp = {
      fieldName: fieldKey,
      fieldValue: value,
    };
    sessionStorage.setItem("dataListEntry", JSON.stringify(temp));
  };

  const validateCanadianPostalCode = (postalCode) => {
    const canadianPostalCodeRegex = /^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/;
    return canadianPostalCodeRegex.test(postalCode);
  };

  const addNewDocument = async (file) => {
    console.log(file, file?.name, "Test");
    let fileName = {
      fileName: file?.name,
    };
    const formData = new FormData();

    if (file !== null) {
      formData.append(
        "files",
        new Blob([JSON.stringify(fileName)], {
          type: "application/json",
        })
      );
      formData.append("documents", file);

      // await POST(`application-management-service/application/${applicationId}/files`, formData)
      //     .then(response => {
      //         SuccessToaster('File Uploaded Successfully');
      //         console.log(response?.data)
      //         return response?.data;
      //     })
      //     .catch(error => {
      //         ErrorToaster('File Upload Failed');
      //     })
      try {
        const response = await POST(
          `application-management-service/application/${applicationId}/files?isLLMRequired=${formSchema?.requiredDocuments?.length !== 0 ? true : false
          }&schemaId=${formSchema?.id}`,
          formData
        );
        SuccessToaster("File Uploaded Successfully");
        try {
          if (
            response?.data?.documentType !== null &&
            formSchema?.requiredDocuments?.length !== 0
          ) {
            await PUT(
              `application-management-service/application/${applicationId}/form/updateData`,
              {
                documentType:
                  response?.data?.documentType !== null
                    ? response?.data?.documentType?.name
                    : "",
                fileSize: `${(file?.size / (1024 * 1024)).toFixed(2)} Mb`,
                fileURL: response?.data?.file?.fileURL,
                fileType: response?.data?.file?.fileType,
                fileUploaded: file?.name,
                requirement:
                  response?.data?.documentType !== null
                    ? basicForm?.documentsRequired?.filter(
                      (data) =>
                        data?.document?.name ===
                        response?.data?.documentType?.name
                    )?.[0]?.required
                      ? "Required"
                      : "Recommended"
                    : "",
                valid: response?.data?.valid,
                verified: response?.data?.verified,
                rowId: response?.data?.id
              }
            );
          }
          console.log(response);
        } catch (error) {
          console.log(error);
        }
        console.log(response?.data);
        return response?.data;
      } catch (error) {
        ErrorToaster("File Upload Failed");
        console.error(error);
        return null;
      }
    }
  };

  console.log(basicForm, "Test");

  // Usage:
  // const thenStrings = getAllThenStrings(object);
  // console.log(thenStrings, '246');

  const renderField = (
    fieldKey,
    fieldData,
    baseKey,
    handleChange,
    getValueByPath,
    style,
    calendarStart,
    setCalendarStart,
    parentData
  ) => {
    // const checkAllOfConditions = (object, path = '', fieldKey) => {
    //     if (!object) return true;

    //     if (object.allOf) {
    //         console.log(object.allOf)
    //         return object.allOf.every(subSchema => {
    //             const ifConditionKey = Object.entries(subSchema?.if?.properties || {})?.map(([key]) => key)[0];
    //             const ifConditionValue = Object.entries(subSchema?.if?.properties || {})?.map(([key, data]) => data)[0]?.const;
    //             const actualValue = getValueByPath(basicForm, `${baseKey}.${ifConditionKey}`);

    //             const thenRequired = !getAllThenStrings(object)?.includes(fieldKey);
    //             console.log(getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`), ifConditionValue, 'if display Check', fieldKey, `${baseKey}.${ifConditionKey}`, basicForm, `${basicpath}.${baseKey}.${fieldKey}`, getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) === ifConditionValue ? true : thenRequired)
    //             return (getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) === ifConditionValue) ? true : thenRequired;
    //         });
    //     }

    //     return Object.entries(object.properties || {}).every(([key, value]) => {
    //         return checkAllOfConditions(value, `${path}.${key}`, fieldKey);
    //     });
    // };

    // Usage:
    // const conditionMet = checkAllOfConditions(object, `${baseKey}`, fieldKey);
    console.log(
      fieldKey,
      "fielddataaaaaaaaaaaa" + JSON.stringify(fieldData),
      `${basicpath}.${baseKey}.${fieldKey}`,
      object?.then?.required,
      getAllThenStrings(object),
      getAllThenStrings(object)
        ?.map((data) => data?.value)
        ?.includes(fieldKey),
      object?.then?.required?.includes(fieldKey),
      "275",
      parentData,
      object,
      getValueByPath(
        basicForm,
        `${basicpath}.${baseKey}.${getAllThenStrings(object)?.filter(
          (data) => data?.value === fieldKey
        )[0]?.key
        }`
      ) ==
        getAllThenStrings(object)?.filter(
          (data) => data?.value === fieldKey
        )[0]?.checkValue == null ? null : getAllThenStrings(object)?.filter(
          (data) => data?.value === fieldKey
        )[0]?.checkValue,
      getValueByPath(
        basicForm,
        `${basicpath}.${baseKey}.${getAllThenStrings(object)?.filter(
          (data) => data?.value === fieldKey
        )[0]?.key
        }`
      ),
      parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey) || object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey)
    );
    // if (object?.then?.required?.includes(fieldKey) !== undefined ? (!object?.then?.required?.includes(fieldKey) || object?.if?.properties !== undefined && getValueByPath(basicForm, `${basicpath}.${baseKey}.${Object.entries(object?.if?.properties)?.map(([key, data]) => key)}`) === Object.entries(object?.if?.properties)?.map(([key, data]) => data)[0]?.const) : getAllThenStrings(object)?.map(data => data?.value)?.includes(fieldKey) ? (getAllThenStrings(object)?.map(data => data?.value)?.includes(fieldKey) && (getAllThenStrings(object)?.map(data => data?.value)?.includes(fieldKey) && getValueByPath(basicForm, `${basicpath}.${baseKey}.${getAllThenStrings(object)?.filter(data => data?.value === fieldKey)[0]?.key}`) === getAllThenStrings(object)?.filter(data => data?.value === fieldKey)[0]?.checkValue)) : true && fieldData.fieldType) {
    let firstObject;
    let dynamicValue;
    if (object?.if?.properties !== undefined) {
      firstObject = Object.entries(object?.if?.properties)?.map(
        ([key, data]) => data
      )[0]; // Get the first key dynamically
      dynamicValue = Object.keys(firstObject)?.[0];
      console.log(
        firstObject,
        firstObject[dynamicValue],
        "275",
        getValueByPath(
          basicForm,
          `${basicpath}.${baseKey}.${Object.entries(
            object?.if?.properties
          )?.map(([key, data]) => key)}`
        ),
        dynamicValue,
      );
    }
    console.log(dynamicValue);
    if (
      object?.then?.required?.includes(fieldKey) !== undefined
        ? !object?.then?.required?.includes(fieldKey) ||
        (object?.if?.properties !== undefined &&
          Array.isArray(firstObject[dynamicValue])
          ? firstObject[dynamicValue]?.includes(
            getValueByPath(
              basicForm,
              `${basicpath}.${baseKey}.${Object.entries(
                object?.if?.properties
              )?.map(([key, data]) => key)}`
            )
          ) : firstObject[dynamicValue] == null ?
            getValueByPath(
              basicForm,
              `${basicpath}.${baseKey}.${Object.entries(
                object?.if?.properties
              )?.map(([key, data]) => key)}`
            ) == firstObject[dynamicValue]
            : getValueByPath(
              basicForm,
              `${basicpath}.${baseKey}.${Object.entries(
                object?.if?.properties
              )?.map(([key, data]) => key)}`
            ) === firstObject[dynamicValue])
        : getAllThenStrings(object)
          ?.map((data) => data?.value)
          ?.includes(fieldKey)
          ? getAllThenStrings(object)
            ?.map((data) => data?.value)
            ?.includes(fieldKey) &&
          getAllThenStrings(object)
            ?.map((data) => data?.value)
            ?.includes(fieldKey) &&
          (getValueByPath(
            basicForm,
            `${basicpath}.${baseKey}.${getAllThenStrings(object)?.filter(
              (data) => data?.value === fieldKey
            )[0]?.key
            }`
          ) ==
            (getAllThenStrings(object)?.filter(
              (data) => data?.value === fieldKey
            )[0]?.checkValue == null ? null :
              getAllThenStrings(object)?.filter(
                (data) => data?.value === fieldKey
              )[0]?.checkValue))
          : true && fieldData.fieldType
    ) {
      if (
        // (isLableEmpty(fieldData.label)
        //   ? false
        //   : object.required?.includes(fieldKey) ||
        //   (parentData !== null
        //     ? parentData.required?.includes(fieldKey)
        //     : false)) &&
        getAllPath &&
        getAllLabels &&
        fieldData.fieldType !== "switchbutton"
      ) {
        if (
          baseKey?.split(".")[0] === "contactAddress1" ||
          baseKey?.split(".")[0] === "contactAddress2" ||
          baseKey?.split(".")[0] === "contactAddress3"
        ) {
          getAllPath(`${basicpath}.${baseKey}.${fieldKey}`);
          getAllLabels({
            label: fieldData?.label,
            path: `${basicpath}.${baseKey}.${fieldKey}`,
            mandatory: (isLableEmpty(fieldData.label)
              ? false
              : object.required?.includes(fieldKey) ||
              (parentData !== null
                ? parentData?.required?.includes(fieldKey)
                : false)),
          });
        } else {
          getAllPath(`${basicpath}.${baseKey}.${fieldKey}`);
          getAllLabels({
            label: fieldData?.label,
            path: `${basicpath}.${baseKey}.${fieldKey}`,
            mandatory: parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey) || object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey),
          });
        }
      }
      switch (fieldData.fieldType) {
        case "dropdown":
          if (isPOD) {
            return (
              <div>
                <div className={`${style.lableStylePOD}`}>
                  {fieldData.label}
                  {isLableEmpty(fieldData.label)
                    ? false
                    : (object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                      (parentData !== null
                        ? parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                        : false)) &&
                    "*"}
                </div>
                <hr className={style.borderLine} />
                <div className={style.lableReadOnlyStyleInPOD}>
                  {getValueByPath(
                    basicForm,
                    `${basicpath}.${baseKey}.${fieldKey}`
                  ) || "-"}
                </div>
              </div>
            );
          } else {
            console.log(formPermission?.permissions?.filter(data => data?.role === sessionStorage.getItem('workModeType'))?.[0]?.fieldLevelPermissions?.filter(data => data?.level === fieldData?.permissionLevel?.toString())?.[0]?.accessPermissions?.includes('Write') ? true : false, formPermission?.permissions?.filter(data => data?.role === sessionStorage.getItem('workModeType'))?.[0]?.fieldLevelPermissions?.filter(data => data?.level === fieldData?.permissionLevel?.toString())?.[0]?.accessPermissions?.includes('Write'), 'Dropdowncheck')

            const specialityValues =
              fieldKey === "specialty"
                ? getSpecialityValues(object)
                : fieldData.enum;

            // Render the dropdown conditionally for "specialty" only if there are values
            return fieldKey === "specialty" &&
              specialityValues.length === 0 ? null : (
              <CommonSelectField
                value={
                  getValueByPath(
                    basicForm,
                    `${basicpath}.${baseKey}.${fieldKey}`
                  ) || null
                }
                onChange={(e) =>
                  handleChange(fieldKey, e.target.value, baseKey)
                }
                className={style.fullWidth}
                valueList={specialityValues}
                labelList={specialityValues}
                disabledList={specialityValues.map(() => false)}
                label={fieldData.label}
                required={
                  isLableEmpty(fieldData.label)
                    ? false
                    : object.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                    (parentData !== null
                      ? parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                      : false)
                }
                // Hide warning specifically for specialty field
                warning={
                  fieldKey !== "specialty" &&
                  warningFields
                    ?.map((data) => data?.key)
                    ?.includes(`${basicpath}.${baseKey}.${fieldKey}`)
                }
                disabledSelect={!formPermission ? false : formPermission?.permissions?.filter(data => data?.role === sessionStorage.getItem('workModeType'))?.[0]?.fieldLevelPermissions?.filter(data => data?.level === fieldData?.permissionLevel?.toString())?.[0]?.accessPermissions?.includes('Write') ? false : true}
              />
            );
          }
        case "multiDropdown":
          if (isPOD) {
            return (
              <div>
                <div className={`${style.lableStylePOD}`}>
                  {fieldData.label}
                  {isLableEmpty(fieldData.label)
                    ? false
                    : (object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                      (parentData !== null
                        ? parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                        : false)) &&
                    "*"}
                </div>
                <hr className={style.borderLine} />
                <div className={style.lableReadOnlyStyleInPOD}>
                  {getValueByPath(
                    basicForm,
                    `${basicpath}.${baseKey}.${fieldKey}`
                  ) || "-"}
                </div>
              </div>
            );
          } else {
            console.log(formPermission?.permissions?.filter(data => data?.role === sessionStorage.getItem('workModeType'))?.[0]?.fieldLevelPermissions?.filter(data => data?.level === fieldData?.permissionLevel?.toString())?.[0]?.accessPermissions?.includes('Write') ? true : false, formPermission?.permissions?.filter(data => data?.role === sessionStorage.getItem('workModeType'))?.[0]?.fieldLevelPermissions?.filter(data => data?.level === fieldData?.permissionLevel?.toString())?.[0]?.accessPermissions?.includes('Write'), 'Dropdowncheck')

            const specialityValues =
              fieldKey === "specialty"
                ? getSpecialityValues(object)
                : fieldData.enum;

            // Render the dropdown conditionally for "specialty" only if there are values
            return fieldKey === "specialty" &&
              specialityValues.length === 0 ? null : (
              <div>
                <div className={`${style.lableStyle}`}>
                  {fieldData.label}
                  {(isLableEmpty(fieldData.label)
                    ? false
                    : object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                    (parentData !== null
                      ? parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                      : false)) && "*"}
                </div>
                <div className={style.marginTop10}>
                  <CommonMultiSelectField
                    value={
                      getValueByPath(
                        basicForm,
                        `${basicpath}.${baseKey}.${fieldKey}`
                      ) || []
                    }
                    onChange={(e) =>
                      handleChange(fieldKey, e.target.value, baseKey)
                    }
                    className={style.fullWidth}
                    valueList={specialityValues}
                    labelList={specialityValues}
                    disabledList={specialityValues.map(() => false)}
                    label={fieldData.label}
                    required={
                      isLableEmpty(fieldData.label)
                        ? false
                        : object.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                        (parentData !== null
                          ? parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                          : false)
                    }
                    // Hide warning specifically for specialty field
                    warning={
                      fieldKey !== "specialty" &&
                      warningFields
                        ?.map((data) => data?.key)
                        ?.includes(`${basicpath}.${baseKey}.${fieldKey}`)
                    }
                    disabledSelect={!formPermission ? false : formPermission?.permissions?.filter(data => data?.role === sessionStorage.getItem('workModeType'))?.[0]?.fieldLevelPermissions?.filter(data => data?.level === fieldData?.permissionLevel?.toString())?.[0]?.accessPermissions?.includes('Write') ? false : true}
                  />
                </div>
              </div>
            );
          }
        case "datalist":
          if (isPOD) {
            return (
              <div>
                <div className={`${style.lableStylePOD}`}>
                  {fieldData.label}
                  {isLableEmpty(fieldData.label)
                    ? false
                    : (object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                      (parentData !== null
                        ? parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                        : false)) &&
                    "*"}
                </div>
                <hr className={style.borderLine} />
                <div className={style.lableReadOnlyStyleInPOD}>
                  {getValueByPath(
                    basicForm,
                    `${basicpath}.${baseKey}.${fieldKey}`
                  ) || "-"}
                </div>
              </div>
            );
          } else {
            return (
              <div>
                <div className={`${style.lableStyle}`}>
                  {fieldData.label}
                  {(object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                    (parentData !== null
                      ? parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                      : false)) &&
                    "*"}
                </div>
                <DatalistInput
                  items={getItems(fieldData.enum) || []}
                  onSelect={(item) =>
                    handleChange(fieldKey, item.value, baseKey)
                  }
                  className={`${style.fullWidth} ${style.marginTop10} ${style.leftAlign}`}
                  maxLength={TEXTFIELDLEN50}
                  onChange={(e) => {
                    handleChange(fieldKey, e.target.value, baseKey);
                    handleDatalistInput(fieldKey, e.target.value);
                  }}
                  placeholder={
                    fieldData.placeHolder !== null
                      ? fieldData.placeHolder
                      : fieldData.label !== null
                        ? `Enter ${fieldData.label}`
                        : null
                  }
                  value={
                    getValueByPath(
                      basicForm,
                      `${basicpath}.${baseKey}.${fieldKey}`
                    ) || ""
                  }
                  required={
                    isLableEmpty(fieldData.label)
                      ? false
                      : object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                      (parentData !== null
                        ? parentData.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                        : false)
                  }
                  // warning={warningFields?.map(data => data?.key)?.includes(`${basicpath}.${baseKey}.${fieldKey}`)
                  // ? (value === 0 || (isNaN(value) && value !== undefined) || value === '')
                  // : (value === '' || value === null || value === undefined)}
                  style={
                    warningFields
                      ?.map((data) => data?.key)
                      ?.includes(`${basicpath}.${baseKey}.${fieldKey}`) &&
                      (value === "" || value === null || value === undefined)
                      ? { border: "2px solid #cc0000", borderRadius: "5px" }
                      : {}
                  }
                />
              </div>
            );
          }

        case "textbox":
          if (isPOD) {
            return (
              <div>
                <div className={`${style.lableStylePOD}`}>
                  {fieldData.label}
                  {isLableEmpty(fieldData.label)
                    ? false
                    : (object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                      (parentData !== null
                        ? parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                        : false)) &&
                    "*"}
                </div>
                <hr className={style.borderLine} />
                <div className={style.lableReadOnlyStyleInPOD}>
                  {getValueByPath(
                    basicForm,
                    `${basicpath}.${baseKey}.${fieldKey}`
                  ) || "-"}
                </div>
              </div>
            );
          } else {
            return (
              // <CommonInputField
              //     value={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) || ''}
              //     className={style.fullWidth}
              //     onChange={(e) => handleChange(fieldKey, fieldData.type === "number" ? parseInt(e.target.value <= fieldData.maximum ? e.target.value : fieldData.maximum) : e.target.value, baseKey)}
              //     maxLength={TEXTFIELDLEN50}
              //     placeholder={fieldData.label !== null ? `Enter ${fieldData.label}` : null}
              //     label={fieldData.label}
              //     required={isLableEmpty(fieldData.label) ? false : (object.required?.includes(fieldKey) || (parentData !== null ? parentData.required?.includes(fieldKey) : false))}
              //     type={fieldData.type}
              //     min={fieldData.minimum}
              // />
              (user === null ||
                user?.roles?.filter(
                  (data) => data?.roleName === "Staff Manager"
                )?.length === 0) &&
                (fieldKey === "officialEmail" ||
                  fieldKey === "applicantType") ? (
                // <CommonLabel label={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) || ''} />\
                <div>
                  <div className={`${style.lableStyle}`}>
                    {fieldData.label}
                    {isLableEmpty(fieldData.label)
                      ? false
                      : (object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                        (parentData !== null
                          ? parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                          : false)) &&
                      "*"}
                  </div>
                  {fieldKey === "applicantType" ? (
                    <Tooltip
                      title={`To change applicant type contact ${basicForm?.createdBy?.name?.firstName
                        } ${basicForm?.createdBy?.name?.lastName !== null
                          ? basicForm?.createdBy?.name?.lastName
                          : ""
                        }`}
                      placement="bottom-start"
                      followCursor
                      arrow
                    >
                      <div className={style.lableReadOnlyStyle}>
                        <strong>{getValueByPath(
                          basicForm,
                          `${basicpath}.${baseKey}.${fieldKey}`
                        ) || ""}</strong>
                      </div>
                    </Tooltip>
                  ) : (
                    <div className={style.lableReadOnlyStyle}>
                      <strong>{getValueByPath(
                        basicForm,
                        `${basicpath}.${baseKey}.${fieldKey}`
                      ) || ""}</strong>
                    </div>
                  )}
                </div>
              ) : (
                <div key={fieldKey}>

                  <CommonTextField
                    value={
                      getValueByPath(
                        basicForm,
                        `${basicpath}.${baseKey}.${fieldKey}`
                      ) || ""
                    }
                    // inputRef={
                    //   refsMap.current?.[basicForm,`${basicpath}.${baseKey}.${fieldKey}`]
                    // }
                    className={style.fullWidth}
                    onChange={(e) =>
                      handleChange(
                        fieldKey,
                        fieldData.type === "number"
                          ? parseInt(
                            e.target.value <= fieldData.maximum
                              ? e.target.value
                              : fieldData.maximum
                          )
                          : fieldKey === "pinCode"
                            ? FormatPostalCode(e.target.value)
                            : fieldData.type === "string" &&
                              fieldData.maxLength !== 0
                              ? e.target.value.length <= fieldData.maxLength
                                ? e.target.value
                                : e.target.value.slice(0, fieldData.maxLength)
                              : e.target.value,
                        baseKey
                      )
                    }
                    maxLength={TEXTFIELDLEN50}
                    placeholder={
                      fieldData.placeHolder !== null
                        ? fieldData.placeHolder
                        : fieldData.label !== null
                          ? `Enter ${fieldData.label}`
                          : null
                    }
                    label={fieldData.label}
                    required={
                      isLableEmpty(fieldData.label)
                        ? false
                        : object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                        (parentData !== null
                          ? parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                          : false)
                    }
                    type={fieldData.type}
                    min={fieldData.minimum}
                    warning={warningFields
                      ?.map((data) => data?.key)
                      ?.includes(`${basicpath}.${baseKey}.${fieldKey}`)}
                  // InputProps={{
                  //     readOnly: (user?.roles?.filter(data => data?.roleName === "Staff Manager")?.length === 0 && fieldKey === 'officialEmail') ? true : false,
                  // }}
                  />
                </div>
              )
            );
          }
        case "maskedtextbox":
          if (isPOD) {
            return (
              <div>
                <div className={`${style.lableStylePOD}`}>
                  {fieldData.label}
                  {isLableEmpty(fieldData.label)
                    ? false
                    : (object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                      (parentData !== null
                        ? parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                        : false)) &&
                    "*"}
                </div>
                <hr className={style.borderLine} />
                <div className={style.lableReadOnlyStyleInPOD}>
                  {isMasked ? String(getValueByPath(
                    basicForm,
                    `${basicpath}.${baseKey}.${fieldKey}`
                  ) || "").replace(/\d(?=\d{4})/g, "X") : getValueByPath(
                    basicForm,
                    `${basicpath}.${baseKey}.${fieldKey}`
                  ) || "-"}
                </div>
              </div>
            );
          } else {
            return (
              <div key={fieldKey}>
                <CommonTextField
                  value={
                    isMasked ? String(getValueByPath(
                      basicForm,
                      `${basicpath}.${baseKey}.${fieldKey}`
                    ) || "").replace(/\d(?=\d{4})/g, "X") : getValueByPath(
                      basicForm,
                      `${basicpath}.${baseKey}.${fieldKey}`
                    ) || ""
                  }
                  className={style.fullWidth}
                  onChange={(e) =>
                    handleChange(
                      fieldKey,
                      e.target.value.replace(/\s+/g, ""),
                      baseKey
                    )
                  }
                  maxLength={TEXTFIELDLEN50}
                  placeholder={
                    fieldData.placeHolder !== null
                      ? fieldData.placeHolder
                      : fieldData.label !== null
                        ? `Enter ${fieldData.label}`
                        : null
                  }
                  label={fieldData.label}
                  required={
                    isLableEmpty(fieldData.label)
                      ? false
                      : object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                      (parentData !== null
                        ? parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                        : false)
                  }
                  type={fieldData.type}
                  min={fieldData.minimum}
                  warning={warningFields
                    ?.map((data) => data?.key)
                    ?.includes(`${basicpath}.${baseKey}.${fieldKey}`)}
                  inputProps={{
                    pattern: "^[0-9]*$",
                    maxLength: 18,
                    onlyDigits: true,
                  }}
                  onBlur={() => setIsMasked(true)}
                  onFocus={() => setIsMasked(false)}
                />
              </div>
            );
          }
        case "textArea":
          if (isPOD) {
            return (
              <div>
                <div className={`${style.lableStylePOD}`}>
                  {fieldData.label}
                  {isLableEmpty(fieldData.label)
                    ? false
                    : (object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                      (parentData !== null
                        ? parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                        : false)) &&
                    "*"}
                </div>
                <hr className={style.borderLine} />
                <div className={style.lableReadOnlyStyleInPOD}>
                  {getValueByPath(
                    basicForm,
                    `${basicpath}.${baseKey}.${fieldKey}`
                  ) || "-"}
                </div>
              </div>
            );
          } else {
            return (
              <div>
                <div className={`${style.lableStyle}`}>
                  {fieldData.label}
                  {(isLableEmpty(fieldData.label)
                    ? false
                    : object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                    (parentData !== null
                      ? parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                      : false)) && "*"}
                </div>
                <TextArea
                  value={
                    getValueByPath(
                      basicForm,
                      `${basicpath}.${baseKey}.${fieldKey}`
                    ) || null
                  }
                  className={`${style.fullWidth} ${style.marginTop10}`}
                  onChange={(e) =>
                    handleChange(fieldKey, e.target.value, baseKey)
                  }
                  maxLength={TEXTFIELDLEN50}
                  placeholder={
                    fieldData.placeHolder !== null
                      ? fieldData.placeHolder
                      : fieldData.label !== null
                        ? `Enter ${fieldData.label}`
                        : null
                  }
                  rows={4}
                />
              </div>
            );
          }
        case "ckeditor":
          if (isPOD) {
            return (
              <div>
                <div className={`${style.lableStylePOD}`}>
                  <strong>{fieldData.label}
                    {isLableEmpty(fieldData.label)
                      ? false
                      : (object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                        (parentData !== null
                          ? parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                          : false)) &&
                      "*"}
                  </strong>
                </div>
                <div
                  className={style.lableReadOnlyStyleInPOD}
                  dangerouslySetInnerHTML={{
                    __html:
                      getValueByPath(
                        basicForm,
                        `${basicpath}.${baseKey}.${fieldKey}`
                      ) || "-",
                  }}
                />
              </div>
            );
          } else {
            return (
              <div>
                <div className={`${style.lableStyle}`}>
                  {fieldData.label}
                  {(isLableEmpty(fieldData.label)
                    ? false
                    : object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                    (parentData !== null
                      ? parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                      : false)) && "*"}
                </div>
                <div className={style.marginTop10}>
                  <CKEditor
                    editor={ClassicEditor}
                    data={
                      getValueByPath(
                        basicForm,
                        `${basicpath}.${baseKey}.${fieldKey}`
                      ) || ""
                    }
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      handleChange(fieldKey, data, baseKey);
                    }}
                    onReady={(editor) => {
                      editor.editing.view.change((writer) => {
                        writer.setStyle(
                          "height",
                          "150px",
                          editor.editing.view.document.getRoot()
                        );
                      });
                    }}
                    config={{
                      placeholder: "Enter your response here...",
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
              </div>
            );
          }
        case "cellNumber":
          if (isPOD) {
            return (
              <div>
                <div className={`${style.lableStylePOD}`}>
                  {fieldData.label}
                  {isLableEmpty(fieldData.label)
                    ? false
                    : (object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                      (parentData !== null
                        ? parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                        : false)) &&
                    "*"}
                </div>
                <hr className={style.borderLine} />
                <div className={style.lableReadOnlyStyleInPOD}>
                  {getValueByPath(
                    basicForm,
                    `${basicpath}.${baseKey}.${fieldKey}`
                  ) || "-"}
                </div>
              </div>
            );
          } else {
            console.log(parentData, fieldData, "371");
            return (
              <CommonPhoneField
                value={
                  getValueByPath(
                    basicForm,
                    `${basicpath}.${baseKey}.${fieldKey}`
                  ) || ""
                }
                className={style.fullWidth}
                onChange={(e) => {
                  const formattedValue = FormatPhoneNumber(e.target.value);
                  handleChange(fieldKey, formattedValue, baseKey);

                  // Dynamically update mobileNumber if cellPhone is updated
                  if (fieldKey === "cellPhone") {
                    handleChange("mobileNumber", formattedValue, baseKey);
                  }
                }}
                placeholder={
                  fieldData.placeHolder !== null
                    ? fieldData.placeHolder
                    : fieldData.label !== null
                      ? `Enter ${fieldData.label}`
                      : null
                }
                label={fieldData.label}
                required={
                  isLableEmpty(fieldData.label)
                    ? false
                    : object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                    (parentData !== null
                      ? parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                      : false)
                }
                warning={warningFields
                  ?.map((data) => data?.key)
                  ?.includes(`${basicpath}.${baseKey}.${fieldKey}`)}
              />
            );
          }
        case "datepicker":

          const shouldSetMinDateToToday = (() => {
            const customValidations = (object?.type === 'object') ? object?.customValidations : object?.items?.customValidations;
            const validation = customValidations?.find((validation) => {
              const validationDate1 = validation.parameters.date1;
              const fieldPath = `${baseKey}.${fieldKey}`;
              return (
                validation.condition === "Date1GreaterThanCurrentDate" &&
                (validationDate1 === fieldPath || validationDate1 === fieldKey) // Match with or without prefix
              );
            });

            console.log(
              "Validation for Date1GreaterThanCurrentDate:",
              validation,
              "Expected:",
              `${baseKey}.${fieldKey}`
            );

            return !!validation; // Return true if validation exists
          })();

          const shouldSetMaxDateToToday = (() => {
            const customValidations = (object?.type === 'object') ? object?.customValidations : object?.items?.customValidations;
            const validation = customValidations?.find((validation) => {
              const validationDate1 = validation.parameters.date1;
              const fieldPath = `${baseKey}.${fieldKey}`;
              return (
                validation.condition === "Date1LesserThanCurrentDate" &&
                (validationDate1 === fieldPath || validationDate1 === fieldKey) // Match with or without prefix
              );
            });

            console.log(
              "Validation for Date1LesserThanCurrentDate:",
              validation,
              "Expected:",
              `${baseKey}.${fieldKey}`,
              object
            );

            return !!validation; // Return true if validation exists
          })();

          // Check if Date2 is greater than Date1
          const minDateForDate2 = (() => {
            const customValidations = (object?.type === 'object') ? object?.customValidations : object?.items?.customValidations;
            const validation = customValidations?.find((validation) =>
              validation.condition === "Date2GreaterThanDate1" &&
              validation.parameters.date2 === `${baseKey}.${fieldKey}`
            );
            if (validation) {
              const date1Path = `${basicpath}.${baseKey}.${validation.parameters.date1.split('.').pop()}`;
              const date1Value = getValueByPath(basicForm, date1Path);
              if (isValidDate(date1Value)) {
                return new Date(date1Value);
              }
            }
            return null;
          })();

          // Check if the birthday should be less than today
          const customValidationsForBirthday = (object?.type === 'object') ? object?.customValidations : object?.items?.customValidations;
          const shouldSetMaxDateForBirthday = customValidationsForBirthday?.some(
            (validation) =>
              validation.condition === "Age_GreaterThan18LessThan100" &&
              `${baseKey}.${fieldKey}` === validation.parameters.date1
          );
          const currentDate = new Date();
          const maxDateForBirthday = new Date(
            currentDate.getFullYear() - 18,
            currentDate.getMonth(),
            currentDate.getDate()
          );
          const minDateForBirthday = new Date(
            currentDate.getFullYear() - 100,
            currentDate.getMonth(),
            currentDate.getDate()
          );
          // Final minDate logic
          const minDate = (() => {
            if (shouldSetMinDateToToday) {
              return new Date(); // Today's date for Date1GreaterThanCurrentDate
            }
            if (minDateForDate2) {
              return minDateForDate2; // Date2 > Date1 logic
            }
            if (shouldSetMaxDateForBirthday) {
              return minDateForBirthday
            }
            return null; // Default
          })();

          const maxDate = shouldSetMaxDateForBirthday ? maxDateForBirthday : shouldSetMaxDateToToday ? new Date() : null;



          console.log("shouldSetMinDateToToday:", shouldSetMinDateToToday);
          console.log("shouldSetMaxDateToToday:", shouldSetMaxDateToToday);
          console.log("minDateForDate2:", minDateForDate2);
          console.log("Final minDate:", minDate, maxDate);

          if (isPOD) {
            return (
              <div>
                <div className={`${style.lableStylePOD}`}>
                  {fieldData.label}
                  {isLableEmpty(fieldData.label)
                    ? false
                    : (object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                      (parentData !== null
                        ? parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                        : false)) &&
                    "*"}
                </div>
                <hr className={style.borderLine} />
                <div className={style.lableReadOnlyStyleInPOD}>
                  {getValueByPath(
                    basicForm,
                    `${basicpath}.${baseKey}.${fieldKey}`
                  ) !== undefined &&
                    isValidDate(
                      getValueByPath(
                        basicForm,
                        `${basicpath}.${baseKey}.${fieldKey}`
                      )
                    )
                    ? format(
                      new Date(
                        getValueByPath(
                          basicForm,
                          `${basicpath}.${baseKey}.${fieldKey}`
                        )
                      ),
                      canadaData?.dateFormat || "dd/MM/yyyy"
                    )
                    : (getValueByPath(
                      basicForm,
                      `${basicpath}.${baseKey}.${fieldKey}`
                    ) !== undefined && getValueByPath(
                      basicForm,
                      `${basicpath}.${baseKey}.${fieldKey}`
                    ) !== "" && getValueByPath(
                      basicForm,
                      `${basicpath}.${baseKey}.${fieldKey}`
                    )) ? format(
                      new Date(
                        getValueByPath(
                          basicForm,
                          `${basicpath}.${baseKey}.${fieldKey}`
                        )
                      ),
                      canadaData?.dateFormat || "dd/MM/yyyy"
                    ) : "-"}
                </div>
              </div>
            );
          } else {
            return (
              <CommonDateField
                className={style.fullWidth}
                open={calendarStart}
                onOpen={() => setCalendarStart(true)}
                onClose={() => setCalendarStart(false)}
                // minDate={sub(new Date(), { years: 3 })}
                // maxDate={add(new Date(), { months: 6 })}
                value={
                  getValueByPath(
                    basicForm,
                    `${basicpath}.${baseKey}.${fieldKey}`
                  ) || null
                }
                onChange={(newValue) =>
                  handleChange(
                    fieldKey,
                    fieldData.format === "date-time"
                      ? format(new Date(newValue), "yyyy-MM-dd'T'HH:mm:ss'Z'")
                      : format(new Date(newValue), "yyyy-MM-dd'T'00:00"),
                    baseKey
                  )
                }
                minDate={minDate}
                maxDate={maxDate}
                InputProps={{
                  style: {
                    fontSize: 14,
                    height: 30,
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      placeholder:
                        fieldData.placeHolder !== null
                          ? fieldData.placeHolder
                          : fieldData.label !== null
                            ? `Enter ${fieldData.label}`
                            : null,
                      readOnly: true,
                    }}
                    color={
                      warningFields
                        ?.map((data) => data?.key)
                        ?.includes(`${basicpath}.${baseKey}.${fieldKey}`) &&
                        (getValueByPath(
                          basicForm,
                          `${basicpath}.${baseKey}.${fieldKey}`
                        ) === null ||
                          getValueByPath(
                            basicForm,
                            `${basicpath}.${baseKey}.${fieldKey}`
                          ) === "")
                        ? "error"
                        : ""
                    }
                    fullWidth
                    focused={
                      warningFields
                        ?.map((data) => data?.key)
                        ?.includes(`${basicpath}.${baseKey}.${fieldKey}`) &&
                        (getValueByPath(
                          basicForm,
                          `${basicpath}.${baseKey}.${fieldKey}`
                        ) === null ||
                          getValueByPath(
                            basicForm,
                            `${basicpath}.${baseKey}.${fieldKey}`
                          ) === "")
                        ? true
                        : false
                    }
                  // style={
                  //     warningFields?.map(data => data?.key)?.includes(`${basicpath}.${baseKey}.${fieldKey}`)
                  //         && (value === '' || value === null || value === undefined)
                  //         ? { border: '2px solid #cc0000', borderRadius: '5px' }
                  //         : {}
                  // }
                  />
                )}
                label={fieldData.label}
                required={
                  isLableEmpty(fieldData.label)
                    ? false
                    : object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                    (parentData !== null
                      ? parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                      : false)
                }
              />
            );
          }
        case "radiobutton":
          if (isPOD) {
            return null;
          }
          return (
            <div
              className={`${style.spaceBetween} ${style.verticalAlignCenter}`}
            >
              <div
                className={`${style.lableRadioStyle} ${fieldData.label !== null ? style.marginRight : ""
                  }`}
              >
                {fieldData.label}
                {(isLableEmpty(fieldData.label)
                  ? false
                  : object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                  (parentData !== null
                    ? parentData.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                    : false)) && "*"}
              </div>
              <CommonRadio
                className={style.leftAlign}
                value={
                  getValueByPath(
                    basicForm,
                    `${basicpath}.${baseKey}.${fieldKey}`
                  ) || null
                }
                onChange={
                  isPOD
                    ? () => { }
                    : (e) => handleChange(fieldKey, e.target.value, baseKey)
                }
                radioValue={fieldData.enum}
                label={fieldData.enum}
                required={
                  isLableEmpty(fieldData.label)
                    ? false
                    : object.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                    (parentData !== null
                      ? parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                      : false)
                }
                warning={warningFields
                  ?.map((data) => data?.key)
                  ?.includes(`${basicpath}.${baseKey}.${fieldKey}`)}
              />
            </div>
          );
        case "referenceRadioButton":
          if (isPOD) {
            return (
              <div
                className={`${refGridStyle} ${style.verticalAlignCenter} ${style.refRadioCard} ${style.marginBottom5}`}
              >
                <div
                  className={`${style.lableRadioStyle} ${fieldData.label !== null ? style.marginRight : ""
                    }`}
                >
                  {fieldData.label}
                  {(isLableEmpty(fieldData.label)
                    ? false
                    : object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                    (parentData !== null
                      ? parentData.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                      : false)) && "*"}
                </div>
                <CommonRadio
                  isRow={false}
                  showInCustomCol={true}
                  customRadioStyle={customRadioStyle}
                  className={`${style.centerAlign}`}
                  value={
                    getValueByPath(
                      basicForm,
                      `${basicpath}.${baseKey}.${fieldKey}`
                    ) || null
                  }
                  // onChange={
                  //   isPOD
                  //     ? () => { }
                  //     : (e) => handleChange(fieldKey, e.target.value, baseKey)
                  // }
                  radioValue={fieldData.enum}
                  label={referenceRadioShowLabel ? fieldData.enum : []}
                  required={
                    isLableEmpty(fieldData.label)
                      ? false
                      : object.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                      (parentData !== null
                        ? parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                        : false)
                  }
                  warning={warningFields
                    ?.map((data) => data?.key)
                    ?.includes(`${basicpath}.${baseKey}.${fieldKey}`)}
                  checkedColor={alternateReferenceRadioColor ? alternateReferenceRadioColor : referenceRadioColor}
                />
              </div>
            );
          }
          return (
            <div
              className={`${refGridStyle} ${style.verticalAlignCenter} ${style.refRadioCard} ${style.marginBottom5}`}
            >
              <div
                className={`${style.lableRadioStyle} ${fieldData.label !== null ? style.marginRight : ""
                  }`}
              >
                {fieldData.label}
                {(isLableEmpty(fieldData.label)
                  ? false
                  : object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                  (parentData !== null
                    ? parentData.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                    : false)) && "*"}
              </div>
              <CommonRadio
                isRow={false}
                showInCustomCol={true}
                customRadioStyle={customRadioStyle}
                className={`${style.centerAlign}`}
                value={
                  getValueByPath(
                    basicForm,
                    `${basicpath}.${baseKey}.${fieldKey}`
                  ) || null
                }
                onChange={
                  isPOD
                    ? () => { }
                    : (e) => handleChange(fieldKey, e.target.value, baseKey)
                }
                radioValue={fieldData.enum}
                label={referenceRadioShowLabel ? fieldData.enum : []}
                required={
                  isLableEmpty(fieldData.label)
                    ? false
                    : object.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                    (parentData !== null
                      ? parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                      : false)
                }
                warning={warningFields
                  ?.map((data) => data?.key)
                  ?.includes(`${basicpath}.${baseKey}.${fieldKey}`)}
                checkedColor={alternateReferenceRadioColor ? alternateReferenceRadioColor : referenceRadioColor}
              />
            </div>
          );
        case "disclosureRadioButton":
          if (fieldData.priorDataComparisonNeeded === true) {
            const priorData = basicForm?.forms?.[formIndex]?.priorData?.disclosures?.[baseKey?.split('.')?.[1]]?.[fieldKey];
            const currentValue = getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`);
            const isConflict = priorData !== undefined && priorData !== null && currentValue !== undefined && currentValue !== null && currentValue !== priorData;
            let isIssueResolved = basicForm?.forms?.[formIndex]?.data?.disclosures?.[baseKey?.split('.')?.[1]][parentData?.allOf?.filter(data => fieldKey in data?.if?.properties)[0]?.then?.required[2]] !== undefined && basicForm?.forms?.[formIndex]?.data?.disclosures?.[baseKey?.split('.')?.[1]][parentData?.allOf?.filter(data => fieldKey in data?.if?.properties)[0]?.then?.required[2]] !== null;
            let isShowAdditionalFields = parentData?.allOf?.filter(data => fieldKey in data?.if?.properties)[0]?.if?.properties?.[fieldKey]?.const;
            console.log("Disclosure Conflict", isConflict, fieldKey, priorData, parentData, fieldData.priorDataComparisonNeeded, fieldData, currentValue !== priorData, currentValue, priorData, basicForm?.forms?.[formIndex]?.priorData?.disclosures?.[baseKey?.split('.')?.[1]], basicForm?.forms?.[formIndex], formIndex, isShowAdditionalFields, priorData !== undefined, priorData !== null, currentValue !== undefined, currentValue !== null, currentValue !== priorData, isShowAdditionalFields !== currentValue)
            console.log("currentValue2", currentValue)
            if (isConflict && !showPriorDataDialog && !isIssueResolved && isShowAdditionalFields !== currentValue) {
              setDisclosureBaseKey(baseKey?.split('.')?.[1])
              setDisclosureFieldKey(fieldKey)
              setDisclosureSchema(parentData)
              setShowPriorDataDialog(true)
            }
          }
          const currentValue = getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`);
          console.log("currentValue1", currentValue);
          const additionalFields = parentData?.allOf?.filter(data => fieldKey in data?.if?.properties)?.[0]?.then?.required || [];

          // Identify CKEditor and File Upload fields dynamically
          const ckEditorFields = additionalFields.filter(key => parentData?.properties?.[key]?.fieldType === "ckeditor");
          const fileUploadFields = additionalFields.filter(key => parentData?.properties?.[key]?.fieldType === "fileupload");

          const isRequired =
            !isLableEmpty(fieldData.label) &&
            (object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
              ((parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)) ?? false));

          const insertAsteriskBeforeClosingP = (html) => {
            return isRequired
              ? html.replace(
                /<\/p>/i,
                '<span style="color:#171A1A;"> *</span></p>'
              )
              : html;
          };

          const labelWithAsterisk = insertAsteriskBeforeClosingP(fieldData.label);




          return (
            <div
              className={`${style.disclosureGrid} ${style.verticalAlignCenter}`}
            >
              {/* <div className={!isPOD ? style.disclosureLabelGrid : style.displayInRow}> */}
              <div className={style.disclosureLabelGrid}>
                {/* {!isPOD && ( */}
                <div className={`${style.lableRadioSerialNumberStyle}`}>
                  {fieldData.serialNumber !== null
                    ? `${fieldData.serialNumber}. `
                    : ""}
                </div>
                {/* )} */}
                <div
                  className={`${style.lableRadioStyle} ${!isPOD ? fieldData.serialNumber !== null ? style.marginLeft10 : "" : ""
                    } ${fieldData.label !== null ? style.marginRight : ""} ${style.displayInRow}`} style={{ display: 'inline' }}
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: labelWithAsterisk,
                    }}
                  />
                </div>
              </div>
              {isPOD ? (
                <span className={currentValue === 'Yes' ? style.RadiobuttonYesStyle : style.RadiobuttonNoStyle}>
                  {currentValue}
                </span>
              ) : (
                <CommonRadio
                  className={style.leftAlign}
                  value={
                    getValueByPath(
                      basicForm,
                      `${basicpath}.${baseKey}.${fieldKey}`
                    ) || null
                  }
                  onChange={isPOD ? () => { } : (e) => {
                    const newValue = e.target.value;
                    handleChange(fieldKey, newValue, baseKey);

                    if (currentValue !== newValue) {
                      console.log("Disclosure toggled! Resetting CKEditor and File Upload...");

                      ckEditorFields.forEach((ckField) => {
                        handleChange(ckField, "", baseKey);
                      });

                      fileUploadFields.forEach((fileField) => {
                        handleChange(fileField, null, baseKey);
                      });
                    }
                  }}
                  radioValue={fieldData.enum}
                  label={fieldData.enum}
                  required={
                    isLableEmpty(fieldData.label)
                      ? false
                      : object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                      (parentData !== null
                        ? parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                        : false)
                  }
                  warning={warningFields
                    ?.map((data) => data?.key)
                    ?.includes(`${basicpath}.${baseKey}.${fieldKey}`)}
                />
              )}
            </div>
          );

        case "switchbutton": {
          const currentValue = getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) === true ? "Yes" : ((getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) === false || getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) === undefined) && fieldKey === "registeredBusinessAddress") ? "This applicant has no business address" : "No";
          console.log("currentValueee", currentValue, fieldKey)
          return isPOD ? (
            <div className={style.leftAlign}>
              <span>{fieldData.label}:</span>
              <span className={`${style.marginLeft10} ${currentValue === 'Yes' ? style.RadiobuttonYesStyle : style.RadiobuttonNoStyle}`}>
                {currentValue}
              </span>
            </div>
          ) : (
            <CommonSwitch
              label={
                getValueByPath(
                  basicForm,
                  `${basicpath}.${baseKey}.${fieldKey}`
                ) === true
                  ? "YES"
                  : "NO"
              }
              checked={
                getValueByPath(
                  basicForm,
                  `${basicpath}.${baseKey}.${fieldKey}`
                ) || null
              }
              onChange={
                isPOD
                  ? () => { }
                  : (e) => handleChange(fieldKey, e.target.checked, baseKey)
              }
              labelName={fieldData.label}
              required={
                isLableEmpty(fieldData.label)
                  ? false
                  : object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                  (parentData !== null
                    ? parentData?.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                    : false)
              }
            />
          )
        };
        case "checkbox":
          if (isPOD) {
            return <div></div>;
          } else {
            return (
              <CommonCheckBox
                checked={
                  getValueByPath(
                    basicForm,
                    `${basicpath}.${baseKey}.${fieldKey}`
                  ) || null
                }
                onChange={(e) =>
                  handleChange(fieldKey, e.target.checked, baseKey)
                }
                label={`${fieldData.label}${(
                  isLableEmpty(fieldData.label)
                    ? false
                    : object?.required?.includes(fieldKey) || object?.then?.required?.includes(fieldKey) ||
                    (parentData !== null
                      ? parentData.required?.includes(fieldKey) || parentData?.then?.required?.includes(fieldKey)
                      : false)
                )
                  ? "*"
                  : ""
                  }`}
              />
            );
          }
        case "sitecheckbox":
          if (isPOD) {
            return <div></div>;
          } else {
            return (
              <div
                className={`${style.siteDisplayCard} ${style.siteDisplayGrid} ${style.verticalAlignCenter}`}
              >
                <CommonCheckBox
                  checked={
                    getValueByPath(
                      basicForm,
                      `${basicpath}.${baseKey}.${fieldKey}`
                    ) || null
                  }
                  onChange={(e) =>
                    handleChange(fieldKey, e.target.checked, baseKey)
                  }
                />
                <div>
                  <div className={style.siteDisplaySiteTextStyle}>
                    Cambridge Memorial Hospital{" "}
                  </div>
                  <div className={style.siteDisplayDepartmentTextStyle}>
                    Department of Surgery (Cardiothoracic Surgery)
                  </div>
                </div>
              </div>
            );
          }
        case "addMoreFileupload":
          if (isPOD) {
            const fieldValue = getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`);
            const fileURL = fieldValue?.fileURL;
            const fileValid = fileURL && fileURL !== "" && fileURL !== null;
            if (fileValid) {
              return <div key={fieldKey}>
                <div className={`${style.uploadButton}`}>
                  <div className={style.uploadGridPOD}>
                    {getValueByPath(
                      basicForm,
                      `${basicpath}.${baseKey}.${fieldKey}`
                    ) !== undefined &&
                      getValueByPath(
                        basicForm,
                        `${basicpath}.${baseKey}.${fieldKey}`
                      ) !== null &&
                      getValueByPath(
                        basicForm,
                        `${basicpath}.${baseKey}.${fieldKey}`
                      ) !== "" &&
                      getValueByPath(
                        basicForm,
                        `${basicpath}.${baseKey}.${fieldKey}`
                      )?.fileURL !== null ? (
                      <img
                        src={VerifiedImage}
                        alt=""
                        className={`${style.imgIcon} ${style.cursorPointer}`}
                        onClick={() => {
                          setShowFileDisplayDialog(true); setselectedFile(
                            getValueByPath(
                              basicForm,
                              `${basicpath}.${baseKey}.${fieldKey}`
                            )
                          );
                        }
                        }
                      />
                    ) : (
                      <img
                        src={ToBeVerifiedImage}
                        alt=""
                        className={style.imgIcon}
                      />
                    )}
                    <div
                      className={`${style.uploadText} ${style.verticalAlignCenter}`}
                    >
                      {getValueByPath(
                        basicForm,
                        `${basicpath}.${baseKey}.${fieldKey}`
                      )?.fileName}
                    </div>
                    <div className={`${style.uploadText} ${style.cursorPointer} ${style.verticalAlignCenter}`}
                      onClick={() => {
                        setShowFileDisplayDialog(true); setselectedFile(
                          getValueByPath(
                            basicForm,
                            `${basicpath}.${baseKey}.${fieldKey}`
                          )
                        );
                      }}
                    >View</div>
                  </div>
                </div>
              </div>;
            }
          } else {
            let isDocAvailable = (getValueByPath(
              basicForm,
              `${basicpath}.${baseKey}.${fieldKey}`
            ) !== undefined &&
              getValueByPath(
                basicForm,
                `${basicpath}.${baseKey}.${fieldKey}`
              ) !== null &&
              getValueByPath(
                basicForm,
                `${basicpath}.${baseKey}.${fieldKey}`
              ) !== "" &&
              getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`)
                ?.fileURL !== null);
            console.log(isDocAvailable, "checkstring", getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`)?.fileURL, basicForm, `${basicpath}.${baseKey}.${fieldKey}`);
            return (
              <div className={`${style.addMoreUpload} ${style.addMoreUploadMargin}`}>
                <div className={style.marginLeft10}>
                  <label
                    for={`addMore-file-upload-dynamic-${fieldKey}`}
                    className={`${style.displayInRow} ${style.cursorPointer} `}
                  >
                    <Tooltip title={isDocAvailable ? "Click to replace" : "Click to upload"}>
                      <FileUploadOutlinedIcon sx={{ color: '#000' }} />
                    </Tooltip>
                  </label>
                </div>
                <input
                  id={`addMore-file-upload-dynamic-${fieldKey}`}
                  type="file"
                  accept=".pdf,.doc,.png,.xls,.xlsx,.jpeg,.gif,.docx"
                  onChange={(e) => {
                    const selectedFile = e.target.files[0];
                    console.log(basicForm?.forms?.[formIndex]?.formCategory, 'Add More File Check')

                    setBasicForm((prevData) => {
                      const newData = { ...prevData };
                      setNestedValue(newData, `${basicpath}.${baseKey}.${fieldKey}`, {
                        fileName: selectedFile.name,
                      });
                      return newData;
                    });


                    handleChange(fieldKey, selectedFile, baseKey);
                  }}
                />
                <div>
                  {isDocAvailable ? (
                    <div
                      onClick={() => {
                        setShowFileDisplayDialog(true);
                        setselectedFile(
                          getValueByPath(
                            basicForm,
                            `${basicpath}.${baseKey}.${fieldKey}`
                          )
                        );
                      }}
                    >
                      <img
                        src={VerifiedImage}
                        alt=""
                        className={`${style.imgIcon} ${style.cursorPointer}`}
                      />
                    </div>
                  ) : (
                    <>
                      <div>
                        <img
                          src={ToBeVerifiedImage}
                          alt=""
                          className={style.imgIcon}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          }
        case "fileupload":
          if (isPOD) {
            const fieldValue = getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`);
            const fileURL = fieldValue?.fileURL;
            const fileValid = fileURL && fileURL !== "" && fileURL !== null;
            if (fileValid) {
              return <div key={fieldKey}>
                <div className={`${style.uploadButton}`}>
                  <div className={style.uploadGrid}>
                    {getValueByPath(
                      basicForm,
                      `${basicpath}.${baseKey}.${fieldKey}`
                    ) !== undefined &&
                      getValueByPath(
                        basicForm,
                        `${basicpath}.${baseKey}.${fieldKey}`
                      ) !== null &&
                      getValueByPath(
                        basicForm,
                        `${basicpath}.${baseKey}.${fieldKey}`
                      ) !== "" &&
                      getValueByPath(
                        basicForm,
                        `${basicpath}.${baseKey}.${fieldKey}`
                      )?.fileURL !== null ? (
                      <img
                        src={VerifiedImage}
                        alt=""
                        className={`${style.imgIcon} ${style.cursorPointer}`}
                        onClick={() => {
                          setShowFileDisplayDialog(true); setselectedFile(
                            getValueByPath(
                              basicForm,
                              `${basicpath}.${baseKey}.${fieldKey}`
                            )
                          );
                        }
                        }
                      />
                    ) : (
                      <img
                        src={ToBeVerifiedImage}
                        alt=""
                        className={style.imgIcon}
                      />
                    )}
                    <div
                      className={`${style.uploadText} ${style.cursorPointer} ${style.verticalAlignCenter}`}
                    >
                      {getValueByPath(
                        basicForm,
                        `${basicpath}.${baseKey}.${fieldKey}`
                      )?.fileName}
                    </div>
                  </div>
                </div>
                {/* {fileValid && (
                  <div className={style.uploadButton2}>
                    <div className={style.uploadGrid2}>

                      <Tooltip title="Click to View File" placement="bottom-start" followCursor arrow>
                        <span
                          className={`${style.uploadText2} ${style.cursorPointer} ${style.verticalAlignCenter}`}
                          onClick={() => {
                            setShowFileDisplayDialog(true);
                            setselectedFile(
                              fieldValue
                            );

                          }}
                        >
                          {fieldValue?.fileName}
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                )} */}
              </div>;
            }
          } else {
            console.log(
              getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`),
              "filecheck"
            );
            return (
              <div key={fieldKey}>
                <div className={`${style.uploadButton}`}>
                  <div className={style.uploadGrid}>
                    {getValueByPath(
                      basicForm,
                      `${basicpath}.${baseKey}.${fieldKey}`
                    ) !== undefined &&
                      getValueByPath(
                        basicForm,
                        `${basicpath}.${baseKey}.${fieldKey}`
                      ) !== null &&
                      getValueByPath(
                        basicForm,
                        `${basicpath}.${baseKey}.${fieldKey}`
                      ) !== "" &&
                      getValueByPath(
                        basicForm,
                        `${basicpath}.${baseKey}.${fieldKey}`
                      )?.fileURL !== null ? (
                      <img
                        src={VerifiedImage}
                        alt=""
                        className={`${style.imgIcon} ${style.cursorPointer}`}
                        onClick={() => {
                          setShowFileDisplayDialog(true); setselectedFile(
                            getValueByPath(
                              basicForm,
                              `${basicpath}.${baseKey}.${fieldKey}`
                            )
                          );
                        }
                        }
                      />
                    ) : (
                      <img
                        src={(
                          isLableEmpty(fieldData.label)
                            ? false
                            : object.required?.includes(fieldKey) ||
                            (parentData !== null
                              ? parentData.required?.includes(fieldKey)
                              : false)
                        ) ? ToBeVerifiedImage : NotVerifiedImage}
                        alt=""
                        className={style.imgIcon}
                      />
                    )}
                    <div
                      className={`${style.uploadText} ${style.cursorPointer} ${style.verticalAlignCenter}`}
                    >
                      {`${fieldData.label} (${(
                        isLableEmpty(fieldData.label)
                          ? false
                          : object.required?.includes(fieldKey) ||
                          (parentData !== null
                            ? parentData.required?.includes(fieldKey)
                            : false)
                      )
                        ? "Required"
                        : "Optional"
                        })`}
                    </div>
                    <div>
                      <Tooltip title="Click to upload a file" arrow>
                        <label
                          for={`file-upload-dynamic-${fieldKey}`}
                          className={` ${style.uploadTextButton} ${style.cursorPointer} ${style.verticalAlignCenter}`}
                        >
                          Click to upload
                        </label>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <input
                  id={`file-upload-dynamic-${fieldKey}`}
                  type="file"
                  accept=".pdf,.doc,.png,.xls,.xlsx,.jpeg,.gif,.docx"
                  onChange={(e) => {
                    const selectedFile = e.target.files[0];
                    console.log(basicForm?.forms?.[formIndex]?.formCategory, 'Disclosure Check')

                    setBasicForm((prevData) => {
                      const newData = { ...prevData };
                      setNestedValue(newData, `${basicpath}.${baseKey}.${fieldKey}`, {
                        fileName: selectedFile.name,
                      });
                      return newData;
                    });


                    handleChange(fieldKey, selectedFile, baseKey);
                  }}
                />
                {getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`)?.fileName && (
                  <div className={style.uploadButton2}>
                    <div className={style.uploadGrid2}>
                      <Tooltip title="Click to View File" placement="bottom-start" followCursor arrow   >
                        <span
                          className={`${style.uploadText2} ${style.cursorPointer} ${style.verticalAlignCenter}`}
                          onClick={() => {
                            setShowFileDisplayDialog(true);
                            console.log(getValueByPath(
                              basicForm,
                              `${basicpath}.${baseKey}.${fieldKey}`
                            )
                            );
                            setselectedFile(
                              getValueByPath(
                                basicForm,
                                `${basicpath}.${baseKey}.${fieldKey}`
                              )
                            );
                          }
                          }
                        >
                          {getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`)?.fileName}
                        </span>
                      </Tooltip>
                      <Tooltip title="Click to Delete File" arrow>
                        <img
                          src={DeleteIcon}
                          alt="Delete"
                          className={`${style.imgIcon} ${style.cursorPointer}`}
                          onClick={() => handleChange(fieldKey, null, baseKey)}
                        />
                      </Tooltip>
                    </div>
                  </div>
                )}
              </div>
            );
          }
        case "bulkFileupload":
          if (isPOD) {
            return <div></div>;
          } else {
            return (
              <CommonDropZone
                title={fieldData.label}
                description={fieldData.description}
                changeHandler={(acceptedFiles) => {
                  handleChange(fieldKey, acceptedFiles, baseKey);
                }}
              />
            );
          }
        default:
          return "";
      }
    }
  };

  const renderObjectFields = (object, properties) => {
    if (properties) {
      console.log("entered", properties);
      return Object.entries(properties).map(([key, data]) => {
        if (
          data.type === "object" &&
          data.properties &&
          data.fieldType === null
        ) {
          console.log("entered", data?.properties);
          if (object?.if === null) {
            console.log("entered", data?.properties);
            return Object.entries(data.properties).map(
              ([innerKey, innerData]) => {
                if (
                  innerData.type === "object" &&
                  innerData.properties &&
                  innerData.fieldType === null
                ) {
                  console.log("entered", innerData);
                  return Object.entries(innerData.properties).map(
                    ([innerKey2, innerData2]) => {
                      return renderField(
                        innerKey2,
                        innerData2,
                        `${baseKey}.${key}.${innerKey}`,
                        handleChange,
                        getValueByPath,
                        style,
                        calendarStart,
                        setCalendarStart,
                        innerData
                      );
                    }
                  );
                } else if (
                  innerData.type === "array" &&
                  innerData.items?.properties &&
                  innerData.fieldType === null
                ) {
                  console.log("entered", innerData);
                  return Object.entries(innerData.items.properties).map(
                    ([innerKey2, innerData2]) => {
                      return renderField(
                        innerKey2,
                        innerData2,
                        `${baseKey}.${key}.${innerKey}`,
                        handleChange,
                        getValueByPath,
                        style,
                        calendarStart,
                        setCalendarStart,
                        innerData
                      );
                    }
                  );
                } else if (
                  innerData.type === "object" &&
                  innerData.properties &&
                  innerData.fieldType !== null
                ) {
                  return renderField(
                    innerKey,
                    innerData,
                    `${baseKey}.${key}`,
                    handleChange,
                    getValueByPath,
                    style,
                    calendarStart,
                    setCalendarStart,
                    data
                  );
                } else {
                  return renderField(
                    innerKey,
                    innerData,
                    `${baseKey}.${key}`,
                    handleChange,
                    getValueByPath,
                    style,
                    calendarStart,
                    setCalendarStart,
                    data
                  );
                }
              }
            );
          } else if (
            object?.if !== null &&
            getValueByPath(
              basicForm,
              `${basicpath}.${baseKey}.${Object.entries(
                object?.if?.properties
              )?.map(([key, data]) => key)}`
            ) ===
            Object.entries(object?.if?.properties)?.map(
              ([key, data]) => data
            )[0]?.const
          ) {
            console.log(
              getValueByPath(
                basicForm,
                `${basicpath}.${baseKey}.${Object.entries(
                  object?.if?.properties
                )?.map(([key, data]) => key)}`
              ),
              "value if",
              Object.entries(object?.if?.properties)?.map(
                ([key, data]) => data
              )[0]?.const,
              "data",
              data
            );
            return Object.entries(data.properties).map(
              ([innerKey, innerData]) => {
                console.log(innerData);
                if (
                  innerData.type === "object" &&
                  innerData.properties &&
                  innerData.fieldType === null
                ) {
                  console.log("entered", innerData);
                  return Object.entries(innerData.properties).map(
                    ([innerKey2, innerData2]) => {
                      return renderField(
                        innerKey2,
                        innerData2,
                        `${baseKey}.${key}.${innerKey}`,
                        handleChange,
                        getValueByPath,
                        style,
                        calendarStart,
                        setCalendarStart,
                        innerData
                      );
                    }
                  );
                } else if (
                  innerData.type === "array" &&
                  innerData.items?.properties
                ) {
                  console.log("entered", innerData);
                  return Object.entries(innerData.items.properties).map(
                    ([innerKey2, innerData2]) => {
                      return renderField(
                        innerKey2,
                        innerData2,
                        `${baseKey}.${key}.${innerKey}`,
                        handleChange,
                        getValueByPath,
                        style,
                        calendarStart,
                        setCalendarStart,
                        innerData
                      );
                    }
                  );
                } else {
                  return renderField(
                    innerKey,
                    innerData,
                    `${baseKey}.${key}`,
                    handleChange,
                    getValueByPath,
                    style,
                    calendarStart,
                    setCalendarStart,
                    data
                  );
                }
              }
            );
          } else {
            console.log(
              getValueByPath(
                basicForm,
                `${basicpath}.${baseKey}.${Object.entries(
                  object?.if?.properties
                )?.map(([key, data]) => key)}`
              ),
              "value if",
              Object.entries(object?.if?.properties)?.map(
                ([key, data]) => data
              )[0]?.const,
              "data",
              data,
              `${basicpath}.${baseKey}.${Object.entries(
                object?.if?.properties
              )?.map(([key, data]) => key)}`,
              basicForm
            );
            console.log("entered", data, "if");
            return Object.keys(data.properties)
              ?.filter((data) => data !== data?.then?.required)
              .map(([innerKey, innerData]) => {
                return renderField(
                  innerKey,
                  innerData,
                  `${baseKey}.${key}`,
                  handleChange,
                  getValueByPath,
                  style,
                  calendarStart,
                  setCalendarStart,
                  data
                );
              });
          }
        } else if (
          data.type === "array" &&
          data.items?.properties &&
          data.fieldType === null
        ) {
          return Object.entries(data.items.properties).map(
            ([innerKey, innerData]) => {
              return renderField(
                innerKey,
                innerData,
                `${baseKey}.${key}`,
                handleChange,
                getValueByPath,
                style,
                calendarStart,
                setCalendarStart,
                data
              );
            }
          );
        } else if (
          data.type === "object" &&
          data.properties &&
          data.fieldType !== null
        ) {
          return renderField(
            key,
            data,
            baseKey,
            handleChange,
            getValueByPath,
            style,
            calendarStart,
            setCalendarStart,
            object?.items
          );
        } else {
          return renderField(
            key,
            data,
            baseKey,
            handleChange,
            getValueByPath,
            style,
            calendarStart,
            setCalendarStart,
            object?.items
          );
        }
      });
    }
    return null;
  };

  // const renderObjectFields = (object, properties) => {
  //     const renderFields = (data, path, parentObject) => {
  //         if (data.type === 'object' && data.properties && data.fieldType === null) {
  //             // Check for conditions
  //             console.log('entered', data, path.split('.').pop(), parentObject, data.if ? getValueByPath(basicForm, `${basicpath}.${path}.${Object.keys(data.if.properties)[0]}`) !== data.if.properties[Object.keys(data.if.properties)[0]].const : '-')
  //             if (data.if && getValueByPath(basicForm, `${basicpath}.${path}.${Object.keys(data.if.properties)[0]}`) !== data.if.properties[Object.keys(data.if.properties)[0]].const) {
  //                 console.log('entered', data, path, getValueByPath(basicForm, `${basicpath}.${path}.${Object.keys(data.if.properties)[0]}`), data.if.properties[Object.keys(data.if.properties)[0]].const)
  //                 return null;
  //             } else {
  //                 console.log('entered', data, path)
  //                 return Object.entries(data.properties).map(([key, value]) => renderFields(value, `${basicpath}.${path}.${key}`, data));
  //             }
  //         } else if (data.type === 'array' && data.items?.properties) {
  //             console.log('entered', data, path)
  //             return Object.entries(data.items.properties).map(([key, value]) => renderFields(value, `${basicpath}.${path}.${key}`, data));
  //         } else if (data.type === 'object' && data.properties && data.fieldType !== null) {
  //             return renderField(path.split('.').pop(), data, `${basicpath}.${path}`, handleChange, getValueByPath, style, calendarStart, setCalendarStart);
  //         } else {
  //             console.log('entered', data, path, path.split('.').pop())
  //             return renderField(path.split('.').pop(), data, `${basicpath}.${path}`, handleChange, getValueByPath, style, calendarStart, setCalendarStart);
  //         }
  //     };
  //     return properties ? Object.entries(properties).map(([key, data]) => renderFields(data, `${baseKey}.${key}`, object)) : null;
  // };

  // const getValueByPath = (obj, path) => {
  //     console.log(path, path.split('.').reduce((acc, part) => acc && acc[part], basicForm), basicForm)
  //     return path.split('.').reduce((acc, part) => acc && acc[part], basicForm);
  // };

  const generateRandomId = () => {
    return `id-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
  };

  const handleAddMore = (type, skip) => {
    let missingTemp = getMissingFields();
    console.log(
      type,
      "typeCheck",
      missingTemp,
      basicForm,
      baseKey,
      basicForm[baseKey],
      skip
    );
    if (missingTemp?.length === 0 || skip === "skipped") {
      let index = basicForm?.forms?.findIndex((data) => data?.id === formId);
      let temp = basicForm;
      console.log(basicForm[baseKey], "check");
      if (!isTableEdit) {
        if (temp.forms[index].data === null) {
          temp.forms[index].data = {};
          let withId = basicForm[baseKey];
          withId.rowId = generateRandomId();
          temp.forms[index].data[baseKey] = [withId];
        } else if (temp.forms[index].data[baseKey] === undefined) {
          temp.forms[index].data[baseKey] = [];
          let withId = basicForm[baseKey];
          withId.rowId = generateRandomId();
          temp.forms[index].data[baseKey].push(withId);
        } else if (basicForm[baseKey] !== undefined) {
          let withId = basicForm[baseKey];
          withId.rowId = generateRandomId();
          temp.forms[index].data[baseKey].push(withId);
        }
      }
      delete basicForm[baseKey];
      delete basicForm.undefined;
      setBasicForm(temp);
      if ((type === "close") && !isPOD) {
        setIsAddMore(false);
      }
      getIsSubmitClicked(true, temp, skip);
      console.log(
        basicForm?.forms?.filter((data) => data?.id === formId),
        basicForm[baseKey],
        "addMore",
        index,
        basicForm,
        basicForm.baseKey
      );
      setIsTableEdit(false);
    } else {
      setShowValidationDialog(true);
    }
  };

  const handleReappointmentUpdate = () => {
    delete basicForm[baseKey];
    delete basicForm.undefined;
    getIsSubmitClicked(true);
    setIsEdited(false);
    // setIsChanged(false);
  };

  const isValidDateString = (dateString) => {
    if (typeof dateString !== "string") {
      return false;
    }

    const formatString = "yyyy-MM-dd";

    // Check if the string matches the 'yyyy-MM-dd' format
    const regex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/;
    if (!regex.test(dateString)) {
      return false;
    }

    // Parse the string into a Date object
    const parsedDate = parse(dateString, formatString, new Date());

    // Ensure the date is valid and matches the original components
    return (
      isValid(parsedDate) && format(parsedDate, formatString) === dateString
    );
  };

  const isValidDate = (value) => {
    if (typeof value !== "string") return false;
    const regex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?)?$/;

    if (!regex.test(value)) return false;
    const parsed = parseISO(value);
    return isValid(parsed);
  };

  const getApplicantValues = (array) => {
    console.log(array, object?.tableHeaders);
    let temp = [];
    if (
      object?.tableHeaders !== null &&
      basicForm?.forms?.filter((data) => data?.id === formId)[0]?.data !== null
    ) {
      Object.keys(object?.tableHeaders)?.map((data, index) => {
        if (data === "data") {
          temp.push({ type: "dot", value: array?.map((innerData) => innerData[data] === "ACCEPTED" ? "darkgreen" : innerData[data] === "REJECTED" ? "red" : innerData[data] === "PENDING" ? "yellow" : "grey") });
          // temp.push({ "type": "icon", "icon": array?.map(innerData => <CheckCircleIcon style={{ fontSize: 25, color: '#25BF6A' }} onClick={() => { window.open(innerData?.file?.fileURL, '_blank'); }} />), 'isShowHoverText': false })
        } else if (data === "pod") {
          temp.push({ type: "dot", value: array?.map((innerData) => innerData[data] === "ACCEPTED" ? "darkgreen" : innerData[data] === "REJECTED" ? "red" : innerData[data] === "PENDING" ? "yellow" : "grey") });
          // temp.push({ "type": "icon", "icon": array?.map(innerData => <CheckCircleIcon style={{ fontSize: 25, color: '#25BF6A' }} onClick={() => { window.open(innerData?.file?.fileURL, '_blank'); }} />), 'isShowHoverText': false })
        } else if (data !== "file") {
          console.log(array, 'arraycheck')
          temp.push({
            type: "text",
            value: array?.map((innerData) =>
              innerData !== null
                ? isValidDate(innerData[data])
                  ? format(
                    new Date(innerData[data]),
                    "MMM dd, yyyy"
                  )
                  : innerData[data]
                : ""
            ),
            tooltipValueText: !isPOD ? ["Click to Edit"] : [],
            onClickFunction: !isPOD ? handleEdit : () => { },
          });
        } else {
          temp.push({
            type: "icon",
            icon: array?.map((innerData) => (
              <TextSnippetOutlinedIcon
                style={{ fontSize: 20, color: `${data?.subStatus}` }}
                onClick={() => {
                  window.open(innerData?.file?.fileURL, "_blank");
                }}
              />
            )),
            isShowHoverText: false,
          });
        }
        if (index === Object.keys(object?.tableHeaders)?.length - 1 && !isPOD) {
          temp.push({
            type: "icon",
            icon: array?.map((innerData) => (
              <img
                src={DeleteIcon}
                alt=""
                className={`${style.docTypeImgStyle} ${style.cursorPointer}`}
                onClick={() => {
                  toDelete.current = innerData;
                  setShowDeleteConfirmation(true);
                  // handleDelete(innerData);
                }}
              />
            )),
            isShowHoverText: false,
          });
        }
      });
    }
    console.log(temp, array);
    return temp;
  };

  const handleEdit = (data) => {
    setIsTableEdit(true);
    console.log(stepPath, basicForm);
    if (!isPOD) {
      setIsAddMore(true);
    }
    setBasicForm((prevData) => {
      const temp = { ...prevData };
      temp[stepPath] = {};
      temp[stepPath][baseKey] = data;
      return temp;
    });
  };

  const handleDelete = (data) => {
    let index = basicForm?.forms?.findIndex((data) => data?.id === formId);
    console.log(stepPath, basicForm, 'deleteCheck');
    let temp = basicForm;
    temp.forms[index].data[baseKey] = temp.forms[index].data[baseKey].filter(
      (obj) => !isEqual(obj, data)
    );
    console.log(temp, 'deleteCheck', data, toDelete.current);
    getIsSubmitClicked(true, temp);
  };

  const isEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  // const actions = [
  //     { data: "Edit", requiredValue: "boolean", onClick: handleEdit },
  //     { data: "Delete", requiredValue: "boolean", onClick: handleDelete },
  // ];

  // console.log(object, Object.entries(object?.properties)?.map(([data, details]) => data), Object.entries(object?.properties)?.map(([data, details]) => details?.properties !== null && details?.properties !== undefined && Object.entries(details?.properties)?.map(([innerKey, innerData]) => innerData?.label)),
  //     getValueByPath(basicForm, `${'applicant'}.${"name"}.${'firstName'}`))
  console.log(basicForm, object);

  // if (isLoading) {
  //     return (
  //         <div className={`${style.verticalAlignCenter} ${style.justifyCenter}`}>
  //             <img src={FileLoading} alt="" className={style.fileLoadingStyle} />
  //         </div>
  //     )
  // }
  return (
    <>
      {isLoading && (
        <div
          className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}
        >
          <img src={fileLoadingURL} alt="" className={style.fileLoadingStyle} />
        </div>
      )}
      <div
        className={`${window.location.pathname.includes("applicationForm") ||
          window.location.pathname.includes("reappointmentApplicationForm") ||
          window.location.pathname.includes("locumApplicationForm") ||
          isPOD || hideBackground
          ? ""
          : `${style.backgroundCard} ${style.marginTop10}`
          } ${style.marginTop10}`}
        key={baseKey}
      >
        {!isPOD && (
          <>
            {!isReappointment ? (
              <>
                <div className={style.cardTitle}>{object?.label}</div>
                {object?.description !== null && (
                  <div
                    className={`${style.addMoreDescriptionText} ${style.marginTop10}`}
                    dangerouslySetInnerHTML={{ __html: object?.description }}
                  />
                )}
              </>
            ) : (
              <div className={style.cardTitle}>{dataChangedObject?.label}</div>
            )}
          </>
        )}
        {addMoreType && !collapsableQuestionCard ? (
          <div>
            {!isPOD && (
              <div className={`${style.addMoreBorder} ${style.marginTop}`}>
                {isAddMore ? (
                  <div className={style.padding20}>
                    <div
                      className={style.addMoreText}
                      dangerouslySetInnerHTML={{ __html: object?.items?.label }}
                    />
                    <div className={`${gridStyle} ${style.marginTop}`}>
                      {object?.type === "object"
                        ? renderObjectFields(object, object?.properties)
                        : object?.type === "array"
                          ? renderObjectFields(object, object?.items?.properties)
                          : renderObjectFields(object, object?.properties)}
                    </div>
                    <div
                      className={`${style.displayInRowRev} ${style.marginTop}`}
                    >
                      <div className={style.marginLeft}>
                        <Tooltip title={"Click to Save & Close"} arrow>
                          <div
                            className={`${style.addMoreButton}`}
                            onClick={() => {
                              addMoreRef.current = "close"
                              handleAddMore("close");
                            }}
                          >
                            SAVE & CLOSE
                          </div>
                        </Tooltip>
                      </div>
                      <div>
                        <Tooltip title={"Click to Save & Addmore"} arrow>
                          <div
                            className={`${style.addMoreButtonOutlined}`}
                            onClick={() => {
                              addMoreRef.current = ""
                              handleAddMore("");
                            }}
                          >
                            SAVE & ADD MORE
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`${style.spaceBetween} ${style.verticalAlignCenter} ${style.padding10}`}
                  >
                    <div
                      className={style.addMoreText}
                      dangerouslySetInnerHTML={{ __html: object?.items?.label }}
                    />
                    <Tooltip title={"Click to Add"} arrow>
                      <div
                        className={`${style.addMoreButton} ${style.addMoreButtonFlexEnd} ${style.marginLeft}`}
                        onClick={() => setIsAddMore(true)}
                      >
                        ADD
                      </div>
                    </Tooltip>
                  </div>
                )}
              </div>
            )}
            {object?.tableHeaders !== null && (
              <TableTwo
                tableHeaderValues={Object.values(object?.tableHeaders)}
                tableDataValues={
                  basicForm?.forms?.filter((data) => data?.id === formId)[0]
                    ?.data !== null
                    ? getApplicantValues(
                      basicForm?.forms?.filter(
                        (data) => data?.id === formId
                      )[0]?.data[baseKey]
                    )
                    : []
                }
                tableData={
                  basicForm?.forms?.filter((data) => data?.id === formId)[0]
                    ?.data !== null
                    ? basicForm?.forms?.filter((data) => data?.id === formId)[0]
                      ?.data[baseKey]
                    : []
                }
                gridStyle={tableGrid}
                // actions={!isPOD ? actions : []}
                scrollStyle={style.contractScrollStyle}
                tableSortValues={[]}
                heading={heading}
                subHeading={subHeading}
                subHeading2={subHeading2}
                onClickFunction={() => { }}
              />
            )}
          </div>
        ) : !addMoreType && collapsableQuestionCard ? (
          <div className={`${window.location.pathname.includes("applicationForm") ? style.addMoreBorder : ""} ${window.location.pathname.includes("applicationForm") ? style.marginTop : ''}`}>
            <div className={window.location.pathname.includes("applicationForm") ? style.padding20 : ""}>
              <div className={style.spaceBetween}>
                <div className={style.collapsableCardText}>
                  {
                    Object.entries(object?.properties)?.map(
                      ([key, data]) => data
                    )[0]?.label
                  }
                </div>
                {window.location.pathname.includes("applicationForm") && (
                  <>
                    {isCollapsableCard ? (
                      <div onClick={() => setIsCollapsableCard(false)}>
                        <KeyboardArrowUpIcon sx={{ color: "#c4bef3" }} />
                      </div>
                    ) : (
                      <div onClick={() => setIsCollapsableCard(true)}>
                        <KeyboardArrowDownIcon sx={{ color: "#c4bef3" }} />
                      </div>
                    )}
                  </>
                )}
              </div>
              {isCollapsableCard && (
                <>
                  {window.location.pathname.includes("applicationForm") && (
                    <CommonDivider />
                  )}
                  <div className={`${gridStyle} ${style.marginTop}`}>
                    {object?.type === "object"
                      ? renderObjectFields(object, object?.properties)
                      : object?.type === "array"
                        ? renderObjectFields(object, object?.items?.properties)
                        : renderObjectFields(object, object?.properties)}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : isReappointment ? (
          <div>
            {!isPOD && (
              <div className={`${style.marginTop}`}>
                {isChanged ? (
                  <div
                    className={`${style.reappointmentCard} ${style.padding20}`}
                  >
                    <div
                      className={style.addMoreText}
                      dangerouslySetInnerHTML={{ __html: object?.items?.label }}
                    />
                    <div className={`${gridStyle} ${object?.items?.label !== null ? style.marginTop : ''}`}>
                      {object?.type === "object"
                        ? renderObjectFields(object, object?.properties)
                        : object?.type === "array"
                          ? renderObjectFields(object, object?.items?.properties)
                          : renderObjectFields(object, object?.properties)}
                    </div>
                    {!isView ? (
                      <div
                        className={`${style.displayInRowRev} ${style.marginTop}`}
                      >
                        <div className={style.marginLeft}>
                          <Tooltip title={isEdited ? "Click to Update" : ""} arrow>
                            <button
                              className={`${style.reappointmentButton} ${isEdited ? "" : style.disabledButtonLook
                                }`}
                              onClick={
                                isEdited
                                  ? () => {
                                    handleReappointmentUpdate();
                                  }
                                  : () => { }
                              }
                              disabled={!isEdited}
                            >
                              UPDATE
                            </button>
                          </Tooltip>
                        </div>
                        {/* <div>
                          <div
                            className={`${style.reappointmentButtonOutlined}`}
                            onClick={() => {
                              // setIsChanged(false);
                            }}
                          >
                            CANCEL
                          </div>
                        </div> */}
                      </div>
                    ) : (
                      <div
                        className={`${style.displayInRowRev} ${style.marginTop}`}
                      >
                        <div>
                          <Tooltip title={"Click to Close"} arrow>
                            <div
                              className={`${style.reappointmentButton}`}
                              onClick={() => {
                                setIsChanged(false);
                                setIsView(false);
                              }}
                            >
                              CLOSE
                            </div>
                          </Tooltip>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* <div
                      className={`${style.viewMyInfoText} ${style.cursorPointer}`}
                      onClick={() => {
                        setIsChanged(true);
                        setIsView(true);
                      }}
                    >
                      View my information on file
                    </div> */}
                    <div
                      className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                    >
                      <Tooltip title={"Click to Yes"} arrow>
                        <div
                          className={`${yesOrNoDemographic === "Yes"
                            ? style.reappointmentButton
                            : style.reappointmentButtonOutlined
                            }`}
                          onClick={() => {
                            setIsChanged(true);
                            setYesOrNoDemographic("Yes");
                          }}
                        >
                          YES
                        </div>
                      </Tooltip>
                      <Tooltip title={"Click to No"} arrow>
                        <div
                          className={`${yesOrNoDemographic === "No"
                            ? style.reappointmentButton
                            : style.reappointmentButtonOutlined
                            } ${style.marginLeft}`}
                          onClick={() => {
                            setIsChanged(false);
                            setYesOrNoDemographic("No");
                          }}
                        >
                          NO
                        </div>
                      </Tooltip>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          <div
            className={`${gridStyle} ${object?.label !== null ? style.marginTop : ""
              }`}
          >
            {object?.type === "object"
              ? renderObjectFields(object, object?.properties)
              : object?.type === "array"
                ? renderObjectFields(object, object?.items?.properties)
                : renderObjectFields(object, object?.properties)}
          </div>
        )}
        {showAdd && (
          <div className={`${style.spaceBetween} ${style.marginTop}`}>
            <div></div>
            <div className={`${style.addButton}`}>ADD</div>
          </div>
        )}
        {showValidationDialog && (
          <ValidationDialog
            getIsOpen={getIsValidationDialogOpen}
            labelList={warningFields}
            getSkipClicked={getSkipClicked}
          />
        )}
        {showFileDisplayDialog && (
          <FileDisplayDialog
            getIsOpen={getIsShowFileDialog}
            file={selectedFile}
          />
        )}
        {
          showPriorDataDialog && (
            <PriorDataDialog getIsOpen={getIsShowPriorDataDialog}
              basicForm={basicForm} setBasicForm={setBasicForm} disclosureBaseKey={disclosureBaseKey} disclosureFieldKey={disclosureFieldKey} disclosurSchema={disclosurSchema} />
          )
        }
        {showDeleteConfirmation && (
          <DeleteConfirmation
            getShowDeleteConfirmation={getShowDeleteConfirmation}
            getDeleteConfirmation={getDeleteConfirmation}
            confirmationText="Do you want to delete this record?"
          />
        )}
      </div>
    </>
  );
};

export default ApplicationFieldCard;
