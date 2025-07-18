import React, { useState, useEffect, useRef } from "react";
import { GET, PUT, POST, TenantID } from "../../Screens/dataSaver";
import { Dialog } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import { format, sub, add } from 'date-fns';
import style from "./index.module.scss";
import LoadingScreen from "../LoadingScreen";
import UserLogo from "../../images/defaultUserLogo.jpg";
import { Tooltip } from "@mui/material";
import TextField from "@mui/material/TextField";
import { formatFirstNameLastName ,FormatPhoneNumber} from "./../../utils/formatting";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import CommonInputField from "../CommonFields/CommonInputField";
import CommonDateField from "../CommonFields/CommonDateField";
import CommonSelectField from "../CommonFields/CommonSelectField";
import CommonRadio from "../CommonFields/CommonRadio";
import CommonSwitch from "../CommonFields/CommonSwitch";
import CommonDivider from "../CommonFields/CommonDivider";
import { SuccessToaster2 } from "../../utils/toaster";
import CommonPhoneField from "../CommonFields/CommonPhoneField";
import axios from "axios";


const EditInfoDialog = ({ checkedIds, getIsOpen, onClose,applicationId,selectedEditField }) => {
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [form, setForm] = useState([]);
  const [updateForm, setUpdateForm] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [cellNumber, setCellNumber] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Mailing Address
  const [mailingStreetAddress, setMailingStreetAddress] = useState("");
  const [mailingCity, setMailingCity] = useState("");
  const [mailingProvince, setMailingProvince] = useState("");
  const [mailingPostalCode, setMailingPostalCode] = useState("");
  const [sameAddress, setSameAddress] = useState(false);

  // Business Address
  const [businessName, setBusinessName] = useState("");
  const [businessStreetAddress, setBusinessStreetAddress] = useState("");
  const [businessCity, setBusinessCity] = useState("");
  const [businessProvince, setBusinessProvince] = useState("");
  const [businessPostalCode, setBusinessPostalCode] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessWebsite, setBusinessWebsite] = useState("");

  const [businessAddressNeed, setBusinessAddressNeed] = useState(false);
  const [sameAddressInMailing, setSameAddressInMailing] = useState(false);

  const [applicantType, setApplicantType] = useState([]);
  const [selectedApplicantType, setSelectedApplicantType] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [credentialingCategory, setCredentialingCategory] = useState("");
  const [calendarStart, setCalendarStart] = useState(false);
  const [exceptedStartDate, setExceptedStartDate] = useState(null);
  const [locumStartDate, setLocumStartDate] = useState(null);
  const [locumEndDate, setLocumEndDate] = useState(null);
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDepartmentService, setSelectedDepartmentService] = useState('');
  const [sites, setSites] = useState([]);
  const [isApproveEnabled, setIsApproveEnabled] = useState(false);
  const [initialForm, setInitialForm] = useState(null);
  const workModeType = sessionStorage.getItem('workModeType')
  const selectedDepartmentName = departmentList?.find(data => data?.id === selectedDepartment)?.departmentName?.name;
  const selectedSpecialtyName = departmentList
  ?.flatMap(dept => dept?.serviceAreas || [])
  ?.find(service => service?.id === selectedDepartmentService)
  ?.name;
  const selectedApplicantTypeName = applicantType?.find(data => data?.id === selectedApplicantType)?.applicantType;
  const selectedPrivilegeTypeName = categoryList?.find(data => data?.id === credentialingCategory)?.category;
  const applicationType = sessionStorage.getItem('applicationCreationType') ?? 'REAPPOINTMENT';
  const canadaData = sessionStorage.getItem('canadaData') !== 'undefined' ? JSON.parse(sessionStorage.getItem('canadaData')) : {};
  const dateFormat = canadaData?.dateFormat || 'MMM dd, yyyy';
  const lastModifiedDate = form?.lastModifiedDate;
  const lastModifiedDateFormat = lastModifiedDate ? format(new Date(lastModifiedDate), dateFormat) : "-";
  const LastApprovedDate = form?.lastApprovedDate
      ? new Date(form?.lastApprovedDate).toISOString().split('T')[0] + 'T00:00'
      : null;
  const formattedLastApprovedDate = LastApprovedDate ? format(new Date(LastApprovedDate), dateFormat) : "-";
  const selectedDeptObject = departmentList.find(
  (dept) => dept?.id === selectedDepartment
  );
  const serviceAreas = selectedDeptObject?.serviceAreas || [];
  const showServiceAreaField =
  selectedDepartmentService !== undefined && (serviceAreas.length > 0);
  const isFirstRender = useRef(true);


  console.log("selectedDepartmentService",selectedDepartmentService,selectedEditField,selectedDepartmentName,selectedSpecialtyName,businessAddressNeed,businessName,"s112",credentialingCategory,initialForm?.businessName)

  useEffect(() => {
    getDepartmentType()
    getPreApplication()
    getApplicantType()
    // getPrivilege()
  }, [])

    useEffect(() => {
      if(selectedApplicantType !== ""){
        getPrivilege();
      }
    // setCredentialingCategory("")
  }, [selectedApplicantType])



   const handleChangeRequired = (event) => {
    setSameAddress(event.target.value);
  };

   const handleChangeRequiredInMail = (event) => {
    setSameAddressInMailing(event.target.value);
  };

  useEffect(() => {
  setInitialForm({
    firstName: form?.applicant?.name?.firstName ?? "",
    middleName: form?.applicant?.name?.middleName ?? "",
    lastName: form?.applicant?.name?.lastName ?? "",
    emailAddress: form?.applicant?.email?.officialEmail ?? "",
    cellNumber: form?.applicant?.mobileNumber ?? "",
    selectedApplicantType: form?.basicDetailReferences?.applicantType?.id ?? "",
    selectedDepartment: form?.basicDetailReferences?.department?.id ?? "",
    selectedDepartmentService: form?.basicDetailReferences?.specialty?.id ?? "",
    credentialingCategory: form?.basicDetailReferences?.credentialingAndPrivilegingCategory?.id ?? "",
    locumStartDate: form?.tenure?.to ?? "",
    locumEndDate: form?.tenure?.from ?? "",
    streetAddress: form?.applicant?.contactAddress1?.homeAddress?.streetName ?? "",
    city: form?.applicant?.contactAddress1?.homeAddress?.city ?? "",
    province: form?.applicant?.contactAddress1?.homeAddress?.province ?? "",
    postalCode: form?.applicant?.contactAddress1?.homeAddress?.pinCode ?? "",
    mailingStreetAddress: form?.applicant?.contactAddress2?.mailingAddress?.streetName ?? "",
    mailingCity: form?.applicant?.contactAddress2?.mailingAddress?.city ?? "",
    mailingProvince: form?.applicant?.contactAddress2?.mailingAddress?.province ?? "",
    mailingPostalCode: form?.applicant?.contactAddress2?.mailingAddress?.pinCode ?? "",
    businessName: form?.applicant?.contactAddress3?.business?.businessName ?? "",
    businessStreetAddress: form?.applicant?.contactAddress3?.business?.businessAddress?.streetName ?? "",
    businessCity: form?.applicant?.contactAddress3?.business?.businessAddress?.city ?? "",
    businessProvince: form?.applicant?.contactAddress3?.business?.businessAddress?.province ?? "",
    businessPostalCode: form?.applicant?.contactAddress3?.business?.businessAddress?.pinCode ?? "",
    businessPhone: form?.applicant?.contactAddress3?.business?.businessPhone ?? "",
    businessWebsite: form?.applicant?.contactAddress3?.business?.businessWebsite ?? "",
    sameAsHomeAddress3: form?.applicant?.contactAddress3?.business?.businessAddress === null ? false : true,
    sameAsMailingAddress: form?.applicant?.contactAddress3?.business?.sameAsMailingAddress ?? false,
    sameAsHomeAddress2: form?.applicant?.contactAddress2?.sameAsHomeAddress ?? false,
    sameAsBusinessAddress: form?.applicant?.contactAddress2?.sameAsBusinessAddress ?? false,
    initialApprovalDate:form?.initialApprovalDate
  });

  console.log("sameAsHomeAddress3",initialForm?.sameAsHomeAddress3,businessAddressNeed)

  setFirstName(form?.applicant?.name?.firstName ?? "");
  setMiddleName(form?.applicant?.name?.middleName ?? "");
  setLastName(form?.applicant?.name?.lastName ?? "");
  setEmailAddress(form?.applicant?.email?.officialEmail ?? "");
  setCellNumber(form?.applicant?.mobileNumber ?? "");
  setSelectedApplicantType(form?.basicDetailReferences?.applicantType?.id ?? "");
  setSelectedDepartment(form?.basicDetailReferences?.department?.id ?? "");
  setSelectedDepartmentService(form?.basicDetailReferences?.specialty?.id ?? "");
  setCredentialingCategory(form?.basicDetailReferences?.credentialingAndPrivilegingCategory?.id ?? "");
  setLocumStartDate(form?.tenure?.to ?? "");
  setLocumEndDate(form?.tenure?.from ?? "");
  setStreetAddress(form?.applicant?.contactAddress1?.homeAddress?.streetName ?? "");
  setCity(form?.applicant?.contactAddress1?.homeAddress?.city ?? "");
  setProvince(form?.applicant?.contactAddress1?.homeAddress?.province ?? "");
  setPostalCode(form?.applicant?.contactAddress1?.homeAddress?.pinCode ?? "");
  setMailingStreetAddress(form?.applicant?.contactAddress2?.mailingAddress?.streetName ?? "");
  setMailingCity(form?.applicant?.contactAddress2?.mailingAddress?.city ?? "");
  setMailingProvince(form?.applicant?.contactAddress2?.mailingAddress?.province ?? "");
  setMailingPostalCode(form?.applicant?.contactAddress2?.mailingAddress?.pinCode ?? "");
  setBusinessName(form?.applicant?.contactAddress3?.business?.businessName || "");
  setBusinessStreetAddress(form?.applicant?.contactAddress3?.business?.businessAddress?.streetName ?? "");
  setBusinessCity(form?.applicant?.contactAddress3?.business?.businessAddress?.city ?? "");
  setBusinessProvince(form?.applicant?.contactAddress3?.business?.businessAddress?.province ?? "");
  setBusinessPostalCode(form?.applicant?.contactAddress3?.business?.businessAddress?.pinCode ?? "");
  setBusinessPhone(form?.applicant?.contactAddress3?.business?.businessPhone ?? "");
  setBusinessWebsite(form?.applicant?.contactAddress3?.business?.businessWebsite ?? "");
  setBusinessAddressNeed(!form?.applicant?.contactAddress3 || !form?.applicant?.contactAddress3?.business?.businessAddress ? false : true)
  setSameAddressInMailing(form?.applicant?.contactAddress3?.business?.sameAsHomeAddress === true ? "SAME_CURRENT" : form?.applicant?.contactAddress3?.business?.sameAsMailingAddress === true ? "SAME_MAILING" : "DIFFERENT_ADDRESS")
  setSameAddress(form?.applicant?.contactAddress2?.sameAsHomeAddress === true ? "SAME_CURRENT" :form?.applicant?.contactAddress2?.sameAsBusinessAddress === true ? "BUSINESS_ADDRESS": "DIFFERENT_ADDRESS")
  setExceptedStartDate(form?.initialApprovalDate ?? "")
}, [form]);

useEffect(() => {
  if(sameAddress === "SAME_CURRENT"){
  setMailingStreetAddress(streetAddress);
  setMailingCity(city);
  setMailingProvince(province);
  setMailingPostalCode(postalCode);
  }

  if(sameAddress === "BUSINESS_ADDRESS"){
  setMailingStreetAddress(businessStreetAddress);
  setMailingCity(businessCity);
  setMailingProvince(businessProvince);
  setMailingPostalCode(businessPostalCode);
  }

  if(sameAddress === "DIFFERENT_ADDRESS"){
  setMailingStreetAddress("");
  setMailingCity("");
  setMailingProvince("");
  setMailingPostalCode("");
  }

}, [sameAddress])

useEffect(() => {
  if(sameAddressInMailing === "SAME_CURRENT"){
  setBusinessStreetAddress(streetAddress);
  setBusinessCity(city);
  setBusinessProvince(province);
  setBusinessPostalCode(postalCode);
  }
  if(sameAddressInMailing === "SAME_MAILING"){
  setBusinessStreetAddress(mailingStreetAddress);
  setBusinessCity(mailingCity);
  setBusinessProvince(mailingProvince);
  setBusinessPostalCode(mailingPostalCode);
  }

  if(sameAddressInMailing === "DIFFERENT_ADDRESS"){
  setBusinessStreetAddress("");
  setBusinessCity("");
  setBusinessProvince("");
  setBusinessPostalCode("");
  }
  

}, [sameAddressInMailing])


// Check for changes in state compared to initialForm
useEffect(() => {
  if (!initialForm) return;

    let applicantTypeChanged = false;

  if (selectedApplicantType === initialForm?.selectedApplicantType) {
    applicantTypeChanged =
      // selectedApplicantType !== initialForm?.selectedApplicantType &&
      credentialingCategory !== initialForm?.credentialingCategory &&
      credentialingCategory !== "";
  } else {
    applicantTypeChanged =
      (selectedApplicantType !== initialForm?.selectedApplicantType &&
        credentialingCategory !== initialForm?.credentialingCategory &&
      credentialingCategory !== "")
  }

  const hasChanged =
    (firstName !== initialForm?.firstName && firstName !== "") ||
    middleName !== initialForm?.middleName ||
    (lastName !== initialForm?.lastName && lastName !== "") ||
    (emailAddress !== initialForm?.emailAddress && emailAddress !== "")||
    cellNumber !== initialForm?.cellNumber ||
    // selectedApplicantType !== initialForm?.selectedApplicantType ||
    selectedDepartment !== initialForm?.selectedDepartment ||
    selectedDepartmentService !== initialForm?.selectedDepartmentService ||
    applicantTypeChanged ||
    locumStartDate !== initialForm?.locumStartDate ||
    locumEndDate !== initialForm?.locumEndDate ||
    (streetAddress !== initialForm?.streetAddress && streetAddress !== "") ||
    (city !== initialForm?.city && city !== "") ||
    (province !== initialForm?.province && province !== "")||
    (postalCode !== initialForm?.postalCode && postalCode !== "") ||
    (mailingStreetAddress !== initialForm?.mailingStreetAddress && mailingStreetAddress !== "") ||
    (mailingCity !== initialForm?.mailingCity && mailingCity !== "" ) ||
    (mailingProvince !== initialForm?.mailingProvince && mailingProvince !== "") ||
    (mailingPostalCode !== initialForm?.mailingPostalCode && mailingPostalCode !== "") ||
    (businessAddressNeed &&
    (
      (businessName !== initialForm?.businessName && businessName !== "") ||
      (businessStreetAddress !== initialForm?.businessStreetAddress && businessStreetAddress !== "") ||
      (businessCity !== initialForm?.businessCity && businessCity !== "") ||
      (businessProvince !== initialForm?.businessProvince && businessProvince !== "") ||
      (businessPostalCode !== initialForm?.businessPostalCode && businessPostalCode !== "")
    )
  )  ||
    businessPhone !== initialForm?.businessPhone ||
    businessWebsite !== initialForm?.businessWebsite
    //  || 
    // businessAddressNeed !== initialForm?.sameAsHomeAddress3;
    // sameAddressInMailing !== initialForm?.sameAsMailingAddress ||
    // sameAddress !== initialForm?.sameAsHomeAddress2;

     // HOME_ADDRESS Validation: All home address fields must have value if selected
  const isHomeAddressValid = selectedEditField === "HOME_ADDRESS"
    ? streetAddress !== "" &&
      city !== "" &&
      province !== "" &&
      postalCode !== "" &&
      mailingStreetAddress !== "" &&
      mailingCity !== "" &&
      mailingProvince !== "" &&
      mailingPostalCode !== ""
    : true;

  const isBusinessAddressValid = (businessAddressNeed && selectedEditField === "HOME_ADDRESS")
    ? businessName !== "" &&
      businessStreetAddress !== "" &&
      businessCity !== "" &&
      businessProvince !== "" &&
      businessPostalCode !== ""
    : true;

  setIsApproveEnabled(hasChanged && isHomeAddressValid && isBusinessAddressValid);
}, [
  firstName,
  middleName,
  lastName,
  emailAddress,
  cellNumber,
  selectedApplicantType,
  selectedDepartment,
  selectedDepartmentService,
  credentialingCategory,
  locumStartDate,
  locumEndDate,
  streetAddress,
  city,
  province,
  postalCode,
  mailingStreetAddress,
  mailingCity,
  mailingProvince,
  mailingPostalCode,
  businessName,
  businessStreetAddress,
  businessCity,
  businessProvince,
  businessPostalCode,
  businessPhone,
  businessWebsite,
  initialForm,
  businessAddressNeed
]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://geocoder.ca/${postalCode}?json=1`
      );
      let data = response.data;
      console.log(data);

      const fetchedCity = data?.standard?.city || "";
      const fetchedProvince = data?.standard?.prov || "";

      setCity(fetchedCity);
      setProvince(fetchedProvince);

    } catch (error) {
      console.log("Error fetching data");
    }
  };
  if( selectedEditField === "HOME_ADDRESS" && postalCode !== ""){
   fetchData();
  }
}, [postalCode]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://geocoder.ca/${mailingPostalCode}?json=1`
      );
      let data = response.data;
      console.log(data);

      const fetchedCity = data?.standard?.city || "";
      const fetchedProvince = data?.standard?.prov || "";

      setMailingCity(fetchedCity);
      setMailingProvince(fetchedProvince);

    } catch (error) {
      console.log("Error fetching data");
    }
  };
  if( selectedEditField === "HOME_ADDRESS" && mailingPostalCode !== ""){
   fetchData();
  }
}, [mailingPostalCode]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://geocoder.ca/${businessPostalCode}?json=1`
      );
      let data = response.data;
      console.log(data);

      const fetchedCity = data?.standard?.city || "";
      const fetchedProvince = data?.standard?.prov || "";

      setBusinessCity(fetchedCity);
      setBusinessProvince(fetchedProvince);

    } catch (error) {
      console.log("Error fetching data");
    }
  };
  if( selectedEditField === "HOME_ADDRESS" && businessPostalCode !== ""){
   fetchData();
  }
}, [businessPostalCode]);

// const fetchCityProvince = async (code) => {
//   try {
//     const response = await axios.get(
//       `https://geocoder.ca/${code}?json=1`
//     );
//     let data = response.data;
//     console.log(data);

//     const fetchedCity = data?.standard?.city || "";
//     const fetchedProvince = data?.standard?.prov || "";

//     setCity(fetchedCity);
//     setProvince(fetchedProvince);
//   } catch (error) {
//     console.log("Error fetching data", error);
//   }
// };

// useEffect(() => {
//   if (selectedEditField === "HOME_ADDRESS" && postalCode !== "") {
//     fetchCityProvince(postalCode);
//   }
// }, [postalCode]);

  const handleDateChange = (date , type) => {
    const formattedDate = format(new Date(date), "yyyy-MM-dd'T'00:00")
    if(type ==="startDate"){
     setExceptedStartDate(formattedDate);
    } else if (type ==="locumStartDate"){
     setLocumStartDate (formattedDate);
    } else if (type ==="locumEndDate"){
     setLocumEndDate(formattedDate)
    }
    setCalendarStart(false)
  };

  const getDepartmentType = async () => {
    // setIsLoadingImage(true)
      const { data: department } = await GET(
        `entity-service/department`
      );
      setDepartmentList(department)
      // setIsLoadingImage(false)
    }

    const getPrivilege = async () => {
      setIsLoadingImage(true)
    const applicantTypeId = selectedApplicantType;
    // const url = applicantTypeId 
    //   ? `entity-service/privilege?applicantTypeId=${applicantTypeId}` 
    //   : `entity-service/privilege`;
      const { data: category } = await GET(
        `entity-service/privilege?applicantTypeId=${applicantTypeId}`
      );
    // const { data: category } = await GET(url);
    setCategoryList(category);
    setIsLoadingImage(false)
  }

     const getApplicantType = async () => {
      // setIsLoadingImage(true)
        const { data: applicant } = await GET(
          `entity-service/applicantType`
        );
        const filteredApplicant = applicant.filter(item => item.id !== "66dc4517788741fedc982f05");
        setApplicantType(filteredApplicant)
        // setIsLoadingImage(false)
      }

  const getPreApplication = async () => {
    try {
      setIsLoadingImage(true)
      const { data: basicform } = await GET(`application-management-service/staff/${applicationId}`);
      setForm(basicform)
      setIsLoadingImage(false)
    } catch (error) {
      console.error('Error fetching application Documents:', error);
    }
  };

  // const putPreApplication = async () => {
  //   try {
  //     setIsLoadingImage(true)
  //     let temp = { ...form };
  //     if (selectedEditField === "NAME") {
  //     temp?.applicant?.name?.firstName = firstName;
  //     temp?.applicant?.name?.middleName = middleName;
  //     temp?.applicant?.name?.lastName = lastName;
  //     }
  //     else if (selectedEditField === "CONTACT_DETAILS") {
  //     temp?.applicant?.email?.officialEmail = emailAddress;
  //     temp?.applicant?.mobileNumber = cellNumber;
  //     }
  //     else if (selectedEditField === "DEPARTMENT_DIVISION") {
  //     temp?.basicDetailReferences?.department?.id = selectedDepartment;
  //     temp?.basicDetailReferences?.specialty?.id = selectedDepartmentService;
  //      }
  //     else if (selectedEditField === "PRIVILEGE_CATEGORY") {
  //     temp?.basicDetailReferences?.credentialingAndPrivilegingCategory?.id = credentialingCategory;
  //     temp?.basicDetailReferences?.applicantType?.id = selectedApplicantType;
  //     temp?.tenure?.to = locumStartDate;
  //     temp?.tenure?.from = locumEndDate;
  //     }

  //     else if (selectedEditField === "HOME_ADDRESS") {

  //     temp?.applicant?.contactAddress1?.homeAddress?.streetName = streetAddress;
  //     temp?.applicant?.contactAddress1?.homeAddress?.city = city;
  //     temp?.applicant?.contactAddress1?.homeAddress?.province = province
  //     temp?.applicant?.contactAddress1?.homeAddress?.pinCode = postalCode;

  //     temp?.applicant?.contactAddress2?.mailingAddress?.streetName = mailingStreetAddress;
  //     temp?.applicant?.contactAddress2?.mailingAddress?.city = mailingCity;
  //     temp?.applicant?.contactAddress2?.mailingAddress?.province = mailingProvince;
  //     temp?.applicant?.contactAddress2?.mailingAddress?.pinCode = mailingPostalCode;

  //     temp?.applicant?.contactAddress3?.business?.businessName = businessName;
  //     temp?.applicant?.contactAddress3?.business?.businessAddress?.streetName = businessStreetAddress;
  //     temp?.applicant?.contactAddress3?.business?.businessAddress?.city = businessCity;
  //     temp?.applicant?.contactAddress3?.business?.businessAddress?.province = businessProvince;
  //     temp?.applicant?.contactAddress3?.business?.businessAddress?.pinCode = businessPostalCode;
  //     temp?.applicant?.contactAddress3?.business?.businessPhone = businessPhone;
  //     temp?.applicant?.contactAddress3?.business?.businessWebsite = businessWebsite;
  //     }
  //     const { data: updateBasicform } = await PUT(`application-management-service/staff/${applicationId}`,temp);
  //     setUpdateForm(updateBasicform)
  //     setIsLoadingImage(false)
  //   } catch (error) {
  //     console.error('Error fetching application Documents:', error);
  //   }
  // };

  const putPreApplication = async () => {
  try {
    setIsLoadingImage(true);
    let temp = { ...form };

    if (selectedEditField === "NAME") {
      temp.applicant = temp.applicant || {};
      temp.applicant.name = temp.applicant.name || {};
      temp.applicant.name.firstName = firstName;
      temp.applicant.name.middleName = middleName;
      temp.applicant.name.lastName = lastName;
    }
    else if (selectedEditField === "CONTACT_DETAILS") {
      temp.applicant = temp.applicant || {};
      temp.applicant.email = temp.applicant.email || {};
      temp.applicant.email.officialEmail = emailAddress;
      temp.applicant.mobileNumber = cellNumber;
    }
    else if (selectedEditField === "DEPARTMENT_DIVISION") {
  temp.basicDetailReferences = temp.basicDetailReferences || {};
  temp.basicDetailReferences.department = temp.basicDetailReferences.department || {};
  
  temp.basicDetailReferences.department.id = selectedDepartment;
  temp.basicDetailReferences.department.name = selectedDepartmentName;

  const selectedDeptObj = departmentList?.find(dep => dep?.id === selectedDepartment);

  if (selectedDeptObj?.serviceAreas?.length > 0) {
    if (selectedDepartmentService !== "" && selectedSpecialtyName) {
      temp.basicDetailReferences.specialty = {
        id: selectedDepartmentService,
        name: selectedSpecialtyName
      };
    } else {
      temp.basicDetailReferences.specialty = null;
    }
  } else {
    temp.basicDetailReferences.specialty = null;
  }
}
    else if (selectedEditField === "PRIVILEGE_CATEGORY") {
      temp.basicDetailReferences = temp.basicDetailReferences || {};
      temp.basicDetailReferences.credentialingAndPrivilegingCategory = temp.basicDetailReferences.credentialingAndPrivilegingCategory || {};
      temp.basicDetailReferences.applicantType = temp.basicDetailReferences.applicantType || {};
      temp.tenure = temp.tenure || {};
      temp.basicDetailReferences.credentialingAndPrivilegingCategory.id = credentialingCategory;
      temp.basicDetailReferences.credentialingAndPrivilegingCategory.name = selectedPrivilegeTypeName;
      temp.basicDetailReferences.applicantType.id = selectedApplicantType;
      temp.basicDetailReferences.applicantType.serviceProviderType = selectedApplicantTypeName;
      temp.tenure.to = locumStartDate;
      temp.tenure.from = locumEndDate;
    }
    else if (selectedEditField === "HOME_ADDRESS") {
      temp.applicant = temp.applicant || {};
      temp.applicant.contactAddress1 = temp.applicant.contactAddress1 || {};
      temp.applicant.contactAddress1.homeAddress = temp.applicant.contactAddress1.homeAddress || {};
      temp.applicant.contactAddress1.homeAddress.streetName = streetAddress;
      temp.applicant.contactAddress1.homeAddress.city = city;
      temp.applicant.contactAddress1.homeAddress.province = province;
      temp.applicant.contactAddress1.homeAddress.pinCode = postalCode;

      temp.applicant.contactAddress2 = temp.applicant.contactAddress2 || {};
      temp.applicant.contactAddress2.mailingAddress = temp.applicant.contactAddress2.mailingAddress || {};
      temp.applicant.contactAddress2.mailingAddress.streetName = mailingStreetAddress;
      temp.applicant.contactAddress2.mailingAddress.city = mailingCity;
      temp.applicant.contactAddress2.mailingAddress.province = mailingProvince;
      temp.applicant.contactAddress2.mailingAddress.pinCode = mailingPostalCode;
      temp.applicant.contactAddress2.sameAsHomeAddress = sameAddress === "SAME_CURRENT" ? true : false;
      temp.applicant.contactAddress2.sameAsBusinessAddress = sameAddress === "BUSINESS_ADDRESS" ? true : false;

      temp.applicant.contactAddress3 = temp.applicant.contactAddress3 || {};
      temp.applicant.contactAddress3.business = temp.applicant.contactAddress3.business || {};
      temp.applicant.contactAddress3.business.businessAddress = temp.applicant.contactAddress3.business.businessAddress || {};
      if (businessAddressNeed === true) {
    temp.applicant.contactAddress3.business.businessAddress = temp.applicant.contactAddress3.business.businessAddress || {};
    temp.applicant.contactAddress3.business.businessName = businessName;
    temp.applicant.contactAddress3.business.businessAddress.streetName = businessStreetAddress;
    temp.applicant.contactAddress3.business.businessAddress.city = businessCity;
    temp.applicant.contactAddress3.business.businessAddress.province = businessProvince;
    temp.applicant.contactAddress3.business.businessAddress.pinCode = businessPostalCode;
    temp.applicant.contactAddress3.business.businessPhone = businessPhone;
    temp.applicant.contactAddress3.business.businessWebsite = businessWebsite;
    temp.applicant.contactAddress3.business.sameAsHomeAddress = sameAddressInMailing === "SAME_CURRENT" ? true : false;
    temp.applicant.contactAddress3.business.sameAsMailingAddress = false;
  } else {
    temp.applicant.contactAddress3.business.businessAddress = null;
    temp.applicant.contactAddress3.business.businessName = "";
    temp.applicant.contactAddress3.business.businessPhone = "";
    temp.applicant.contactAddress3.business.businessWebsite = "";
    temp.applicant.contactAddress3.business.sameAsHomeAddress = false;
    temp.applicant.contactAddress3.business.sameAsMailingAddress = false;
  }
    }
     let updatedField = "";
    if (selectedEditField === "NAME") updatedField = "Name";
    else if (selectedEditField === "CONTACT_DETAILS") updatedField = "Contact Details";
    else if (selectedEditField === "HOME_ADDRESS") updatedField = "Address";
    else if (selectedEditField === "DEPARTMENT_DIVISION") updatedField = "Department/Division";
    else if (selectedEditField === "PRIVILEGE_CATEGORY") updatedField = "Credentialing & Privileges Category"

    const { data: updateBasicform } = await PUT(`application-management-service/staff/${applicationId}`, temp);
    setUpdateForm(updateBasicform);
    setIsLoadingImage(false);
    SuccessToaster2(`Successfully Updated ${updatedField}`);
    getIsOpen(false);
  } catch (error) {
    console.error('Error updating application:', error);
    setIsLoadingImage(false);
  }
};

  return (
    <>
      {isLoadingImage && (
        
<div className={style.loadingOverlay}>
	<LoadingScreen />
</div>
      )}
      {!isLoadingImage && (
        
<Dialog
          isOpen={getIsOpen}
          onClose={onClose}
          className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
          canOutsideClickClose={false}
          canEscapeKeyClose={false}
        >
	<div>
		<div className={style.templateHeader}>
			<div className={style.templateHeadertext}>
        Edit {" "}
        {selectedEditField === "NAME" && "Name"}
        {selectedEditField === "CONTACT_DETAILS" && "Contact Details"}
        {selectedEditField === "HOME_ADDRESS" && "Address"}
        {selectedEditField === "DEPARTMENT_DIVISION" && "Department / Division"}
        {selectedEditField === "PRIVILEGE_CATEGORY" && "Credentialing & Privileges Category"}
        {" for "}
        {form?.applicant?.name?.firstName !== undefined &&
        form?.applicant?.name?.lastName !== undefined
          ? formatFirstNameLastName(
              form?.applicant?.name?.firstName,
              form?.applicant?.name?.lastName,
            )
          : "{First Name} {Last Name}"}
      </div>
			<Tooltip title="Click to Close" arrow>
				<img src={CrossPink} alt="close" className={`${style.crossStyle} ${style.cursorPointer}`} onClick= {()=> {getIsOpen(false)}} />
			</Tooltip>
		</div>
    {selectedEditField === "NAME" && (
    <div className={`${style.grid3} ${style.marginTop10}`}>
			<div>
				<CommonInputField
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                placeholder="First Name"
                label="First Name"
                required
                />
			</div>
			<div>
				<CommonInputField
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                type="text"
                placeholder="Middle initial"
                label="Middle Name / initial"
                />
			</div>
			<div>
				<CommonInputField
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                placeholder="Last Name"
                label="Last Name"
                required
                />
			</div>
		</div>
    )}
    {selectedEditField === "CONTACT_DETAILS" && (
		<div className={` ${style.grid3} ${style.marginTop5}`}>
			<div>
				<CommonInputField
                value={emailAddress}
                // onChange={(e) => setEmailAddress(e.target.value)}
                type="text"
                placeholder="Entity Email"
                label="Email Address"
                required
                />
			</div>
			<div>
				<CommonPhoneField
          value={cellNumber}
          onChange={(e) => {
            const formattedValue = FormatPhoneNumber(e.target.value);
            setCellNumber(formattedValue);
          }}
          placeholder="Enter Cell Phone"
          label="Cell Phone"
        />
			</div>
		</div>
    )}
        {selectedEditField === "HOME_ADDRESS"  && (
          <div>
            <div className={style.addressLabel}>Current home Address* </div>
            <div className={`${style.grid1} ${style.marginTop10}`}>
            <div>
				<CommonInputField
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                type="text"
                placeholder="Enter Street Address"
                label="Street Address*"
                />
			</div>
      <div>
				<CommonInputField
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                type="text"
                placeholder="Enter Postal Code"
                label="Postal Code*"
                />
                </div>
            </div>
            <div className={style.grid1}>
              <div>
				<CommonInputField
                value={city}
                onChange={(e) => setCity(e.target.value)}
                type="text"
                placeholder="Enter City"
                label="City*"
                />
			</div>
            <div>
				<CommonInputField
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                type="text"
                placeholder="Enter Province"
                label="Province*"
                />
                </div>
                </div>
                <CommonDivider />
                <div className={`${style.addressLabel} ${style.marginTop10} ${style.flex} ${style.alignItem}`}>
                  <div>
                  <CommonSwitch label={businessAddressNeed ? 'YES' : 'NO'} checked={businessAddressNeed} onChange={(e) => setBusinessAddressNeed(e.target.checked)} labelName={'Do you have a Registered Business address?'} />
                    </div>
                    {businessAddressNeed && (
                      <div className={style.marginLeft10}>
              <CommonRadio
                  onChange={handleChangeRequiredInMail}
                  value={sameAddressInMailing}
                  radioValue={["SAME_CURRENT","DIFFERENT_ADDRESS"]}
                  label={["Same as current home address?","different address?"]
                  }
                />
              </div>
                    )}
                </div>
                {businessAddressNeed && (
                <div>
                 <div className={`${style.marginTop10}`}>
				<CommonInputField
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                type="text"
                placeholder="Enter Business Name"
                label="Business Name*"
                />
			</div>
            <div className={`${style.grid1} ${style.marginTop10}`}>
            <div>
				<CommonInputField
                value={businessStreetAddress}
                onChange={(e) => setBusinessStreetAddress(e.target.value)}
                type="text"
                placeholder="Enter Street Address"
                label="Street Address*"
                />
			</div>
      <div>
				<CommonInputField
                value={businessPostalCode}
                onChange={(e) => setBusinessPostalCode(e.target.value)}
                type="text"
                placeholder="Enter Postal Code"
                label="Postal Code*"
                />
                </div>
            </div>
            <div className={style.grid1}>
              <div>
				<CommonInputField
                value={businessCity}
                onChange={(e) => setBusinessCity(e.target.value)}
                type="text"
                placeholder="Enter City"
                label="City*"
                />
			</div>
            <div>
				<CommonInputField
                value={businessProvince}
                onChange={(e) => setBusinessProvince(e.target.value)}
                type="text"
                placeholder="Enter Province"
                label="Province*"
                />
                </div>
                </div>
                <div className={style.grid3}>
              <div>
				<CommonPhoneField
                value={businessPhone}
                onChange={(e) => {
                    const formattedValue = FormatPhoneNumber(e.target.value);
                    setBusinessPhone(formattedValue);
                }}
                type="number"
                placeholder="Enter Business Phone"
                label="Business Phone"
                />
			</div>
            <div>
				<CommonInputField
                value={businessWebsite}
                onChange={(e) => setBusinessWebsite(e.target.value)}
                type="text"
                placeholder="Enter Business Website"
                label="Business Website"
                />
                </div>
                </div>
              </div>
                )}
                 <CommonDivider />
            <div className={`${style.addressLabel} ${style.marginTop10} ${style.flex}`}>
               <div className={style.alignContent}>Mailing Address*</div>
               <div className={style.marginLeft10}>
                {businessAddressNeed ? (
                      <div className={style.marginLeft10}>
              <CommonRadio
                  onChange={handleChangeRequired}
                  value={sameAddress}
                  radioValue={["SAME_CURRENT","BUSINESS_ADDRESS","DIFFERENT_ADDRESS"]}
                  label={["Same as current home address?","Same as Business Address?","different address?"]
                  }
                />
              </div>
                    ) : (
                      <CommonRadio
                  onChange={handleChangeRequired}
                  value={sameAddress}
                  radioValue={["SAME_CURRENT","DIFFERENT_ADDRESS"]}
                  label={["Same as current home address?","different Address?"]
                  }
                />
                    )}
              </div>
            </div>
            <div className={`${style.grid1} ${style.marginTop10}`}>
            <div>
				<CommonInputField
                value={mailingStreetAddress}
                onChange={(e) => setMailingStreetAddress(e.target.value)}
                type="text"
                placeholder="Enter Street Address"
                label="Street Address*"
                />
			</div>
      <div>
				<CommonInputField
                value={mailingPostalCode}
                onChange={(e) => setMailingPostalCode(e.target.value)}
                type="text"
                placeholder="Enter Postal Code"
                label="Postal Code*"
                />
                </div>
            </div>
            <div className={style.grid1}>
              <div>
				<CommonInputField
                value={mailingCity}
                onChange={(e) => setMailingCity(e.target.value)}
                type="text"
                placeholder="Enter City"
                label="City*"
                />
			</div>
            <div>
				<CommonInputField
                value={mailingProvince}
                onChange={(e) => setMailingProvince(e.target.value)}
                type="text"
                placeholder="Enter Province"
                label="Province*"
                />
                </div>
                </div>
          </div>
        )}
     {selectedEditField === "DEPARTMENT_DIVISION" && (
    <div className={`${style.grid1} ${style.marginTop5}`}>
						<div>
							<CommonSelectField
                value={selectedDepartment}
                 onChange={(e) => {
                    setSelectedDepartment(e.target.value);
                    // setSelectedDepartmentService("");
                  }}
                className={style.fullWidth}
                // firstOptionLabel={'All'}
                // firstOptionValue={''}
                valueList={departmentList?.map(data => data?.id)}
                labelList={departmentList?.map(data => data?.departmentName?.name)}
                disabledList={departmentList?.map(data => false)}
                required={false}
                label={"Department"}
            />
						</div>
                {showServiceAreaField  && (
                   
						<div>
							<CommonSelectField
                value={selectedDepartmentService}
                onChange={(e) => setSelectedDepartmentService(e.target.value)}
                className={style.fullWidth}
                firstOptionLabel={'All'}
                firstOptionValue={''}
                valueList={serviceAreas?.map((service) => service?.id)}
                labelList={serviceAreas?.map((service) => service?.name)}
                disabledList={serviceAreas?.map(() => false)}
                required={false}
                label={"Specialty OR Service Area"}
            />
						</div>
                )}
            
					</div>
        )}
        {selectedEditField === "PRIVILEGE_CATEGORY" && (
        <div>
			<div className={`${style.grid2} ${style.marginTop5}`}>
				<div>
					<CommonSelectField
                  value={credentialingCategory}
                  onChange={(e) => setCredentialingCategory(e.target.value)}
                  className={style.fullWidth}
                  // firstOptionLabel={'All'}
                  // firstOptionValue={''}
                  valueList={categoryList?.map(data => data?.id)}
                  labelList={categoryList?.map(data => data?.category)}
                  disabledList={categoryList?.map(data => false)}
                  required={true}
                  label={"Credentialing & Privileges Category for Appointment"}
                />
				</div>
        {selectedPrivilegeTypeName === "Locum Tenens" && (
          <div className={style.lableStyle}>
                    Locum Period
                
					<div className={style.gridPeriod}>
						<div className={`${style.marginTop5}`}>
							<div className={style.marginTopLess}>
								<CommonDateField
                onChange={(date) => handleDateChange(date,"locumStartDate")}
                open={calendarStart}
                onOpen={() => setCalendarStart(true)}
                onClose={() => setCalendarStart(false)}
                minDate={sub(new Date(), { years: 3 })}
                maxDate={add(new Date(), { years: 3 })}
                value={locumStartDate}
                // label={"Expected Start Date"}
                 InputProps={{
                    style: {
                        fontSize: 14,
                        height: 30,
                        margin: 0,
                    },
                    }}
                renderInput={(params) => (
                    
									<TextField
                    {...params}
                    inputProps={{
                        ...params.inputProps,
                        placeholder: 'DD/MM/YYYY',
                        readOnly: true
                    }}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    />
                )}
                />
								</div>
							</div>
							<div className={style.marginTop}>To</div>
							<div className={`${style.marginTop5}`}>
								<div className={style.marginTopLess}>
									<CommonDateField
                onChange={(date) => handleDateChange(date,"locumEndDate")}
                open={calendarStart}
                onOpen={() => setCalendarStart(true)}
                onClose={() => setCalendarStart(false)}
                minDate={sub(new Date(), { years: 3 })}
                maxDate={add(new Date(), { years: 3 })}
                value={locumEndDate}
                label={""}
                 InputProps={{
                    style: {
                        fontSize: 14,
                        height: 30,
                        margin: 0,
                    },
                    }}
                renderInput={(params) => (
                    
										<TextField
                    {...params}
                    inputProps={{
                        ...params.inputProps,
                        placeholder: 'DD/MM/YYYY',
                        readOnly: true
                    }}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    />
                )}
                />
									</div>
								</div>
							</div>
						</div>
        )}
					</div>
          <div className={`${style.grid3} ${style.marginTop5}`}>
			<div>
				<CommonSelectField
                  value={selectedApplicantType}
                   onChange={(e) => {
                    setSelectedApplicantType(e.target.value);
                    setCredentialingCategory("");
                  }}
                  className={style.fullWidth}
                  // firstOptionLabel={'All'}
                  // firstOptionValue={''}
                  valueList={applicantType?.map(data => data?.id)}
                  labelList={applicantType?.map(data => data?.applicantType)}
                  disabledList={applicantType?.map(data => false)}
                  required={true}
                  label={"Applicant Type"}
                />
			</div>
			<div className={`${style.marginTop5} ${style.lableStyle}`}>
                    Expected Start Date 
				<br />
				<div className={style.marginTopLess}>
					<CommonDateField
                onChange={(date) => handleDateChange(date,"startDate")}
                open={calendarStart}
                onOpen={() => setCalendarStart(true)}
                onClose={() => setCalendarStart(false)}
                minDate={sub(new Date(), { years: 3 })}
                maxDate={add(new Date(), { years: 3 })}
                value={exceptedStartDate}
                // label={"Expected Start Date"}
                 InputProps={{
                    style: {
                        fontSize: 14,
                        height: 30,
                        margin: 0,
                    },
                    }}
                renderInput={(params) => (
                    
						<TextField
                    {...params}
                    inputProps={{
                        ...params.inputProps,
                        placeholder: 'DD/MM/YYYY',
                        readOnly: true
                    }}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    />
                )}
                />
					</div>
				</div>
			</div>
      </div>
        )}
					<div className={`${style.actionButtons} ${style.marginTop}`}>
						<div className={`${style.reviewButtonStyle} ${isApproveEnabled ? style.cursorPointer : undefined}`}
                style={{
                  pointerEvents: isApproveEnabled ? 'auto' : 'none',
                  opacity: isApproveEnabled ? 1 : 0.5
                }}
                onClick={putPreApplication}
                >
							<Tooltip title={isApproveEnabled ? "Click to Update" : ""} arrow>
								<div className={style.reviewButton}>Save Changes</div>
							</Tooltip>
						</div>
					</div>
				</div>
			</Dialog>
      )}
    
		</>
  );
};

export default EditInfoDialog;
