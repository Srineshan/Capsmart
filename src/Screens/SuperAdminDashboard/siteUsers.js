import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { InputGroup, Icon, Intent, TagInput, Dialog, Classes } from '@blueprintjs/core';
import {
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Checkbox,
  Select,
  FormControlLabel
} from "@material-ui/core";
import Switch from '@mui/material/Switch';
import DatalistInput from 'react-datalist-input';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { GET, TenantID, POST, isSuperAdminAccess } from './../dataSaver';
import Step1 from './../../images/step12.png';
import Step2 from './../../images/step23.png';
import Step3 from './../../images/step34.png';
import Step4 from './../../images/step44.png';
import Step5 from './../../images/step5.png';
import CloudUpload from './../../images/cloudUpload.png';
import HourglassImg from './../../images/hourglassImg.png';
import UploadedImg from './../../images/uploadedImage.png';
import Download from './../../images/download.png';
import Dropzone from "react-dropzone";
import { Auth } from './../../utils/auth';
import { CSVLink } from "react-csv";
import Papa from 'papaparse';
import axios from 'axios';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import SaveInProgress from './saveInProgressAlert';
import SuffixList from './../../Components/SuffixList';

import style from './index.module.scss';
import 'react-datalist-input/dist/styles.css';

const VALUES = ['Site 1', "Site 1", "Site", 'Site 1'];

const dropzoneStyle = {
  width: "100%",
  height: "auto",
  borderWidth: 2,
  borderColor: "rgb(102, 102, 102)",
  borderStyle: "dashed",
  borderRadius: 5,
}

const SiteUsers = ({ getActiveStep }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAppUserContractor, setIsAppUserContractor] = useState(true);
  const [tags, setTags] = useState(VALUES);
  const [entityRoles, setEntityRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [siteSpecific, setSiteSpecific] = useState(false);
  const [showUserTable, setShowUserTable] = useState(true);
  const [selectedSites, setSelectedSites] = useState([]);
  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false);
  const [showUploading, setShowUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [item, setItem] = useState();
  const [user, setUser] = useState([]);
  const accessToken = Auth();
  const [entitySite, setEntitySite] = useState([]);
  const [userDataCSV, setUserDataCSV] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [contractId, setContractId] = useState('');
  const [entityData, setEntityData] = useState();
  const [showSaveInProgress, setShowSaveInProgress] = useState(false);
  const [unassignedKeys, setUnassignedKeys] = useState([]);
  const [userData, setUserData] = useState({ firstName: '', lastName: '', suffix: { suffix: '', id: '' }, isAdmin: false, title: { title: '', id: '' }, email: '', phone: '' });
  const role = '';

  const columns = [
    {
      label: "NPIN",
      key: "npin", // String-based value accessors!
    },
    {
      label: "Site Name",
      key: "site_name",
    },
    {
      label: "Site Type",
      key: "site_type",
    },
    {
      label: "Address Line",
      key: "address_line",
    },
    {
      label: "City",
      key: "city",
    },
    {
      label: "State",
      key: "state",
    },
    {
      label: "Zipcode",
      key: "zipcode",
    },
    {
      label: "Country",
      key: "country",
    },
    {
      label: "Setup Department",
      key: "setup_department",
    },
    {
      label: "Department Name",
      key: "department",
    }
  ];


  useEffect(() => {
    getUserData();
    getEntityData();
    getSiteData();
    getRolesData();
    getContracts();
  }, [])

  const getEntityData = async () => {
    const { data: data } = await GET(`entity-service/entity/${id}`);
    setEntityData(data);
  }

  const getContracts = async () => {
    await axios(`https:${window.location.hostname}/contract-managment-service/contracts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-tenantID': id,
        'X-Authorization': `Bearer ${Auth()}`
      },
    }).then(response => {
      setContracts(response?.data?.contractList);
    }).catch(error => {
      console.log('error', error)
    })
  }

  const getUserData = async () => {
    await axios(`https:${window.location.hostname}/user-management-service/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-tenantID': id,
        'X-Authorization': `Bearer ${Auth()}`
      },
    }).then(response => {
      setUser(response?.data);
      setShowUserTable(response?.data?.length === 0 ? true : false);
    }).catch(error => {
      console.log('error', error)
    })
  }

  console.log('user', user);

  const getSiteData = async () => {
    const { data: data } = await GET(`entity-service/entity/${id}`);
    setEntitySite(data?.sites);
  }

  const getRolesData = async () => {
    const { data: data } = await GET(`user-management-service/roles`);
    if (data && isSuperAdminAccess) {
      let roles = data?.filter(data => !['Activity Logger', 'Accounts Payable', 'Super Sys Admin', 'Distributor Admin', 'Entity Sys Admin']?.includes(data?.roleName))?.map(data => data);
      setEntityRoles(roles);
      console.log('roles', roles);
    } if (data && !isSuperAdminAccess) {
      let roles = data?.filter(data => !['Activity Logger', 'Super Sys Admin', 'Distributor Admin', 'Entity Sys Admin']?.includes(data?.roleName))?.map(data => data);
      setEntityRoles(roles);
      console.log('roles', roles);
    }
  }

  const items = useMemo(
    () =>
      entitySite?.map((option) => ({
        id: option?.id,
        value: option.siteName.siteName,
        ...option,
      })),
    [entitySite],
  );

  console.log('items', selectedSites, entitySite);
  const onSelect = (selectedItem) => {
    if (!selectedSites?.map(data => data?.id)?.includes(selectedItem?.id)) {
      setItem(selectedItem);
      let temp = selectedSites;
      temp.push(selectedItem);
      setSelectedSites(temp);
    }
  }


  const handleTagsRemove = (tags, index) => {
    setSelectedSites(selectedSites?.filter((data, indexValue) => indexValue !== index)?.map(data => data));
  };

  const roleItems = useMemo(
    () =>
      entityRoles?.map((option) => ({
        id: option?.id,
        value: option.roleName,
        ...option,
      })),
    [entityRoles],
  );

  const handleRoleChange = (value) => {
    setSelectedRoles(value);
  }

  const handleTagsRemoveRoles = (tags, index) => {
    setSelectedRoles(selectedRoles?.filter((data, indexValue) => indexValue !== index)?.map(data => data));
  };


  const handleUserData = (name, value) => {
    setUserData({ ...userData, [name]: value });
  }

  const changeHandler = (event) => {
    Papa.parse(event?.[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log(results.data)
        setUserDataCSV(results.data);
      },
    });
  };

  const mandatoryFieldCheck = (buttonType) => {
    if (userData?.firstName === '') {
      ErrorToaster('First Name is Mandatory');
      return;
    }
    if (userData.email === '') {
      ErrorToaster('Email is Mandatory');
      return;
    }
    if (!userData.email.includes('@') || !userData.email.includes('.')) {
      ErrorToaster('Enter Valid Email-Id');
      return;
    }
    if (buttonType === 'SaveInProgress') {
      saveInProgressCheck();
    } else if (buttonType === 'AddMore') {
      addUser('AddMore');
    } else {
      addUser('Continue');
      getActiveStep('appSubscription');
    }
  }

  const saveInProgressCheck = () => {
    var keys = [];
    if (userData?.lastName === '') {
      keys.push('Last Name');
    }
    if (userData?.suffix?.suffix === '') {
      keys.push('Suffix');
    }
    if (userData?.phone === '') {
      keys.push("Cell Phone");
    } if (selectedRoles?.length === 0) {
      keys.push('Other App Role')
    }
    setUnassignedKeys(keys);
    if (keys?.length !== 0) {
      setShowSaveInProgress(true);
    } else {
      addUser('SaveInProgress');
    }
  }

  const saveInProgressFunction = () => {
    addUser('SaveInProgress');
  }


  const addUser = async (buttonType) => {
    let data = {
      "name": {
        "firstName": userData.firstName,
        "lastName": userData.lastName,
        "suffix": userData.suffix,
      },
      "userType": "REGISTERED_USER",
      "contracts": isAppUserContractor ? [
        {
          "id": contractId,
          "contractName": {
            "contractName": contracts?.filter(data => data?.id === contractId)?.map(data => data?.contractName?.contractName)[0],
          }
        }
      ] : [],
      "email": {
        "officialEmail": userData.email
      },
      "password": {
        "password": "admin123"
      },
      "communication": {
        "personalEmail": userData.email,
        "mobileNumber": userData.phone,
        "landlineNumber": "string"
      },
      "roles": selectedRoles,
      "tenant": {
        "tenantId": id,
      },
      "sites": {
        "sites": siteSpecific ? selectedSites : entitySite,
      },
      "blocked": false
    }
    await POST('user-management-service/user/register', data)
      .then(response => {
        SuccessToaster('User Created Successfully');
        resetValues();
      }).catch(error => {
        ErrorToaster('Unexpected Error Creating User');
      });
    if (buttonType === 'SaveInProgress') {
      navigate('/user');
    }
  }

  const resetValues = () => {
    setUserData({ firstName: '', lastName: '', suffix: { suffix: '', id: '' }, isAdmin: false, title: { title: '', id: '' }, email: '', phone: '' });
    setSelectedRoles([]);
    setSelectedSites([]);
    setContractId('');
  }

  const getSaveInProgressAlert = (value) => {
    setShowSaveInProgress(value);
  }

  const onSuffixChange = (id, value) => {
    setUserData({ ...userData, suffix: { id: id, suffix: value } });
  }

  console.log('suffix', userData?.suffix);

  return (
    <div className={style.entitySetupBackground}>
      <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.floatRight}`} onClick={() => navigate('/activeCustomers')} />
      <div className={style.stepperMargin}>
        <div className={isSuperAdminAccess ? style.stepperGrid : style.stepperGrid4}>
          <div onClick={() => getActiveStep('entitySetup')}>
            <div className={style.justifyCenter}>
              <div className={`${style.stepperImgBackground} ${style.completedStepperStyle}`}>
                <img src={Step1} alt="Step1" className={style.stepperImgStyle} />
              </div>
            </div>
            <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>ENTITY SETUP</p>
          </div>
          <div onClick={() => getActiveStep('siteInformation')}>
            <div className={style.justifyCenter}>
              <div className={`${style.stepperImgBackground} ${style.completedStepperStyle} `}>
                <img src={Step3} alt="Step2" className={style.stepperImgStyle} />
              </div>
            </div>
            <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>SITES FOR APP USE</p>
          </div>
          {isSuperAdminAccess && (
            <div onClick={() => getActiveStep('entitySystemAdmin')}>
              <div className={style.justifyCenter}>
                <div className={`${style.stepperImgBackground} ${style.completedStepperStyle}`}>
                  <img src={Step2} alt="Step3" className={style.stepperImgStyle} />
                </div>
              </div>
              <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>ENTITY SYSTEM ADMIN</p>
            </div>
          )}
          <div onClick={() => getActiveStep('siteUsers')}>
            <div className={style.justifyCenter}>
              <div className={`${style.stepperImgBackground} ${style.activeStepperStyle} `}>
                <img src={Step4} alt="Step4" className={style.stepperImgStyle} />
              </div>
            </div>
            <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>APP USERS</p>
          </div>
          <div onClick={() => getActiveStep('appSubscription')}>
            <div className={style.justifyCenter}>
              <div className={style.stepperImgBackground}>
                <img src={Step5} alt="Step5" className={style.stepperImgStyle} />
              </div>
            </div>
            <p className={isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid}>APP SUBSCRIPTION</p>
          </div>
        </div>
        <div className={isSuperAdminAccess ? style.stepperDivider4 : style.stepperDivider4grid4}></div>
      </div>
      {showUserTable ? (
        <div className={style.entitySetupCardStyle}>
          <p className={style.heading}>Add Registered Users</p>
          <div className={style.greyBorder}></div>
          <div className={style.entityDescription}>
            Help lorem ipsum dolor sit amet, consectetur adipiscing elit. sed finibus
            quam nec tellus dictum, vitae ultrices urna porttitor. donec commodo tellus
            dapibus semper mattis. aenean ut massa vitae tortor consequat tristique. etiam
            eget condimentum sapien. morbi est ante, sagittis ac rhoncus eget, faucibus ut
            felis. pellentesque iaculis aliquam massa. lorem ipsum dolor sit amet, consectetur
            adipiscing elit. sed finibus quam nec tellus dictum.
          </div>
          <div>
            <div className={style.cloneBlockStyle}>
              <div className={`${style.newContractFromCloneBoxStyle}`}>
                {
                  !isSuperAdminAccess &&
                  <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Is App User A Contractor? *</div>
                    <div className={style.displayInRow}>
                      <FormControlLabel
                        control={
                          <Switch checked={isAppUserContractor} className={` ${style.textAlignLeft} `} onChange={() => setIsAppUserContractor(!isAppUserContractor)} />
                        }
                        className={`${style.switchFontStyle} ${style.fourFieldWidth}`}
                        label={isAppUserContractor ? 'YES' : 'NO'}
                      />
                      {isAppUserContractor &&
                        <select
                          name="class"
                          id="Class"
                          value={contractId}
                          className={`${style.twoFieldWidth} ${style.marginLeft20}`}
                          onChange={(e) => setContractId(e.target.value)}>
                          <option value="Select Contractor" >
                            Select Contractor
                          </option>
                          {
                            contracts?.map(data => (
                              <option value={data?.id} >
                                {data.contractName?.contractName}
                              </option>
                            ))
                          }
                        </select>
                      }
                      <p className={`${style.fourFieldWidth}`}></p>
                    </div>
                  </div>
                }
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                  <div className={style.extentionLableStyle}>Name*</div>
                  <div className={`${style.displayInRow}`}>
                    <InputGroup placeholder="First Name" className={`${style.fourFieldWidth}`} value={userData.firstName} onChange={(e) => handleUserData('firstName', e.target.value)} />
                    <InputGroup placeholder="LAST NAME" className={`${style.fourFieldWidth} ${style.marginLeft20}`} value={userData.lastName} onChange={(e) => handleUserData('lastName', e.target.value)} />
                    <SuffixList value={userData?.suffix?.id} onChangeFunc={onSuffixChange} className={[style.fourFieldWidth, style.marginLeft20]} />
                    <p className={`${style.fourFieldWidth}`}></p>
                  </div>
                </div>

                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                  <div className={style.extentionLableStyle}>Email Address*</div>
                  <InputGroup placeholder="Email" className={`${style.twoFieldWidth}`} value={userData.email} onChange={(e) => handleUserData('email', e.target.value)} />
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                  <div className={style.extentionLableStyle}>Cell Phone</div>
                  <InputGroup placeholder="+1 (342) 444-5505" className={`${style.twoFieldWidth}`} value={userData.phone} onChange={(e) => handleUserData('phone', e.target.value)} />
                </div>
                {
                  entityData?.multiSiteEntity &&
                  <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Specific Site Access*</div>
                    <div>
                      <div className={style.displayInRow}>
                        <FormControlLabel
                          control={
                            <Switch checked={siteSpecific} className={` ${style.textAlignLeft}`} onChange={() => setSiteSpecific(!siteSpecific)} />
                          }
                          className={`${style.switchFontStyle}`}
                          label={siteSpecific ? 'YES' : "NO"}
                        />
                        {siteSpecific && (
                          <>
                            <DatalistInput items={items} placeholder="Select sites" onSelect={onSelect} className={`${style.fullWidth} ${style.marginLeft20} ${style.textAlignLeft}`} />
                          </>
                        )}
                      </div>

                      {siteSpecific && (
                        <TagInput
                          placeholder="Enter tags/keywords relative to the post"
                          values={selectedSites?.map(data => data?.siteName?.siteName)}
                          className={`${style.marginTop20} ${style.tagInputStyle}`}
                          onRemove={handleTagsRemove}
                          separator={/[\s,]/}
                          addOnBlur={true}
                          addOnPaste={true}
                        />
                      )}
                    </div>
                  </div>
                }

                {
                  // <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                  //     <div className={style.extentionLableStyle}>Sys admin access*</div>
                  //         <FormControlLabel
                  //             control={
                  //                 <Switch checked={userData.isAdmin} onChange={(e)=>setUserData({...userData, isAdmin:(!userData.isAdmin)})} className={` ${style.textAlignLeft}`}  />
                  //             }
                  //             className={`${style.switchFontStyle} ${style.fourFieldWidth}`}
                  //             label={userData?.isAdmin? 'YES' : 'NO'}
                  //         />
                  // </div>
                }
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                  <div className={style.extentionLableStyle}>Other App Role*</div>
                  <FormControl className={style.fullWidth}>
                    {
                      <InputLabel id="mutiple-select-label">Roles Multi Select</InputLabel>
                    }
                    <Select
                      labelId="mutiple-select-label"
                      multiple
                      value={selectedRoles}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      renderValue={selectedRoles => selectedRoles.map(data => data?.roleName)?.join(', ')}
                    >
                      {entityRoles.map((option) => (
                        <MenuItem key={option} value={option}>
                          <ListItemIcon>
                            <Checkbox checked={selectedRoles?.map(data => data?.id)?.includes(option?.id)} style={{ color: '#7165E3' }} />
                          </ListItemIcon>
                          <ListItemText primary={option?.roleName} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>


              </div>
              <div className={style.spaceBetween}>
                <div className={`${style.marginTop20} ${style.buttonPositionLeft}`}>
                  <button className={style.outlinedButton}>BULK UPLOAD</button>
                </div>
                <div className={`${style.buttonPosition} ${style.floatRight} ${style.marginTop20}`}>
                  <button className={style.outlinedButton} onClick={() => mandatoryFieldCheck('SaveInProgress')}>SAVE IN-PROGRESS</button>
                  <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => mandatoryFieldCheck('AddMore')}>SAVE & ADD MORE</button>
                  <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => { mandatoryFieldCheck('Continue') }}>CONTINUE</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={style.entitySetupCardStyle}>
          <p className={style.heading}>Registered App Users</p>
          <div className={`${style.floatRight} ${style.siteButtonPosition}`}>
            <button className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer}`} onClick={() => setShowUserTable(true)}>ADD USERS</button>
            <button className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer}`} onClick={() => setShowBulkUploadDialog(true)}>BULK UPLOAD</button>
          </div>
          <div className={style.greyBorder}></div>
          <div className={style.tableHeight}>
            <div className={`${style.tableHeader} ${style.marginTop20}`}>
              <p className={style.tableHeaderFontStyle}>USER NAME</p>
              <p className={style.tableHeaderFontStyle}>SUFFIX</p>
              <p className={style.tableHeaderFontStyle}>TITLE</p>
              <p className={style.tableHeaderFontStyle}>SITES</p>
              <p className={style.tableHeaderFontStyle}>SYS ADMIN</p>
              <p className={style.tableHeaderFontStyle}>OTHER ROLE</p>
              <p className={style.tableHeaderFontStyle}>SOURCE</p>
            </div>
            <div className={`${style.tableData} ${style.displayInCol}`} >
              {
                user?.map(data => (
                  <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                    <p className={style.tableDataFontStyle}>{data?.name?.firstName}{' '}{data?.name?.lastName}</p>
                    <p className={style.tableDataFontStyle}>{data?.name?.suffix?.suffix}</p>
                    <p className={style.tableDataFontStyle}>{data?.title?.title}</p>
                    <p className={style.tableDataFontStyle}>{data?.sites?.sites?.length || 0}</p>
                    <p className={style.tableDataFontStyle}>{data?.roles?.map(data => data?.roleName).includes('Entity Sys Admin') ? 'YES' : 'NO'}</p>
                    <p className={style.tableDataFontStyle}>{data?.roles?.[0]?.roleName || ''}</p>
                    <p className={style.tableDataFontStyle}>Manual</p>
                  </div>
                ))
              }
            </div>
          </div>
          <div className={` ${style.floatRight} ${style.marginTop20} ${style.marginRightForPositionButton}`}>
            <button className={style.outlinedButton}>SAVE IN-PROGRESS</button>
            <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => getActiveStep('appSubscription')}>CONTINUE</button>
          </div>
        </div>
      )}
      <Dialog isOpen={showBulkUploadDialog} onClose={() => setShowBulkUploadDialog(false)} className={`${style.bulkUploadDialog} ${style.dialogPaddingBottom}`}>
        <div className={`${Classes.DIALOG_BODY} ${style.bulkUploadDialogBackground}`}>
          <div className={style.spaceBetween}>
            <p className={style.extensionStyle}>USERS BULK UPLOAD FOR CUSTOMER NAME</p>
            <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.alertCrossStyle} onClick={() => setShowBulkUploadDialog(false)} />
          </div>
          <div className={style.extensionBorder}></div>
          <div className={`${style.dashborderStyle} ${style.marginTop20}`}>
            <div className={style.alignCenter}>
              {/* {isUploaded ? (
                            <div onClick={() => setShowUploading(false)}>
                                <img src={UploadedImg} alt="done" className={style.uploadImgStyle} />
                                <p className={style.uploadTextStyle}>
                                20 RECORDS SUCCESSFULLY UPLOADED
                                </p>
                            </div>
                        ) : showUploading ? (
                            <div onClick={() => setIsUploaded(true)}>
                                <img src={HourglassImg} alt="hourGlass" className={style.uploadImgStyle} />
                                <p className={style.uploadTextStyle}>
                                5 OF 20 RECORD PROCESSING, 1 MIN LEFT...
                                </p>
                            </div>
                        ) : !showUploading ? (
                            <div onClick={() => setShowUploading(true)}>
                                <img src={CloudUpload} alt="cloud" className={style.uploadImgStyle} />
                                <p className={style.uploadTextStyle}>
                                DRAG AND DROP, OR CLICK TO UPLOAD THE EXCEL TEMPLATE
                                </p>
                            </div>
                        ) : ''} */}
              <Dropzone style={dropzoneStyle} accept=".csv" onDrop={acceptedFiles => changeHandler(acceptedFiles)}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} accept=".csv" />
                      {userDataCSV?.length === 0 ? (
                        <>
                          <img src={CloudUpload} alt="cloud" className={style.uploadImgStyle} />
                          <p className={style.uploadTextStyle}>
                            DRAG AND DROP, OR CLICK TO UPLOAD THE EXCEL TEMPLATE
                          </p>
                        </>
                      ) : (
                        <>
                          <img src={UploadedImg} alt="done" className={style.uploadImgStyle} />
                          <p className={style.uploadTextStyle}>
                            RECORDS SUCCESSFULLY UPLOADED
                          </p>
                        </>
                      )}
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>
            {isUploaded && (
              <div className={`${style.spaceBetween} ${style.reduceMarginTop}`}>
                <div className={style.displayInRow}>
                  <img src={Download} alt="download" className={style.downloadImageStyle} />
                  <p className={style.failedTesxtColor}>5 RECORDS FAILED</p>
                </div>
                <p className={`${style.resetStyle} ${style.marginRight20}`}>RESET AND IMPORT AGAIN</p>
              </div>
            )}
          </div>
          <div className={`${style.uploadDescription} ${style.marginTop20}`}>
            <p className={style.descriptionHeading}>INSTRUCTIONS FOR BULK UPLOAD</p>
            <p className={style.uploadDescriptionText}>
              Help lorem ipsum dolor sit amet, consectetur adipiscing elit.
              sed finibus quam nec tellus dictum, vitae ultrices urna porttitor.
              donec commodo tellus dapibus semper mattis. aenean ut massa vitae
              tortor consequat tristique. etiam eget condimentum sapien. morbi
              est ante, sagittis ac rhoncus eget, faucibus ut felis. pellentesque
              iaculis aliquam massa. lorem ipsum dolor sit amet, consectetur
              adipiscing elit. sed finibus quam nec tellus dictum.
            </p>
            <CSVLink
              data={[]}
              headers={columns}
              filename={`Site Users`}
              target="_blank"
              className={style.m10}>
              <button className={style.downloadBulkButtonStyle}>
                DOWNLOAD BULK USER UPLOAD EXCEL TEMPLATE FILE
              </button>
            </CSVLink>
          </div>
          <div>
            <div className={`${style.floatRight} ${style.marginTop20}`}>
              <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => setShowBulkUploadDialog(false)}>{isUploaded ? 'SAVE & CONTINUE' : 'CANCEL UPLOAD'}</button>
            </div>
          </div>
        </div>
      </Dialog>
      <SaveInProgress alert={showSaveInProgress} getSaveInProgressAlert={getSaveInProgressAlert} fieldData={unassignedKeys?.join(', ')} saveInProgressFunction={saveInProgressFunction} />
    </div>
  )
}

export default SiteUsers;
