  import React, { useEffect, useState } from "react";
  import Navbar from "../../../Components/Navbar";
  import style from "./index.module.scss";
  import CommonInputField from "../../../Components/CommonFields/CommonInputField";
  import CommonDateField from "../../../Components/CommonFields/CommonDateField";
  import { format, parse } from "date-fns";
  import CommonSelectField from "../../../Components/CommonFields/CommonSelectField";
  import { GET } from "../../dataSaver";
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


  const HistoricalData = () => {

  const [firstName,setFirstName] = useState("");
  const [lastName,setLastName] = useState("");
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

  const [privilegeCategoryMasterList, setPrivilegeCategoryMasterList] = useState([])
    const [privilegeCategoryList, setPrivilegeCategoryList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [hospitalList, setHospitalList] = useState([]);
    const [groupList, setGroupList] = useState([]);
    const [applicantTypeList, setApplicantTypeList] = useState([]);
    const [applicationOldData, setApplicationOldData] = useState([]);
    const [privilege,setPrivilege] = useState("");
    const [program,setProgram]= useState("");
    const [applicantType,setApplicantType]= useState("");
    const [billingNo,setBillingNo] = useState(0);
    const [cmpaNo,setCmpaNo] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState({
      ACLS: [],
      ACES: [],
      CMPA: [],
      Malpractice: [],
      CPSO: [],
      N95: [],
      PALS: [],
      NRP: [],
      CPR: [],
      BloodyEasy:[]
    });
    const [prescribeSuboxone, setPrescribeSuboxone] = useState("");
    const [mrpForPatients, setMrpForPatients] = useState("");

    const [licensingBody, setLicensingBody] = useState({
      radioValue: "", 
      content: "", 
      file: null, 
    });

    const [investigatedByCPSO, setInvestigatedByCPSO] = useState({
      radioValue: "", 
      content: "", 
      file: null, 
    });

    const [privilegesOther, setPrivilegesOther] = useState({
      radioValue: "", 
      Hospital:"" ,
      privilegeCategory:""
    });

    const [physicalHealth, setPhysicalHealth] = useState({
      radioValue: "", 
      content: "", 
      file: null, 
    });
    const [defendantCivilCase, setDefentantCivilCase] = useState({
      radioValue: "", 
      content: "", 
      file: null, 
    });
    const [pendingCivilCase, setPendingCivilCase] = useState({
      radioValue: "", 
      content: "", 
      file: null, 
    });
    const [terminatedReason, setTerminatedReason]=useState({
      radioValue: "", 
      content: "", 
      file: null, 
    });

    const [voluntary, setVoluntary]=useState({
      radioValue: "", 
      content: "", 
      file: null, 
    });

    
    const [mACPastYear, setMACPastYear]=useState({
      radioValue: "", 
      content: "", 
      file: null, 
    });

    const [CMETranscript ,setCMETranscript]=useState({
      radioValue: "", 
      file: [], 
    });

    const [CMECertificate, setCMECertificate]=useState({
      radioValue: "", 
      file: [], 
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

  const handleFileDrop = (category, acceptedFiles) => {
    setUploadedFiles((prevFiles) => ({
      ...prevFiles,
      [category]: acceptedFiles,
    }));

    acceptedFiles.forEach((file) => {
      console.log(`Uploaded file for ${category}:`, file.name);
      console.log(file);
      
    });
  };

  const getApplicantTypes = async () => {
    const { data: types } = await GET("entity-service/applicantType");
    setApplicantTypeList(types);
  };
  
  const getPrivilegeCategoriesMaster = async () => {
    const { data: types } = await GET("entity-service/privilegeCategoriesMaster");
    setPrivilegeCategoryMasterList(types);
  };

    const getPrivilegeCategories = async () => {
        const { data: types } = await GET("entity-service/privilege");
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
        getPrivilegeCategories();
        getDepartments();
        getApplicantTypes();
        getPrivilegeCategoriesMaster();
        getHospitals();
        getGrouplist();
        getApplicationOldData();
      }, []);


      const formatPhoneNumber = (phone) => {
        // Remove all non-numeric characters except for the initial +1
        let cleaned = phone.replace(/[^0-9]/g, '');
        
        // Ensure the phone number starts with +1
        if (cleaned.length > 1) {
          const areaCode = cleaned.slice(0, 3);
          const firstPart = cleaned.slice(3, 6);
          const secondPart = cleaned.slice(6, 10);
          
          // Format as +1 (XXX) XXX-XXXX
          if (areaCode.length === 3 && firstPart.length === 3 && secondPart.length === 4) {
            return `+1 (${areaCode}) ${firstPart}-${secondPart}`;
          }
        }
    
        // In case the input is incomplete, return the cleaned string starting with +1
        return cleaned ? `+1 ${cleaned}` : '';
      };
    
      // Reusable phone change handler
      const handlePhoneChange = (e, setPhoneState) => {
        const value = e.target.value;
        // Ensure the value starts with +1 and only allows valid characters
        if (/^[\d\s\(\)\-]*$/.test(value)) {
          setPhoneState(formatPhoneNumber(value));
        }
      };

      const handleChange = (event) => {
        setPrescribeSuboxone(event.target.value);
      };

      const handleMRPChange = (event) => {
        setMrpForPatients(event.target.value);
      };

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
          }));
        }
      };

      const handleRadioPrivilegeChange = (event) => {
        setPrivilegesOther({
          ...privilegesOther,
          radioValue: event.target.value,
          // Reset dropdowns if "No" is selected
          ...(event.target.value === "no" && {
            Hospital: "",
            privilegeCategory: "",
          }),
        });
      };

      const handleSelectChange = (field, value) => {
        setPrivilegesOther({
          ...privilegesOther,
          [field]: value,
        });
      };
      
      // Generalized File Upload Handler
      const handleFileUpload = (event, setState) => {
        const file = event.target.files[0]; // Get the first file selected
      
        if (file) {
          // Creating a temporary fileURL
          const fileURL = URL.createObjectURL(file);
      
          // Assume you uploaded the file and got a file path back from the backend
          const uploadedFilePath = '/server/uploads/filename.pdf'; // Example file path returned from server
      
          // Creating the attachment object
          const attachment = {
            filePath: uploadedFilePath,  
            fileName: file.name,
            fileURL: fileURL,  
            fileType: file.type,
          };
      
          // Updating the state with the new attachment
          setState((prev) => ({
            ...prev,
            attachment: attachment,
            file: file,
          }));
      
          // For debugging purposes
          console.log(attachment);
        }
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


      const handleRadioCMEChange = (setStateFunction, value) => {
        setStateFunction((prev) => ({
          ...prev,
          radioValue: value,
          file: value === "no" ? [] : prev.file, 
        }));
      };

      const handleFileDropCME = (setStateFunction, acceptedFiles) => {
        setStateFunction((prev) => ({
          ...prev,
          file: acceptedFiles,
        }));
        acceptedFiles.forEach((file) => {
          console.log("Uploaded file:", file.name);
        });
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
          privilege.push(data?.privilegeCategory.status);
         editIcon.push(<EditIcon className={style.docTypeImgStyle} onClick={() => handleEditClick(data)} />)
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

    return (
      <>
        <Navbar />
        <div className={style.applicantList}>
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
            <div className={style.inputGroup}>
              <CommonTextField
                label="Zip Code"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
                placeholder="Enter Zip Code"
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
                label="Zip Code"
                value={homeZipcode}
                onChange={(e) => setHomeZipcode(e.target.value)}
                placeholder="Enter Zip Code"
                required
                className={style.fullwidth}
              />
            </div>
            <div className={style.inputGroup}>
              <CommonTextField
                label="Contact Number"
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
                label="Preferred Phone"
                value={preferredPhone}
                onChange={(e) => handlePhoneChange(e, setPreferredPhone)}
                placeholder="Enter Preferred Phone"
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
      </div>
      </div>

      <div className={`${style.formContainer} ${style.marginTop20} ${style.margin10}`}>
      <h2 className={style.heading}>Professional Information</h2>
      <div className={style.gridContainer1}>
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
      files={uploadedFiles.CMPA}
      accept={acceptTypes}
    />
    {uploadedFiles.CMPA.length > 0 && (
      <div className={style.uploadedFiles}>
        <h4>Uploaded File:</h4>
        <ul>
          {uploadedFiles.CMPA.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
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
      files={uploadedFiles.Malpractice}
      accept={acceptTypes}
    />
    {uploadedFiles.Malpractice.length > 0 && (
      <div className={style.uploadedFiles}>
        <h4>Uploaded File:</h4>
        <ul>
          {uploadedFiles.Malpractice.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      </div>
    )}
</div>
<div className={style.inputGroup1}>
<div className={style.headerContainer}>
    <p>CPSO Active Registration file*</p>
  </div>
<CommonDropZone
      title="Upload CPSO File"
      description="Drag & drop a file here, or click to select"
      changeHandler={(acceptedFiles) => handleFileDrop("CPSO", acceptedFiles)}
      files={uploadedFiles.CPSO}
      accept={acceptTypes}
    />
    {uploadedFiles.CPSO.length > 0 && (
      <div className={style.uploadedFiles}>
        <h4>Uploaded File:</h4>
        <ul>
          {uploadedFiles.CPSO.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
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
      files={uploadedFiles.N95}
      accept={acceptTypes}
    />
    {uploadedFiles.N95.length > 0 && (
      <div className={style.uploadedFiles}>
        <h4>Uploaded File:</h4>
        <ul>
          {uploadedFiles.N95.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
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
      files={uploadedFiles.PALS}
      accept={acceptTypes}
    />
    {uploadedFiles.PALS.length > 0 && (
      <div className={style.uploadedFiles}>
        <h4>Uploaded File:</h4>
        <ul>
          {uploadedFiles.PALS.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
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
      files={uploadedFiles.NRP}
      accept={acceptTypes}
    />
    {uploadedFiles.NRP.length > 0 && (
      <div className={style.uploadedFiles}>
        <h4>Uploaded File:</h4>
        <ul>
          {uploadedFiles.NRP.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
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
      files={uploadedFiles.CPR}
      accept={acceptTypes}
    />
    {uploadedFiles.CPR.length > 0 && (
      <div className={style.uploadedFiles}>
        <h4>Uploaded File:</h4>
        <ul>
          {uploadedFiles.CPR.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
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
      files={uploadedFiles.ACLS}
      accept={acceptTypes}
    />
    {uploadedFiles.ACLS.length > 0 && (
      <div className={style.uploadedFiles}>
        <h4>Uploaded File:</h4>
        <ul>
          {uploadedFiles.ACLS.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
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
      files={uploadedFiles.ACES}
      accept={acceptTypes}
    />
    {uploadedFiles.ACES.length > 0 && (
      <div className={style.uploadedFiles}>
        <h4>Uploaded File:</h4>
        <ul>
          {uploadedFiles.ACES.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      </div>
    )}
</div>

<div className={style.inputGroup1}>
<div className={style.headerContainer}>
    <p>proof of BloodyEasy Lite training*</p>
  </div>
<CommonDropZone
      title="Upload BloodyEasy Lite training"
      description="Drag & drop a file here, or click to select"
      changeHandler={(acceptedFiles) => handleFileDrop("BloodyEasy", acceptedFiles)}
      files={uploadedFiles.BloodyEasy}
      accept={acceptTypes}
    />
    {uploadedFiles.BloodyEasy.length > 0 && (
      <div className={style.uploadedFiles}>
        <h4>Uploaded File:</h4>
        <ul>
          {uploadedFiles.BloodyEasy.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      </div>
    )}
</div>

<div className={style.inputGroup4}>
  <p className={style.question}>Do you prescribe Suboxone?</p>
  <CommonRadio
    onChange={handleChange}
    value={prescribeSuboxone}
    radioValue={["yes", "no"]}
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
    radioValue={["yes", "no"]}
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
        {licensingBody.file && <p className={style.fileName}>Uploaded file: {licensingBody.file.name}</p>}
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
        {investigatedByCPSO.file && <p className={style.fileName}>Uploaded file: {investigatedByCPSO.file.name}</p>}
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
        {physicalHealth.file && <p className={style.fileName}>Uploaded file: {physicalHealth.file.name}</p>}
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
        {defendantCivilCase.file && <p className={style.fileName}>Uploaded file: {defendantCivilCase.file.name}</p>}
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
        {pendingCivilCase.file && <p className={style.fileName}>Uploaded file: {pendingCivilCase.file.name}</p>}
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
     onChange={(e) =>
      handleSelectChange("Hospital", e.target.value)
    }
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
     label="Select Privilege Category"
    onChange={(e) =>
                handleSelectChange("privilegeCategory", e.target.value)
              }
    valueList={privilegeCategoryMasterList.map((item) => item.id)}
    labelList={privilegeCategoryMasterList.map((item) => item.category)}
    firstOptionLabel="Select Privilege Category"
    firstOptionValue=""
     required
     disabledList={[]}
     menuColor={[]}/>
      </div>
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
        {terminatedReason.file && <p className={style.fileName}>Uploaded file: {terminatedReason.file.name}</p>}
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
        {voluntary.file && <p className={style.fileName}>Uploaded file: {voluntary.file.name}</p>}
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
        {mACPastYear.file && <p className={style.fileName}>Uploaded file: {mACPastYear.file.name}</p>}
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
      radioValue={["yes", "no"]}
      label={["Yes", "No"]}
      required={true}
      className={style.commonRadio}
    />
  </div>

  {CMETranscript.radioValue === "yes" && (
    <div className={style.secondRow2}>

<CommonDropZone
      title="Upload CME Transcript"
      description="Drag & drop a file here, or click to select"
      changeHandler={(acceptedFiles) => handleFileDropCME(setCMETranscript, acceptedFiles)}
      files={CMETranscript.file}
      accept={acceptTypes}
    />
    {CMETranscript.file.length > 0 && (
      <div className={style.uploadedFiles}>
        <h4>Uploaded File:</h4>
        <ul>
          {CMETranscript.file.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
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
      radioValue={["yes", "no"]}
      label={["Yes", "No"]}
      required={true}
      className={style.commonRadio}
    />
  </div>

  {CMECertificate.radioValue === "yes" && (
    <div className={style.secondRow2}>

<CommonDropZone
      title="Upload CME Certificate"
      description="Drag & drop a file here, or click to select"
      changeHandler={(acceptedFiles) => handleFileDropCME(setCMECertificate, acceptedFiles)}
      files={CMECertificate.file}
      accept={acceptTypes}
    />
    {CMECertificate.file.length > 0 && (
      <div className={style.uploadedFiles}>
        <h4>Uploaded File:</h4>
        <ul>
          {CMECertificate.file.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
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
      valueList={["Doctor A", "Doctor B", "Doctor C"]}
      labelList={["Doctor A", "Doctor B", "Doctor C"]}
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
        className={style.fullWidth}
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
      valueList={["Doctor A", "Doctor B", "Doctor C"]}
      labelList={["Doctor A", "Doctor B", "Doctor C"]}
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
        className={style.fullWidth}
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
      
      </>
    );
  };

  export default HistoricalData;
