import React, { useState, useEffect } from "react";
import { GET, PUT, POST, TenantID } from "../../Screens/dataSaver";
import { Dialog } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import { format, sub, add } from 'date-fns';
import style from "./index.module.scss";
import LoadingScreen from "../LoadingScreen";
import UserLogo from "../../images/defaultUserLogo.jpg";
import { Tooltip } from "@mui/material";
import TextField from "@mui/material/TextField";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import CommonInputField from "../CommonFields/CommonInputField";
import CommonDateField from "../CommonFields/CommonDateField";
import CommonSelectField from "../CommonFields/CommonSelectField";


const EditInfoDialog = ({ checkedIds, getIsOpen, onClose,applicationId }) => {
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [form, setForm] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [cellNumber, setCellNumber] = useState("");
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
  const [departmentServiceList, setDepartmentServiceList] = useState([]);
  const [selectedDepartmentService, setSelectedDepartmentService] = useState('');
  const [sites, setSites] = useState([]);
  const [isApproveEnabled, setIsApproveEnabled] = useState(false);
  const workModeType = sessionStorage.getItem('workModeType')
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

  useEffect(() => {
    checkApproveEnabled();
  }, [firstName]);

  console.log("selectedDepartmentService",selectedDepartmentService)

  useEffect(() => {
    getDepartmentType()
    getSites()
    getPreApplication()
    getApplicantType()
    getPrivilege()
  }, [])

  useEffect(() => {
    getPrivilege()
  }, [selectedApplicantType])

  useEffect(() => {
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
}, [form]);
  
  

  const checkApproveEnabled = () => {
    const hasCheckedIds = checkedIds?.length > 0;
      setIsApproveEnabled(hasCheckedIds);
  };

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
      const { data: department } = await GET(
        `entity-service/department`
      );
      setDepartmentList(department)
    }

     const getPrivilege = async () => {
        const { data: category } = await GET(
          `entity-service/privilege?applicantTypeId=${selectedApplicantType}`
        );
        setCategoryList(category)
      }

     const getApplicantType = async () => {
        const { data: applicant } = await GET(
          `entity-service/applicantType`
        );
        setApplicantType(applicant)
      }

const getSites = async () => {
    const { data: sites } = await GET('entity-service/sites');
    setSites(sites);
};

  const getPreApplication = async () => {
    try {
      const { data: basicform } = await GET(`application-management-service/staff/${applicationId}`);
      setForm(basicform)
    } catch (error) {
      console.error('Error fetching application Documents:', error);
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
                Edit Applicant Details
              </div>
			<Tooltip title="Click to Close" arrow>
				<img src={CrossPink} alt="close" className={`${style.crossStyle} ${style.cursorPointer}`} onClick= {()=> {getIsOpen(false)}} />
			</Tooltip>
		</div>
		<div className={`${style.spaceBetween} ${style.padding}`}>
              {form?.applicant?.profilePicture?.fileURL ? (
                
			<div className={`${style.photoBorderStyle}`}>
				<img
                    src={form.applicant.profilePicture.fileURL}
                    alt="Profile Picture"
                    className={style.profileImage}
                  />
			</div>
              ) : (
                
			<div className={style.photoBackground}>
				<div className={style.photoText}>
                    Photo
                  </div>
				<ModeEditOutlineOutlinedIcon style={{ fontSize: 20, color: "#06617A", cursor: "pointer", float: "inline-end" }} />
			</div>
              )}
                {/* 
			<div className={style.photoBackground}>
				<div className={style.photoText}>
                        Photo
                    </div>
			</div> */}
                  {/* 
			<div className={`${style.photoBorderStyle}`}>
				<img
                    //   src={form?.applicant?.profilePicture?.fileURL || UserLogo}
                     src={UserLogo}
                      alt="Profile Picture"
                      className={style.profileImage}
                    />
			</div> */}
                    
			<div className={style.marginright40}>
				<div className={`${style.twoColumnGridInner2}`}>
					<div className={`${style.rightAlignTextStyle}`}>
                          {/* Last Updated on {lastModifiedDateFormat} */}
                          
						<div>Last Updated:</div>
					</div>
					<div className={style.datetextFormat}>{lastModifiedDateFormat}</div>
				</div>
                      {formattedLastApprovedDate !== "-" && (
                      
				<div className={`${style.twoColumnGridInner2} ${style.marginTop10}`}>
					<div className={`${style.rightAlignTextStyle}`}>
                          {/* Last Updated on {lastModifiedDateFormat} */}
                          
						<div> Last Approved By BOD:</div>
					</div>
					<div className={style.datetextFormat}>{formattedLastApprovedDate}</div>
				</div>
                      )}
                    
			</div>
		</div>
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
		<div className={`${style.grid3} ${style.marginTop5}`}>
			<div>
				<CommonInputField
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                type="text"
                placeholder="Entity Email"
                label="Email Address"
                required
                />
			</div>
			<div>
				<CommonInputField
                value={cellNumber}
                onChange={(e) => setCellNumber(e.target.value)}
                type="number"
                placeholder="Cell Phone"
                label="Cell Phone"
                />
			</div>
		</div>
		<div className={`${style.grid3} ${style.marginTop5}`}>
			<div>
				<CommonSelectField
                  value={selectedApplicantType}
                  onChange={(e) => setSelectedApplicantType(e.target.value)}
                  className={style.fullWidth}
                  firstOptionLabel={'All'}
                  firstOptionValue={''}
                  valueList={applicantType?.map(data => data?.id)}
                  labelList={applicantType?.map(data => data?.applicantType)}
                  disabledList={applicantType?.map(data => false)}
                  required={true}
                  label={"Credentialing Type"}
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
			<div className={`${style.grid2} ${style.marginTop5}`}>
				<div>
					<CommonSelectField
                  value={credentialingCategory}
                  onChange={(e) => setCredentialingCategory(e.target.value)}
                  className={style.fullWidth}
                  firstOptionLabel={'All'}
                  firstOptionValue={''}
                  valueList={categoryList?.map(data => data?.id)}
                  labelList={categoryList?.map(data => data?.category)}
                  disabledList={categoryList?.map(data => false)}
                  required={true}
                  label={"Credentialing & Privileges Category for Appointment"}
                />
				</div>
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
					</div>
					<div className={`${style.grid1} ${style.marginTop5}`}>
						<div>
							<CommonSelectField
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className={style.fullWidth}
                firstOptionLabel={'All'}
                firstOptionValue={''}
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
					<div className={`${style.actionButtons} ${style.marginTop}`}>
						<div className={`${style.reviewButtonStyle} ${isApproveEnabled ? style.cursorPointer : undefined}`}
                style={{
                  pointerEvents: isApproveEnabled ? 'auto' : 'none',
                  opacity: isApproveEnabled ? 1 : 0.5
                }}
                // onClick={onClickApproveMoveFunction}
                >
							<Tooltip title={isApproveEnabled ? "Click to Save" : "Please select a valid applicant and provide appropriate notes."} arrow>
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
