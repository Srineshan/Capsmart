import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../../Components/Navbar";
import style from "./index.module.scss";
import CommonInputField from "../../../Components/CommonFields/CommonInputField";
import CommonDateField from "../../../Components/CommonFields/CommonDateField";
import { format, parse } from "date-fns";
import CommonSelectField from "../../../Components/CommonFields/CommonSelectField";
import { GET, PUT, POST, TenantID } from "../../dataSaver";
import CommonTextField from "../../../Components/CommonFields/CommonTextField";
import { Button, TextField } from "@mui/material";
import CommonDropZone from "../../../Components/CommonFields/CommonDropZone";
import axios from "axios";
import CommonRadio from "../../../Components/CommonFields/CommonRadio";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CommonMultiSelectField from "../../../Components/CommonFields/CommonMultiSelectField";
import TableTwo from "../../../Components/TableDesignTwo";
import EditIcon from '@mui/icons-material/Edit';
import { ErrorToaster, SuccessToaster } from "../../../utils/toaster";
import { baseUrl } from "../../../utils/auth";
import CommonCheckBox from "../../../Components/CommonFields/CommonCheckBox";
import CommonSwitch from "../../../Components/CommonFields/CommonSwitch";
import HistoricValidationDialog from "./historicDataValidationDialog";



const HistoricalData = () => {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saveData, setSaveData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [middleName, setMiddleName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [zipCode, setZipCode] = useState(""); 
  const [homeAddress, setHomeAddress] = useState("");
  const [homeCity, setHomeCity] = useState("");
  const [homeProvince, setHomeProvince] = useState("");
  const [homeZipcode, setHomeZipcode] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [preferredPhone, setPreferredPhone] = useState("");
  const [physicianName, setPhysicianName] = useState("");
  const [doA, setDoA] = useState("");
  const [isOfficeAddressSameAsHomeAddress, setIsOfficeAddressSameAsHomeAddress] = useState(false);
  const [agreement, setAgreement] = useState(false);
  const formRef = useRef(null);
  const tableRef = useRef(null);
  const [privilegeOtherList, setPrivilegeOtherList] = useState([]);
  const [privilegeCategoryList, setPrivilegeCategoryList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [hospitalList, setHospitalList] = useState([]);
  const [applicantTypeList, setApplicantTypeList] = useState([]);
  const [applicationOldData, setApplicationOldData] = useState([]);
  const [privilege, setPrivilege] = useState("");
  const [program, setProgram] = useState("");
  const [applicantType, setApplicantType] = useState("");
  const [billingNo, setBillingNo] = useState("");
  const [cmpaNo, setCmpaNo] = useState("");
  const [cPSONo, setCPSONo] = useState("");
  const [subSpeciality, setSubSpeciality] = useState("")
  const [serviceAreas, setServiceAreas] = useState([]);
  const [individualList, setIndividualList] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState();
  const [uploadedFiles, setUploadedFiles] = useState({
    ACLS: {
      file: [],
      responseFile: {}
    },
    ACES: {
      file: [],
      responseFile: {}
    },
    CMPA: {
      file: [],
      responseFile: {}
    },
    Malpractice: {
      file: [],
      responseFile: {}
    },
    CPSO: {
      file: [], responseFile: {}
    },
    N95: {
      file: [],
      responseFile: {}
    },
    PALS: {
      file: [],
      responseFile: {}
    },
    NRP: {
      file: [],
      responseFile: {}
    },
    CPR: {
      file: [],
      responseFile: {}
    },
    BloodyEasy: {
      file: [],
      responseFile: {}
    },
    Other: { file: [], responseFile: {} }
  });
  const [prescribeSuboxone, setPrescribeSuboxone] = useState("");
  const [mrpForPatients, setMrpForPatients] = useState("");

  const [licensingBody, setLicensingBody] = useState({
    radioValue: "",
    content: "",
    file: null,
    responseFile: {}
  });

  const [investigatedByCPSO, setInvestigatedByCPSO] = useState({
    radioValue: "",
    content: "",
    file: null,
    responseFile: {}
  });

  const [hospitalPrivileges, setHospitalPrivileges] = useState([]);
  const [privilegesOther, setPrivilegesOther] = useState({
    Hospital: "",
    privilegeCategory: "",
    radioValue: "",
  });

  const [physicalHealth, setPhysicalHealth] = useState({
    radioValue: "",
    content: "",
    file: null,
    responseFile: {}
  });
  const [defendantCivilCase, setDefentantCivilCase] = useState({
    radioValue: "",
    content: "",
    file: null,
    responseFile: {}
  });
  const [pendingCivilCase, setPendingCivilCase] = useState({
    radioValue: "",
    content: "",
    file: null,
    responseFile: {}
  });
  const [terminatedReason, setTerminatedReason] = useState({
    radioValue: "",
    content: "",
    file: null,
    responseFile: {}
  });

  const [voluntary, setVoluntary] = useState({
    radioValue: "",
    content: "",
    file: null,
    responseFile: {}
  });


  const [mACPastYear, setMACPastYear] = useState({
    radioValue: "",
    content: "",
    file: null,
    responseFile: {}
  });

  const [CMETranscript, setCMETranscript] = useState({
    radioValue: "",
    file: [],
    responseFile: {}
  });


  const [coverage, setCoverage] = useState({
    providerType: "",
    providerDetails: [],
    groupDetails: [],
  });


  const [whoCoverage, setWhoCoverage] = useState({
    obstetricsProviderType: "",
    obstetricsProviderDetails: [],
    obstetricsGroupDetails: [],
  });

  const [errors, setErrors] = useState({});
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [warningFields, setWarningFields] = useState([]);


  const [doe, setDoe] = useState("");
  const [restrictiontext, setRestrictionText] = useState("");
  const tableHeader = ['Name', 'Applicant Type', 'Privilege', ''];

  const canadianPostalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

  const isValidCanadianZip = (code) => canadianPostalCodeRegex.test(code);

  useEffect(() => {
    validateFields();
}, [firstName, lastName, email, contactNo, zipCode,dob,province,preferredPhone,city,officeAddress,homeAddress,homeZipcode,homeCity,homeProvince,applicantType,program,privilege]);







  const validateFields = () => {
    let newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/;
    const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
  
  
    if (!firstName||!firstName.trim()) newErrors.firstName = "First Name - Required";
    if (!lastName||!lastName.trim()) newErrors.lastName = "Last Name - Required";
    if (!dob||!dob.trim()) newErrors.dob = "Date of Birth - Required";
    if (!email || !email.trim()) newErrors.email = "Email - Required";
  else if (!emailRegex.test(email)) newErrors.email = "Email - Invalid email format";
    if (!officeAddress || !officeAddress.trim()) newErrors.officeAddress = "Office Address - Required";
    if (!zipCode || !zipCode.trim()) newErrors.zipCode = "Postal Code - Required";
    else if (!postalCodeRegex.test(zipCode)) newErrors.zipCode = "Postal Code - Invalid postal code format (e.g., K1A 0B1)";
    if (!city||!city.trim()) newErrors.city = " City - Required";
    if (!province||!province.trim()) newErrors.province = "Province - Required";
    if (!homeAddress||!homeAddress.trim()) newErrors.homeAddress = "Home Address Line - Required";
    if (!homeZipcode||!homeZipcode.trim()) newErrors.homeZipcode = "Postal Code - Required";
  else if (!postalCodeRegex.test(homeZipcode)) newErrors.homeZipcode = "POstal Code - Invalid postal code format (e.g., K1A 0B1)";
    if (!homeCity||!homeCity.trim()) newErrors.homeCity = "City - Required";
    if (!homeProvince||!homeProvince.trim()) newErrors.homeProvince = "Province - Required";
    if (!contactNo||!contactNo.trim()) newErrors.contactNo = "Phone Number - Required";
  else if (!phoneRegex.test(contactNo)) newErrors.contactNo = "Phone Number - Invalid Phone Number format";
    if (!phoneRegex.test(preferredPhone)) newErrors.preferredPhone = "CMH Phone - Invalid Phone Number format";
    if (!applicantType||!applicantType.trim()) newErrors.applicantType = "Applicant Type - Required";
  if (!privilege||!privilege.trim()) newErrors.privilege = "Privilege Category - Required";
  if (!program||!program.trim()) newErrors.program = "Program - Required"
  
  setErrors(newErrors);

  let missingFields = Object.entries(newErrors).map(([key, value]) => ({
    key,
    label: value
}));

setWarningFields(missingFields);

return Object.keys(newErrors).length === 0;


  };

  // Generic function to fetch city by zip code
  const fetchCityByZipcode = async (zipCode, setCityCallback, setProvinceCallBack) => {
    if (isValidCanadianZip(zipCode)) {
      try {
        const response = await axios.get(
          `https://geocoder.ca/${zipCode}?json=1`
        );
        if (response.data && response.data.standard) {
          const fetchedCity = response.data.standard.city;
          setCityCallback(fetchedCity || "");
          const fetchedProvince = response.data.standard.prov;
          setProvinceCallBack(fetchedProvince || "");
        }
      } catch (error) {
        console.error("Error fetching city data:", error);
      }
    }
  };


  useEffect(() => {
    setPhysicianName(`${firstName} ${lastName}`);
  }, [firstName, lastName]);

  useEffect(() => {
    fetchCityByZipcode(zipCode, setCity, setProvince);
  }, [zipCode]);

  useEffect(() => {
    fetchCityByZipcode(homeZipcode, setHomeCity, setHomeProvince);
  }, [homeZipcode]);

  const handleDobChange = (newDate) => {
    if (newDate) {
      const formattedDate = format(new Date(newDate), "MM-dd-yyyy");
      setDob(formattedDate);
    } else {
      setDob("");
    }
  };


  const handleAgreementChange = (e) => {
    setAgreement(e.target.checked);
  };

  const handleDoAChange = (newDate) => {
    if (newDate) {
      const formattedDate = format(new Date(newDate), "MM-dd-yyyy");
      setDoA(formattedDate);
    } else {
      setDoA("");
    }
  };


  const handleDoeChange = (newDate) => {
    if (newDate) {
      const formattedDate = format(new Date(newDate), "MM-dd-yyyy");
      setDoe(formattedDate);
    } else {
      setDoe("");
    }
  };


  const handleFileDrop = async (category, acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0]; // Assuming single file upload

    setUploadedFiles((prevFiles) => ({
      ...prevFiles,
      [category]: {
        ...prevFiles[category],
        file: acceptedFiles, // Update the file list for the category
      },
    }));

    const formData = new FormData();
    formData.append("documents", file);

    const fileMetadata = {
      filePath: "",
      fileName: file.name,
      fileURL: "",
      fileType: "",
      classification: "",
      verified: true,
      valid: true,
      title: "",
      description: "",
    };

    const filesBlob = new Blob([JSON.stringify(fileMetadata)], {
      type: "application/json",
    });
    formData.append("files", filesBlob);

    try {
      const response = await POST(
        'application-management-service/application/historicFileUpload',
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-tenantID": TenantID,
          },
        }
      );

      console.log(`File upload response for ${category}:`, response.data);

      // Update the responseFile in the state
      setUploadedFiles((prevFiles) => ({
        ...prevFiles,
        [category]: {
          ...prevFiles[category],
          responseFile: response.data.file,
        },
      }));
    } catch (error) {
      console.error(`Error uploading file for ${category}:`, error);
    }

    acceptedFiles.forEach((file) => {
      console.log(`Uploaded file for ${category}:`, file.name);
      console.log(file);

    });
  };

  const getApplicantTypes = async () => {
    const { data: types } = await GET("entity-service/applicantType");
    setApplicantTypeList(types);
  };



  const getPrivilegeCategories = async () => {
    const { data: types } = await GET(`entity-service/privilege?applicantTypeId=${applicantType}`);
    setPrivilegeCategoryList(types);
  };

  const getDepartments = async () => {
    const { data: programs } = await GET("entity-service/department");
    setDepartmentList(programs);
  };
  const getHospitals = async () => {
    const { data: programs } = await GET("entity-service/hospitalMaster");
    setHospitalList(programs);
  };


  const getApplicationOldData = async () => {
    const { data: application } = await GET(
      "application-management-service/application/applicationOldData"
    );
    setApplicationOldData(application);
  };
  useEffect(() => {
    getDepartments();
    getApplicantTypes();
    getHospitals();
    getApplicationOldData();
  }, []);


  useEffect(() => {
    getPrivilegeCategories();
  }, [applicantType]);

  useEffect(() => {
    if (program) {
      const selectedDepartment = departmentList.find(
        (dept) => dept.id === program
      );
      if (selectedDepartment) {
        setServiceAreas(selectedDepartment.serviceAreas || []);
        console.log(serviceAreas)
      } else {
        setServiceAreas([]);
      }
    } else {
      setServiceAreas([]);
    }
  }, [program, departmentList]);

  useEffect(() => {
    if (privilege) {
      const selectedPrivilegeCategory = privilegeCategoryList.find(
        (data) => data.id === privilege
      );
      if (selectedPrivilegeCategory) {
        setPrivilegeOtherList(selectedPrivilegeCategory.otherHospitalPrivilegeCategories || []);
      } else {
        setPrivilegeOtherList([]);
      }
    } else {
      setPrivilegeOtherList([]);
    }
  }, [privilege, privilegeCategoryList]);

  const formatPhoneNumber = (digits) => {
    if (!digits) return ""; // Return empty if no digits are provided

    // Format the number dynamically
    if (digits.length <= 3) {
      return `(${digits}`;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e, setPhoneState) => {
    const rawValue = e.target.value;

    // Strip all non-numeric characters
    let numericValue = rawValue.replace(/\D/g, ""); // Remove non-numeric characters

    // Limit to 10 digits max
    const digits = numericValue.slice(0, 10);

    // Format and update state
    setPhoneState(formatPhoneNumber(digits));
  };




  const handleChange = (event) => {
    setPrescribeSuboxone(event.target.value);
  };

  const handleMRPChange = (event) => {
    setMrpForPatients(event.target.value);
  };

  const handleEditClick = (application) => {
    setIsEdit(true);
    setSelectedApplication(application);
    formRef.current?.scrollIntoView({ behavior: "instant", block: "start" });
  };

  const handleCancelClick = () => {
    setIsEdit(false);
    setSelectedApplication(null);
    resetDialogFields();
    tableRef.current?.scrollIntoView({ behavior: "instant", block: "start" });
  };

  const handleAddClick = () => {
    setIsEdit(false);
    setSelectedApplication(null);
    resetDialogFields();
    formRef.current?.scrollIntoView({ behavior: "instant", block: "start" });
  };


  const handleFileUpload = async (event, setState) => {
    const file = event.target.files[0];
    if (!file) return;

    setState((prev) => ({
      ...prev,
      file: file,
    }));

    const formData = new FormData();

    // Append the raw file to 'documents'
    formData.append("documents", file);

    // Prepare the metadata object for 'files'
    const fileMetadata = {
      filePath: "",
      fileName: file.name,
      fileURL: "",
      fileType: "",
      classification: "",
      verified: true,
      valid: true,
      title: "",
      description: "",
    };

    // Append file metadata as JSON with specific content type
    const filesBlob = new Blob([JSON.stringify(fileMetadata)], {
      type: "application/json",
    });
    formData.append("files", filesBlob);

    try {
      const response = await POST(
        'application-management-service/application/historicFileUpload',
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-tenantID": TenantID,
          },
        }
      );

      console.log("File upload response:", response.data.file);

      setState((prev) => ({
        ...prev,
        responseFile: response.data.file, // Update with the server response
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };


  const handleRadioPrivilegeChange = (event) => {
    const value = event.target.value;
    setPrivilegesOther((prev) => ({
      ...prev,
      radioValue: value,
      ...(value === "no" && { Hospital: "", privilegeCategory: "" }), // Reset fields
    }));

    if (value === "no") {
      setHospitalPrivileges([]); // Clear hospitalPrivileges array
    }
  };

  useEffect(() => {
    if (privilegesOther.Hospital && privilegesOther.privilegeCategory) {
      // Find hospital and privilege category details
      const selectedHospital = hospitalList.find(
        (item) => item.id === privilegesOther.Hospital
      );
      const selectedPrivilegeCategory = privilegeOtherList.find(
        (item) => item.id === privilegesOther.privilegeCategory
      );

      // Add the new pair to hospitalPrivileges
      setHospitalPrivileges((prev) => [
        ...prev,
        {
          id: privilegesOther.Hospital,
          hospitalName: selectedHospital?.name || "",
          privileges: "",
          privilegeCategory: {
            id: privilegesOther.privilegeCategory,
            name: selectedPrivilegeCategory?.category || "",
            type: selectedPrivilegeCategory?.type || "",
          },
        },
      ]);

      // Reset the fields for the next selection
      setPrivilegesOther((prev) => ({
        ...prev,
        Hospital: "",
        privilegeCategory: "",
      }));
    }
  }, [privilegesOther.Hospital, privilegesOther.privilegeCategory]);


  const handleSelectChange = (field, value) => {
    setPrivilegesOther({
      ...privilegesOther,
      [field]: value,
    });
  };



  const handleEditorChange = (event, editor, setState) => {
    const data = editor.getData();
  
    // Extract plain text content
    const textContent = editor.editing.view.document.getRoot().getChild(0)?.getChild(0)?.data || "";
  
    // Allow updates only if character count is within the limit
    if (textContent.length <= 150) {
      setState((prev) => ({
        ...prev,
        content: data,
      }));
    }
  };


  const handleEditorRestrictionChange = (event, editor) => {
    const data = editor.getData();

    const textContent = editor.editing.view.document.getRoot()?.getChild(0)?.getChild(0)?.data || "";
  
    if (textContent.length <= 150) {
      setRestrictionText(data);
    }
  };
  

  const getIndividuallist = async () => {
    try {
      // Fetch the data from the API
      const { data: staffs } = await GET(
        `application-management-service/staff?status=ACTIVE&departmentId=${program}&applicantTypeId=${applicantType}`
      );

      // Filter the remaining staff (those that do not match firstName and lastName)
      const remainingStaffs = staffs.staffs.filter(
        (staff) =>
          staff.applicant?.name?.firstName !== firstName ||
          staff.applicant?.name?.lastName !== lastName
      );

      // Set the remaining staff in individualList
      setIndividualList(remainingStaffs);
    } catch (error) {
      console.error("Error fetching individual list:", error);
    }
  };


  useEffect(() => {
    if (program || applicantType || firstName || lastName) {
      getIndividuallist();
    }
  }, [program, applicantType, firstName, lastName]);

  const handleRadioChange = (event, setState) => {
    const value = event.target.value;
    setState((prev) => ({
      ...prev,
      radioValue: value,
    }));

    if (value === "no") {
      setState((prev) => ({
        ...prev,
        content: "",
        file: null,
        responseFile: {}
      }));
    }
  };

  const handleRadioCMEChange = (setStateFunction, value) => {
    setStateFunction((prev) => ({
      ...prev,
      radioValue: value,
      file: value === "false" ? [] : prev.file,
      responseFile: value === "false" ? {} : prev.responseFile
    }));
  };

  const handleFileDropCME = async (setStateFunction, acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0]; // Handle single file upload

    setStateFunction((prev) => ({
      ...prev,
      file: acceptedFiles,
    }));

    const formData = new FormData();

    // Append the raw file to 'documents'
    formData.append("documents", file);

    // Prepare the metadata object for 'files'
    const fileMetadata = {
      filePath: "",
      fileName: file.name,
      fileURL: "",
      fileType: "",
      classification: "",
      verified: true,
      valid: true,
      title: "",
      description: "",
    };

    // Manually set 'files' as JSON with specific content type
    const filesBlob = new Blob([JSON.stringify(fileMetadata)], {
      type: "application/json",
    });
    formData.append("files", filesBlob);

    try {
      const response = await POST(
        'application-management-service/application/historicFileUpload',
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-tenantID": TenantID,
          },
        }
      );

      console.log("File upload response:", response.data.file);

      setStateFunction((prev) => ({
        ...prev,
        responseFile: response.data.file,
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };


  const isPhysician = applicantTypeList.some(data => data.id === applicantType && data.applicantType === "Physician");


  const handleCoverageTypeChange = (currentState, setState, value) => {
    setState({
      ...currentState,
      providerType: value,
      providerDetails: value === "Individual" ? currentState.providerDetails : [],
      groupDetails:
        value === "Department/Speciality Group"
          ? [
              {
                departmentId: program,
                departmentName:
                  departmentList.find((data) => data.id === program)?.departmentName.name || "",
                serviceAreaId: subSpeciality,
                serviceAreaName:
                  serviceAreas.find((data) => data.id === subSpeciality)?.name || "",
                departmentSpecialtyName: `${
                  departmentList.find((data) => data.id === program)?.departmentName.name || ""
                } - ${
                  serviceAreas.find((data) => data.id === subSpeciality)?.name || ""
                }`,
              },
            ]
          : [],
    });
  };
  

  const handleWhoCoverageTypeChange = (currentState, setState, value) => {
    setState({
      ...currentState,
      obstetricsProviderType: value,
      obstetricsProviderDetails: value === "Individual" ? currentState.obstetricsProviderDetails : [],
      obstetricsGroupDetails:
        value === "Department/Speciality Group"
          ? [
              {
                departmentId: program,
                departmentName:
                  departmentList.find((data) => data.id === program)?.departmentName.name || "",
                serviceAreaId: subSpeciality,
                serviceAreaName:
                  serviceAreas.find((data) => data.id === subSpeciality)?.name || "",
                departmentSpecialtyName: `${
                  departmentList.find((data) => data.id === program)?.departmentName.name || ""
                } - ${
                  serviceAreas.find((data) => data.id === subSpeciality)?.name || ""
                }`,
              },
            ]
          : [],
    });
  };
 
  

  const handleIndividualChange = (currentState, setState, value) => {
    const selectedIndividual = individualList.find((data) => data.id === value);
    setState({
      ...currentState,
      providerDetails: selectedIndividual
        ? [
            {
              id: selectedIndividual.id,
              name: `${selectedIndividual.applicant?.name?.firstName} ${selectedIndividual.applicant?.name?.lastName}`,
            },
          ]
        : [],
      groupDetails: [],
    });
  };

  const handleWhoIndividualChange = (currentState, setState, value) => {
    const selectedIndividual = individualList.find((data) => data.id === value);
    setState({
      ...currentState,
      obstetricsProviderDetails: selectedIndividual
        ? [
            {
              id: selectedIndividual.id,
              name: `${selectedIndividual.applicant?.name?.firstName} ${selectedIndividual.applicant?.name?.lastName}`,
            },
          ]
        : [],
      obstetricsGroupDetails: [],
    });
  };


  const handleSwitchChange = (event) => {
    const isChecked = event.target.checked;
    setIsOfficeAddressSameAsHomeAddress(isChecked);
  
    if (isChecked) {
      setOfficeAddress(homeAddress || ""); 
      setZipCode(homeZipcode || ""); 
      setCity(homeCity || "");
      setProvince(homeProvince || "");
    } else {
      setOfficeAddress("");
      setZipCode("");
      setCity("");
      setProvince("");
    }
  };
  

  const getTableDataValues = () => {
    let name = [];
    let applicantType = [];
    let privilege = [];
    let editIcon = [];

    applicationOldData.map(data => {
      name.push(data?.demographics.name.firstName);
      applicantType.push(data?.applicantType.category);
      privilege.push(data?.privilegeCategory.status.category);
      editIcon.push(<EditIcon className={style.editColor} onClick={() => handleEditClick(data)} />)
    })
    return [
      { type: "text", value: name },
      { type: "text", value: applicantType },
      { type: "text", value: privilege },
      {
        type: "icon",
        icon: editIcon,
        isShowHoverText: false,
      }]
  }

  useEffect(() => {
    if (selectedApplication && isEdit) {
      setSaveData({ ...selectedApplication });
      setFirstName(selectedApplication.demographics.name.firstName);
      setLastName(selectedApplication.demographics.name.lastName);
      setMiddleName(selectedApplication.demographics.name.middleName);
      setDob(selectedApplication.demographics.dateOfBirth);
      setEmail(selectedApplication.demographics.email);
      setHomeAddress(selectedApplication.demographics.residence.streetName);
      setHomeCity(selectedApplication.demographics.residence.city);
      setHomeProvince(selectedApplication.demographics.residence.province);
      setHomeZipcode(selectedApplication.demographics.residence.pinCode);
      setOfficeAddress(selectedApplication.demographics.office.streetName);
      setCity(selectedApplication.demographics.office.city);
      setProvince(selectedApplication.demographics.office.province);
      setZipCode(selectedApplication?.demographics?.office?.pinCode);
      setContactNo(selectedApplication.demographics.homephoneno);
      setPreferredPhone(selectedApplication.demographics.cmh_admin_phoneno);
      setPrivilege(selectedApplication.privilegeCategory.status.id);
      setProgram(selectedApplication.privilegeCategory.program.id);
      setSubSpeciality(selectedApplication.privilegeCategory.subSpecialty.id);
      setBillingNo(selectedApplication.professionalInformation.ohipbillingNumber);
      setCmpaNo(selectedApplication.professionalInformation.cmpaNumber);
      setPrescribeSuboxone(selectedApplication.professionalInformation.prescribeSuboxone);
      setMrpForPatients(selectedApplication.professionalInformation.mrpForNursery)
      setUploadedFiles({
        CMPA: { responseFile: selectedApplication.professionalInformation.cmpaattachment },
        Malpractice: { responseFile: selectedApplication.professionalInformation.otherMalpracticeProtectionAttachement },
        CPSO: { responseFile: selectedApplication.professionalInformation.cpsoattachment },
        Other: { responseFile: selectedApplication.professionalInformation.otherProfessionalRegistrationAttachment },
        N95: { responseFile: selectedApplication.professionalInformation.n95FitTestAttachment },
        PALS: { responseFile: selectedApplication.professionalInformation.palsattachment },
        NRP: { responseFile: selectedApplication.professionalInformation.nrpattachment },
        CPR: { responseFile: selectedApplication.professionalInformation.cprattachment },
        ACLS: { responseFile: selectedApplication.professionalInformation.aclsattachment },
        ACES: { responseFile: selectedApplication.professionalInformation.acesattachment },
        BloodyEasy: { responseFile: selectedApplication.professionalIssues.bloodyEasyLiteTraining }
      });
      setLicensingBody({
        radioValue: selectedApplication.professionalIssues.formalComplaint.response,
        content: selectedApplication.professionalIssues.formalComplaint.remarks,
        responseFile: selectedApplication.professionalIssues.formalComplaint.attachment
      });
      setInvestigatedByCPSO({
        radioValue: selectedApplication.professionalIssues.underInvestigation.response,
        content: selectedApplication.professionalIssues.underInvestigation.remarks,
        responseFile: selectedApplication.professionalIssues.underInvestigation.attachment
      });
      setPhysicalHealth({
        radioValue: selectedApplication.professionalIssues.healthProblems.response,
        content: selectedApplication.professionalIssues.healthProblems.remarks,
        responseFile: selectedApplication.professionalIssues.healthProblems.attachment
      });
      setDefentantCivilCase({
        radioValue: selectedApplication.professionalIssues.civilOrCriminalLawsuits.response,
        content: selectedApplication.professionalIssues.civilOrCriminalLawsuits.remarks,
        responseFile: selectedApplication.professionalIssues.civilOrCriminalLawsuits.attachment
      });
      setPendingCivilCase({
        radioValue: selectedApplication.professionalIssues.pendingActions.response,
        content: selectedApplication.professionalIssues.pendingActions.remarks,
        responseFile: selectedApplication.professionalIssues.pendingActions.attachment
      });
      setPrivilegesOther({ radioValue: selectedApplication.professionalIssues.otherHospitalPrivilegesExist });
      setHospitalPrivileges(selectedApplication.professionalIssues.hospitalPrivileges);
      setTerminatedReason({
        radioValue: selectedApplication.professionalIssues.privilegesReduced.response,
        content: selectedApplication.professionalIssues.privilegesReduced.remarks,
        responseFile: selectedApplication.professionalIssues.privilegesReduced.attachment
      });
      setVoluntary({
        radioValue: selectedApplication.professionalIssues.voluntarilyRelinquished.response,
        content: selectedApplication.professionalIssues.voluntarilyRelinquished.remarks,
        responseFile: selectedApplication.professionalIssues.voluntarilyRelinquished.attachment
      });
      setMACPastYear({
        radioValue: selectedApplication.professionalIssues.subjectToPatientConcerns.response,
        content: selectedApplication.professionalIssues.subjectToPatientConcerns.remarks,
        responseFile: selectedApplication.professionalIssues.subjectToPatientConcerns.attachment
      });
      setDoe(selectedApplication.restrictedLicensing.expiryDate);
      setRestrictionText(selectedApplication.restrictedLicensing.restrictions);
      setCMETranscript({
        radioValue: selectedApplication.continuingEducation.requirementsMet,
        responseFile: selectedApplication.continuingEducation.transcripts
      });
      setPhysicianName(selectedApplication.confirmation.physicianName);
      setDoA(selectedApplication.confirmation.submissiondate);
      setAgreement(selectedApplication.confirmation.agreementToTerms);
      setApplicantType(selectedApplication.applicantType.id);
      setCoverage({
        providerType:selectedApplication.coverageDetails.providerType,
        providerDetails:selectedApplication.coverageDetails.providerDetails,
        groupDetails:selectedApplication.coverageDetails.groupDetails
      });
      setWhoCoverage({
        obstetricsProviderType:selectedApplication.coverageDetails.obstetricsProviderType,
        obstetricsGroupDetails:selectedApplication.coverageDetails.obstetricsGroupDetails,
        obstetricsProviderDetails:selectedApplication.coverageDetails.obstetricsProviderDetails
      })
    }
  }, [selectedApplication]);


 



  const resetDialogFields = () => {
    setSaveData({});
    setFirstName("");
    setLastName("");
    setMiddleName("");
    setDob("");
    setEmail("");
    setHomeAddress("");
    setHomeCity("");
    setHomeProvince("");
    setHomeZipcode("");
    setOfficeAddress("");
    setCity("");
    setProvince("");
    setZipCode("");
    setContactNo("");
    setPreferredPhone("");
    setPrivilege("");
    setProgram("");
    setSubSpeciality("");
    setBillingNo("");
    setCmpaNo("");
    setCPSONo("");
    setPhysicianName("");
    setDoA("");
    setAgreement(false);
    setPrescribeSuboxone("");
    setMrpForPatients("");
    setUploadedFiles({
      CMPA: { responseFile: {} },
      Malpractice: { responseFile: {} },
      CPSO: { responseFile: {} },
      Other: { responseFile: {} },
      N95: { responseFile: {} },
      PALS: { responseFile: {} },
      NRP: { responseFile: {} },
      CPR: { responseFile: {} },
      ACLS: { responseFile: {} },
      ACES: { responseFile: {} },
      BloodyEasy: { responseFile: {} }
    });
    setLicensingBody({
      radioValue: "",
      content: "",
      responseFile: {}
    });
    setInvestigatedByCPSO({
      radioValue: "",
      content: "",
      responseFile: {}
    });
    setPhysicalHealth({
      radioValue: "",
      content: "",
      responseFile: {}
    });
    setDefentantCivilCase({
      radioValue: "",
      content: "",
      responseFile: {}
    });
    setPendingCivilCase({
      radioValue: "",
      content: "",
      responseFile: {}
    });
    setPrivilegesOther({ radioValue: "" });
    setHospitalPrivileges([]);
    setTerminatedReason({
      radioValue: "",
      content: "",
      responseFile: {}
    });
    setVoluntary({
      radioValue: "",
      content: "",
      responseFile: {}
    });
    setMACPastYear({
      radioValue: "",
      content: "",
      responseFile: {}
    });
    setDoe("");
    setRestrictionText("");
    setCMETranscript({
      radioValue: "",
      responseFile: {}
    });
    setCoverage({ providerType: "", providerDetails: [], groupDetails: [] });
    setWhoCoverage({ obstetricsProviderType: "", obstetricsProviderDetails: [], obstetricsGroupDetails: [] })
    setApplicantType("");
  };


  const SaveSubmitHandler = async () => {

    if (!validateFields()) {
      setShowValidationDialog(true); // Show missing fields
      ErrorToaster("Please fill all required fields.");
      return;
  }

    var application = {
      ...saveData,
      demographics: {
        name: {
          firstName: firstName,
          lastName: lastName,
          middleName: middleName
        },
        dateOfBirth: dob,
        office: {
          streetName: officeAddress,
          city: city,
          province: province,
          pinCode:zipCode,
        },
        residence: {
          streetName: homeAddress,
          city: homeCity,
          province: homeProvince,
          pinCode: homeZipcode
        },
        homephoneno: contactNo,
        cmh_admin_phoneno: preferredPhone,
        email: email
      },
      privilegeCategory: {
        status: {
          id: privilege,
          category: privilegeCategoryList.find((data) => data.id === privilege)?.category,
          type: privilegeCategoryList.find((data) => data.id === privilege)?.type
        },
        program: {
          id: program,
          name: departmentList.find((data) => data.id === program)?.departmentName.name
        },
        subSpecialty: {
          id: subSpeciality,
          name: serviceAreas.find((data) => data.id === subSpeciality)?.name
        },
        changePrivilegesFromPreviousYear: true,
      },
      professionalInformation: {
        ohipbillingNumber: billingNo,
        cmpaNumber: cmpaNo,
        cmpaattachment: uploadedFiles.CMPA.responseFile,
        otherMalpracticeProtectionAttachement: uploadedFiles.Malpractice.responseFile,
        cpsoRegistrationNumber: cPSONo,
        cpsoattachment: uploadedFiles.CPSO.responseFile,
        otherProfessionalRegistrationAttachment: uploadedFiles.Other.responseFile,
        n95FitTestAttachment: uploadedFiles.N95.responseFile,
        palsattachment: uploadedFiles.PALS.responseFile,
        nrpattachment: uploadedFiles.NRP.responseFile,
        cprattachment: uploadedFiles.CPR.responseFile,
        aclsattachment: uploadedFiles.ACLS.responseFile,
        acesattachment: uploadedFiles.ACES.responseFile,
        prescribeSuboxone: prescribeSuboxone,
        mrpForNursery: mrpForPatients
      },
      professionalIssues: {
        formalComplaint: {
          response: licensingBody.radioValue,
          remarks: licensingBody.content,
          attachment: licensingBody.responseFile
        },
        underInvestigation: {
          response: investigatedByCPSO.radioValue,
          remarks: investigatedByCPSO.content,
          attachment: investigatedByCPSO.responseFile
        },
        subjectToPatientConcerns: {
          response: mACPastYear.radioValue,
          remarks: mACPastYear.content,
          attachment: mACPastYear.responseFile
        },
        civilOrCriminalLawsuits: {
          response: defendantCivilCase.radioValue,
          remarks: defendantCivilCase.content,
          attachment: defendantCivilCase.responseFile
        },
        pendingActions: {
          response: pendingCivilCase.radioValue,
          remarks: pendingCivilCase.content,
          attachment: pendingCivilCase.responseFile
        },
        healthProblems: {
          response: physicalHealth.radioValue,
          remarks: physicalHealth.content,
          attachment: physicalHealth.responseFile
        },
        privilegesReduced: {
          response: terminatedReason.radioValue,
          remarks: terminatedReason.content,
          attachment: terminatedReason.responseFile
        },
        voluntarilyRelinquished: {
          response: voluntary.radioValue,
          remarks: voluntary.content,
          attachment: voluntary.responseFile
        },
        otherHospitalPrivilegesExist: privilegesOther.radioValue,
        hospitalPrivileges: hospitalPrivileges,
        bloodyEasyLiteTraining: uploadedFiles.BloodyEasy.responseFile,

      },
      restrictedLicensing: {
        expiryDate: doe,
        restrictions: restrictiontext
      },
      continuingEducation: {
        requirementsMet: CMETranscript.radioValue,
        transcripts: CMETranscript.radioValue ? [CMETranscript.responseFile] : []
      },
      coverageDetails: {
        providerType: coverage.providerType,
        providerDetails: coverage.providerDetails,
        groupDetails:coverage.groupDetails,
        obstetricsProviderType: whoCoverage.obstetricsProviderType,
        obstetricsProviderDetails: whoCoverage.obstetricsProviderDetails,
        obstetricsGroupDetails:whoCoverage.obstetricsGroupDetails
      },
      confirmation: {
        physicianName: physicianName,
        submissiondate: doA,
        agreementToTerms: agreement
      },
      applicantType: {
        id: applicantType,
        serviceProviderType: applicantTypeList.find((data) => data.id === applicantType)?.applicantType,
        category: applicantTypeList.find((data) => data.id === applicantType)?.category.category
      }

    };


 
    if (!isEdit) {
      await POST("application-management-service/application/createStaffFromOldData", JSON.stringify(application))
        .then((response) => {
          SuccessToaster("Historical Data Added Successfully");
          resetDialogFields();
          getApplicationOldData();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      var importedDataId = selectedApplication.id;
      await PUT(
        `application-management-service/application/${importedDataId}/updateApplicationOldData`,
        JSON.stringify(application)
      )
        .then((response) => {
          SuccessToaster("Historical Data Updated Successfully");
          resetDialogFields();
          getApplicationOldData();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    }
  };
  return (
    <>
      <Navbar />
      <div className={style.applicantList} ref={tableRef}>
        <div className={`${style.floatRight} ${style.marginTop20} ${style.marginBottom20}`}>
          <button
            className={style.buttonStyle}
            onClick={() => handleAddClick()}
          >
            ADD NEW
          </button>
          </div>
        <TableTwo
          tableHeaderValues={tableHeader}
          tableDataValues={getTableDataValues()}
          tableData={applicationOldData}
          gridStyle={style.applicantGrid}
          // actions={!isPOD ? actions : []}
          scrollStyle={style.contractScrollStyle}
          tableSortValues={[]}
          heading={'There are no record to display'}
          onClickFunction={() => { }}
          hidePagination={true}
        />
      </div>
      <div className={style.margin10}>
        <div ref={formRef} className={`${style.formContainer} ${style.margin10}`}>
          <h2 className={style.heading}>Personal Information</h2>
          <div className={style.gridContainer}>
            <div className={style.inputGroup}>
              <CommonTextField
                label="First Name"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter First Name"
                required
                className={`${style.fullwidth} ${errors["firstName"] ? style.errorField : ""}`}
              />
            </div>
            <div className={style.inputGroup}>
              <CommonTextField
                label="Middle Name"
                name="middleName"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                placeholder="Enter Middle Name"
                className={style.fullwidth}
              />
            </div>
            <div className={style.inputGroup}>
              <CommonTextField
                label="Last Name"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter Last Name"
                required
                className={`${style.fullwidth} ${errors["lastName"] ? style.errorField : ""}`}
              />
            </div>
            <div className={style.inputGroup}>
              <CommonTextField
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email Address"
                required
                className={`${style.fullwidth} ${errors["email"] ? style.errorField : ""}`}
              />
            </div>
            <div className={style.inputGroup}>
              <CommonDateField
                label="Date of Birth"
                value={dob ? parse(dob, "MM-dd-yyyy", new Date()) : null}
                onChange={handleDobChange}
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
                      placeholder: "MM-DD-YYYY",
                      readOnly: true,
                    }}
                    fullWidth
                  />
                )}
                minDate={new Date("1900-01-01")}
                maxDate={new Date()}
                required
                className={`${style.fullwidth} ${errors["dob"] ? style.errorField : ""}`}
              />
            </div>
          </div>
        </div>
        <div className={`${style.formContainer} ${style.marginTop20} ${style.margin10}`}>
          <h2 className={style.heading}>Demographic Data</h2>
          <div className={style.inputGroup}>
            <h3 className={style.subHeading}>Home Address</h3>
            <div className={style.gridContainer}>
              <div className={style.inputGroup}>
                <CommonTextField
                  label="Home Address Line"
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  placeholder="Enter Home Address"
                  required
                  className={`${style.fullwidth} ${errors["homeAddress"] ? style.errorField : ""}`}
                />
              </div>
              <div className={style.inputGroup}>
                <CommonTextField
                  label="Postal Code"
                  value={homeZipcode}
                  onChange={(e) => setHomeZipcode(e.target.value)}
                  placeholder="Enter Postal Code"
                  required
                  className={`${style.fullwidth} ${errors["homeZipcode"] ? style.errorField : ""}`}
                />
              </div>
              <div className={style.inputGroup}>
                <CommonTextField
                  label="City"
                  value={homeCity}
                  onChange={(e) => setHomeCity(e.target.value)}
                  placeholder="Enter City"
                  required
                  className={`${style.fullwidth} ${errors["homeCity"] ? style.errorField : ""}`}
                />
              </div>
              <div className={style.inputGroup}>
                <CommonTextField
                  label="Province"
                  value={homeProvince}
                  onChange={(e) => setHomeProvince(e.target.value)}
                  placeholder="Enter Province"
                  required
                  className={`${style.fullwidth} ${errors["homeProvince"] ? style.errorField : ""}`}
                />
              </div>
              <div className={style.inputGroup}>
                <CommonTextField
                  label="Phone No"
                  value={contactNo}
                  onChange={(e) => handlePhoneChange(e, setContactNo)}
                  placeholder="Enter Contact No"
                  required
                  className={`${style.fullwidth} ${errors["contactNo"] ? style.errorField : ""}`}
                  type="tel"
                />
              </div>
              <div className={style.inputGroup}>
                <CommonTextField
                  label="CMH Phone"
                  value={preferredPhone}
                  onChange={(e) => handlePhoneChange(e, setPreferredPhone)}
                  placeholder="Enter CMH Phone"
                  required
                  className={`${style.fullwidth} ${errors["preferredPhone"] ? style.errorField : ""}`}
                  type="tel"
                />
              </div>
            </div>
          </div>
          <div className={style.inputGroup}>
            <h3 className={style.subHeading}>Office Address</h3>
            <CommonSwitch
        checked={isOfficeAddressSameAsHomeAddress}
        onChange={handleSwitchChange}
        label="Same as Home Address"
      />
            <div className={style.gridContainer}>
              <div className={style.inputGroup}>
                <CommonTextField
                  label="Office Address"
                  value={officeAddress}
                  onChange={(e) => setOfficeAddress(e.target.value)}
                  placeholder="Enter Office Address"
                  className={`${style.fullwidth} ${errors["officeAddress"] ? style.errorField : ""}`}
                  required
                  disabled={isOfficeAddressSameAsHomeAddress}
                />
              </div>
              <div className={style.inputGroup}>
                <CommonTextField
                  label="Postal Code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="Enter Postal Code"
                  className={`${style.fullwidth} ${errors["zipCode"] ? style.errorField : ""}`}
                  required
                  disabled={isOfficeAddressSameAsHomeAddress}
                />
              </div>
              <div className={style.inputGroup}>
                <CommonTextField
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter City"
                  className={`${style.fullwidth} ${errors["city"] ? style.errorField : ""}`}
                  required
                  disabled={isOfficeAddressSameAsHomeAddress}
                />
              </div>
              <div className={style.inputGroup}>
                <CommonTextField
                  label="Province"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  placeholder="Enter Province"
                  required
                  className={`${style.fullwidth} ${errors["province"] ? style.errorField : ""}`}
                  disabled={isOfficeAddressSameAsHomeAddress}
                />
              </div>

            </div>
          </div>
        </div>
        <div className={`${style.formContainer} ${style.marginTop20} ${style.margin10}`}>
          <h2 className={style.heading}>Privilege Category</h2>
          <div className={style.gridContainer}>
            <div className={style.inputGroup}>
              <CommonSelectField
                className={`${style.fullwidth} ${errors["applicantType"] ? style.errorField : ""}`}
                value={applicantType}
                label="Applicant Type"
                onChange={(e) => setApplicantType(e.target.value)}
                valueList={applicantTypeList.map((item) => item.id)}
                labelList={applicantTypeList.map((item) => item.applicantType)}
                firstOptionLabel="Select Applicant Type"
                firstOptionValue=""
                required
                disabledList={[]}
                menuColor={[]} 
                />
            </div>
            <div className={style.inputGroup}>
              <CommonSelectField
               className={`${style.fullwidth} ${errors["privilege"] ? style.errorField : ""}`}
                value={privilege}
                label="Privilege Category"
                onChange={(e) => setPrivilege(e.target.value)}
                valueList={privilegeCategoryList.map((item) => item.id)}
                labelList={privilegeCategoryList.map((item) => item.category)}
                firstOptionLabel="Select Privilege"
                firstOptionValue=""
                required
                disabledList={[]}
                menuColor={[]}
              />
            </div>
            <div className={style.inputGroup}>
              <CommonSelectField
                 className={`${style.fullwidth} ${errors["program"] ? style.errorField : ""}`}
                value={program}
                label="Program"
                onChange={(e) => setProgram(e.target.value)}
                valueList={departmentList.map((item) => item.id)}
                labelList={departmentList.map((item) => item.departmentName.name)}
                firstOptionLabel="Select Program"
                firstOptionValue=""
                required
                disabledList={[]}
                menuColor={[]}
              />
            </div>
            {serviceAreas.length > 0 && (
            <div className={style.inputGroup}>
              <CommonSelectField
                className={style.fullwidth}
                value={subSpeciality}
                label="Sub Speciality"
                onChange={(e) => setSubSpeciality(e.target.value)}
                valueList={serviceAreas.map((item) => item.id)}
                labelList={serviceAreas.map((item) => item.name)}
                firstOptionLabel="Select Sub Speciality"
                firstOptionValue=""
                disabledList={[]}
                menuColor={[]}
              />
            </div>
            )}
          </div>
        </div>

        <div className={`${style.formContainer} ${style.marginTop20} ${style.margin10}`}>
          <h2 className={style.heading}>Professional Information</h2>
          <div className={style.gridContainer1}>
            <div className={style.inputGroup}>
              <CommonTextField
                label="OHIP Billing"
                value={billingNo}
                onChange={(e) => setBillingNo(e.target.value)}
                placeholder="Enter OHIP No"
                className={style.fullwidth} />
            </div>
            <div className={style.inputRow}>
              <div className={style.inputField}>
                <CommonTextField
                  label="CMPA No"
                  value={cmpaNo}
                  onChange={(e) => setCmpaNo(e.target.value)}
                  placeholder="Enter CMPA No"
                  className={style.fullwidth}
                />
              </div>
              <div className={style.fileUpload}>
                <CommonDropZone
                  title="Upload CMPA File"
                  description="Drag & drop a file here, or click to select"
                  changeHandler={(acceptedFiles) => handleFileDrop("CMPA", acceptedFiles)}
                />
                {uploadedFiles.CMPA.responseFile && (
                  <div className={style.uploadedFiles}>
                    <h4>Uploaded File:</h4>
                    <ul>
                      <li>{uploadedFiles.CMPA.responseFile.fileName}</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className={style.inputGroup1}>
              <div className={style.headerContainer}>
                <p>Other Malpractice Protection File*</p>
              </div>
              <CommonDropZone
                title="Upload Malpractice File"
                description="Drag & drop a file here, or click to select"
                changeHandler={(acceptedFiles) => handleFileDrop("Malpractice", acceptedFiles)}
              />
              {uploadedFiles.Malpractice.responseFile && (
                <div className={style.uploadedFiles}>
                  <h4>Uploaded File:</h4>
                  <ul>
                    <li>{uploadedFiles.Malpractice.responseFile.fileName}</li>
                  </ul>
                </div>
              )}
            </div>
            {isPhysician ? (
              <div className={style.inputRow}>
                <div className={style.inputField}>
                  <CommonTextField
                    label="CPSO Registration No"
                    value={cPSONo}
                    onChange={(e) => setCPSONo(e.target.value)}
                    placeholder="Enter CPSO No"
                    className={style.fullwidth}
                  />
                </div>
                <div className={style.fileUpload}>
                  <CommonDropZone
                    title="Upload CPSO File"
                    description="Drag & drop a file here, or click to select"
                    changeHandler={(acceptedFiles) => handleFileDrop("CPSO", acceptedFiles)}
                  />
                  {uploadedFiles.CPSO.responseFile && (
                    <div className={style.uploadedFiles}>
                      <h4>Uploaded File:</h4>
                      <ul>
                        <li>{uploadedFiles.CPSO.responseFile.fileName}</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

            ) : (


              <div className={style.inputGroup1}>
                <div className={style.headerContainer}>
                  <p>Other Professional Attachment*</p>
                </div>
                <CommonDropZone
                  title="Upload Other Professional Attachment File"
                  description="Drag & drop a file here, or click to select"
                  changeHandler={(acceptedFiles) => handleFileDrop("Other", acceptedFiles)}
                />
                {uploadedFiles.Other.responseFile && (
                  <div className={style.uploadedFiles}>
                    <h4>Uploaded File:</h4>
                    <ul>
                      <li>{uploadedFiles.Other.responseFile.fileName}</li>
                    </ul>
                  </div>
                )}
              </div>

            )
            }
            <div className={style.inputGroup1}>
              <div className={style.headerContainer}>
                <p>Proof of your N95 Fit Test*</p>
              </div>
              <CommonDropZone
                title="Upload N95 Fit test File"
                description="Drag & drop a file here, or click to select"
                changeHandler={(acceptedFiles) => handleFileDrop("N95", acceptedFiles)}

              />
              {uploadedFiles.N95.responseFile && (
                <div className={style.uploadedFiles}>
                  <h4>Uploaded File:</h4>
                  <ul>
                    <li>{uploadedFiles.N95.responseFile.fileName}</li>
                  </ul>
                </div>
              )}
            </div>

            <div className={style.inputGroup1}>
              <div className={style.headerContainer}>
                <p> PALS Certificate</p>
              </div>
              <CommonDropZone
                title="Upload PALS File"
                description="Drag & drop a file here, or click to select"
                changeHandler={(acceptedFiles) => handleFileDrop("PALS", acceptedFiles)}

              />
              {uploadedFiles.PALS.responseFile && (
                <div className={style.uploadedFiles}>
                  <h4>Uploaded File:</h4>
                  <ul>
                    <li>{uploadedFiles.PALS.responseFile.fileName}</li>
                  </ul>
                </div>
              )}
            </div>
            <div className={style.inputGroup1}>
              <div className={style.headerContainer}>
                <p>NRP Certificate*</p>
              </div>
              <CommonDropZone
                title="Upload NRP File"
                description="Drag & drop a file here, or click to select"
                changeHandler={(acceptedFiles) => handleFileDrop("NRP", acceptedFiles)}

              />
              {uploadedFiles.NRP.responseFile && (
                <div className={style.uploadedFiles}>
                  <h4>Uploaded File:</h4>
                  <ul>
                    <li>{uploadedFiles.NRP.responseFile.fileName}</li>
                  </ul>
                </div>
              )}
            </div>
            <div className={style.inputGroup1}>
              <div className={style.headerContainer}>
                <p> CPR Certificate*</p>
              </div>
              <CommonDropZone
                title="Upload CPR File"
                description="Drag & drop a file here, or click to select"
                changeHandler={(acceptedFiles) => handleFileDrop("CPR", acceptedFiles)}

              />
              {uploadedFiles.CPR.responseFile && (
                <div className={style.uploadedFiles}>
                  <h4>Uploaded File:</h4>
                  <ul>
                    <li>{uploadedFiles.CPR.responseFile.fileName}</li>
                  </ul>
                </div>
              )}
            </div>
            <div className={style.inputGroup1}>
              <div className={style.headerContainer}>
                <p>ACLS Certificate*</p>
              </div>
              <CommonDropZone
                title="Upload ACLS File"
                description="Drag & drop a file here, or click to select"
                changeHandler={(acceptedFiles) => handleFileDrop("ACLS", acceptedFiles)}

              />
              {uploadedFiles.ACLS.responseFile && (
                <div className={style.uploadedFiles}>
                  <h4>Uploaded File:</h4>
                  <ul>
                    <li>{uploadedFiles.ACLS.responseFile.fileName}</li>
                  </ul>
                </div>
              )}
            </div>
            <div className={style.inputGroup1}>
              <div className={style.headerContainer}>
                <p>ACES Certificate*</p>
              </div>
              <CommonDropZone
                title="Upload ACES File"
                description="Drag & drop a file here, or click to select"
                changeHandler={(acceptedFiles) => handleFileDrop("ACES", acceptedFiles)}

              />
              {uploadedFiles.ACES.responseFile && (
                <div className={style.uploadedFiles}>
                  <h4>Uploaded File:</h4>
                  <ul>
                    <li>{uploadedFiles.ACES.responseFile.fileName}</li>
                  </ul>
                </div>
              )}
            </div>

            <div className={style.inputGroup1}>
              <div className={style.headerContainer}>
                <p>Proof of BloodyEasy Lite training*</p>
              </div>
              <CommonDropZone
                title="Upload BloodyEasy Lite training"
                description="Drag & drop a file here, or click to select"
                changeHandler={(acceptedFiles) => handleFileDrop("BloodyEasy", acceptedFiles)}

              />
              {uploadedFiles.BloodyEasy.responseFile && (
                <div className={style.uploadedFiles}>
                  <h4>Uploaded File:</h4>
                  <ul>
                    <li>{uploadedFiles.BloodyEasy.responseFile.fileName}</li>
                  </ul>
                </div>
              )}
            </div>

            <div className={style.inputGroup4}>
              <p className={style.question}>Do you prescribe Suboxone?</p>
              <CommonRadio
                onChange={handleChange}
                value={prescribeSuboxone}
                radioValue={["true", "false"]}
                label={["Yes", "No"]}
                required={true}
                className={style.commonRadio}
              />
            </div>
            <div className={style.inputGroup4}>
              <p className={style.question}>For Family Physicians Only* Do you wish to be MRP for your patients in the Nursery?</p>
              <CommonRadio
                onChange={handleMRPChange}
                value={mrpForPatients}
                radioValue={["true", "false"]}
                label={["Yes", "No"]}
                required={true}
                className={style.commonRadio}
              />
            </div>
          </div>
        </div>
        <div className={`${style.formContainer} ${style.marginTop20} ${style.margin10}`}>
          <h2 className={style.heading}>Professional Issues</h2>
          <div className={style.gridContainer1}>
            <div className={style.inputGroup5}>
              <div className={style.firstRow}>
                <p className={style.question}>
                  Have you been the subject of a formal complaint to your licensing body
                  (CPSO, Dental, Midwifery, College of Nurses), within the past year?
                </p>
                <CommonRadio
                  onChange={(event) => handleRadioChange(event, setLicensingBody)}
                  value={licensingBody.radioValue}
                  radioValue={["Yes", "No"]}
                  label={["Yes", "No"]}
                  required={true}
                  className={style.commonRadio}
                />
              </div>

              {licensingBody.radioValue === "Yes" && (
                <div className={style.secondRow}>
                  <div className={style.ckEditorWrapper}>
                    <CKEditor
                      editor={ClassicEditor}
                      data={licensingBody.content}
                      onChange={(event, editor) => handleEditorChange(event, editor, setLicensingBody)}
                      onReady={(editor) => {
                        editor.editing.view.change((writer) => {
                          writer.setStyle(
                            "height",
                            "150px",
                            editor.editing.view.document.getRoot()
                          );
                        });
                        const counterElement = document.createElement("div");
                        counterElement.style.position = "absolute";
                        counterElement.style.bottom = "5px";
                        counterElement.style.right = "10px";
                        counterElement.style.fontSize = "12px";
                        counterElement.style.color = "#666";
                        counterElement.style.background = "#fff";
                        counterElement.style.padding = "2px 5px";
                        counterElement.style.borderRadius = "4px";
                        counterElement.style.pointerEvents = "none";
              
                        const editorContainer = editor.ui.view.editable.element;
                        editorContainer.parentNode.appendChild(counterElement);
              
                        // Listen for changes in the editor
                        editor.model.document.on("change:data", () => {
                          const data = editor.getData();
                          const textContent = data.replace(/<[^>]*>/g, ""); // Strip HTML to get pure text
                          counterElement.innerText = `${textContent.length}/150`;
              
                          if (textContent.length > 150) {
                            // Prevent further input by trimming the content
                            editor.setData(textContent.slice(0, 150));
                          }
                        });
                      }}
                      config={{
                        placeholder: "Type your content here...",
                      }}
                    />
                  </div>

                  <div className={style.fileUpload}>
                    <input
                      type="file"
                      onChange={(event) => handleFileUpload(event, setLicensingBody)}
                      accept="image/*,application/pdf"
                      id="file-upload"
                      style={{ display: "none" }}
                    />
                    <label htmlFor="file-upload">
                      <Button variant="contained" component="span" className={style.uploadButton}>
                        Upload File
                      </Button>
                    </label>
                    {licensingBody.responseFile && <p className={style.fileName}>Uploaded file: {licensingBody.responseFile.fileName}</p>}
                  </div>
                </div>
              )}
            </div>


            <div className={style.inputGroup5}>
              <div className={style.firstRow}>
                <p className={style.question}>
                  Are you presently being investigated by the CPSO, Dental Board, College of Midwives, or College of Nurses?
                </p>
                <CommonRadio
                  onChange={(event) => handleRadioChange(event, setInvestigatedByCPSO)}
                  value={investigatedByCPSO.radioValue}
                  radioValue={["Yes", "No"]}
                  label={["Yes", "No"]}
                  required={true}
                  className={style.commonRadio}
                />
              </div>

              {investigatedByCPSO.radioValue === "Yes" && (
                <div className={style.secondRow}>
                  <div className={style.ckEditorWrapper}>
                    <CKEditor
                      editor={ClassicEditor}
                      data={investigatedByCPSO.content}
                      onChange={(event, editor) => handleEditorChange(event, editor, setInvestigatedByCPSO)}
                      onReady={(editor) => {
                        editor.editing.view.change((writer) => {
                          writer.setStyle(
                            "height",
                            "150px",
                            editor.editing.view.document.getRoot()
                          );
                        });
                        const counterElement = document.createElement("div");
                        counterElement.style.position = "absolute";
                        counterElement.style.bottom = "5px";
                        counterElement.style.right = "10px";
                        counterElement.style.fontSize = "12px";
                        counterElement.style.color = "#666";
                        counterElement.style.background = "#fff";
                        counterElement.style.padding = "2px 5px";
                        counterElement.style.borderRadius = "4px";
                        counterElement.style.pointerEvents = "none";
              
                        const editorContainer = editor.ui.view.editable.element;
                        editorContainer.parentNode.appendChild(counterElement);
              
                        // Listen for changes in the editor
                        editor.model.document.on("change:data", () => {
                          const data = editor.getData();
                          const textContent = data.replace(/<[^>]*>/g, ""); // Strip HTML to get pure text
                          counterElement.innerText = `${textContent.length}/150`;
              
                          if (textContent.length > 150) {
                            // Prevent further input by trimming the content
                            editor.setData(textContent.slice(0, 150));
                          }
                        });
                      }}
                      config={{
                        placeholder: "Type your content here...",
                      }}
                    />
                  </div>

                  <div className={style.fileUpload}>
                    <input
                      type="file"
                      onChange={(event) => handleFileUpload(event, setInvestigatedByCPSO)}
                      accept="image/*,application/pdf"
                      id="file-upload"
                      style={{ display: "none" }}
                    />
                    <label htmlFor="file-upload">
                      <Button variant="contained" component="span" className={style.uploadButton}>
                        Upload File
                      </Button>
                    </label>
                    {investigatedByCPSO.responseFile && <p className={style.fileName}>Uploaded file: {investigatedByCPSO.responseFile.fileName}</p>}
                  </div>
                </div>
              )}
            </div>
            <div className={style.inputGroup5}>
              <div className={style.firstRow}>
                <p className={style.question}>
                  Have you experienced any health problems, including physical health, mental health or use of substances which would affect your ability to carry out assigned privileges or that may have an impact on patient care? If yes, please append particulars and also consult with your Chief of Service?
                </p>
                <CommonRadio
                  onChange={(event) => handleRadioChange(event, setPhysicalHealth)}
                  value={physicalHealth.radioValue}
                  radioValue={["Yes", "No"]}
                  label={["Yes", "No"]}
                  required={true}
                  className={style.commonRadio}
                />
              </div>

              {physicalHealth.radioValue === "Yes" && (
                <div className={style.secondRow}>
                  <div className={style.ckEditorWrapper}>
                    <CKEditor
                      editor={ClassicEditor}
                      data={physicalHealth.content}
                      onChange={(event, editor) => handleEditorChange(event, editor, setPhysicalHealth)}
                      onReady={(editor) => {
                        editor.editing.view.change((writer) => {
                          writer.setStyle(
                            "height",
                            "150px",
                            editor.editing.view.document.getRoot()
                          );
                        });
                        const counterElement = document.createElement("div");
                        counterElement.style.position = "absolute";
                        counterElement.style.bottom = "5px";
                        counterElement.style.right = "10px";
                        counterElement.style.fontSize = "12px";
                        counterElement.style.color = "#666";
                        counterElement.style.background = "#fff";
                        counterElement.style.padding = "2px 5px";
                        counterElement.style.borderRadius = "4px";
                        counterElement.style.pointerEvents = "none";
              
                        const editorContainer = editor.ui.view.editable.element;
                        editorContainer.parentNode.appendChild(counterElement);
              
                        // Listen for changes in the editor
                        editor.model.document.on("change:data", () => {
                          const data = editor.getData();
                          const textContent = data.replace(/<[^>]*>/g, ""); // Strip HTML to get pure text
                          counterElement.innerText = `${textContent.length}/150`;
              
                          if (textContent.length > 150) {
                            // Prevent further input by trimming the content
                            editor.setData(textContent.slice(0, 150));
                          }
                        });
                      }}
                      config={{
                        placeholder: "Type your content here...",
                      }}
                    />
                  </div>

                  <div className={style.fileUpload}>
                    <input
                      type="file"
                      onChange={(event) => handleFileUpload(event, setPhysicalHealth)}
                      accept="image/*,application/pdf"
                      id="file-upload"
                      style={{ display: "none" }}
                    />
                    <label htmlFor="file-upload">
                      <Button variant="contained" component="span" className={style.uploadButton}>
                        Upload File
                      </Button>
                    </label>
                    {physicalHealth.responseFile && <p className={style.fileName}>Uploaded file: {physicalHealth.responseFile.fileName}</p>}
                  </div>
                </div>
              )}
            </div>
            <div className={style.inputGroup5}>
              <div className={style.firstRow}>
                <p className={style.question}>
                  Have you been a defendant in any civil or criminal law suit alleging negligence, incompetence, assault, battery, sexual misconduct or that arose in any way from your professional practice or that is in anyway relevant to the practice of medicine, dentistry, midwifery, or nursing in the past year?
                </p>
                <CommonRadio
                  onChange={(event) => handleRadioChange(event, setDefentantCivilCase)}
                  value={defendantCivilCase.radioValue}
                  radioValue={["Yes", "No"]}
                  label={["Yes", "No"]}
                  required={true}
                  className={style.commonRadio}
                />
              </div>

              {defendantCivilCase.radioValue === "Yes" && (
                <div className={style.secondRow}>
                  <div className={style.ckEditorWrapper}>
                    <CKEditor
                      editor={ClassicEditor}
                      data={defendantCivilCase.content}
                      onChange={(event, editor) => handleEditorChange(event, editor, setDefentantCivilCase)}
                      onReady={(editor) => {
                        editor.editing.view.change((writer) => {
                          writer.setStyle(
                            "height",
                            "150px",
                            editor.editing.view.document.getRoot()
                          );
                        });
                        const counterElement = document.createElement("div");
                        counterElement.style.position = "absolute";
                        counterElement.style.bottom = "5px";
                        counterElement.style.right = "10px";
                        counterElement.style.fontSize = "12px";
                        counterElement.style.color = "#666";
                        counterElement.style.background = "#fff";
                        counterElement.style.padding = "2px 5px";
                        counterElement.style.borderRadius = "4px";
                        counterElement.style.pointerEvents = "none";
              
                        const editorContainer = editor.ui.view.editable.element;
                        editorContainer.parentNode.appendChild(counterElement);
              
                        // Listen for changes in the editor
                        editor.model.document.on("change:data", () => {
                          const data = editor.getData();
                          const textContent = data.replace(/<[^>]*>/g, ""); // Strip HTML to get pure text
                          counterElement.innerText = `${textContent.length}/150`;
              
                          if (textContent.length > 150) {
                            // Prevent further input by trimming the content
                            editor.setData(textContent.slice(0, 150));
                          }
                        });
                      }}
                      config={{
                        placeholder: "Type your content here...",
                      }}
                    />
                  </div>

                  <div className={style.fileUpload}>
                    <input
                      type="file"
                      onChange={(event) => handleFileUpload(event, setDefentantCivilCase)}
                      accept="image/*,application/pdf"
                      id="file-upload"
                      style={{ display: "none" }}
                    />
                    <label htmlFor="file-upload">
                      <Button variant="contained" component="span" className={style.uploadButton}>
                        Upload File
                      </Button>
                    </label>
                    {defendantCivilCase.responseFile && <p className={style.fileName}>Uploaded file: {defendantCivilCase.responseFile.fileName}</p>}
                  </div>
                </div>
              )}
            </div>

            <div className={style.inputGroup5}>
              <div className={style.firstRow}>
                <p className={style.question}>
                  Have you had any criminal and/or civil actions brought against you in the past year or pending?
                </p>
                <CommonRadio
                  onChange={(event) => handleRadioChange(event, setPendingCivilCase)}
                  value={pendingCivilCase.radioValue}
                  radioValue={["Yes", "No"]}
                  label={["Yes", "No"]}
                  required={true}
                  className={style.commonRadio}
                />
              </div>

              {pendingCivilCase.radioValue === "Yes" && (
                <div className={style.secondRow}>
                  <div className={style.ckEditorWrapper}>
                    <CKEditor
                      editor={ClassicEditor}
                      data={pendingCivilCase.content}
                      onChange={(event, editor) => handleEditorChange(event, editor, setPendingCivilCase)}
                      onReady={(editor) => {
                        editor.editing.view.change((writer) => {
                          writer.setStyle(
                            "height",
                            "150px",
                            editor.editing.view.document.getRoot()
                          );
                        });
                        const counterElement = document.createElement("div");
                        counterElement.style.position = "absolute";
                        counterElement.style.bottom = "5px";
                        counterElement.style.right = "10px";
                        counterElement.style.fontSize = "12px";
                        counterElement.style.color = "#666";
                        counterElement.style.background = "#fff";
                        counterElement.style.padding = "2px 5px";
                        counterElement.style.borderRadius = "4px";
                        counterElement.style.pointerEvents = "none";
              
                        const editorContainer = editor.ui.view.editable.element;
                        editorContainer.parentNode.appendChild(counterElement);
              
                        // Listen for changes in the editor
                        editor.model.document.on("change:data", () => {
                          const data = editor.getData();
                          const textContent = data.replace(/<[^>]*>/g, ""); // Strip HTML to get pure text
                          counterElement.innerText = `${textContent.length}/150`;
              
                          if (textContent.length > 150) {
                            // Prevent further input by trimming the content
                            editor.setData(textContent.slice(0, 150));
                          }
                        });
                      }}
                      config={{
                        placeholder: "Type your content here...",
                      }}
                    />
                  </div>

                  <div className={style.fileUpload}>
                    <input
                      type="file"
                      onChange={(event) => handleFileUpload(event, setPendingCivilCase)}
                      accept="image/*,application/pdf"
                      id="file-upload"
                      style={{ display: "none" }}
                    />
                    <label htmlFor="file-upload">
                      <Button variant="contained" component="span" className={style.uploadButton}>
                        Upload File
                      </Button>
                    </label>
                    {pendingCivilCase.responseFile && <p className={style.fileName}>Uploaded file: {pendingCivilCase.responseFile.fileName}</p>}
                  </div>
                </div>
              )}
            </div>
            <div className={style.inputGroup5}>
              <div className={style.firstRow}>
                <p className={style.question}>
                  Do you maintain privileges at any other hospital(s)?
                </p>
                <CommonRadio
                  onChange={handleRadioPrivilegeChange}
                  value={privilegesOther.radioValue}
                  radioValue={["Yes", "No"]}
                  label={["Yes", "No"]}
                  required={true}
                  className={style.commonRadio}
                />
              </div>

              {privilegesOther.radioValue === "Yes" && (
                <div className={style.secondRow1}>
                  <div className={style.ckEditorWrapper}>
                    <CommonSelectField
                      className={style.fullwidth}
                      value={privilegesOther.Hospital}
                      label="Select Hospital"
                      onChange={(e) => handleSelectChange("Hospital", e.target.value)}
                      valueList={hospitalList
                        .filter((hospital) => !hospitalPrivileges.some((priv) => priv.id === hospital.id))
                        .map((item) => item.id)}
                      labelList={hospitalList
                        .filter((hospital) => !hospitalPrivileges.some((priv) => priv.id === hospital.id))
                        .map((item) => item.name)}
                      firstOptionLabel="Select Hospital"
                      firstOptionValue=""
                      required
                      disabledList={[]}
                      menuColor={[]} />

                  </div>

                  <div className={style.fileUpload}>
                    <CommonSelectField
                      className={style.fullwidth}
                      value={privilegesOther.privilegeCategory}
                      label="Select Other Privilege Category"
                      onChange={(e) => handleSelectChange("privilegeCategory", e.target.value)}
                      valueList={privilegeOtherList.map((item) => item.id)}
                      labelList={privilegeOtherList.map((item) => item.category)}
                      firstOptionLabel="Select Other Privilege Category"
                      firstOptionValue=""
                      required
                      disabledList={[]}
                      menuColor={[]} />
                  </div>
                </div>
              )}
              {hospitalPrivileges.length > 0 && (
                <div className={style.hospitalPrivilegesList}>
                  {hospitalPrivileges.map((item, index) => (
                    <div key={index} className={style.valueBox}>
                      <span>
                        {`${item.hospitalName} - ${item.privilegeCategory.name}`}
                      </span>
                      <span
                        className={style.crossMark}
                        onClick={() =>
                          setHospitalPrivileges((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                      >
                        &times;
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={style.inputGroup5}>
              <div className={style.firstRow}>
                <p className={style.question}>
                  Have your hospital privileges been reduced, suspended or terminated for any reason within the past year?
                </p>
                <CommonRadio
                  onChange={(event) => handleRadioChange(event, setTerminatedReason)}
                  value={terminatedReason.radioValue}
                  radioValue={["Yes", "No"]}
                  label={["Yes", "No"]}
                  required={true}
                  className={style.commonRadio}
                />
              </div>

              {terminatedReason.radioValue === "Yes" && (
                <div className={style.secondRow}>
                  <div className={style.ckEditorWrapper}>
                    <CKEditor
                      editor={ClassicEditor}
                      data={terminatedReason.content}
                      onChange={(event, editor) => handleEditorChange(event, editor, setTerminatedReason)}
                      onReady={(editor) => {
                        editor.editing.view.change((writer) => {
                          writer.setStyle(
                            "height",
                            "150px",
                            editor.editing.view.document.getRoot()
                          );
                        });
                        const counterElement = document.createElement("div");
                        counterElement.style.position = "absolute";
                        counterElement.style.bottom = "5px";
                        counterElement.style.right = "10px";
                        counterElement.style.fontSize = "12px";
                        counterElement.style.color = "#666";
                        counterElement.style.background = "#fff";
                        counterElement.style.padding = "2px 5px";
                        counterElement.style.borderRadius = "4px";
                        counterElement.style.pointerEvents = "none";
              
                        const editorContainer = editor.ui.view.editable.element;
                        editorContainer.parentNode.appendChild(counterElement);
              
                        // Listen for changes in the editor
                        editor.model.document.on("change:data", () => {
                          const data = editor.getData();
                          const textContent = data.replace(/<[^>]*>/g, ""); // Strip HTML to get pure text
                          counterElement.innerText = `${textContent.length}/150`;
              
                          if (textContent.length > 150) {
                            // Prevent further input by trimming the content
                            editor.setData(textContent.slice(0, 150));
                          }
                        });
                      }}
                      config={{
                        placeholder: "Type your content here...",
                      }}
                    />
                  </div>

                  <div className={style.fileUpload}>
                    <input
                      type="file"
                      onChange={(event) => handleFileUpload(event, setTerminatedReason)}
                      accept="image/*,application/pdf"
                      id="file-upload"
                      style={{ display: "none" }}
                    />
                    <label htmlFor="file-upload">
                      <Button variant="contained" component="span" className={style.uploadButton}>
                        Upload File
                      </Button>
                    </label>
                    {terminatedReason.responseFile && <p className={style.fileName}>Uploaded file: {terminatedReason.responseFile.fileName}</p>}
                  </div>
                </div>
              )}
            </div>
            <div className={style.inputGroup5}>
              <div className={style.firstRow}>
                <p className={style.question}>
                  Have you voluntarily relinquished part or all of your hospital privileges within the past year?
                </p>
                <CommonRadio
                  onChange={(event) => handleRadioChange(event, setVoluntary)}
                  value={voluntary.radioValue}
                  radioValue={["Yes", "No"]}
                  label={["Yes", "No"]}
                  required={true}
                  className={style.commonRadio}
                />
              </div>

              {voluntary.radioValue === "Yes" && (
                <div className={style.secondRow}>
                  <div className={style.ckEditorWrapper}>
                    <CKEditor
                      editor={ClassicEditor}
                      data={voluntary.content}
                      onChange={(event, editor) => handleEditorChange(event, editor, setVoluntary)}
                      onReady={(editor) => {
                        editor.editing.view.change((writer) => {
                          writer.setStyle(
                            "height",
                            "150px",
                            editor.editing.view.document.getRoot()
                          );
                        });
                        const counterElement = document.createElement("div");
                        counterElement.style.position = "absolute";
                        counterElement.style.bottom = "5px";
                        counterElement.style.right = "10px";
                        counterElement.style.fontSize = "12px";
                        counterElement.style.color = "#666";
                        counterElement.style.background = "#fff";
                        counterElement.style.padding = "2px 5px";
                        counterElement.style.borderRadius = "4px";
                        counterElement.style.pointerEvents = "none";
              
                        const editorContainer = editor.ui.view.editable.element;
                        editorContainer.parentNode.appendChild(counterElement);
              
                        // Listen for changes in the editor
                        editor.model.document.on("change:data", () => {
                          const data = editor.getData();
                          const textContent = data.replace(/<[^>]*>/g, ""); // Strip HTML to get pure text
                          counterElement.innerText = `${textContent.length}/150`;
              
                          if (textContent.length > 150) {
                            // Prevent further input by trimming the content
                            editor.setData(textContent.slice(0, 150));
                          }
                        });
                      }}
                      config={{
                        placeholder: "Type your content here...",
                      }}
                    />
                  </div>

                  <div className={style.fileUpload}>
                    <input
                      type="file"
                      onChange={(event) => handleFileUpload(event, setVoluntary)}
                      accept="image/*,application/pdf"
                      id="file-upload"
                      style={{ display: "none" }}
                    />
                    <label htmlFor="file-upload">
                      <Button variant="contained" component="span" className={style.uploadButton}>
                        Upload File
                      </Button>
                    </label>
                    {voluntary.responseFile && <p className={style.fileName}>Uploaded file: {voluntary.responseFile.fileName}</p>}
                  </div>
                </div>
              )}
            </div>
            <div className={style.inputGroup5}>
              <div className={style.firstRow}>
                <p className={style.question}>
                  Have you been the subject of patient concerns that have been brought to the MAC within the past year?
                </p>
                <CommonRadio
                  onChange={(event) => handleRadioChange(event, setMACPastYear)}
                  value={mACPastYear.radioValue}
                  radioValue={["Yes", "No"]}
                  label={["Yes", "No"]}
                  required={true}
                  className={style.commonRadio}
                />
              </div>

              {mACPastYear.radioValue === "Yes" && (
                <div className={style.secondRow}>
                  <div className={style.ckEditorWrapper}>
                    <CKEditor
                      editor={ClassicEditor}
                      data={mACPastYear.content}
                      onChange={(event, editor) => handleEditorChange(event, editor, setMACPastYear)}
                      onReady={(editor) => {
                        editor.editing.view.change((writer) => {
                          writer.setStyle(
                            "height",
                            "150px",
                            editor.editing.view.document.getRoot()
                          );
                        });
                        const counterElement = document.createElement("div");
                        counterElement.style.position = "absolute";
                        counterElement.style.bottom = "5px";
                        counterElement.style.right = "10px";
                        counterElement.style.fontSize = "12px";
                        counterElement.style.color = "#666";
                        counterElement.style.background = "#fff";
                        counterElement.style.padding = "2px 5px";
                        counterElement.style.borderRadius = "4px";
                        counterElement.style.pointerEvents = "none";
              
                        const editorContainer = editor.ui.view.editable.element;
                        editorContainer.parentNode.appendChild(counterElement);
              
                        // Listen for changes in the editor
                        editor.model.document.on("change:data", () => {
                          const data = editor.getData();
                          const textContent = data.replace(/<[^>]*>/g, ""); // Strip HTML to get pure text
                          counterElement.innerText = `${textContent.length}/150`;
              
                          if (textContent.length > 150) {
                            // Prevent further input by trimming the content
                            editor.setData(textContent.slice(0, 150));
                          }
                        });
                      }}
                      config={{
                        placeholder: "Type your content here...",
                      }}
                    />
                  </div>

                  <div className={style.fileUpload}>
                    <input
                      type="file"
                      onChange={(event) => handleFileUpload(event, setMACPastYear)}
                      accept="image/*,application/pdf"
                      id="file-upload"
                      style={{ display: "none" }}
                    />
                    <label htmlFor="file-upload">
                      <Button variant="contained" component="span" className={style.uploadButton}>
                        Upload File
                      </Button>
                    </label>
                    {mACPastYear.responseFile && <p className={style.fileName}>Uploaded file: {mACPastYear.responseFile.fileName}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={`${style.formContainer} ${style.marginTop20} ${style.margin10}`}>
          <h2 className={style.heading}>Restricted Licensing Update</h2>
          <div className={style.gridContainer1}>
            <div className={style.inputGroup5}>
              <div className={style.firstRow1}>
                <p className={style.question}>
                  Please complete only if you hold a restricted license to practice.
                </p>
                <CommonDateField
                  label="Expiry of current license"
                  value={doe ? parse(doe, "MM-dd-yyyy", new Date()) : null}
                  onChange={handleDoeChange}
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
                        placeholder: "MM-DD-YYYY",
                        readOnly: true,
                      }}
                      fullWidth
                    />
                  )}
                  minDate={new Date()}
                  required
                  className={style.fullwidth}
                />
              </div>


              <div className={style.secondRow1}>
                <div className={style.question2}>
                  <p className={style.question}>
                    Restrictions - please provide an update on the status of your independent practice license (e.g. when you will be writing your qualifying examinations, work permit status, etc.)
                  </p>
                </div>
                <div className={style.ckEditorWrapper}>
                  <CKEditor
                    editor={ClassicEditor}
                    data={restrictiontext}
                    onChange={handleEditorRestrictionChange}
                    onReady={(editor) => {
                      editor.editing.view.change((writer) => {
                        writer.setStyle(
                          "height",
                          "150px",
                          editor.editing.view.document.getRoot()
                        );
                      });
                      const counterElement = document.createElement("div");
                      counterElement.style.position = "absolute";
                      counterElement.style.bottom = "5px";
                      counterElement.style.right = "10px";
                      counterElement.style.fontSize = "12px";
                      counterElement.style.color = "#666";
                      counterElement.style.background = "#fff";
                      counterElement.style.padding = "2px 5px";
                      counterElement.style.borderRadius = "4px";
                      counterElement.style.pointerEvents = "none";
            
                      const editorContainer = editor.ui.view.editable.element;
                      editorContainer.parentNode.appendChild(counterElement);
            
                      // Listen for changes in the editor
                      editor.model.document.on("change:data", () => {
                        const data = editor.getData();
                        const textContent = data.replace(/<[^>]*>/g, ""); // Strip HTML to get pure text
                        counterElement.innerText = `${textContent.length}/150`;
            
                        if (textContent.length > 150) {
                          // Prevent further input by trimming the content
                          editor.setData(textContent.slice(0, 150));
                        }
                      });
                    }}
                    config={{
                      placeholder: "Type your content here...",
                    }}
                  />
                </div>

              </div>

            </div>


          </div>
        </div>
        <div className={`${style.formContainer} ${style.marginTop20} ${style.margin10}`}>
          <h2 className={style.heading}>CME</h2>
          <div className={style.gridContainer1}>
            <div className={style.inputGroup5}>
              <div className={style.firstRow}>
                <p className={style.question}>
                  Do you have any CME / CEU Transcript from your College or Membership Organization?
                </p>
                <CommonRadio
                  onChange={(event) =>
                    handleRadioCMEChange(setCMETranscript, event.target.value)
                  }
                  value={CMETranscript.radioValue}
                  radioValue={["true", "false"]}
                  label={["Yes", "No"]}
                  required={true}
                  className={style.commonRadio}
                />
              </div>

              {CMETranscript.radioValue === "true" && (
                <div className={style.secondRow2}>

                  <CommonDropZone
                    title="Upload CME Transcript"
                    description="Drag & drop a file here, or click to select"
                    changeHandler={(acceptedFiles) => handleFileDropCME(setCMETranscript, acceptedFiles)}
                  />
                  {CMETranscript.responseFile && (
                    <div className={style.uploadedFiles}>
                      <h4>Uploaded File:</h4>
                      <ul>
                        <li>{CMETranscript.responseFile.fileName}</li>
                      </ul>
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>
        </div>
        <div className={`${style.formContainer} ${style.marginTop20} ${style.margin10}`}>
          <h2 className={style.heading}>Hospital Coverage</h2>
          <p className={style.alignLeft}>Twenty-four hour coverage of hospital patients, including those in the ER, is a requirement of Professional Staff responsibilities. The physician must provide an acceptable method to respond to hospital calls.</p>
          <div className={style.gridContainer1}>
            <div className={style.inputGroup6}>
              <p className={style.question}>Who covers your hospital patients when you are not available?</p>

              {/* Type Select and Individual/Group Fields Row */}
              <div className={style.gridContainer2}>
  <CommonSelectField
    value={coverage.providerType}
    onChange={(e) => handleCoverageTypeChange(coverage, setCoverage, e.target.value)}
    firstOptionLabel="Select Type"
    firstOptionValue=""
    valueList={["Individual", "Department/Speciality Group"]}
    labelList={["Individual", "Department/Speciality Group"]}
    className={style.fullwidth}
    required={true}
    label="Type"
    disabledList={[]}
    menuColor={[]}
  />

  {coverage.providerType === "Individual" && (
    <CommonSelectField
      value={coverage.providerDetails.length > 0 ? coverage.providerDetails[0].id : ""}
      onChange={(e) => handleIndividualChange(coverage, setCoverage, e.target.value)}
      firstOptionLabel="Select an Individual"
      firstOptionValue=""
      valueList={individualList.map((data) => data.id)}
      labelList={individualList.map(
        (data) =>
          `${data.applicant?.name?.firstName} ${data.applicant?.name?.lastName} - ${data.basicDetailReferences?.specialty?.name}`
      )}
      className={style.fullwidth}
      required={true}
      label="Select Individual"
      disabledList={[]}
      menuColor={[]}
    />
  )}

  {coverage.providerType === "Department/Speciality Group" && coverage.groupDetails.length > 0 && (
    <div>
      <label className={style.labels2}>Group Provider*</label>
      <h5 className={style.question}>
        {coverage.groupDetails[0].departmentSpecialtyName}
      </h5>
    </div>
  )}
</div>

            </div>
            <div className={style.inputGroup6}>
              <p className={style.question}>If you are practicing obstetrics, who covers your patients when you are not available? </p>

              {/* Type Select and Individual/Group Fields Row */}
              <div className={style.gridContainer2}>
  <CommonSelectField
    value={whoCoverage.obstetricsProviderType}
    onChange={(e) => handleWhoCoverageTypeChange(whoCoverage, setWhoCoverage, e.target.value)}
    firstOptionLabel="Select Type"
    firstOptionValue=""
    valueList={["Individual", "Department/Speciality Group"]}
    labelList={["Individual", "Department/Speciality Group"]}
    className={style.fullwidth}
    required={true}
    label="Type"
    disabledList={[]}
    menuColor={[]}
  />

  {whoCoverage.obstetricsProviderType === "Individual" && (
    <CommonSelectField
      value={whoCoverage.obstetricsProviderDetails.length > 0 ? whoCoverage.obstetricsProviderDetails[0].id : ""}
      onChange={(e) => handleWhoIndividualChange(whoCoverage, setWhoCoverage, e.target.value)}
      firstOptionLabel="Select an Individual"
      firstOptionValue=""
      valueList={individualList.map((data) => data.id)}
      labelList={individualList.map(
        (data) =>
          `${data.applicant?.name?.firstName} ${data.applicant?.name?.lastName} - ${data.basicDetailReferences?.specialty?.name}`
      )}
      className={style.fullwidth}
      required={true}
      label="Select Individual"
      disabledList={[]}
      menuColor={[]}
    />
  )}

  {whoCoverage.obstetricsProviderType === "Department/Speciality Group" && whoCoverage.obstetricsGroupDetails.length > 0 && (
    <div>
      <label className={style.labels2}>Group Provider*</label>
      <h5 className={style.question}>
        {whoCoverage.obstetricsGroupDetails[0].departmentSpecialtyName}
      </h5>
    </div>
  )}
</div>
            </div>
          </div>

        </div>
        <div className={`${style.formContainer} ${style.marginTop20} ${style.margin10}`}>
          <h2 className={style.heading}>Acknowledgement</h2>
          <div className={style.gridStyle}>
            <div className={style.firstRowStyle}>
              <CommonCheckBox
                label="By submitting this reappointment application, I certify that the information provided is correct and true to the best of my knowledge and I agree to submit all supporting documentation within 48 hours if my application is selected for a random audit by the Chief of Staff Office."
                checked={agreement}
                onChange={handleAgreementChange}
                className={style.checkbox}
              />
            </div>

            <div className={style.secondRowStyle}>
              <div className={style.inputField}>
                <CommonTextField
                  label="Medical/Professional Staff Name"
                  value={physicianName}
                  onChange={(e) => setPhysicianName(e.target.value)}
                  placeholder="Enter Physician/Staff Name"
                  required
                  className={style.fullwidth}
                />
              </div>

              <div className={style.inputField}>
                <CommonDateField
                  label="Submission Date"
                  value={doA ? parse(doA, "MM-dd-yyyy", new Date()) : null}
                  onChange={handleDoAChange}
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
                        placeholder: "MM-DD-YYYY",
                        readOnly: true,
                      }}
                      fullWidth
                    />
                  )}
                  required
                  className={style.fullwidth}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`${style.padding20} ${style.marginRight40} ${style.marginBottom20}`}>
        <div className={`${style.floatRight} ${style.marginTop20} ${style.marginBottom20}`}>
          <button
            className={style.buttonStyle}
            onClick={() => SaveSubmitHandler()}
          >
            SAVE
          </button>
          <button
            className={`${style.outlinedButton} ${style.marginLeft20}`}
            onClick={() => handleCancelClick()}
          >
            CANCEL
          </button>
        </div>
      </div>
      {showValidationDialog && (
                <HistoricValidationDialog
                    getIsOpen={setShowValidationDialog}
                    labelList={warningFields}
                />
            )}
    </>

  );
};

export default HistoricalData;
