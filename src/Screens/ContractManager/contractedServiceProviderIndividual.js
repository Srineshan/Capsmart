import React, { useState, useEffect, useMemo } from "react";
import { Tag, TagInput } from "@blueprintjs/core";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormGroup from "@mui/material/FormGroup";
import FormControl from "@mui/material/FormControl";
import { FormatPhoneNumber } from "./../../utils/formatting";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { POST, GET, PUT, TenantID } from "./../dataSaver";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import SuffixList from "./../../Components/SuffixList";
import ProviderTypeList from "./../../Components/ProviderTypeList";
import FunctionalTitleList from "./../../Components/FunctionalTitleList";
import CommonInputField from "../../Components/CommonFields/CommonInputField";
import CommonCheckBox from "../../Components/CommonFields/CommonCheckBox";
import CommonSwitch from "../../Components/CommonFields/CommonSwitch";
import CommonLabel from "../../Components/CommonFields/CommonLabel";
import CommonSelectField from "../../Components/CommonFields/CommonSelectField";
import { valueCheck } from "./../../utils/valueCheck";

import style from "./index.module.scss";
import MissedMandatoryFieldAlert from "./missedMandatoryFieldAlert";

const ContractedServicesProviderIndividual = ({
  getViewPage3,
  getCurrentPage,
  contractId,
  contractType,
  contractName,
  checkFieldAndPopAlert,
  getShowAlert,
  isEditable,
  getTabDataStatus,
}) => {
  const testContractId = contractId;
  const [user, setUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [selectContractManager, setSelectContractManager] = useState("");
  const [siteLevel, setSiteLevel] = useState(false);
  const [departmentLevel, setDepartmentLevel] = useState(false);
  const [selectedContract, setSelectedContract] = useState("Select...");
  const theme = useTheme();
  const [personName, setPersonName] = useState([]);
  const [serviceProviderType, setServiceProviderType] = useState({
    contractedServiceProviderType: "",
    id: "",
  });
  const [npin, setNpin] = useState("");
  const [npinMissing, setNpinMissing] = useState(false);
  const [npinNotApplicable, setNpinNotApplicable] = useState(false);
  const [contractorFirstName, setContractorFirstName] = useState("");
  const [contractorMiddleName, setContractorMiddleName] = useState("");
  const [contractorLastName, setContractorLastName] = useState("");
  const [contractorNameSuffix, setContractorNameSuffix] = useState({
    id: "",
    suffix: "",
  });
  const [contractorEmail, setContractorEmail] = useState("");
  const [contractorPhone, setContractorPhone] = useState(0);
  const [address, setAddress] = useState({
    addressLine: "",
    city: "",
    state: "",
    zipcode: "",
  });
  const [siteLevelTitle, setSiteLevelTitle] = useState({ title: "", id: "" });
  const [departmentLevelDepartment, setDepartmentLevelDepartment] =
    useState("");
  const [departmentLevelTitle, setDepartmentLevelTitle] = useState({
    title: "",
    id: "",
  });
  const [siteLevelSite, setSiteLevelSite] = useState({ id: "", name: "" });
  const [departmentLevelSite, setDepartmentLevelSite] = useState({
    id: "",
    name: "",
  });
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [siteTitleValues, setSiteTitleValues] = useState([]);
  const [departmentTitleValues, setDepartmentTitleValues] = useState([]);
  const id = contractId;
  const [contractData, setContractData] = useState([]);
  const [userProviderData, setUserProviderData] = useState({});
  const [isUserPresent, setIsUserPresent] = useState(false);
  const [siteList, setSiteList] = useState([]);
  const [sites, setSites] = useState([]);
  const [selectedSitesDept, setSelectedSitesDepartment] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [allowPersonalMail, setAllowPersonalMail] = useState(false);
  const [mobileNA, setMobileNA] = useState(false);
  const [continueLoading, setContinueLoading] = useState(false);
  const [ssoId, setSsoId] = useState(null);
  const [tempSite, setTempSite] = useState([]);
  const [CSPSubDomain, setCSPSubDomain] = useState("");
  const [unassignedKeys, setUnassignedKeys] = useState([]);
  const [showSaveInProgress, setShowSaveInProgress] = useState(false);
  const contractStatus = sessionStorage.getItem("Selected Contract Status");

  useEffect(() => {
    getRoles();
    getUserData();
    getUsersData();
    getEntityData();
  }, []);

  useEffect(() => {
    let depts = sites
      ?.filter((data) => data?.id === departmentLevelSite?.id)
      ?.map((data) => data.department)[0];
    setSelectedSitesDepartment(depts);
  }, [departmentLevelSite]);

  useEffect(() => {
    if (isUserPresent) {
      setServiceProviderType(userProviderData?.serviceProviderType);
      setNpin(userProviderData?.npin?.npin);
      setNpinMissing(userProviderData?.npin?.missing);
      setNpinNotApplicable(userProviderData?.npin?.notApplicable);
      setContractorFirstName(userProviderData?.name?.firstName);
      setContractorLastName(userProviderData?.name?.lastName);
      setContractorNameSuffix(userProviderData?.name?.suffix);
      setContractorMiddleName(userProviderData?.name?.middleName);
      setContractorPhone(userProviderData?.communication?.mobileNumber);
      setContractorEmail(userProviderData?.email?.officialEmail);
      setAddress(userProviderData?.address);
      setSelectedRoles(userProviderData?.roles || []);
      setContracts(userProviderData?.contracts);
      let contractData = userProviderData?.contracts
        ?.filter((data) => data?.id === contractId)
        ?.map((data) => data)[0];
      setSiteList(contractData?.sites?.sites ? contractData?.sites?.sites : []);
      setSiteLevel(contractData?.siteLevelResponsible);
      setDepartmentLevel(contractData?.departmentLevelResponsible);
      let siteTemp = [];
      contractData?.sites?.sites?.map((site) => {
        let deptTemp = [];
        site?.departmentList?.departments?.map((dept) => {
          deptTemp.push({
            id: dept?.id,
            name: dept?.departmentName?.name,
            title: dept?.departmentResponsibility?.title || "",
            title_id: dept?.departmentResponsibility?.id || "",
          });
        });
        siteTemp.push({
          id: site?.id,
          name: site?.siteName?.siteName,
          title: site?.siteResponsibility?.title,
          title_id: site?.siteResponsibility?.id,
          department: deptTemp,
        });
      });
      setSites(siteTemp || []);
      setAllowPersonalMail(userProviderData?.personalEmailAddressAllowed);
      setMobileNA(userProviderData?.communication?.mobileNumberNotApplicable);
      setSsoId(userProviderData?.ssoId);
    } else {
      getSites();
    }
  }, [contractId, userProviderData, isUserPresent, user]);

  useEffect(() => {
    getTitleData();
  }, [siteList?.length, siteList, userProviderData, isUserPresent]);

  const getTitleData = () => {
    console.log(
      "inside titledata",
      siteList,
      siteTitleValues,
      departmentTitleValues
    );
    let temp = [];
    let siteValue = siteTitleValues || [];
    let deptValue = departmentTitleValues || [];
    console.log("above values", deptValue, siteValue);
    siteList?.map((data) => {
      let dept = [];
      data?.departmentList?.departments?.map((deptData) => {
        dept.push({
          id: deptData?.id,
          name: deptData?.departmentName?.name,
          title: deptData?.departmentResponsibility?.title || "",
          title_id: deptData?.departmentResponsibility?.id || "",
        });
        if (
          deptData?.departmentResponsibility?.title !== "" &&
          deptData?.departmentResponsibility?.title !== undefined
        ) {
          let valueString = `${data?.siteName?.siteName} -- ${deptData?.departmentName?.name} -- ${deptData?.departmentResponsibility?.title}`;
          if (!deptValue.includes(valueString)) {
            deptValue.push(valueString);
            console.log("deptvalue", valueString);
          }
        }
      });
      temp.push({
        id: data?.id,
        name: data?.siteName?.siteName,
        title: data?.siteResponsibility?.title || "",
        title_id: data?.siteResponsibility?.id,
        department: dept,
      });
      if (
        data?.siteResponsibility?.title !== "" &&
        data?.siteResponsibility?.title !== undefined
      ) {
        let valueString = `${data?.siteName?.siteName} -- ${data?.siteResponsibility?.title}`;
        if (!siteValue.includes(valueString)) {
          siteValue.push(valueString);
          console.log("siteValue", valueString);
        }
      }
    });
    console.log("under site title value", siteValue, deptValue);
    setSites(temp);
    setSiteTitleValues(siteValue);
    setDepartmentTitleValues(deptValue);
  };

  const getUserData = async () => {
    if (contractId !== "" && contractId !== undefined) {
      const { data: userData } = await GET(
        `user-management-service/user?contractID=${contractId}`
      );
      if (userData) {
        if (userData?.length !== 0) {
          setUserProviderData(userData[0]);
          setIsUserPresent(true);
        }
        setUsers(userData);
      }
    }
  };

  const getUsersData = async () => {
    const { data: user } = await GET("user-management-service/user");
    if (user) {
      setUsers(user);
    }
  };

  const getEntityData = async () => {
    const { data: entityData } = await GET(`entity-service/entity/${TenantID}`);
    // console.log("entity", entityData.subdomain);
    setCSPSubDomain(entityData?.officialEmailDomain?.officialEmail);
  };

  const getSites = async () => {
    const { data: contractData } = await GET(
      `contract-managment-service/contracts/${contractId}/contractDetail`
    );
    let contractDetail = contractData?.contractDetail;
    let sitesValue = contractDetail?.site?.sites;
    setTempSite(contractDetail?.site);
    if (sitesValue && siteList?.length === 0) {
      setSiteList(sitesValue);
      let siteTemp = [];
      sitesValue?.map((site) => {
        let deptTemp = [];
        site?.departmentList?.departments?.map((dept) => {
          deptTemp.push({
            id: dept?.id,
            name: dept?.departmentName?.name,
            title: dept?.departmentResponsibility?.title || "",
            title_id: dept?.departmentResponsibility?.id || "",
          });
        });
        siteTemp.push({
          id: site?.id,
          name: site?.siteName?.siteName,
          title: site?.siteResponsibility?.title,
          title_id: site?.siteResponsibility?.id,
          department: deptTemp,
        });
      });
      setSites(siteTemp || []);

      // getTitleData();
    }
  };

  const deptTitleReset = () => {
    let temp = sites;
    temp?.map((site) => {
      site?.department?.map((dept) => {
        dept.title = "";
        dept.title_id = "";
      });
    });
    setSites(temp);
    setDepartmentTitleValues([]);
  };

  const siteTitleReset = () => {
    let temp = sites;
    temp?.map((site) => {
      site.title = "";
      site.title_id = "";
    });
    setSites(temp);
    setSiteTitleValues([]);
  };

  const getTagProps = (_v, index) => ({
    minimal: true,
  });

  const handleSiteLevelValues = () => {
    if (siteLevelSite?.name === "" || siteLevelTitle.title === "") {
      ErrorToaster("Selecting all the fields is mandatory");
      return;
    }
    setSiteTitleValues([
      ...siteTitleValues,
      `${siteLevelSite?.name} -- ${siteLevelTitle?.title}`,
    ]);
    let temp = sites;
    temp
      ?.filter((data) => data?.id === siteLevelSite?.id)
      ?.map((data) => {
        data.title = siteLevelTitle?.title;
        data.title_id = siteLevelTitle?.id;
      });
    setSites(temp);
    setSiteLevelSite({ id: "", name: "" });
    setSiteLevelTitle({ id: "", title: "" });
  };

  const handleDepartmentLevelValues = () => {
    if (
      departmentLevelSite?.name === "" ||
      departmentLevelDepartment?.name === "" ||
      departmentLevelTitle?.title === ""
    ) {
      ErrorToaster("Selecting all the fields is mandatory");
      return;
    }
    let valueString = `${departmentLevelSite?.name} -- ${departmentLevelDepartment?.name} -- ${departmentLevelTitle?.title}`;
    setDepartmentTitleValues([...departmentTitleValues, valueString]);
    let temp = sites;
    let siteDepartment = sites
      ?.filter((data) => data?.id === departmentLevelSite?.id)
      ?.map((data) => data?.department)[0];
    siteDepartment
      ?.filter((dept) => dept?.id === departmentLevelDepartment?.id)
      ?.map((dept) => {
        dept.title = departmentLevelTitle?.title;
        dept.title_id = departmentLevelTitle?.id;
      });
    temp
      ?.filter((data) => data?.id === departmentLevelSite?.id)
      ?.map((data) => {
        data.department = siteDepartment;
      });
    setSites(temp);
    setDepartmentLevelSite({ id: "", name: "" });
    setDepartmentLevelDepartment({ id: "", name: "" });
    setDepartmentLevelTitle({ id: "", title: "" });
  };

  const handleSelectedDepartmentSite = (id) => {
    setDepartmentLevelSite({
      id: id,
      name: sites
        ?.filter((data) => data?.id === id)
        ?.map((data) => data?.name)[0],
    });
  };

  const getSiteData = () => {
    let siteData = [];
    sites?.map((data) => {
      console.log("site data", sites, "data", data);
      let deptData = [];
      data?.department?.map((dept) => {
        deptData.push({
          id: dept?.id,
          departmentName: {
            name: dept?.name,
          },
          departmentHead: {
            id: "",
          },
          departmentResponsibility: {
            title: dept?.title,
            id: dept?.title_id,
          },
        });
      });
      siteData.push({
        id: data?.id,
        siteName: {
          siteName: data?.name,
        },
        departmentList: {
          departments: deptData,
        },
        siteResponsibility: {
          title: data?.title,
          id: data?.title_id,
        },
      });
    });
    return siteData;
  };

  const getContractsData = () => {
    let isContractpresent =
      contracts
        ?.filter((data) => data?.id === testContractId)
        ?.map((data) => data)?.length || 0;
    let value = [];
    if (isContractpresent === 0) {
      let temp = contracts !== null ? contracts : [];
      temp.push({
        id: testContractId,
        contractName: {
          contractName: contractName,
        },
        roles: selectedRoles,
        sites: {
          sites: getSiteData(),
        },
        siteLevelResponsible: siteLevel,
        departmentLevelResponsible: departmentLevel,
      });
      setContracts(temp);
      value = temp;
    } else {
      let temp = contracts;
      temp
        ?.filter((data) => data?.id === testContractId)
        ?.map((data) => {
          data.roles = selectedRoles;
          let siteValue = {
            sites: getSiteData(),
          };
          data.sites = siteValue;
          // data.sites = tempSite;
          data.siteLevelResponsible = siteLevel;
          data.departmentLevelResponsible = departmentLevel;
        });
      setContracts(temp);
      value = temp;
    }
    return value;
  };

  const mandatoryFieldCheck = (buttonType) => {
    if (buttonType === "SaveInProgress") {
      saveInProgresscheck();
    } else {
      handleSave("Continue");
    }
  };

  const saveInProgresscheck = () => {
    var keys = [];

    if (serviceProviderType?.id === "") {
      keys.push("Service Provider Type");
    }
    if (address?.addressLine === "") {
      keys.push("Address");
    }
    if (siteLevel && siteTitleValues.length === 0) {
      keys.push("Site Level Responsibility");
    }
    if (departmentLevel && departmentTitleValues?.length === 0) {
      keys.push("Department Level Responsibility");
    }
    if (isUserPresent && rolesTags.length === 0) {
      keys.push("Assign Contractor With App User Role");
    }

    setUnassignedKeys(keys);
    if (keys?.length !== 0) {
      setShowSaveInProgress(true);
    } else {
      handleSave("SaveInProgress");
    }
  };

  const saveInProgressFunction = () => {
    handleSave("SaveInProgress");
  };

  const getSaveInProgressAlert = (value) => {
    setShowSaveInProgress(value);
  };

  const handleSave = async (buttonText) => {
    setContinueLoading(true);
    let roles = userProviderData?.roles || [];
    selectedRoles?.map((data) => {
      if (!roles?.map((role) => role?.id).includes(data?.id)) {
        roles.push(data);
      }
    });
    if (!npinMissing && !npinNotApplicable && npin === "") {
      ErrorToaster("NPIN is Mandatory if not Missing/NA");
      setContinueLoading(false);
      return;
    }
    if (contractorFirstName === "") {
      ErrorToaster("First Name is Mandatory");
      setContinueLoading(false);
      return;
    }
    if (contractorLastName === "") {
      ErrorToaster("Last Name is Mandatory");
      setContinueLoading(false);
      return;
    }

    if (
      (!allowPersonalMail && !contractorEmail?.includes(`@${CSPSubDomain}`)) ||
      (!allowPersonalMail && !contractorEmail?.includes("."))
    ) {
      ErrorToaster("Enter a Valid Email Domain");
      setContinueLoading(false);
      return;
    } else if (
      (allowPersonalMail && !contractorEmail?.includes("@")) ||
      (allowPersonalMail && contractorEmail?.includes(`@${CSPSubDomain}`)) ||
      (allowPersonalMail && !contractorEmail?.includes("."))
    ) {
      ErrorToaster("Enter a Valid Personal Email");
      setContinueLoading(false);
      return;
    }

    if (!mobileNA && contractorPhone?.length !== 14) {
      ErrorToaster("Enter Valid Phone Number");
      setContinueLoading(false);
      return;
    }
    if (roles?.length === 0) {
      ErrorToaster("Select User Role");
      setContinueLoading(false);
      return;
    }
    const data = {
      ...(isUserPresent && { id: userProviderData?.id }),
      name: {
        firstName: contractorFirstName,
        lastName: contractorLastName,
        middleName: contractorMiddleName,
        suffix: contractorNameSuffix,
      },
      userType: "CONTRACTED_SERVICE_PROVIDER_USER",
      contracts: getContractsData(),
      title: {},
      email: {
        officialEmail: contractorEmail,
      },
      ssoId: isUserPresent ? ssoId : { id: contractorEmail },
      ...(!isUserPresent && {
        password: {
          password: "string",
        },
      }),
      communication: {
        personalEmail: contractorEmail,
        mobileNumber: contractorPhone,
        landlineNumber: "string",
        mobileNumberNotApplicable: mobileNA,
      },
      roles: roles,
      address: address,
      tenant: {
        tenantId: TenantID,
      },
      sites: {
        sites: getSiteData(),
      },
      serviceProviderType: serviceProviderType,
      npin: {
        missing: npinMissing,
        notApplicable: npinNotApplicable,
        npin: npin,
      },
      personalEmailAddressAllowed: allowPersonalMail,
    };
    console.log("final data", data);
    if (!isUserPresent) {
      await POST("user-management-service/user/register", JSON.stringify(data))
        .then((response) => {
          SuccessToaster("User Added Successfully");
        })
        .catch((error) => {
          ErrorToaster("Unexpected Error");
        });
    } else {
      await PUT("user-management-service/user", JSON.stringify(data))
        .then((response) => {
          SuccessToaster("User Updated Successfully");
        })
        .catch((error) => {
          ErrorToaster("Unexpected Error");
        });
    }
    setContinueLoading(false);

    if (buttonText === "Continue") {
      getViewPage3(true);
      getCurrentPage("Contractor Business Entity");
    } else {
      getShowAlert(true);
    }
    setUnassignedKeys([]);

    getTabDataStatus();
  };

  const handleRoles = (value) => {
    if (value !== "0") {
      const selectedValue = roles
        .filter((data) => data?.roleName === value)
        .map((data) => data)[0];
      if (!selectedRoles?.map((data) => data?.roleName).includes(value)) {
        setSelectedRoles([...selectedRoles, selectedValue]);
      }
    }
  };

  const rolesTags = selectedRoles
    ?.filter((data) => roles.map((role) => role?.id === data?.id))
    ?.map((tag, index) => {
      const onRemove = () => {
        setSelectedRoles(
          selectedRoles
            .filter((t) => t?.roleName !== tag?.roleName)
            ?.map((data) => data)
        );
      };
      return (
        <Tag
          key={index}
          onRemove={contractStatus === "ACTIVE" ? () => {} : onRemove}
          large={true}
          className={style.tagStyle}
        >
          {tag?.roleName}
        </Tag>
      );
    });

  const getRoles = async () => {
    let role = ["APP", "APP_SYSTEM"];
    const { data: roles } = await GET(
      `user-management-service/roles?roleType=${role}`
    );
    setRoles(roles);
    let temp = selectedRoles;
    if (
      !selectedRoles?.map((data) => data?.roleName)?.includes("Activity Logger")
    ) {
      temp.push(
        roles
          ?.filter((role) => role?.roleName === "Activity Logger")
          ?.map((data) => data)[0]
      );
      setSelectedRoles(temp);
    }
  };

  const onSelectDepartment = (deptId) => {
    let selectedSite = sites
      ?.filter((data) => data?.id === departmentLevelSite?.id)
      ?.map((data) => data)[0];
    let selectedDepartment = selectedSite?.department
      ?.filter((data) => data?.id === deptId)
      ?.map((data) => data?.name)[0];
    setDepartmentLevelDepartment({ id: deptId, name: selectedDepartment });
  };

  const handleDeptRemove = (values, index) => {
    let data = values?.split(" -- ");
    let site = data?.[0];
    let dept = data?.[1];
    let title = data?.[2];
    let temp = sites;
    let siteDepartment = sites
      ?.filter((data) => data?.name === site)
      ?.map((data) => data?.department)[0];
    siteDepartment
      ?.filter((data) => data?.name === dept && data?.title === title)
      ?.map((data) => {
        data.title = "";
        data.title_id = "";
      });
    temp
      ?.filter((data) => data?.name === site && data?.title)
      ?.map((data) => {
        data.department = siteDepartment;
      });
    setSites(temp);
    setDepartmentTitleValues(
      departmentTitleValues
        ?.filter((data, indexVal) => index !== indexVal)
        ?.map((data) => data)
    );
  };

  const handleSiteRemove = (values, index) => {
    let data = values?.split(" -- ");
    let site = data?.[0];
    let title = data?.[1];
    let temp = sites;
    temp
      ?.filter((data) => data?.name === site && data?.title === title)
      ?.map((data) => {
        data.title = "";
        data.title_id = "";
      });
    setSites(temp);
    setSiteTitleValues(
      siteTitleValues
        ?.filter((data, indexVal) => index !== indexVal)
        ?.map((data) => data)
    );
  };

  const items = useMemo(
    () =>
      user.map((option) => ({
        id: option?.id,
        value: `${option.name.firstName} ${option.name.lastName} ${option.name.suffix}`,
        ...option,
      })),
    [user]
  );

  const onSelect = (selectedItem) => {
    setSelectContractManager(selectedItem.id);
  };

  const handleInput = (e) => {
    const formattedPhoneNumber = FormatPhoneNumber(e.target.value);
    setContractorPhone(formattedPhoneNumber);
  };

  const changePersonalMail = () => {
    setAllowPersonalMail(!allowPersonalMail);
    setContractorEmail("");
  };

  console.log("dept", departmentTitleValues, "site", siteTitleValues);

  const dataCheck = (value) => {
    if (isUserPresent) {
      return valueCheck(value);
    } else {
      return false;
    }
  };

  return (
    <div className={style.cloneBlockStyle}>
      <div className={`${style.newContractFromCloneBoxStyle}`}>
        <div>
          <div
            className={`${style.extentionGrid}`}
            onFocus={() => {
              checkFieldAndPopAlert(
                serviceProviderType?.id,
                "Service Provider Type"
              );
            }}
          >
            <CommonLabel
              value="Service Provider Type*"
              className={
                dataCheck(serviceProviderType?.id) ? style.redLable : ""
              }
            />
            {/* <div className={style.grid2}> */}
            <ProviderTypeList
              value={serviceProviderType?.id}
              onChangeFunc={(id, value) =>
                setServiceProviderType({
                  id: id,
                  contractedServiceProviderType: value,
                })
              }
              className={[style.fullWidth]}
            />
            {/* </div> */}
          </div>
          <div
            className={`${style.extentionGrid} ${style.marginTop20}`}
            onFocus={() => {
              checkFieldAndPopAlert(npin, "NPIN");
            }}
          >
            <CommonLabel
              value="NPIN*"
              className={
                !npinMissing &&
                !npinNotApplicable &&
                (dataCheck(npin) ? style.redLable : "")
              }
            />
            <div className={style.grid3}>
              <CommonInputField
                className={style.fullWidth}
                placeholder="NPIN"
                value={npin}
                type="tel"
                maxLength={10}
                disabled={npinMissing || npinNotApplicable}
                onChange={(e) => e.target.value >= 0 && setNpin(e.target.value)}
              />
              <CommonCheckBox
                value="Missing"
                checked={npinMissing}
                onChange={(e) => {
                  setNpinMissing(e.target.checked);
                  setNpin("");
                  setNpinNotApplicable(false);
                }}
                label="Missing"
              />
              <CommonCheckBox
                value="NA"
                checked={npinNotApplicable}
                onChange={(e) => {
                  setNpinNotApplicable(e.target.checked);
                  setNpin("");
                  setNpinMissing(false);
                }}
                label="NA"
              />
            </div>
          </div>
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <CommonLabel
              value="Contractor Name*"
              className={dataCheck(contractorFirstName) ? style.redLable : ""}
            />
            <div className={style.grid3}>
              <CommonInputField
                className={style.fullWidth}
                placeholder="First"
                value={contractorFirstName}
                maxLength={30}
                onFocus={() => {
                  checkFieldAndPopAlert(
                    contractorFirstName,
                    "Contractor First Name"
                  );
                }}
                onChange={(e) => setContractorFirstName(e.target.value)}
              />
              <CommonInputField
                className={style.fullWidth}
                placeholder="Middle"
                value={contractorMiddleName}
                maxLength={30}
                onFocus={() => {
                  checkFieldAndPopAlert(
                    contractorMiddleName,
                    "Contractor Middle Initials"
                  );
                }}
                onChange={(e) => setContractorMiddleName(e.target.value)}
              />
              <CommonInputField
                className={style.fullWidth}
                placeholder="Last"
                value={contractorLastName}
                maxLength={30}
                onFocus={() => {
                  checkFieldAndPopAlert(
                    contractorLastName,
                    "Contractor Last Name"
                  );
                }}
                onChange={(e) => setContractorLastName(e.target.value)}
              />
            </div>
          </div>
          <div
            className={`${style.extentionGrid} ${style.marginTop20}`}
            onFocus={() => {
              checkFieldAndPopAlert(contractorNameSuffix?.id, "Suffix");
            }}
          >
            <CommonLabel
              value="Suffix*"
              className={
                dataCheck(contractorNameSuffix?.id) ? style.redLable : ""
              }
            />
            <div className={style.grid3}>
              <SuffixList
                value={contractorNameSuffix?.id}
                onChangeFunc={(id, value) =>
                  setContractorNameSuffix({
                    ...contractorNameSuffix,
                    id: id,
                    suffix: value,
                  })
                }
                className={[style.fullWidth]}
              />
            </div>
          </div>

          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <CommonLabel
              value="Allow Use of Alternate/ Personal Email Address"
              className={
                allowPersonalMail && dataCheck(contractorEmail)
                  ? style.redLable
                  : ""
              }
            />
            <div className={style.displayInRow}>
              <CommonSwitch
                className={`${style.flexLeft} ${style.switchFontStyle}`}
                label={allowPersonalMail ? "YES" : "NO"}
                checked={allowPersonalMail}
                onChange={changePersonalMail}
              />
              {allowPersonalMail && (
                <div
                  className={`${style.fullWidth} ${style.verticalAlignCenter}`}
                  onFocus={() => {
                    checkFieldAndPopAlert(
                      contractorEmail,
                      "Email Contractor id"
                    );
                  }}
                >
                  <CommonInputField
                    placeholder="Enter Personal email"
                    className={`${style.fullWidth}`}
                    value={contractorEmail}
                    onChange={(e) => setContractorEmail(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
          {!allowPersonalMail && (
            <div
              className={`${style.extentionGrid} ${style.marginTop20}`}
              onFocus={() => {
                checkFieldAndPopAlert(contractorEmail, "Email Contractor id");
              }}
            >
              <CommonLabel
                value="Contract Entity Email*"
                className={dataCheck(contractorEmail) ? style.redLable : ""}
              />
              <div className={style.displayInRow}>
                <CommonInputField
                  placeholder="Enter entity specific email"
                  className={`${style.entityFieldWidth}`}
                  value={contractorEmail}
                  maxLength={30}
                  onChange={(e) => setContractorEmail(e.target.value)}
                />
              </div>
            </div>
          )}
          {/* 
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <CommonLabel value='SSO ID*' />
            <div className={style.displayInRow}>
              <CommonInputField placeholder="Enter SSO ID" className={`${style.entityFieldWidth}`}
                value={ssoId?.id}
                maxLength={30}
                onChange={(e) => setSsoId({ ...ssoId, id: e.target.value })} />
            </div>
          </div> */}

          <div
            className={`${style.extentionGrid} ${style.marginTop20}`}
            onFocus={() => {
              checkFieldAndPopAlert(contractorPhone, "Cell Phone");
            }}
          >
            <CommonLabel
              value="Cell Phone*"
              className={
                !mobileNA && dataCheck(contractorPhone) ? style.redLable : ""
              }
            />
            <div className={style.twoCol}>
              <div
                className={`${style.displayInRow} ${style.verticalAlignCenter}`}
              >
                <div className={`${style.plusOneText} ${style.marginRight}`}>
                  +1
                </div>
                <CommonInputField
                  placeholder="Numeric"
                  value={contractorPhone}
                  disabled={mobileNA}
                  maxLength={15}
                  onChange={(e) => {
                    setContractorPhone(FormatPhoneNumber(e.target.value));
                    setMobileNA(false);
                  }}
                  className={`${style.fullWidth}`}
                />
              </div>
              <CommonCheckBox
                value="NA"
                checked={mobileNA}
                onChange={(e) => {
                  setMobileNA(e.target.checked);
                  if (e.target.checked) {
                    setContractorPhone("");
                  }
                }}
                label="NA"
              />
            </div>
          </div>
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <CommonLabel
              value="Address"
              className={dataCheck(address?.addressLine) ? style.redLable : ""}
            />
            <div>
              <CommonInputField
                className={style.fullWidth}
                placeholder="Street"
                value={address?.addressLine}
                onChange={(e) =>
                  setAddress({ ...address, addressLine: e.target.value })
                }
                onFocus={() => {
                  checkFieldAndPopAlert(address?.addressLine, "Address Street");
                }}
              />
              <div className={`${style.grid3} ${style.marginTop20}`}>
                <CommonInputField
                  className={style.fullWidth}
                  placeholder="City"
                  value={address?.city}
                  maxLength={50}
                  onFocus={() => {
                    checkFieldAndPopAlert(address?.city, "Address City");
                  }}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                />
                <CommonInputField
                  className={style.fullWidth}
                  placeholder="State"
                  value={address?.state}
                  maxLength={20}
                  onFocus={() => {
                    checkFieldAndPopAlert(address?.state, "Address State");
                  }}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                />
                <CommonInputField
                  className={style.fullWidth}
                  placeholder="Zipcode"
                  value={address?.zipcode}
                  maxLength={5}
                  onFocus={() => {
                    checkFieldAndPopAlert(address?.zipcode, "Address Zip Code");
                  }}
                  onChange={(e) =>
                    setAddress({ ...address, zipcode: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className={`${style.extentionGrid} ${style.marginTop20}`}
          onFocus={() => {
            checkFieldAndPopAlert(
              siteLevel ? siteTitleValues?.length : true,
              "Site Level Responsibility"
            );
          }}
        >
          <CommonLabel
            value="Site Level Responsibility*"
            className={
              siteLevel && siteTitleValues.length === 0 ? style.redLable : ""
            }
          />
          <div>
            <div className={style.flexLeft}>
              <CommonSwitch
                checked={siteLevel}
                className={`${style.flexLeft} ${style.switchFontStyle}`}
                label={siteLevel ? "YES" : "NO"}
                onChange={() => {
                  setSiteLevel(!siteLevel);
                  siteTitleReset();
                }}
              />
            </div>
            {siteLevel && (
              <div
                className={`${style.siteLevelBoxStyle}`}
                onFocus={() =>
                  checkFieldAndPopAlert(
                    siteTitleValues?.length,
                    "Site Level Responsibility"
                  )
                }
              >
                <div className={`${style.siteLevelGrid}`}>
                  <div className={style.marginTop}>Site*</div>
                  <CommonSelectField
                    value={siteLevelSite?.id}
                    className={`${style.marginLeft20} ${style.weekSelectStyle}`}
                    onChange={(e) =>
                      setSiteLevelSite({
                        id: e.target.value,
                        name: sites
                          ?.filter((data) => data?.id === e.target.value)
                          ?.map((data) => data?.name)[0],
                      })
                    }
                    firstOptionLabel={""}
                    firstOptionValue={""}
                    valueList={siteList?.map((data) => data?.id)}
                    labelList={siteList?.map(
                      (data) => data?.siteName?.siteName
                    )}
                    disabledList={sites?.map((data) =>
                      data?.title !== "" && data?.title !== null ? true : false
                    )}
                  />
                </div>
                {/* )} */}
                <div className={`${style.siteLevelGrid} ${style.marginTop10}`}>
                  <div className={style.marginTop}>Title*</div>
                  <FunctionalTitleList
                    value={siteLevelTitle?.id}
                    onChangeFunc={(id, value) =>
                      setSiteLevelTitle({ id: id, title: value })
                    }
                    className={[style.marginLeft20, style.weekSelectStyle]}
                    providerId={serviceProviderType?.id}
                  />
                </div>
                <div
                  className={`${style.addButtonPosition} ${style.marginTop20}`}
                >
                  <Button
                    variant="outlined"
                    onClick={() => handleSiteLevelValues()}
                  >
                    Add
                  </Button>
                </div>
                <TagInput
                  values={siteTitleValues}
                  className={`${style.marginTop20}`}
                  onRemove={
                    contractStatus === "ACTIVE" ? () => {} : handleSiteRemove
                  }
                  separator={/[\s,]/}
                  addOnBlur={true}
                  addOnPaste={true}
                />
              </div>
            )}
          </div>
        </div>
        <div
          className={`${style.extentionGrid} ${style.marginTop20}`}
          onFocus={() => {
            checkFieldAndPopAlert(
              departmentLevel ? departmentTitleValues?.length : true,
              "Department Level Responsibility"
            );
          }}
        >
          <CommonLabel
            value="Department Level Responsibility*"
            className={
              departmentLevel && departmentTitleValues?.length === 0
                ? style.redLable
                : ""
            }
          />
          <div>
            <div className={style.flexLeft}>
              <CommonSwitch
                checked={departmentLevel}
                className={`${style.flexLeft} ${style.switchFontStyle}`}
                label={departmentLevel ? "YES" : "NO"}
                onChange={() => {
                  setDepartmentLevel(!departmentLevel);
                  deptTitleReset();
                }}
              />
            </div>
            <div>
              {departmentLevel && (
                <div
                  className={`${style.departmentLevelBoxStyle}`}
                  onFocus={() => {
                    checkFieldAndPopAlert(
                      departmentTitleValues?.length,
                      "Department Level Responsibility"
                    );
                  }}
                >
                  {/* {selectedContract === "Multiple Contractor" && ( */}
                  <div className={`${style.siteLevelGrid}`}>
                    <div className={style.marginTop}>Site*</div>
                    <CommonSelectField
                      value={departmentLevelSite?.id}
                      onChange={(e) =>
                        handleSelectedDepartmentSite(e.target.value)
                      }
                      className={`${style.marginLeft20} ${style.weekSelectStyle}`}
                      firstOptionLabel={""}
                      firstOptionValue={""}
                      valueList={sites?.map((data) => data?.id)}
                      labelList={sites?.map((data) => data?.name)}
                      disabledList={sites?.map((data) => false)}
                    />
                  </div>
                  {/* )} */}
                  <div
                    className={`${style.siteLevelGrid} ${style.marginTop10}`}
                  >
                    <div className={style.marginTop}>Department*</div>
                    <CommonSelectField
                      value={departmentLevelDepartment?.id}
                      onChange={(e) => onSelectDepartment(e.target.value)}
                      className={`${style.marginLeft20} ${style.weekSelectStyle}`}
                      firstOptionLabel={"Select Department"}
                      firstOptionValue={"Select Department"}
                      valueList={selectedSitesDept?.map((data) => data?.id)}
                      labelList={selectedSitesDept?.map((data) => data?.name)}
                      disabledList={selectedSitesDept?.map((data) =>
                        data?.title !== "" ? true : false
                      )}
                    />
                  </div>
                  <div
                    className={`${style.siteLevelGrid} ${style.marginTop10}`}
                  >
                    <div className={style.marginTop}>Title*</div>
                    <FunctionalTitleList
                      value={departmentLevelTitle?.id}
                      onChangeFunc={(id, value) =>
                        setDepartmentLevelTitle({ id: id, title: value })
                      }
                      className={[style.marginLeft20, style.weekSelectStyle]}
                      providerId={serviceProviderType?.id}
                    />
                  </div>
                  <div
                    className={`${style.addButtonPosition} ${style.marginTop20}`}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => handleDepartmentLevelValues()}
                    >
                      Add
                    </Button>
                  </div>
                  <TagInput
                    values={departmentTitleValues}
                    className={`${style.marginTop20}`}
                    onRemove={
                      contractStatus === "ACTIVE" ? () => {} : handleDeptRemove
                    }
                    separator={/[\s,]/}
                    addOnBlur={true}
                    addOnPaste={true}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className={`${style.extentionGrid} ${style.marginTop20}`}
          onFocus={() => {
            checkFieldAndPopAlert(true, "Assign Contractor With App User Role");
          }}
        >
          <CommonLabel
            value="Assign Contractor With App User Role*"
            className={
              isUserPresent && rolesTags.length === 0 ? style.redLable : ""
            }
          />
          <div>
            <CommonSelectField
              onChange={(e) => handleRoles(e.target.value)}
              className={`${style.fullWidth}`}
              firstOptionLabel={"Select Role-multi select"}
              firstOptionValue={"0"}
              valueList={roles
                ?.filter((data) => data?.roleName !== "Aggregator")
                ?.map((data) => data?.roleName)}
              labelList={roles
                ?.filter((data) => data?.roleName !== "Aggregator")
                ?.map((data) => data?.roleName)}
              disabledList={roles?.map((data) => false)}
            />
            <div className={`${style.marginTop20}`}>{rolesTags}</div>
          </div>
        </div>
      </div>
      {isEditable && (
        <div className={`${style.spaceBetween} ${style.marginTop20}`}>
          <button
            className={`${style.newContractButtonStyle}  ${style.cursorPointer}`}
            onClick={() => {
              getCurrentPage("Contract ID & Term Limit");
            }}
          >
            BACK
          </button>
          <div>
            <button
              className={`${style.newContractOutlinedButton}  ${
                style.cursorPointer
              } ${continueLoading ? style.disabled : ""}`}
              onClick={() =>
                !continueLoading && mandatoryFieldCheck("SaveInProgress")
              }
            >
              SAVE IN-PROGRESS
            </button>
            <button
              className={`${style.newContractButtonStyle} ${
                style.marginLeft20
              }  ${style.cursorPointer} ${
                continueLoading ? style.disabled : ""
              }`}
              onClick={() => {
                !continueLoading && mandatoryFieldCheck("Continue");
              }}
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}

      <MissedMandatoryFieldAlert
        alert={showSaveInProgress}
        getSaveInProgressAlert={getSaveInProgressAlert}
        fieldData={unassignedKeys}
        saveInProgressFunction={saveInProgressFunction}
      />
    </div>
  );
};

export default ContractedServicesProviderIndividual;
