  import React, { useEffect, useState } from "react";
  import Navbar from "../../../Components/Navbar";
  import style from "./index.module.scss";
  import CommonInputField from "../../../Components/CommonFields/CommonInputField";
  import CommonDateField from "../../../Components/CommonFields/CommonDateField";
  import { format, parse } from "date-fns";
  import CommonSelectField from "../../../Components/CommonFields/CommonSelectField";
  import { GET,PUT,POST, TenantID } from "../../dataSaver";
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



  const HistoricalData = () => {

  const [firstName,setFirstName] = useState("");
  const [lastName,setLastName] = useState("");
  const [saveData, setSaveData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [middleName,setMiddleName] = useState("");
  const [email,setEmail] = useState("");
  const [dob,setDob] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [city, setCity] = useState("");
  const [province,setProvince] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [homeCity, setHomeCity] = useState("");
  const [homeProvince, setHomeProvince] = useState("");
  const [homeZipcode, setHomeZipcode] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [preferredPhone, setPreferredPhone] = useState("");

  const [privilegeOtherList, setPrivilegeOtherList] = useState([]);
    const [privilegeCategoryList, setPrivilegeCategoryList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [hospitalList, setHospitalList] = useState([]);
    const [groupList, setGroupList] = useState([]);
    const [applicantTypeList, setApplicantTypeList] = useState([]);
    const [applicationOldData, setApplicationOldData] = useState([]);
    const [privilege,setPrivilege] = useState("");
    const [program,setProgram]= useState("");
    const [applicantType,setApplicantType]= useState("");
    const [billingNo,setBillingNo] = useState("");
    const [cmpaNo,setCmpaNo] = useState("");
    const [cPSONo,setCPSONo] = useState("");
    const [subSpeciality,setSubSpeciality] = useState("")
    const [serviceAreas, setServiceAreas] = useState([]);
    const [individualList, setIndividualList] = useState([]);
    const [selectedApplication,setSelectedApplication] = useState();
    const [uploadedFiles, setUploadedFiles] = useState({
      ACLS: {
        file:[],
        responseFile:{}
      },
      ACES: {
        file:[],
        responseFile:{}
      },
      CMPA: {
        file:[],
        responseFile:{}
      },
      Malpractice: {
        file:[],
        responseFile:{}
      },
      CPSO: {
        file:[],responseFile:{}
      },
      N95: {
        file:[],
        responseFile:{}
      },
      PALS: {
        file:[],
        responseFile:{}
      },
      NRP: {file:[],
        responseFile:{}
      },
      CPR: {
        file:[],
        responseFile:{}
      },
      BloodyEasy:{
        file:[],
        responseFile:{}
      },
      Other:{file:[],responseFile:{}}
    });
    const [prescribeSuboxone, setPrescribeSuboxone] = useState("");
    const [mrpForPatients, setMrpForPatients] = useState("");

    const [licensingBody, setLicensingBody] = useState({
      radioValue: "", 
      content: "", 
      file: null, 
      responseFile:{}
    });

    const [investigatedByCPSO, setInvestigatedByCPSO] = useState({
      radioValue: "", 
      content: "", 
      file: null, 
      responseFile:{}
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
      responseFile:{} 
    });
    const [defendantCivilCase, setDefentantCivilCase] = useState({
      radioValue: "", 
      content: "", 
      file: null,
      responseFile:{} 
    });
    const [pendingCivilCase, setPendingCivilCase] = useState({
      radioValue: "", 
      content: "", 
      file: null,
      responseFile:{} 
    });
    const [terminatedReason, setTerminatedReason]=useState({
      radioValue: "", 
      content: "", 
      file: null,
      responseFile:{} 
    });

    const [voluntary, setVoluntary]=useState({
      radioValue: "", 
      content: "", 
      file: null,
      responseFile:{} 
    });

    
    const [mACPastYear, setMACPastYear]=useState({
      radioValue: "", 
      content: "", 
      file: null,
      responseFile:{} 
    });

    const [CMETranscript ,setCMETranscript]=useState({
      radioValue: "", 
      file: [], 
      responseFile:{}
    });

    const [CMECertificate, setCMECertificate]=useState({
      radioValue: "", 
      file: [], 
      responseFile:{}
    });

    const [coverage, setCoverage] = useState({
      type: "",
      individual: "",
      group: [],
    });
    const [whoCoverage, setWhoCoverage] = useState({
      type: "",
      individual: "",
      group: [],
    });




    const [doe,setDoe] = useState("");
    const [restrictiontext,setRestrictionText] = useState("");
    const tableHeader = ['Name', 'Applicant Type', 'Privilege',''];


    const canadianPostalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

    const isValidCanadianZip = (code) => canadianPostalCodeRegex.test(code);
  
    // Generic function to fetch city by zip code
    const fetchCityByZipcode = async (zipcode, setCityCallback,setProvinceCallBack) => {
      if (isValidCanadianZip(zipcode)) {
        try {
          const response = await axios.get(
            `https://geocoder.ca/${zipcode}?json=1`
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
      fetchCityByZipcode(zipcode, setCity,setProvince);
    }, [zipcode]);

     useEffect(() => {
    fetchCityByZipcode(homeZipcode, setHomeCity,setHomeProvince);
  }, [homeZipcode]);

    const handleDobChange = (newDate) => {
      if (newDate) {
        const formattedDate = format(new Date(newDate), "MM-dd-yyyy");
        setDob(formattedDate);
      } else {
        setDob("");
      }
    };
    const buildCoveragePayload = (coverage, individualList, groupList) => {
      const payload = {};
    
      // Handle Coverage (coverage state)
      if (coverage.type === "Individual") {
        const individual = individualList.find((item) => item.id === coverage.individual);
        payload.providerType = "Individual";
        if (individual) {
          payload.providerDetails_id = individual.id;
          payload.providerDetails_name = `${individual.applicant?.name?.firstName} ${individual.applicant?.name?.lastName}`;
        }
      } else if (coverage.type === "Group") {
        payload.providerType = "Group";
        coverage.group.forEach((groupId, index) => {
          const group = groupList.find((item) => item.id === groupId);
          payload[`providerDetails_id_${index + 1}`] = group?.id || groupId;
          payload[`providerDetails_name_${index + 1}`] = group?.name || "";
        });
      }
    
      return payload;
    };
    
    

    const handleDoeChange = (newDate) => {
      if (newDate) {
        const formattedDate = format(new Date(newDate), "MM-dd-yyyy");
        setDoe(formattedDate);
      } else {
        setDoe("");
      }
    };

  const acceptTypes = {
    "image/jpeg": [],
    "image/png": [],
    "image/jpg": [],
    "application/pdf": []
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
      const response = await axios.post(
        `${baseUrl()}/application-management-service/application/historicFileUpload`,
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

      const getGrouplist = async () => {
        const { data: programs } = await GET("entity-service/callCoverageGroups");
        setGroupList(programs);
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
        getGrouplist();
        getApplicationOldData();
      }, []);


      useEffect(() => {
        getPrivilegeCategories();
      },[applicantType]);

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
        if (!digits) return "+1"; // Return default country code if no digits are provided
      
        // Format the number dynamically
        if (digits.length <= 3) {
          return `+1 (${digits}`;
        } else if (digits.length <= 6) {
          return `+1 (${digits.slice(0, 3)}) ${digits.slice(3)}`;
        } else {
          return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
        }
      };
      
    
    
      // Reusable phone change handler
      const handlePhoneChange = (e, setPhoneState) => {
        const rawValue = e.target.value;
      
        // Strip all non-numeric characters except + and limit to 10 digits after +1
        const numericValue = rawValue.replace(/[^\d]/g, "");
      
        // Ensure it starts with +1
        let formattedValue = "+1";
        if (numericValue.startsWith("1")) {
          const digits = numericValue.slice(1, 11); // Get up to 10 digits after the country code
          formattedValue = formatPhoneNumber(digits);
        }
      
        // Update state with the formatted value
        setPhoneState(formattedValue);
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
      };

      const handleAddClick = () => {
        setIsEdit(true);
        setSelectedApplication(null);
        resetDialogFields();
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
          const response = await axios.post(
            `${baseUrl()}/application-management-service/application/historicFileUpload`,
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
        setState((prev) => ({
          ...prev,
          content: editor.getData(),
        }));
      };
      

      const handleEditorRestrictionChange = (event, editor) => {
        const data = editor.getData();
        setRestrictionText(data); 
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
            responseFile:{}
          }));
        }
      };

      const handleRadioCMEChange = (setStateFunction, value) => {
        setStateFunction((prev) => ({
          ...prev,
          radioValue: value,
          file: value === "false" ? [] : prev.file,
          responseFile:value=== "false" ? {} : prev.responseFile
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
          const response = await axios.post(
            `${baseUrl()}/application-management-service/application/historicFileUpload`,
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
      
      



      const handleCoverageTypeChange = (currentState, setState, value) => {
        setState({
          ...currentState,
          type: value,
          individual: value === "Individual" ? "" : currentState.individual,
          group: value === "Group" ? [] : currentState.group,
        });
      };
      
      const handleIndividualChange = (currentState, setState, value) => {
        setState({
          ...currentState,
          individual: value,
        });
      };
      
      const handleGroupChange = (currentState, setState, value) => {
        setState({
          ...currentState,
          group: value,
        });
      };
      
      const removeGroupValue = (currentState, setState, valueToRemove) => {
        setState({
          ...currentState,
          group: currentState.group.filter((value) => value !== valueToRemove),
        });
      };

      const getTableDataValues = () => {
        let name = [];
        let applicantType = [];
        let privilege= [];
        let editIcon = [];
    
       applicationOldData.map(data => {
          name.push(data?.demographics.name.firstName);
          applicantType.push(data?.applicantType.category);
          privilege.push(data?.privilegeCategory.status.category);
         editIcon.push(<EditIcon className={style.editColor} onClick={() => handleEditClick(data)} />)
        })
        return [
          { type: "text", value: name},
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
          setZipcode(selectedApplication.demographics.office.pinCode);
          setContactNo(selectedApplication.demographics.homephoneno);
          setPreferredPhone(selectedApplication.demographics.cmh_admin_phoneno);
          setPrivilege(selectedApplication.privilegeCategory.status.id);
          setProgram(selectedApplication.privilegeCategory.program.id);
          setSubSpeciality(selectedApplication.privilegeCategory.subSpecialty.id);
          setBillingNo(selectedApplication.professionalInformation.ohipbillingNumber);
          setCmpaNo(selectedApplication.professionalInformation.cmpaNumber);
          setPrescribeSuboxone(selectedApplication.professionalInformation.prescribeSuboxone);
          setMrpForPatients(selectedApplication.professionalInformation.mrpForNursery)
          setUploadedFiles({CMPA:{responseFile:selectedApplication.professionalInformation.cmpaattachment},
            Malpractice:{responseFile:selectedApplication.professionalInformation.otherMalpracticeProtectionAttachement},
            CPSO:{responseFile:selectedApplication.professionalInformation.cpsoattachment},
            Other:{responseFile:selectedApplication.professionalInformation.otherProfessionalRegistrationAttachment},
            N95:{responseFile:selectedApplication.professionalInformation.n95FitTestAttachment},
            PALS:{responseFile:selectedApplication.professionalInformation.palsattachment},
            NRP:{responseFile:selectedApplication.professionalInformation.nrpattachment},
            CPR:{responseFile:selectedApplication.professionalInformation.cprattachment},
            ACLS:{responseFile:selectedApplication.professionalInformation.aclsattachment},
            ACES:{responseFile:selectedApplication.professionalInformation.acesattachment},
            BloodyEasy:{responseFile:selectedApplication.professionalIssues.bloodyEasyLiteTraining}
          });
          setLicensingBody({radioValue:selectedApplication.professionalIssues.formalComplaint.response,
    content:selectedApplication.professionalIssues.formalComplaint.remarks,
    responseFile:selectedApplication.professionalIssues.formalComplaint.attachment
        });
        setInvestigatedByCPSO({radioValue:selectedApplication.professionalIssues.underInvestigation.response,
          content:selectedApplication.professionalIssues.underInvestigation.remarks,
          responseFile:selectedApplication.professionalIssues.underInvestigation.attachment
              });
              setPhysicalHealth({radioValue:selectedApplication.professionalIssues.healthProblems.response,
                content:selectedApplication.professionalIssues.healthProblems.remarks,
                responseFile:selectedApplication.professionalIssues.healthProblems.attachment});
          setDefentantCivilCase({radioValue:selectedApplication.professionalIssues.civilOrCriminalLawsuits.response,
            content:selectedApplication.professionalIssues.civilOrCriminalLawsuits.remarks,
            responseFile:selectedApplication.professionalIssues.civilOrCriminalLawsuits.attachment});
            setPendingCivilCase({radioValue:selectedApplication.professionalIssues.pendingActions.response,
              content:selectedApplication.professionalIssues.pendingActions.remarks,
              responseFile:selectedApplication.professionalIssues.pendingActions.attachment});
           setPrivilegesOther({radioValue:selectedApplication.professionalIssues.otherHospitalPrivilegesExist});
           setHospitalPrivileges(selectedApplication.professionalIssues.hospitalPrivileges);
           setTerminatedReason({
            radioValue:selectedApplication.professionalIssues.privilegesReduced.response,
              content:selectedApplication.professionalIssues.privilegesReduced.remarks,
              responseFile:selectedApplication.professionalIssues.privilegesReduced.attachment
           });
           setVoluntary({
            radioValue:selectedApplication.professionalIssues.voluntarilyRelinquished.response,
              content:selectedApplication.professionalIssues.voluntarilyRelinquished.remarks,
              responseFile:selectedApplication.professionalIssues.voluntarilyRelinquished.attachment
           });
           setMACPastYear({
            radioValue:selectedApplication.professionalIssues.subjectToPatientConcerns.response,
              content:selectedApplication.professionalIssues.subjectToPatientConcerns.remarks,
              responseFile:selectedApplication.professionalIssues.subjectToPatientConcerns.attachment
           });
           setDoe(selectedApplication.restrictedLicensing.expiryDate);
           setRestrictionText(selectedApplication.restrictedLicensing.restrictions);
           setCMETranscript({
            radioValue:selectedApplication.continuingEducation.requirementsMet,
            responseFile:selectedApplication.continuingEducation.transcripts
           })
          setApplicantType(selectedApplication.applicantType.id);
        }
      }, [selectedApplication]);


      useEffect(() => {
        if (selectedApplication?.coverageDetails) {
          // Set coverage state
          const providerDetails = selectedApplication.coverageDetails.providerDetails || [];
          const providerType = selectedApplication.coverageDetails.providerType;
      
          // Find individual and group items
          const individual = providerDetails.length > 0 ? providerDetails[0]?.id : "";
          const groupIds = providerDetails.map(item => item.id);
      
          // Ensure individual is in the individualList and group is in the groupList
          const validIndividual = individualList.some(individualItem => individualItem.id === individual) ? individual : "";
          const validGroupIds = groupIds.filter(groupId => groupList.some(groupItem => groupItem.id === groupId));
      
          // Set coverage state
          setCoverage({
            type: providerType, // "Individual" or "Group"
            individual: validIndividual, // Only set individual if it exists in individualList
            group: validGroupIds, // Only set group if it exists in groupList
          });
      
          // Set whoCoverage state for obstetrics provider
          const obstetricsProviderDetails = selectedApplication.coverageDetails.obstetricsProviderDetails || [];
          const obstetricsProviderType = selectedApplication.coverageDetails.obstetricsProviderType;
      
          const obstetricsIndividual = obstetricsProviderDetails.length > 0 ? obstetricsProviderDetails[0]?.id : "";
          const obstetricsGroupIds = obstetricsProviderDetails.map(item => item.id);
      
          const validObstetricsIndividual = individualList.some(individualItem => individualItem.id === obstetricsIndividual) ? obstetricsIndividual : "";
          const validObstetricsGroupIds = obstetricsGroupIds.filter(groupId => groupList.some(groupItem => groupItem.id === groupId));
      
          // Set whoCoverage state
          setWhoCoverage({
            type: obstetricsProviderType, // "Individual" or "Group"
            individual: validObstetricsIndividual, // Only set individual if it exists in individualList
            group: validObstetricsGroupIds, // Only set group if it exists in groupList
          });
        }
      }, [selectedApplication, individualList, groupList]); // Dependency on selectedApplication, individualList, and groupList
      


      const resetDialogFields = () => {
        setSaveData({  });
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
        setZipcode("");
        setContactNo("");
        setPreferredPhone("");
        setPrivilege("");
        setProgram("");
        setSubSpeciality("");
        setBillingNo("");
        setCmpaNo("");
        setCPSONo("");
        setPrescribeSuboxone("");
        setMrpForPatients("");
        setUploadedFiles({CMPA:{responseFile:{}},
          Malpractice:{responseFile:{}},
          CPSO:{responseFile:{}},
          Other:{responseFile:{}},
          N95:{responseFile:{}},
          PALS:{responseFile:{}},
          NRP:{responseFile:{}},
          CPR:{responseFile:{}},
          ACLS:{responseFile:{}},
          ACES:{responseFile:{}},
          BloodyEasy:{responseFile:{}}
        });
        setLicensingBody({radioValue:"",
  content:"",
  responseFile:{}
      });
      setInvestigatedByCPSO({radioValue:"",
        content:"",
        responseFile:{}
            });
            setPhysicalHealth({radioValue:"",
              content:"",
              responseFile:{}});
        setDefentantCivilCase({radioValue:"",
          content:"",
          responseFile:{}});
          setPendingCivilCase({radioValue:"",
            content:"",
            responseFile:{}});
         setPrivilegesOther({radioValue:""});
         setHospitalPrivileges([]);
         setTerminatedReason({
          radioValue:"",
            content:"",
            responseFile:{}
         });
         setVoluntary({
          radioValue:"",
            content:"",
            responseFile:{}
         });
         setMACPastYear({
          radioValue:"",
            content:"",
            responseFile:{}
         });
         setDoe("");
         setRestrictionText("");
         setCMETranscript({
          radioValue:"",
          responseFile:{}
         });
        setApplicantType("");
      };

      const buildWhoCoveragePayload = (whoCoverage, individualList, groupList) => {
        const payload = {};
      
        // Handle Who Coverage (whoCoverage state)
        if (whoCoverage.type === "Individual") {
          const individual = individualList.find((item) => item.id === whoCoverage.individual);
          payload.obstetricsProviderType = "Individual";
          if (individual) {
            payload.obstetricsProviderDetails_id = individual.id;
            payload.obstetricsProviderDetails_name = `${individual.applicant?.name?.firstName} ${individual.applicant?.name?.lastName}`;
          }
        } else if (whoCoverage.type === "Group") {
          payload.obstetricsProviderType = "Group";
          whoCoverage.group.forEach((groupId, index) => {
            const group = groupList.find((item) => item.id === groupId);
            payload[`obstetricsProviderDetails_id_${index + 1}`] = group?.id || groupId;
            payload[`obstetricsProviderDetails_name_${index + 1}`] = group?.name || "";
          });
        }
      
        return payload;
      };
      
const SaveSubmitHandler = async (isSaveAndExit) => {

  const coveragePayload = buildCoveragePayload(coverage, individualList, groupList);

  const whoCoveragePayload = buildWhoCoveragePayload(whoCoverage, individualList, groupList);
    var application = {
      ...saveData,
      demographics: {
        name:{
          firstName:firstName,
          lastName:lastName,
          middleName: middleName
        },
        dateOfBirth: dob,
        office:{
          streetName:officeAddress,
          city:city,
          province:province,
          pincode:zipcode
        },
        residence: {
        streetName: homeAddress,
        city: homeCity,
        province: homeProvince,
        pinCode: homeZipcode
      },
      homephoneno: contactNo,
      cmh_admin_phoneno:preferredPhone,
      email:email
      },
      privilegeCategory:{
          staus:{
            id:privilege,
            category:privilegeCategoryList.find((data) => data.id === privilege)?.category,
            type:privilegeCategoryList.find((data) => data.id === privilege)?.type
          },
          program:{
            id:program,
            name:departmentList.find((data) => data.id === program)?.departmentName.name
          },
          subSpecialty:{
            id:subSpeciality,
            name:serviceAreas.find((data) => data.id === subSpeciality)?.name
          },
          changePrivilegesFromPreviousYear:true,
      },
      professionalInformation:{
        ohipbillingNumber:billingNo,
        cmpaNumber:cmpaNo,
        cmpaattachment:uploadedFiles.CMPA.responseFile,
        otherMalpracticeProtectionAttachement:uploadedFiles.Malpractice.responseFile,
        cpsoRegistrationNumber:cPSONo,
        cpsoattachment:uploadedFiles.CPSO.responseFile,
        otherProfessionalRegistrationAttachment:uploadedFiles.Other.responseFile,
        n95FitTestAttachment:uploadedFiles.N95.responseFile,
        palsattachment:uploadedFiles.PALS.responseFile,
        nrpattachment:uploadedFiles.NRP.responseFile,
        cprattachment:uploadedFiles.CPR.responseFile,
        aclsattachment:uploadedFiles.ACLS.responseFile,
        acesattachment:uploadedFiles.ACES.responseFile,
        prescribeSuboxone:prescribeSuboxone,
        mrpForNursery:mrpForPatients
      },
      professionalIssues:{
        formalComplaint:{
          response:licensingBody.radioValue,
          remarks:licensingBody.content,
          attachment:licensingBody.responseFile
        },
        underInvestigation:{
          response:investigatedByCPSO.radioValue,
          remarks:investigatedByCPSO.content,
          attachment:investigatedByCPSO.responseFile
        },
        subjectToPatientConcerns:{
          response:mACPastYear.radioValue,
          remarks:mACPastYear.content,
          attachment:mACPastYear.responseFile
        },
        civilOrCriminalLawsuits:{
          response:defendantCivilCase.radioValue,
          remarks:defendantCivilCase.content,
          attachment:defendantCivilCase.responseFile
        },
        pendingActions:{
          response:pendingCivilCase.radioValue,
          remarks:pendingCivilCase.content,
          attachment:pendingCivilCase.responseFile
        },
        healthProblems:{
          response:physicalHealth.radioValue,
          remarks:physicalHealth.content,
          attachment:physicalHealth.responseFile
        },
        privilegesReduced:{
          response:terminatedReason.radioValue,
          remarks:terminatedReason.content,
          attachment:terminatedReason.responseFile
        },
        voluntarilyRelinquished:{
          response:voluntary.radioValue,
          remarks:voluntary.content,
          attachment:voluntary.responseFile
        },
        otherHospitalPrivilegesExist:privilegesOther.radioValue,
        hospitalPrivileges:hospitalPrivileges,
        bloodyEasyLiteTraining:uploadedFiles.BloodyEasy.responseFile,

      },
      restrictedLicensing:{
        expiryDate:doe,
        restrictions:restrictiontext
      },
      continuingEducation:{
        requirementsMet:CMETranscript.radioValue,
        transcripts:[
          CMETranscript.responseFile]
      },
      coverageDetails:{
        providerType:coveragePayload.providerType,
        providerDetails:[{
          id:coveragePayload.providerDetails_id,
          name:coveragePayload.providerDetails_name
        }],

        obstetricsProviderType:whoCoveragePayload.obstetricsProviderType,
        obstetricsProviderDetails: [
          {
            id: whoCoveragePayload.obstetricsProviderDetails_id,
            name: whoCoveragePayload.obstetricsProviderDetails_name
          }
        ]
        
      }
      
    };

    if (!isEdit) {
      await POST("application-management-service/application/createStaffFromOldData", JSON.stringify(application))
        .then((response) => {
          SuccessToaster("Historical Data Added Successfully");
           resetDialogFields();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
       var importedDataId = selectedApplication.id;
      await PUT(
        `application-management-service/${importedDataId}/updateApplicationOldData`,
        JSON.stringify(application)
      )
        .then((response) => {
          SuccessToaster("Historical Data Updated Successfully");
           resetDialogFields();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    }
  };
    return (
      <>
        <Navbar />
        <div className={style.applicantList}>
        <div className={`${style.floatRight} ${style.marginTop20} ${style.marginBottom20}`}>
            <button
              className={style.buttonStyle}
              onClick={() => handleAddClick()}
            >
              ADD NEW
            </button></div>
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
              />
              </div>
        <div className={style.margin10}>
        <div className={`${style.formContainer} ${style.margin10}`}>
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
          className={style.fullwidth}
        />
      </div>
      <div className={style.inputGroup}>
        <CommonTextField
          label="Middle Name"
          name="middleName"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
          placeholder="Enter Middle Name"
          required
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
          className={style.fullwidth}
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
          className={style.fullwidth}
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
          placeholder:"MM-DD-YYYY",
          readOnly: true,
        }}
        color={
          dob === null || dob === "" ? "error" : "" 
        }
        fullWidth 
        focused={
          dob === null || dob === ""  
        }
      />
    )}
    minDate={new Date("1900-01-01")}
    maxDate={new Date()}
    required
    className={style.fullwidth} 
  />

      </div>
    </div>
  </div>
  <div className={`${style.formContainer} ${style.marginTop20} ${style.margin10}`}>
        <h2 className={style.heading}>Demographic Data</h2>

        {/* Office Address Section */}
        <div className={style.inputGroup}>
          <h3 className={style.subHeading}>Office Address</h3>
          <div className={style.gridContainer}>
            <div className={style.inputGroup}>
              <CommonTextField
                label="Office Address"
                value={officeAddress}
                onChange={(e) => setOfficeAddress(e.target.value)}
                placeholder="Enter Office Address"
                required
                className={style.fullwidth}
              />
            </div>
            <div className={style.inputGroup}>
              <CommonTextField
                label="Postal Code"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
                placeholder="Enter Postal Code"
                required
                className={style.fullwidth}
              />
            </div>
            <div className={style.inputGroup}>
              <CommonTextField
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter City"
                required
                className={style.fullwidth}
              />
            </div>
            <div className={style.inputGroup}>
              <CommonTextField
                label="Province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="Enter Province"
                required
                className={style.fullwidth}
              />
            </div>
           
          </div>
        </div>

        {/* Home Address Section */}
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
                className={style.fullwidth}
              />
            </div>
            <div className={style.inputGroup}>
              <CommonTextField
                label="Postal Code"
                value={homeZipcode}
                onChange={(e) => setHomeZipcode(e.target.value)}
                placeholder="Enter Postal Code"
                required
                className={style.fullwidth}
              />
            </div>
            <div className={style.inputGroup}>
              <CommonTextField
                label="City"
                value={homeCity}
                onChange={(e) => setHomeCity(e.target.value)}
                placeholder="Enter City"
                required
                className={style.fullwidth}
              />
            </div>
            <div className={style.inputGroup}>
              <CommonTextField
                label="Province"
                value={homeProvince}
                onChange={(e) => setHomeProvince(e.target.value)}
                placeholder="Enter Province"
                required
                className={style.fullwidth}
              />
            </div>
            <div className={style.inputGroup}>
              <CommonTextField
                label="Phone No"
                value={contactNo}
                onChange={(e) => handlePhoneChange(e, setContactNo)}
                placeholder="Enter Contact No"
                required
                className={style.fullwidth}
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
                className={style.fullwidth}
                type="tel"
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
     className={style.fullWidth}
     value={applicantType}
     label="Applicant Type"
     onChange={(e) => setApplicantType(e.target.value)}
     valueList={applicantTypeList.map((item) => item.id)}
     labelList={applicantTypeList.map((item) => item.applicantType)}
     firstOptionLabel="Select Applicant Type"
     firstOptionValue=""
     required
     disabledList={[]}
     menuColor={[]}/>
      </div>
      <div className={style.inputGroup}>
      <CommonSelectField
        className={style.fullWidth}
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
        className={style.fullWidth}
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

      <div className={style.inputGroup}>
      <CommonSelectField
        className={style.fullWidth}
        value={subSpeciality}
        label="Sub Speciality"
        onChange={(e) => setSubSpeciality(e.target.value)}
        valueList={serviceAreas.map((item) => item.id)}
        labelList={serviceAreas.map((item) => item.name)}
        firstOptionLabel="Select Sub Speciality"
        firstOptionValue=""
        required
        disabledList={[]}
        menuColor={[]}
      />
      </div>
      </div>
      </div>

      <div className={`${style.formContainer} ${style.marginTop20} ${style.margin10}`}>
      <h2 className={style.heading}>Professional Information</h2>
      <div className={style.gridContainer1}>
      <div className={style.inputGroup}>
  <CommonTextField
  label="OHIP Billing"
  value={billingNo}
  onChange={(e)=>setBillingNo(e.target.value)}
  placeholder="Enter OHIP No"
  required
  className={style.fullwidth}/>
      </div>
      <div className={style.inputRow}>
  <div className={style.inputField}>
    <CommonTextField
      label="CMPA No"
      value={cmpaNo}
      onChange={(e) => setCmpaNo(e.target.value)}
      placeholder="Enter CMPA No"
      required
      className={style.fullwidth}
    />
  </div>
  <div className={style.fileUpload}>
    <CommonDropZone
      title="Upload CMPA File"
      description="Drag & drop a file here, or click to select"
      changeHandler={(acceptedFiles) => handleFileDrop("CMPA", acceptedFiles)}
    />
    {uploadedFiles.CMPA.responseFile&& (
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
  {uploadedFiles.Malpractice.responseFile&& (
      <div className={style.uploadedFiles}>
        <h4>Uploaded File:</h4>
        <ul>
            <li>{uploadedFiles.Malpractice.responseFile.fileName}</li>
        </ul>
      </div>
    )}
</div>
<div className={style.inputRow}>
  <div className={style.inputField}>
    <CommonTextField
      label="CPSO Registration No"
      value={cPSONo}
      onChange={(e) => setCPSONo(e.target.value)}
      placeholder="Enter CPSO No"
      required
      className={style.fullwidth}
    />
  </div>
  <div className={style.fileUpload}>
    <CommonDropZone
      title="Upload CPSO File"
      description="Drag & drop a file here, or click to select"
      changeHandler={(acceptedFiles) => handleFileDrop("CPSO", acceptedFiles)}
    />
   {uploadedFiles.CPSO.responseFile&& (
      <div className={style.uploadedFiles}>
        <h4>Uploaded File:</h4>
        <ul>
            <li>{uploadedFiles.CPSO.responseFile.fileName}</li>
        </ul>
      </div>
    )}
  </div>
</div>

<div className={style.inputGroup1}>
<div className={style.headerContainer}>
    <p>Other Professional Attachment*</p>
  </div>
<CommonDropZone
      title="Upload Other Professional Attachment File"
      description="Drag & drop a file here, or click to select"
      changeHandler={(acceptedFiles) => handleFileDrop("Other", acceptedFiles)}
    />
    {uploadedFiles.Other.responseFile&& (
      <div className={style.uploadedFiles}>
        <h4>Uploaded File:</h4>
        <ul>
            <li>{uploadedFiles.Other.responseFile.fileName}</li>
        </ul>
      </div>
    )}
</div>

<div className={style.inputGroup1}>
<div className={style.headerContainer}>
    <p>Proof of your N95 Fit Test*</p>
  </div>
<CommonDropZone
      title="Upload N95 Fit test File"
      description="Drag & drop a file here, or click to select"
      changeHandler={(acceptedFiles) => handleFileDrop("N95", acceptedFiles)}
     
    />
   {uploadedFiles.N95.responseFile&& (
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
  {uploadedFiles.PALS.responseFile&& (
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
    {uploadedFiles.NRP.responseFile&& (
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
    {uploadedFiles.CPR.responseFile&& (
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
    {uploadedFiles.ACLS.responseFile&& (
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
    {uploadedFiles.ACES.responseFile&& (
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
   {uploadedFiles.BloodyEasy.responseFile&& (
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
      radioValue={["yes", "no"]}
      label={["Yes", "No"]}
      required={true}
      className={style.commonRadio}
    />
  </div>

  {licensingBody.radioValue === "yes" && (
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
      radioValue={["yes", "no"]}
      label={["Yes", "No"]}
      required={true}
      className={style.commonRadio}
    />
  </div>

  {investigatedByCPSO.radioValue === "yes" && (
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
      radioValue={["yes", "no"]}
      label={["Yes", "No"]}
      required={true}
      className={style.commonRadio}
    />
  </div>

  {physicalHealth.radioValue === "yes" && (
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
      radioValue={["yes", "no"]}
      label={["Yes", "No"]}
      required={true}
      className={style.commonRadio}
    />
  </div>

  {defendantCivilCase.radioValue === "yes" && (
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
        {defendantCivilCase.responseFile&& <p className={style.fileName}>Uploaded file: {defendantCivilCase.responseFile.fileName}</p>}
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
      radioValue={["yes", "no"]}
      label={["Yes", "No"]}
      required={true}
      className={style.commonRadio}
    />
  </div>

  {pendingCivilCase.radioValue === "yes" && (
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
      radioValue={["yes", "no"]}
      label={["Yes", "No"]}
      required={true}
      className={style.commonRadio}
    />
  </div>

  {privilegesOther.radioValue === "yes" && (
    <div className={style.secondRow1}>
      <div className={style.ckEditorWrapper}>
      <CommonSelectField
     className={style.fullWidth}
     value={privilegesOther.Hospital}
     label="Select Hospital"
     onChange={(e) => handleSelectChange("Hospital", e.target.value)}
    valueList={hospitalList.map((item) => item.id)}
    labelList={hospitalList.map((item) => item.name)}
     firstOptionLabel="Select Hospital"
     firstOptionValue=""
     required
     disabledList={[]}
     menuColor={[]}/>
       
      </div>

      <div className={style.fileUpload}>
      <CommonSelectField
     className={style.fullWidth}
     value={privilegesOther.privilegeCategory}
     label="Select Other Privilege Category"
     onChange={(e) => handleSelectChange("privilegeCategory", e.target.value)}
    valueList={privilegeOtherList.map((item) => item.id)}
    labelList={privilegeOtherList.map((item) => item.category)}
    firstOptionLabel="Select Other Privilege Category"
    firstOptionValue=""
     required
     disabledList={[]}
     menuColor={[]}/>
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
      radioValue={["yes", "no"]}
      label={["Yes", "No"]}
      required={true}
      className={style.commonRadio}
    />
  </div>

  {terminatedReason.radioValue === "yes" && (
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
        {terminatedReason.responseFile&& <p className={style.fileName}>Uploaded file: {terminatedReason.responseFile.fileName}</p>}
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
      radioValue={["yes", "no"]}
      label={["Yes", "No"]}
      required={true}
      className={style.commonRadio}
    />
  </div>

  {voluntary.radioValue === "yes" && (
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
      radioValue={["yes", "no"]}
      label={["Yes", "No"]}
      required={true}
      className={style.commonRadio}
    />
  </div>

  {mACPastYear.radioValue === "yes" && (
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
          placeholder:"MM-DD-YYYY",
          readOnly: true,
        }}
        color={
          doe === null || doe === "" ? "error" : "" 
        }
        fullWidth 
        focused={
          doe === null || doe === ""  
        }
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
    Do you have any CME / CEU Transcript from your College or Membership Organisation?
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
<div className={style.inputGroup5}>
  <div className={style.firstRow}>
    <p className={style.question}>
    Do you have any other CME / CEU Certificates you have obtained in the past year?
    </p>
    <CommonRadio
      onChange={(event) =>
              handleRadioCMEChange(setCMECertificate, event.target.value)
            }
      value={CMECertificate.radioValue}
      radioValue={["true", "false"]}
      label={["Yes", "No"]}
      required={true}
      className={style.commonRadio}
    />
  </div>

  {CMECertificate.radioValue === "true" && (
    <div className={style.secondRow2}>

<CommonDropZone
      title="Upload CME Certificate"
      description="Drag & drop a file here, or click to select"
      changeHandler={(acceptedFiles) => handleFileDropCME(setCMECertificate, acceptedFiles)}
    />
    {CMECertificate.responseFile&& (
      <div className={style.uploadedFiles}>
        <h4>Uploaded File:</h4>
        <ul>
          
            <li>{CMECertificate.responseFile.fileName}</li>
          
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
    value={coverage.type}
    onChange={(e) =>
      handleCoverageTypeChange(coverage, setCoverage, e.target.value)
    }
    firstOptionLabel="Select Type"
    firstOptionValue=""
    valueList={["Individual", "Group"]}
    labelList={["Individual", "Group"]}
    className={style.fullWidth}
    required={true}
    label="Type"
    disabledList={[]}
    menuColor={[]}
  />

  {coverage.type === "Individual" && (
    <CommonSelectField
      value={coverage.individual}
      onChange={(e) =>
        handleIndividualChange(coverage, setCoverage, e.target.value)
      }
      firstOptionLabel="Select an Individual"
      firstOptionValue=""
      valueList={individualList.map((data)=>data.id)}
      labelList={individualList.map((data) =>`${data.applicant?.name?.firstName} ${data.applicant?.name?.lastName}`)}
      className={style.fullWidth}
      required={true}
      label="Select Individual"
      disabledList={[]}
      menuColor={[]}
    />
  )}

  {coverage.type === "Group" && (
    <div>
       <label className={style.labels}>Group Provider*</label>
      <CommonMultiSelectField
        value={coverage.group}
        onChange={(e) =>
          handleGroupChange(coverage, setCoverage, e.target.value)
        }
        firstOptionLabel="Select Groups"
        firstOptionValue=""
        valueList={groupList.map((item) => item.id)}
        labelList={groupList.map((item) => item.name)}
        className={`${style.fullWidth} ${style.marginTop20}`}
        disabledList={[]}
      />

<div className={style.selectedGroupValues}>
      {coverage.group.map((value, index) => {
        // Find the name corresponding to the selected ID
        const groupName = groupList.find((item) => item.id === value)?.name;
        return (
          <div key={index} className={style.valueBox}>
            {groupName || value} 
            <span
              className={style.crossMark}
              onClick={() => removeGroupValue(coverage, setCoverage, value)}
            >
              &times;
            </span>
          </div>
        );
      })}
    </div>
    </div>
  )}
</div>
      </div>
      <div className={style.inputGroup6}>
      <p className={style.question}>If you are practicing obstetrics, who covers your patients when you are not available? </p>

{/* Type Select and Individual/Group Fields Row */}
<div className={style.gridContainer2}>
  <CommonSelectField
    value={whoCoverage.type}
    onChange={(e) =>
      handleCoverageTypeChange(whoCoverage, setWhoCoverage, e.target.value)
    }
    firstOptionLabel="Select Type"
    firstOptionValue=""
    valueList={["Individual", "Group"]}
    labelList={["Individual", "Group"]}
    className={style.fullWidth}
    required={true}
    label="Type"
    disabledList={[]}
    menuColor={[]}
  />

  {whoCoverage.type === "Individual" && (
    <CommonSelectField
      value={whoCoverage.individual}
      onChange={(e) =>
        handleIndividualChange(whoCoverage, setWhoCoverage, e.target.value)
      }
      firstOptionLabel="Select an Individual"
      firstOptionValue=""
      valueList={individualList.map((data)=>data.id)}
      labelList={individualList.map((data) => `${data.applicant?.name?.firstName} ${data.applicant?.name?.lastName}`)}
      className={style.fullWidth}
      required={true}
      label="Select Individual"
      disabledList={[]}
      menuColor={[]}
    />
  )}

  {whoCoverage.type === "Group" && (
    <div>
      <label className={style.labels}>Group Provider*</label>
      <CommonMultiSelectField
        value={whoCoverage.group}
        onChange={(e) =>
          handleGroupChange(whoCoverage, setWhoCoverage, e.target.value)
        }
        firstOptionLabel="Select Groups"
        firstOptionValue=""
        valueList={groupList.map((item) => item.id)}
        labelList={groupList.map((item) => item.name)}
        className={`${style.fullWidth} ${style.marginTop20}`}
        disabledList={[]}
        
      />

<div className={style.selectedGroupValues}>
      {whoCoverage.group.map((value, index) => {
        
        const groupName = groupList.find((item) => item.id === value)?.name;
        return (
          <div key={index} className={style.valueBox}>
            {groupName || value} 
            <span
              className={style.crossMark}
              onClick={() => removeGroupValue(whoCoverage, setWhoCoverage, value)}
            >
              &times;
            </span>
          </div>
        );
      })}
    </div>
    </div>
  )}
</div>
      </div>
      </div>
      
      </div>

      </div> 
      <div className={`${style.padding20} ${style.marginRight40} ${style.marginBottom20}`}>
          <div className={`${style.floatRight} ${style.marginTop20} ${style.marginBottom20}`}>
            <button
              className={style.buttonStyle}
              onClick={() => SaveSubmitHandler(true)}
            >
              SAVE 
            </button>
            <button
              className={`${style.outlinedButton} ${style.marginLeft20}`}
            >
              CANCEL
            </button>
          </div>
        </div>
      </>
    );
  };

  export default HistoricalData;
